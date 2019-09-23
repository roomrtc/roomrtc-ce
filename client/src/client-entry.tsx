import React from 'react';
import ReactDOM from 'react-dom';

import Counter from './containers/counter';

ReactDOM.hydrate(
  <Counter />,
  document.getElementById('app'),
);
