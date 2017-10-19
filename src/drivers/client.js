import fromEvent from 'xstream/extra/fromEvent';
import { adapt } from '@cycle/run/lib/adapt'

export function clientDriver () {
  return {
    resize$: adapt(
      fromEvent(window, 'resize')
        .map(windowSize)
        .startWith(windowSize())
    ),
    touchSupport: touchSupport()
  }
}

function windowSize () {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

function touchSupport () {
  return 'ontouchstart' in window || navigator.msMaxTouchPoints
}
