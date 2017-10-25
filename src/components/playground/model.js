import xs from 'xstream'

const { min, max } = Math
const { assign } = Object

export const UP = 0,
             RIGHT = 1,
             DOWN = 2,
             LEFT = 3

export const WORLD_WIDTH = 1000,
             WORLD_HEIGHT = 1000

export function model ({ move$, restart$ }) {
  const restartReducer$ = restart$
    .mapTo((prevState = { playground: {} }) =>
      prevState.playground.finished ? generatePlayground() : prevState.playground
    )
  const moveReducer$ = move$
    .map(move => move.split('').map(moveInDir => moveInDir === '1'))
    .map(move => {
      return (prevState = {}) => {
        if (!prevState.playground) { return generatePlayground() }

        const { playground } = prevState
        let { dude, platforms, coin, finished } = playground

        if (finished) { return playground }

        const oldPlatforms = platforms
        platforms = platforms.map(updatePlatform)
        dude = updateDude(dude, { oldPlatforms, platforms }, move)
        finished = thingsIntersect(dude, coin)

        return { dude, platforms, coin, finished }
      }
    })
  return xs.merge(moveReducer$, restartReducer$)
}

function generatePlayground() {
  const DUDE = { x: 120, y: 720, w: 20, h: 40, vX: 0, vY: 0, g: 0.4 }
  const PLATFORMS = [
    { x: 500, y: 100, w: 200, h: 20 },
    { x: 300, y: 150, w: 150, h: 20 },
    { x: 200, y: 250, w: 100, h: 20 },
    { x: 400, y: 300, w: 200, h: 20 },
    { x: 400, y: 400, w: 200, h: 20, vX: 2.5 },
    { x: 400, y: 500, w: 200, h: 20 },
    { x: 400, y: 600, w: 200, h: 20 },
    { x: 800, y: 700, w: 100, h: 20, vY: -2.5 },
    { x: 400, y: 800, w: 200, h: 20 },
  ]
  const COIN = { x: 200, y: 900, w: 40, h: 40 }

  return {
    dude: DUDE,
    platforms: PLATFORMS,
    coin: COIN,
    finished: false
  }
}

function updateDude (dude, { oldPlatforms, platforms }, move) {
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

function applyDeltaToDude (dude, delta) {
  return assign({}, dude, {
    x: min(WORLD_WIDTH - dude.w, dude.x + delta.x),
    y: min(WORLD_HEIGHT - dude.h, dude.y + delta.y),
  })
}

function updateDudeX (dude, move) {
  let vX = 0
  if (move[LEFT]) { vX -= 5 }
  if (move[RIGHT]) { vX += 5 }
  const x = min(WORLD_WIDTH - dude.w, max(0, dude.x + vX ))
  return assign({}, dude, { x, vX })
}

function updateDudeY (dude, platforms, move) {
  let { y, vY, g } = dude
  const platform = getPlatformBelow(dude, platforms)
  const standing = isStanding(dude, platform)

  if (standing && move[UP]) { vY = 10 }
  const maxY = WORLD_HEIGHT - dude.h
  const minY = (platform && !move[DOWN]) ? platform.y + platform.h : 0
  y = min(maxY, max(minY, y + vY))
  vY = y === minY ? 0 : vY - g // set vY to 0 when standing
  if (y === maxY && vY > 0) { vY = 0 } // when we bump against the ceiling
  return assign({}, dude, { y, vY })
}

function updatePlatform (platform) {
  let { x, y, vX, vY, w, h } = platform
  if (vX) {
    const maxX = WORLD_WIDTH - w
    x = min(maxX, max(0, x + vX))
    if ((vX > 0 && x == maxX) || (vX < 0 && x == 0)) {
      vX = -vX
    }
  }
  if (vY) {
    const maxY = WORLD_HEIGHT - h
    y = min(maxY, max(0, y + vY))
    if ((vY > 0 && y == maxY) || (vY < 0 && y == 0)) {
      vY = -vY
    }
  }
  return assign({}, platform, { x, y, vX, vY })
}

function isStanding (dude, platformBelow) {
  if (dude.vY > 0) { return false }
  if (dude.y === 0 ) { return true }
  return platformBelow && dude.y === platformBelow.y + platformBelow.h
}

function isStandingOrSuperCloseToPlatform (dude, platformBelow) {
  if (!platformBelow || dude.vY > 0) { return false }
  const surfaceY = platformBelow.y + platformBelow.h
  return dude.y === surfaceY || dude.y - surfaceY < platformBelow.vY
}

function getPlatformBelow (dude, platforms) {
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

function thingsIntersect (a, b) {
  return a.x <= b.x + b.w && a.x + a.w >= b.x &&
         a.y <= b.y + b.h && a.y + a.h >= b.y
}

