import { KitesInstance } from '@kites/core';
import { Express } from '@kites/express';

import { platform, cpus } from 'os';

// mediasoup Workers.
// @type {Array<mediasoup.Worker>}
const mediasoupWorkers = [];

// Map of Room instances indexed by roomId.
// @type {Map<Number, Room>}
const rooms = new Map();

async function runMediasoupWorkers(config: any, kites: KitesInstance) {
  const numWorkers = config.numWorkers || cpus().length;
  const { logLevel, logTags, rtcMinPort, rtcMaxPort } = config.worker;

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
 * Media server setup
 *
 * @param {kites} kites
 */
function MediaServer(kites: KitesInstance) {

  const type = platform();
  if (type === 'linux') {
    kites.on('express:config', async (app: Express) => {
      kites.logger.info('Initialize mediasoup Workers ...');
      await runMediasoupWorkers(kites.options.mediasoup, kites);

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
