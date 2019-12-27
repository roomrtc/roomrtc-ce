import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

interface NodeModule {
  hot: boolean;
}

declare var module: NodeModule;

// Fix: Expected server HTML to contain a matching <div> in <div>.
// Ref: https://stackoverflow.com/a/53539693/1896897
const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;

renderMethod(
  <App />,
  document.getElementById('roomrtc-app-container'),
);
