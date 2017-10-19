import xs from 'xstream'
import { TouchController } from './touch-controller'
import { KeyboardController } from './keyboard-controller'
import { Playground } from './playground'

export function App ({ DOM, Time, Client }) {
  const controllers = [
    KeyboardController({ DOM }),
    Client.touchSupport && TouchController({ DOM })
  ].filter(c => c)

  const { request, DOM: vdom$ } = mergeControllers(controllers)

  const { Canvas: vcanvas$ } = Playground({ request, Time })

  const sinks = {
    DOM: vdom$,
    Canvas: vcanvas$,
    preventDefault: touchEvents(DOM)
  }

  return sinks
}

function mergeControllers (controllers) {
  const request = controllers.filter(c => c.request).map(c => c.request)
  const DOM = controllers.filter(c => c.DOM).map(c => c.DOM)
  return {
    request: request.length ? xs.merge(...request) : xs.empty(),
    DOM: DOM.length ?
      xs.combine(...DOM).map((...elements) => <div>{elements}</div>) :
      xs.empty()
  }
}

function touchEvents (DOM) {
  const events = ['touchstart', 'touchmove', 'touchend']
    .map(e => DOM.select('body').events(e))
  return xs.merge(...events)
}
