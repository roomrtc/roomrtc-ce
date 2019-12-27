let protooPort = 4443;

if (window.location.hostname === 'test.roomrtc.com') {
  protooPort = 4444;
}

export function getProtooUrl({ roomId, peerId, forceH264, forceVP9 }) {
  const {hostname, port, protocol} = window.location;
  let url = `${/https/.test(protocol) ? 'wss' : 'ws'}://${hostname}:${port}/?roomId=${roomId}&peerId=${peerId}`;
  // let url = `wss://v3demo.mediasoup.org:4443/?roomId=${roomId}&peerId=${peerId}`;
  // let url = `/ws/?roomId=${roomId}&peerId=${peerId}`;

  if (forceH264) {
    url = `${url}&forceH264=true`;
  } else if (forceVP9) {
    url = `${url}&forceVP9=true`;
  }

  return url;
}
