import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

ReactDOM.hydrate(
  <App />,
  document.getElementById('roomrtc-app-container'),
);
