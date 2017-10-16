import { WORLD_HEIGHT, WORLD_WIDTH, DUDE_HEIGHT, DUDE_WIDTH } from './model'
import { rect } from 'cycle-canvas'
const { round } = Math

export function view (state$, Time) {
  return state$
    .compose(Time.throttleAnimation)
    .map(({ dude, platforms }) => rect({
      x: 0,
      y: 0,
      width: WORLD_WIDTH,
      height: WORLD_HEIGHT,
      draw: [{ clear: true }],
      children: [
        ...platforms.map(platform =>
          rect({
            x: round(platform.x),
            y: round(1000 - platform.y - platform.height),
            width: platform.width,
            height: platform.height,
            draw: [{ fill: 'white' }]
          })
        ),
        rect({
          x: round(dude.x),
          y: round(1000 - dude.y - DUDE_HEIGHT),
          width: DUDE_WIDTH,
          height: DUDE_HEIGHT,
          draw: [{ fill: 'red' }]
        })
      ]
    }))
}
