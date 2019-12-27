let mediaQueryDetectorElem;

export function initialize() {
  // Media query detector stuff.
  mediaQueryDetectorElem =
    document.getElementById('roomrtc-app-media-query-detector');

  return Promise.resolve(mediaQueryDetectorElem);
}

export function isDesktop() {
  return Boolean(mediaQueryDetectorElem.offsetParent);
}

export function isMobile() {
  return !mediaQueryDetectorElem.offsetParent;
}
