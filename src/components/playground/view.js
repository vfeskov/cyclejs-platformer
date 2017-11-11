import { rect, text } from 'cycle-canvas'
import xs from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
const { round } = Math

export function view (state$, { Time, DOM, Client }) {
  const fgVcanvas$ = xs.combine(
    DOM.select('canvas#foreground').element(),
    state$
      .compose(Time.throttleAnimation)
      .map(state => state.playground)
      .map(({ world, dude, platforms, finished }) => rect({
        children: [
          // moving platforms
          ...platforms.filter(({ vX, vY }) => vX || vY).map(platform =>
            rect({
              x: round(platform.x),
              y: round(world.height - platform.y - platform.h),
              width: platform.w,
              height: platform.h,
              draw: [{ fill: 'white' }]
            })
          ),
          // dude
          rect({
            x: round(dude.x),
            y: round(world.height - dude.y - dude.h),
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
  ).map(([ hostCanvas, rootElement ]) => ({ hostCanvas, rootElement }))

  const bgVcanvas$ = xs.combine(
    DOM.select('canvas#background').element(),
    state$
      .filter(({ playground = {} }) => playground.newLevel) // only render once per level when it's generated
      .map(state => state.playground)
      .map(({ world, dude, platforms, coin }) => rect({
        children: [
          // traces of moving platforms
          ...platforms.filter(({ vX, vY }) => vX || vY).map(platform =>
            rect({
              x: round(platform.minX),
              y: round(world.height - platform.maxY - platform.h),
              width: platform.maxX - platform.minX + platform.w,
              height: platform.maxY - platform.minY + platform.h,
              draw: [{ fill: '#333' }]
            })
          ),
          // platforms that don't move
          ...platforms.filter(({ vX, vY }) => !vX && !vY).map(platform =>
            rect({
              x: round(platform.x),
              y: round(world.height - platform.y - platform.h),
              width: platform.w,
              height: platform.h,
              draw: [{ fill: 'white' }]
            })
          ),
          // coin
          rect({
            x: round(coin.x),
            y: round(world.height - coin.y - coin.h),
            width: coin.w,
            height: coin.h,
            draw: [{ fill: 'yellow' }]
          })
        ]
      }))
  ).map(([ hostCanvas, rootElement ]) => ({ hostCanvas, rootElement }))

  const vcanvas$ = xs.merge(bgVcanvas$, fgVcanvas$)

  const vdom$ = state$
    .map(state => state.playground || {})
    .filter(({ world }) => world)
    .compose(dropRepeats((a, b) => a.world.scale === b.world.scale))
    .map(({ world }) =>
      <div className="canvas-container">
        <canvas id="background" width={world.width} height={world.height}></canvas>
        <canvas id="foreground" width={world.width} height={world.height}></canvas>
      </div>
    )

  return { vcanvas$, vdom$ }
}
