import xs from 'xstream'
import { TouchController } from './touch-controller'
import { KeyboardController } from './keyboard-controller'
import { Playground } from './playground'

export function App ({ DOM, Time }) {
  const keyboardController = KeyboardController({ DOM })
  const touchController = TouchController({ DOM })
  const request = xs.merge(
    touchController.request,
    keyboardController.request
  )
  const playground = Playground({ request, Time })

  const sinks = {
    DOM: touchController.DOM,
    Canvas: playground.Canvas
  }

  return sinks
}
