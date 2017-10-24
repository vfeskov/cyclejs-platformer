import dropRepeats from 'xstream/extra/dropRepeats'
import xs from 'xstream'

export function intent ({ onion, Time, Canvas, Client }) {
  return {
    move$: onion.state$
      .map(state => state.move)
      .startWith('0000')
      .compose(dropRepeats())
      .map(move => Time.periodic(20).mapTo(move).startWith(move))
      .flatten(),
    restart$: Canvas.events(Client.touchSupport ? 'touchend' : 'click')
  }
}
