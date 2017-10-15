import { UP, DOWN, LEFT, RIGHT } from './intent'
const { min, max } = Math
const { assign } = Object

export const WORLD_WIDTH = 88,
             WORLD_HEIGHT = 88

export const DUDE_HEIGHT = 4,
             DUDE_WIDTH = 2

export const DUDE = { x: 49, y: 0, velocityX: 0, velocityY: 0, gravity: 0.04 }
export const PLATFORMS = [
  { x: 50, y: 10, width: 20, height: 2 },
  { x: 30, y: 15, width: 15, height: 2 },
  { x: 20, y: 25, width: 10, height: 2 },
  { x: 40, y: 30, width: 20, height: 2 },
  { x: 40, y: 40, width: 20, height: 2 },
  { x: 40, y: 50, width: 20, height: 2 },
  { x: 40, y: 60, width: 20, height: 2 },
  { x: 40, y: 70, width: 20, height: 2 },
  { x: 40, y: 80, width: 20, height: 2 },
]

export function model(action$) {
  return action$
    .fold(({dude, platforms}, actions) => {
      dude = updateX(dude, actions)
      dude = updateY(dude, platforms, actions)
      return { dude, platforms }
    }, { dude: DUDE, platforms: PLATFORMS })
}

export function updateX(dude, actions) {
  let velocityX = 0
  if (actions[LEFT]) { velocityX -= 1 }
  if (actions[RIGHT]) { velocityX += 1 }
  const maxX = WORLD_WIDTH - DUDE_WIDTH
  const x = min(maxX, max(0, dude.x + velocityX))
  return assign({}, dude, { x, velocityX })
}

export function updateY(dude, platforms, actions) {
  let { y, velocityY, gravity } = dude
  const platform = getPlatformBelow(dude, platforms)
  if (actions[UP] && isStanding(dude, platform)) { velocityY = 1 }
  const minY = (platform && !actions[DOWN]) ? platform.y + platform.height : 0
  const maxY = WORLD_HEIGHT - DUDE_HEIGHT
  y = min(maxY, max(minY, y + velocityY))
  velocityY = y === minY ? 0 : velocityY - gravity // set velocityY to 0 when standing
  if (y === maxY && velocityY > 0) { velocityY = 0 } // when we bump against the ceiling
  return assign({}, dude, { y, velocityY })
}

export function isStanding(dude, platformBelow) {
  if (dude.y === 0 ) { return true }
  return platformBelow && dude.y === platformBelow.y + platformBelow.height
}

export function getPlatformBelow(dude, platforms) {
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
