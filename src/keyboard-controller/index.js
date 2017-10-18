import { intent } from './intent'

export function KeyboardController (sources) {
  const actions$ = intent(sources)

  const sinks = {
    request: actions$
  }

  return sinks
}
