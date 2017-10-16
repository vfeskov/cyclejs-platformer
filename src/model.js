import { UP, DOWN, LEFT, RIGHT } from './intent'
const { min, max } = Math
const { assign } = Object

export const WORLD_WIDTH = 1000,
             WORLD_HEIGHT = 1000

export const DUDE_HEIGHT = 40,
             DUDE_WIDTH = 20

export const DUDE = { x: 490, y: 0, velocityX: 0, velocityY: 0, gravity: 0.4 }
export const PLATFORMS = [
  { x: 500, y: 100, width: 200, height: 20 },
  { x: 300, y: 150, width: 150, height: 20 },
  { x: 200, y: 250, width: 100, height: 20 },
  { x: 400, y: 300, width: 200, height: 20 },
  { x: 400, y: 400, width: 200, height: 20 },
  { x: 400, y: 500, width: 200, height: 20 },
  { x: 400, y: 600, width: 200, height: 20 },
  { x: 400, y: 700, width: 200, height: 20 },
  { x: 400, y: 800, width: 200, height: 20 },
]

export function model (action$) {
  return action$
    .fold(({dude, platforms}, actions) => {
      dude = updateX(dude, actions)
      dude = updateY(dude, platforms, actions)
      return { dude, platforms }
    }, { dude: DUDE, platforms: PLATFORMS })
}

export function updateX (dude, actions) {
  let velocityX = 0
  if (actions[LEFT]) { velocityX -= 5 }
  if (actions[RIGHT]) { velocityX += 5 }
  const maxX = WORLD_WIDTH - DUDE_WIDTH
  const x = min(maxX, max(0, dude.x + velocityX))
  return assign({}, dude, { x, velocityX })
}

export function updateY (dude, platforms, actions) {
  let { y, velocityY, gravity } = dude
  const platform = getPlatformBelow(dude, platforms)
  if (actions[UP] && isStanding(dude, platform)) { velocityY = 10 }
  const minY = (platform && !actions[DOWN]) ? platform.y + platform.height : 0
  const maxY = WORLD_HEIGHT - DUDE_HEIGHT
  y = min(maxY, max(minY, y + velocityY))
  velocityY = y === minY ? 0 : velocityY - gravity // set velocityY to 0 when standing
  if (y === maxY && velocityY > 0) { velocityY = 0 } // when we bump against the ceiling
  return assign({}, dude, { y, velocityY })
}

export function isStanding (dude, platformBelow) {
  if (dude.y === 0 ) { return true }
  return platformBelow && dude.y === platformBelow.y + platformBelow.height
}

export function getPlatformBelow (dude, platforms) {
  return platforms
    .filter(platform =>
      dude.y >= platform.y + platform.height &&
      dude.x + DUDE_WIDTH >= platform.x && dude.x <= platform.x + platform.width
    )
    .reduce((closest, platform) => {
      if (!closest) { return platform }
      return platform.y > closest.y ? platform : closest
    }, null)
}
