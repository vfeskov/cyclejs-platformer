import xs from 'xstream'

export function ScrollFixer ({ DOM, Client }) {
  const event$ = Client.touchSupport ? touchEvents(DOM) : xs.empty()

  const sinks = {
    preventDefault: event$
  }

  return sinks
}

function touchEvents(DOM) {
  const container = DOM.select('root-container')
  const events = ['touchstart', 'touchmove', 'touchend']
    .map(e => container.events(e))
  return xs.merge(...events)
}
