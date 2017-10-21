import { intent } from './intent'

export function KeyboardController (sources) {
  const reduce$ = intent(sources)

  const sinks = {
    onion: reduce$
  }

  return sinks
}
