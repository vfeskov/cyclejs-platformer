import { WORLD_HEIGHT, WORLD_WIDTH } from '../../game/config'
import { rect, text } from 'cycle-canvas'
const { round } = Math

export function view (state$, { Time, Client }) {
  return state$
    .compose(Time.throttleAnimation)
    .map(state => state.playground)
    .map(({ dude, platforms, coin, finished }) => rect({
      children: [
        ...platforms.map(platform =>
          rect({
            x: round(platform.minX),
            y: round(WORLD_HEIGHT - platform.maxY - platform.h),
            width: round(platform.maxX - platform.minX + platform.w),
            height: round(platform.maxY - platform.minY + platform.h),
            draw: [{ fill: '#333' }]
          })
        ),
        ...platforms.map(platform =>
          rect({
            x: round(platform.x),
            y: round(WORLD_HEIGHT - platform.y - platform.h),
            width: round(platform.w),
            height: round(platform.h),
            draw: [{ fill: 'white' }]
          })
        ),
        rect({
          x: round(coin.x),
          y: round(WORLD_WIDTH - coin.y - coin.h),
          width: coin.w,
          height: coin.h,
          draw: [{ fill: 'yellow' }]
        }),
        rect({
          x: round(dude.x),
          y: round(WORLD_WIDTH - dude.y - dude.h),
          width: dude.w,
          height: dude.h,
          draw: [{ fill: 'red' }]
        }),
        finished && text({
          x: 500,
          y: 500,
          textAlign: 'center',
          value: `${Client.touchSupport ? 'Tap' : 'Hit SPACE'} to restart`,
          font: '76pt Arial',
          draw: [
            { fill: 'white' },
            { stroke: 'black' }
          ]
        })
      ]
    }))
}
