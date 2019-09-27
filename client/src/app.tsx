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
import { GetRandomName, GetRandomString } from './lib/random-string';

const logger = new Logger('App');

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
    return (
      <div>
        <h1>counter at: {this.state.counter}</h1>
        <button
          onClick={() => this.incrementCounter()}
        />
      </div>
    );
  }
}

export default App;
