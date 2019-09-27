import jsCookie from 'js-cookie';

const USER_COOKIE = 'roomrtc.user';
const DEVICES_COOKIE = 'roomrtc.devices';

function getUser() {
  return jsCookie.getJSON(USER_COOKIE);
}

function setUser({ displayName }) {
  jsCookie.set(USER_COOKIE, { displayName });
}

function getDevices() {
  return jsCookie.getJSON(DEVICES_COOKIE);
}

function setDevices({ webcamEnabled }) {
  jsCookie.set(DEVICES_COOKIE, { webcamEnabled });
}

export {
  getUser,
  setUser,
  getDevices,
  setDevices,
};
