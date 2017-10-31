import { WORLD_WIDTH, WORLD_HEIGHT, SCALE } from './config'

const { min, max } = Math
const { assign } = Object

const UP = 0,
      RIGHT = 1,
      DOWN = 2,
      LEFT = 3

export * from './level-generator'

export function updateDude (dude, { oldPlatforms, platforms }, move) {
  let delta = { x: 0, y: 0 }
  const platform = getPlatformBelow(dude, oldPlatforms)
  const standingOrSuperClose = isStandingOrSuperCloseToPlatform(dude, platform)
  if (standingOrSuperClose) {
    const newPlatform = platforms[oldPlatforms.indexOf(platform)]
    dude = applyDeltaToDude(dude, {
      x: newPlatform.x - platform.x,
      y: newPlatform.y - platform.y
    })
  }
  dude = updateDudeX(dude, move)
  dude = updateDudeY(dude, platforms, move)
  return dude
}

export function applyDeltaToDude (dude, delta) {
  return assign({}, dude, {
    x: min(WORLD_WIDTH - dude.w, dude.x + delta.x),
    y: min(WORLD_HEIGHT - dude.h, dude.y + delta.y),
  })
}

export function updateDudeX (dude, move) {
  let vX = 0
  if (move[LEFT]) { vX -= 5 * SCALE }
  if (move[RIGHT]) { vX += 5 * SCALE }
  const x = min(WORLD_WIDTH - dude.w, max(0, dude.x + vX ))
  return assign({}, dude, { x, vX })
}

export function updateDudeY (dude, platforms, move) {
  let { y, vY, g } = dude
  const platform = getPlatformBelow(dude, platforms)
  const standing = isStanding(dude, platform)

  if (standing && move[UP]) { vY = 10 * SCALE }
  const maxY = WORLD_HEIGHT - dude.h
  const minY = (platform && !move[DOWN]) ? platform.y + platform.h : 0
  y = min(maxY, max(minY, y + vY))
  vY = y === minY ? 0 : vY - g // set vY to 0 when standing
  if (y === maxY && vY > 0) { vY = 0 } // when we bump against the ceiling
  return assign({}, dude, { y, vY })
}

export function updatePlatform (platform) {
  let { x, y, vX, vY, minX, maxX, minY, maxY } = platform
  if (vX) {
    x = min(maxX, max(minX, x + vX))
    if ((vX > 0 && x == maxX) || (vX < 0 && x == minX)) {
      vX = -vX
    }
  }
  if (vY) {
    y = min(maxY, max(minY, y + vY))
    if ((vY > 0 && y == maxY) || (vY < 0 && y == minY)) {
      vY = -vY
    }
  }
  return assign({}, platform, { x, y, vX, vY })
}

export function isStanding (dude, platformBelow) {
  if (dude.vY > 0) { return false }
  if (dude.y === 0 ) { return true }
  return platformBelow && dude.y === platformBelow.y + platformBelow.h
}

export function isStandingOrSuperCloseToPlatform (dude, platformBelow) {
  if (!platformBelow || dude.vY > 0) { return false }
  const surfaceY = platformBelow.y + platformBelow.h
  return dude.y === surfaceY || dude.y - surfaceY < platformBelow.vY
}

export function getPlatformBelow (dude, platforms) {
  return platforms
    .filter(platform =>
      dude.y >= platform.y + platform.h &&
      dude.x + dude.w >= platform.x && dude.x <= platform.x + platform.w
    )
    .reduce((closest, platform) => {
      if (!closest) { return platform }
      return platform.y > closest.y ? platform : closest
    }, null)
}

export function thingsIntersect (a, b) {
  return a.x <= b.x + b.w && a.x + a.w >= b.x &&
         a.y <= b.y + b.h && a.y + a.h >= b.y
}


