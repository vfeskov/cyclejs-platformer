import fromEvent from 'xstream/extra/fromEvent';

function windowSize () {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

export function windowSizeDriver () {
  return fromEvent(window, 'resize')
    .map(windowSize)
    .startWith(windowSize());
}
