import { WORLD_HEIGHT, WORLD_WIDTH } from '../../game/config'
import { rect, text } from 'cycle-canvas'
const { round } = Math

export function view (state$, { Time, Client }) {
  const vcanvas$ = state$
    .compose(Time.throttleAnimation)
    .map(state => state.playground)
    .map(({ dude, platforms, finished }) => rect({
      children: [
        // moving platforms
        ...platforms.filter(({vX, vY}) => vX || vY).map(platform =>
          rect({
            x: round(platform.x),
            y: round(WORLD_HEIGHT - platform.y - platform.h),
            width: platform.w,
            height: platform.h,
            draw: [{ fill: 'white' }]
          })
        ),
        // dude
        rect({
          x: round(dude.x),
          y: round(WORLD_WIDTH - dude.y - dude.h),
          width: dude.w,
          height: dude.h,
          draw: [{ fill: 'red' }]
        }),
        // restart text
        finished && text({
          x: 500,
          y: 500,
          textAlign: 'center',
          value: `${Client.touchSupport ? 'Tap' : 'Hit R'} to restart`,
          font: '76pt Arial',
          draw: [
            { fill: 'white' },
            { stroke: 'black' }
          ]
        })
      ]
    }))

  const vcanvasBackground$ = state$
    .filter(state => state.playground.newLevel) // only render once per level when it's generated
    .map(state => state.playground)
    .map(({ dude, platforms, coin }) => rect({
      children: [
        // traces of moving platforms
        ...platforms.filter(({vX, vY}) => vX || vY).map(platform =>
          rect({
            x: round(platform.minX),
            y: round(WORLD_HEIGHT - platform.maxY - platform.h),
            width: platform.maxX - platform.minX + platform.w,
            height: platform.maxY - platform.minY + platform.h,
            draw: [{ fill: '#333' }]
          })
        ),
        // platforms that don't move
        ...platforms.filter(({vX, vY}) => !vX && !vY).map(platform =>
          rect({
            x: round(platform.x),
            y: round(WORLD_HEIGHT - platform.y - platform.h),
            width: platform.w,
            height: platform.h,
            draw: [{ fill: 'white' }]
          })
        ),
        // coin
        rect({
          x: round(coin.x),
          y: round(WORLD_WIDTH - coin.y - coin.h),
          width: coin.w,
          height: coin.h,
          draw: [{ fill: 'yellow' }]
        })
      ]
    }))

  return { vcanvas$, vcanvasBackground$ }
}
