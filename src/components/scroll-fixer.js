import xs from 'xstream'

export function ScrollFixer ({ DOM, Client }) {
  const event$ = Client.touchSupport ? touchEvents(DOM) : xs.empty()

  const sinks = {
    preventDefault: event$
  }

  return sinks
}

function touchEvents(DOM) {
  const body = DOM.select('body')
  const events = ['touchstart', 'touchmove', 'touchend']
    .map(e => body.events(e))
  return xs.merge(...events)
}
