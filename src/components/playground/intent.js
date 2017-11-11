import dropRepeats from 'xstream/extra/dropRepeats'
import xs from 'xstream'

export function intent ({ onion, Time, Canvas, DOM, Client }) {
  const restartRequest$ = Client.touchSupport ?
    DOM.select('canvas#foreground').events('touchend') :
    DOM.select('body').events('keyup').filter(e => e.keyCode === 82) // r
  return {
    move$: onion.state$
      .map(state => state.move)
      .startWith('0000')
      .compose(dropRepeats())
      .map(move => Time.periodic(20).mapTo(move).startWith(move))
      .flatten(),
    restart$: xs.combine(
      Client.viewportSize$,
      restartRequest$.startWith()
    ).map(([size]) => size)
  }
}
