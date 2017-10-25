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
          y: round(WORLD_WIDTH - coin.y - coin.h),
          width: coin.w,
          height: coin.h,
          draw: [{ fill: 'yellow' }]
        }),
        ...platforms.map(platform =>
          rect({
            x: round(platform.x),
            y: round(WORLD_HEIGHT - platform.y - platform.h),
            width: platform.w,
            height: platform.h,
            draw: [{ fill: 'white' }]
          })
        ),
        rect({
          x: round(dude.x),
          y: round(WORLD_WIDTH - dude.y - dude.h),
          width: dude.w,
          height: dude.h,
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
