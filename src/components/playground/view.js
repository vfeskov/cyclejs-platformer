import { WORLD_HEIGHT, WORLD_WIDTH, DUDE_HEIGHT, DUDE_WIDTH } from './model'
import { rect, text } from 'cycle-canvas'
const { round } = Math

export function view (state$, { Time, Client }) {
  return state$
    .compose(Time.throttleAnimation)
    .map(state => state.playground)
    .map(({ dude, platforms, coin, finished }) => rect({
      children: [
        rect({
          x: round(coin.x),
          y: round(WORLD_WIDTH - coin.y - coin.height),
          width: coin.width,
          height: coin.height,
          draw: [{ fill: 'yellow' }]
        }),
        ...platforms.map(platform =>
          rect({
            x: round(platform.x),
            y: round(WORLD_HEIGHT - platform.y - platform.height),
            width: platform.width,
            height: platform.height,
            draw: [{ fill: 'white' }]
          })
        ),
        rect({
          x: round(dude.x),
          y: round(WORLD_WIDTH - dude.y - DUDE_HEIGHT),
          width: DUDE_WIDTH,
          height: DUDE_HEIGHT,
          draw: [{ fill: 'red' }]
        }),
        finished && text({
          x: 100,
          y: 500,
          value: `${Client.touchSupport ? 'Tap' : 'Click'} to restart`,
          font: '100pt Arial',
          draw: [
            { fill: 'white' },
            { stroke: 'black' }
          ]
        })
      ]
    }))
}
