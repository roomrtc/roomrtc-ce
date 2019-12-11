import { KitesInstance } from '@kites/core';
import { Express } from '@kites/express';

import url from 'url';
import { platform, cpus } from 'os';
import protoo from 'protoo-server';
import AwaitQueue from 'awaitqueue';
import { Room } from './room';

// Async queue to manage rooms.
// @type {AwaitQueue}
const queue = new AwaitQueue();

// mediasoup Workers.
// @type {Array<mediasoup.Worker>}
const mediasoupWorkers = [];

// Protoo WebSocket server.
// @type {protoo.WebSocketServer}
let protooWebSocketServer;

// Map of Room instances indexed by roomId.
// @type {Map<Number, Room>}
const rooms = new Map<string, Room>();

// Index of next mediasoup Worker to use.
// @type {Number}
let nextMediasoupWorkerIdx = 0;

/**
 * Launch as many mediasoup Workers as given in the configuration file.
 */
async function runMediasoupWorkers(kites: KitesInstance, config: any) {
  const numWorkers = config.numWorkers || cpus().length;
  const { logLevel, logTags, rtcMinPort, rtcMaxPort } = config.worker;

  const libmediasoup = 'mediasoup';
  const mediasoup = await import('mediasoup');
  kites.logger.info('Running (%d) mediasoup workers ...', numWorkers);

  for (let i = 0; i < numWorkers; i++) {
    const worker = await mediasoup.createWorker(
      {
        logLevel,
        logTags,
        rtcMinPort,
        rtcMaxPort,
      });

    worker.on('died', () => {
      kites.logger.error(
        'mediasoup Worker died, exiting  in 2 seconds... [pid:%d]', worker.pid);

      setTimeout(() => process.exit(1), 2000);
    });

    mediasoupWorkers.push(worker);
  }

  kites.logger.info('Create workers done!');
}

/**
 * Create a protoo WebSocketServer to allow WebSocket connections from browsers.
 */
async function runProtooWebSocketServer(kites: KitesInstance, config: any) {
  const httpServer = kites.express.server;
  kites.logger.info('running protoo WebSocketServer...');

  // Create the protoo WebSocket server.
  protooWebSocketServer = new protoo.WebSocketServer(httpServer,
    {
      maxReceivedFrameSize: 960000, // 960 KBytes.
      maxReceivedMessageSize: 960000,
      fragmentOutgoingMessages: true,
      fragmentationThreshold: 960000,
    });

  // Handle connections from clients.
  protooWebSocketServer.on('connectionrequest', (info, accept, reject) => {
    // The client indicates the roomId and peerId in the URL query.
    const roomUrl = url.parse(info.request.url, true);
    const roomId = roomUrl.query.roomId;
    const peerId = roomUrl.query.peerId;
    const consume = roomUrl.query.consume;
    const forceH264 = roomUrl.query.forceH264 === 'true';
    const forceVP9 = roomUrl.query.forceVP9 === 'true';

    if (!roomId || !peerId) {
      reject(400, 'Connection request without roomId and/or peerId');
      return;
    }

    kites.logger.info(
      'protoo connection request [roomId:%s, peerId:%s, address:%s, origin:%s]',
      roomId, peerId, info.socket.remoteAddress, info.origin);

    // Serialize this code into the queue to avoid that two peers connecting at
    // the same time with the same roomId create two separate rooms with same
    // roomId.
    queue.push(async () => {
      const room = await getOrCreateRoom({ roomId, forceH264, forceVP9, kites });

      // Accept the protoo WebSocket connection.
      const protooWebSocketTransport = accept();

      room.handleProtooConnection({ peerId, consume, protooWebSocketTransport });
      kites.logger.info('getOrCreateRoom ok: ' + roomId);
    })
      .catch((error) => {
        // console.error('ErrorE::', error);
        kites.logger.error('room creation or room joining failed:%o', error);

        reject(error);
      });
  });
}

/**
 * Get next mediasoup Worker.
 */
function getMediasoupWorker() {
  const worker = mediasoupWorkers[nextMediasoupWorkerIdx];

  if (++nextMediasoupWorkerIdx === mediasoupWorkers.length) {
    nextMediasoupWorkerIdx = 0;
  }

  return worker;
}

/**
 * Get a Room instance (or create one if it does not exist).
 */
async function getOrCreateRoom({ kites, roomId, forceH264 = false, forceVP9 = false }) {
  let room = rooms.get(roomId);

  // If the Room does not exist create a new one.
  if (!room) {
    kites.logger.info('creating a new Room [roomId:%s]', roomId);

    const mediasoupWorker = getMediasoupWorker();
    const { routerOptions, webRtcTransportOptions, plainRtpTransportOptions } = kites.options.mediasoup;

    // console.log('Router options WWWWWWWWWWW: ', kites.options.mediasoup);

    room = await Room.create({
      mediasoupWorker,
      roomId,
      forceH264,
      forceVP9,
      routerOptions,
      webRtcTransportOptions,
      plainRtpTransportOptions,
    });

    rooms.set(roomId, room);
    room.on('close', () => rooms.delete(roomId));
  }

  return room;
}

/**
 * Media server setup
 *
 * @param {kites} kites
 */
function MediaServer(kites: KitesInstance) {

  const type = platform();
  if (type === 'linux') {
    kites.on('express:config', async (app: Express) => {
      kites.logger.info('Initialize mediasoup Workers ...');

      // start mediasoup workers
      await runMediasoupWorkers(kites, kites.options.mediasoup);

      // start signaling server
      await runProtooWebSocketServer(kites, kites.options.mediasoup);
    });

    // Log rooms status
    setInterval(() => {
      for (const room of rooms.values()) {
        room.logStatus();
      }
    }, 2000);
  } else {
    kites.logger.error(
      `Media server run only on linux platform or WSL! Currently do not support: ${type}!`);
  }
}

export {
  MediaServer,
};
