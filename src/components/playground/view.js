import { WORLD_HEIGHT, WORLD_WIDTH, DUDE_HEIGHT, DUDE_WIDTH } from './model'
import { rect } from 'cycle-canvas'
const { round } = Math

export function view (state$, { Time }) {
  return state$
    .compose(Time.throttleAnimation)
    .map(state => state.playground)
    .map(({ dude, platforms }) => rect({
      children: [
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
        })
      ]
    }))
}
