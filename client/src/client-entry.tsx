import React from 'react';
import ReactDOM from 'react-dom';

import App from './lib/app';

ReactDOM.hydrate(
  <App />,
  document.getElementById('app'),
);
