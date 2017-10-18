import { intent } from './intent'
import { view } from './view'

export function TouchController (sources) {
  const actions$ = intent(sources)
  const vdom$ = view(actions$)

  const sinks = {
    DOM: vdom$,
    request: actions$
  }

  return sinks
}
