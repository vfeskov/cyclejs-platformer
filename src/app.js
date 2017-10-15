import { intent } from './intent'
import { model } from './model'
import { view } from './view'

export function App (sources) {
  const action$ = intent(sources)
  const state$ = model(action$)
  const vtree$ = view(state$, sources.Time)

  const sinks = {
    DOM: vtree$
  }
  return sinks
}

