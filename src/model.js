import { WORLD_WIDTH, WORLD_HEIGHT, DUDE_WIDTH, DUDE_HEIGHT, UP, DOWN, LEFT, RIGHT, REQUESTED } from './constants'
const { min, max } = Math

export const DUDE = { x: 0, y: 0, velocityX: 0, velocityY: 0, gravity: 0.01 }
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
  const maxX = WORLD_WIDTH - DUDE_WIDTH
  const maxY = WORLD_HEIGHT - DUDE_HEIGHT

  return action$
    .fold(({dude, platforms}, actions) => {
      dude = Object.assign({}, dude)

      dude.velocityX = 0
      if (actions[LEFT] === REQUESTED) { dude.velocityX -= 0.5 }
      if (actions[RIGHT] === REQUESTED) { dude.velocityX += 0.5 }
      dude.x = min(maxX, max(0, dude.x + dude.velocityX))

      const platform = getPlatformBelow(dude, platforms)
      if (actions[UP] === REQUESTED && isStanding(dude, platform)) { dude.velocityY = 0.5 }
      const minY = (platform && actions[DOWN] !== REQUESTED) ? platform.y + platform.height : 0
      dude.y = min(maxY, max(minY, dude.y + dude.velocityY))
      dude.velocityY = dude.y === minY ? 0 : dude.velocityY - dude.gravity
      if (dude.y === maxY && dude.velocityY > 0) { dude.velocityY = 0 }
      return { dude, platforms }
    }, { dude: DUDE, platforms: PLATFORMS })
}

export function isStanding(dude, platformBelow) {
  if (dude.y === 0 ) { return true }
  return platformBelow && dude.y === platformBelow.y + platformBelow.height
}

export function getPlatformBelow(dude, platforms) {
  return platforms.filter(platform =>
    dude.y >= platform.y + platform.height &&
    dude.x + DUDE_WIDTH >= platform.x && dude.x <= platform.x + platform.width
  ).reduce((closestPlatform, platform) => {
    if (!closestPlatform) { return platform }
    return platform.y > closestPlatform.y ? platform : closestPlatform
  }, null)
}
