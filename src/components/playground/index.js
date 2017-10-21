import { intent } from './intent'
import { model } from './model'
import { view } from './view'

export function Playground (sources) {
  const state$ = sources.onion.state$
  const move$ = intent(sources)
  const reduce$ = model(move$)
  const vcanvas$ = view(state$, sources)

  const sinks = {
    Canvas: vcanvas$,
    onion: reduce$
  }

  return sinks
}
