import React from 'react';
import { Provider } from 'react-redux';
import {
  applyMiddleware as applyReduxMiddleware,
  createStore as createReduxStore,
} from 'redux';
import thunk from 'redux-thunk';
import UrlParse from 'url-parse';
import * as utils from './lib/utils';

import Logger from './lib/logger';
import deviceInfo from './lib/device-info';
import * as cookiesManager from './lib/cookies-manager';
import * as stateActions from './redux/state-actions';
import { GetRandomName, GetRandomString } from './lib/random-string';
import RoomClient from './lib/room-client';
import RoomContext from './components/room-context';

import reducers from './redux/reducers';
import Room from './components/room';

const logger = new Logger('App');
const reduxMiddlewares = [thunk];

let roomClient;
const store = createReduxStore(
  reducers,
  undefined,
  applyReduxMiddleware(...reduxMiddlewares),
);

window.STORE = store;

RoomClient.init({ store });

export interface AppState {
  counter: number;
}

export interface AppProps {
  [key: string]: any;
  title?: string;
}

/**
 * Live channel
 */
class App extends React.Component<AppProps, AppState> {

  constructor(props: any) {
    super(props);
    this.state = { counter: 0 };
  }

  incrementCounter() {
    this.setState({ counter: this.state.counter + 1 });
    logger.debug('current: ' + this.state.counter);
  }

  render() {
    logger.debug('run() [environment:%s]', process.env.NODE_ENV);
    const endPoint = window.location.href;
    const urlParser = new UrlParse(endPoint, true);
    const peerId = GetRandomString();
    let roomId = urlParser.query.roomId;
    let displayName =
      urlParser.query.displayName || (cookiesManager.getUser() || {}).displayName;
    const handler = urlParser.query.handler;
    const useSimulcast = urlParser.query.simulcast !== 'false';
    const useSharingSimulcast = urlParser.query.sharingSimulcast !== 'false';
    const forceTcp = urlParser.query.forceTcp === 'true';
    const produce = urlParser.query.produce !== 'false';
    const consume = urlParser.query.consume !== 'false';
    const forceH264 = urlParser.query.forceH264 === 'true';
    const forceVP9 = urlParser.query.forceVP9 === 'true';
    const svc = urlParser.query.svc;
    const datachannel = urlParser.query.datachannel !== 'false';
    const info = urlParser.query.info === 'true';
    const faceDetection = urlParser.query.faceDetection === 'true';
    const externalVideo = urlParser.query.externalVideo === 'true';
    const throttleSecret = urlParser.query.throttleSecret;

    // Enable face detection on demand.
    // if (faceDetection)
    //   await faceapi.loadTinyFaceDetectorModel('/resources/face-detector-models');

    // if (info)
    //   window.SHOW_INFO = true;

    // if (throttleSecret)
    //   window.NETWORK_THROTTLE_SECRET = throttleSecret;

    if (!roomId) {
      roomId = GetRandomString();

      urlParser.query.roomId = roomId;
      window.history.pushState('', '', urlParser.toString());
    }

    // Get the effective/shareable Room URL.
    const wsEndPoint = window.location.href;
    const roomUrlParser = new UrlParse(wsEndPoint, true);

    for (const key of Object.keys(roomUrlParser.query)) {
      // Don't keep some custom params.
      switch (key) {
        case 'roomId':
        case 'simulcast':
        case 'sharingSimulcast':
        case 'produce':
        case 'consume':
        case 'forceH264':
        case 'forceVP9':
        case 'svc':
        case 'datachannel':
        case 'info':
        case 'faceDetection':
        case 'externalVideo':
          break;
        default:
          delete roomUrlParser.query[key];
      }
    }
    delete roomUrlParser.hash;

    const roomUrl = roomUrlParser.toString();

    let displayNameSet;

    // If displayName was provided via URL or Cookie, we are done.
    if (displayName) {
      displayNameSet = true;
    } else {
      // Otherwise pick a random name and mark as "not set".
      displayNameSet = false;
      displayName = GetRandomName();
    }

    // Get current device info.
    const device = deviceInfo();

    store.dispatch(
      stateActions.setRoomUrl(roomUrl));

    store.dispatch(
      stateActions.setRoomFaceDetection(faceDetection));

    store.dispatch(
      stateActions.setMe({ peerId, displayName, displayNameSet, device }));

    roomClient = new RoomClient(
      {
        roomId,
        peerId,
        displayName,
        device,
        handler,
        useSimulcast,
        useSharingSimulcast,
        forceTcp,
        produce,
        consume,
        forceH264,
        forceVP9,
        svc,
        datachannel,
        externalVideo,
      });

    // NOTE: For debugging.
    window.CLIENT = roomClient;
    window.CC = roomClient;
    return (
      <Provider store={store}>
        <RoomContext.Provider value={roomClient}>
          <Room />
        </RoomContext.Provider>
      </Provider>
    );
  }
}

export default App;
