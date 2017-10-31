import { intent } from './intent'
import { model } from './model'
import { view } from './view'

export function Playground (sources) {
  const state$ = sources.onion.state$
  const action = intent(sources)
  const reduce$ = model(action)
  const { vcanvas$, vcanvasBackground$ } = view(state$, sources)

  const sinks = {
    Canvas: vcanvas$,
    CanvasBackground: vcanvasBackground$,
    onion: reduce$
  }

  return sinks
}
