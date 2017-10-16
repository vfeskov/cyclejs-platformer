import xs from 'xstream'
import { adapt } from '@cycle/run/lib/adapt'
import fromEvent from 'xstream/extra/fromEvent';

function windowSize () {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

export function makeElementStyleDriver (selector) {
  const element = document.querySelector(selector)
  if (!element) {
    throw Error('selector is invalid')
  }

  return sink$ => {
    sink$.addListener({
      next: style => Object.assign(element.style, style),
      error: e => { throw e },
      complete: () => null
    })
    return adapt(xs.empty())
  }
}
