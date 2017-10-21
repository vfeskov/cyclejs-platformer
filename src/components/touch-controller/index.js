import { intent } from './intent'
import { view } from './view'

export function TouchController (sources) {
  const state$ = sources.onion.state$
  const reduce$ = intent(sources)
  const vdom$ = view(state$)

  const sinks = {
    DOM: vdom$,
    onion: reduce$
  }

  return sinks
}
