import { intent } from './intent'
import { model } from './model'
import { view } from './view'

export function Playground (sources) {
  const actions$ = intent(sources)
  const state$ = model(actions$)
  const vcanvas$ = view(state$, sources)

  const sinks = {
    Canvas: vcanvas$
  }

  return sinks
}
