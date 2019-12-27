import { GetRandomString } from '../lib/random-string';
import * as stateActions from './state-actions';

// This returns a redux-thunk action (a function).
export const notify = ({ type = 'info', text, title = 'Notify', timeout = 0 }) => {
  if (!timeout) {
    switch (type) {
      case 'info':
        timeout = 3000;
        break;
      case 'error':
        timeout = 5000;
        break;
    }
  }

  const notification = {
    id: GetRandomString(),
    type,
    title,
    text,
    timeout,
  };

  return (dispatch) => {
    dispatch(stateActions.addNotification(notification));

    setTimeout(() => {
      dispatch(stateActions.removeNotification(notification.id));
    }, timeout);
  };
};
