import { intent } from './intent'
import { model } from './model'
import { view } from './view'

export function Playground (sources) {
  const state$ = sources.onion.state$
  const action = intent(sources)
  const reduce$ = model(action, sources)
  const { vcanvas$, vdom$ } = view(state$, sources)

  const sinks = {
    Canvas: vcanvas$,
    DOM: vdom$,
    onion: reduce$
  }

  return sinks
}
