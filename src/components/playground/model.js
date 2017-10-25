import xs from 'xstream'

const { min, max } = Math
const { assign } = Object

export const UP = 0,
             RIGHT = 1,
             DOWN = 2,
             LEFT = 3

export const WORLD_WIDTH = 1000,
             WORLD_HEIGHT = 1000

export const DUDE_HEIGHT = 40,
             DUDE_WIDTH = 20

const DUDE_MAX_X = WORLD_WIDTH - DUDE_WIDTH
const DUDE_MAX_Y = WORLD_HEIGHT - DUDE_HEIGHT

export function model ({ move$, restart$ }) {
  const restartReducer$ = restart$
    .mapTo((prevState = { playground: {} }) =>
      prevState.playground.finished ? generatePlayground() : prevState.playground
    )
  const moveReducer$ = move$
    .map(move => move.split('').map(moveInDir => moveInDir === '1'))
    .map(move => {
      return (prevState = {}) => {
        const playground = prevState.playground || generatePlayground()
        let { dude, platforms, coin, finished } = playground

        if (finished) { return playground }

        const oldPlatforms = platforms
        platforms = platforms.map(updatePlatform)
        dude = updateDude(dude, { oldPlatforms, platforms }, move)
        finished = dudeOverCoin(dude, coin)

        return { dude, platforms, coin, finished }
      }
    })
  return xs.merge(moveReducer$, restartReducer$)
}

function generatePlayground() {
  const DUDE = { x: 120, y: 720, jumpedFromVelocityX: 0, velocityX: 0, velocityY: 0, gravity: 0.4 }
  const PLATFORMS = [
    { x: 500, y: 100, width: 200, height: 20 },
    { x: 300, y: 150, width: 150, height: 20 },
    { x: 200, y: 250, width: 100, height: 20 },
    { x: 400, y: 300, width: 200, height: 20 },
    { x: 400, y: 400, width: 200, height: 20, velocityX: 2.5 },
    { x: 400, y: 500, width: 200, height: 20 },
    { x: 400, y: 600, width: 200, height: 20 },
    { x: 800, y: 700, width: 100, height: 20, velocityY: -2.5 },
    { x: 400, y: 800, width: 200, height: 20 },
  ]
  const COIN = { x: 200, y: 900, width: 40, height: 40 }

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
    x: min(DUDE_MAX_X, dude.x + delta.x),
    y: min(DUDE_MAX_Y, dude.y + delta.y),
  })
}

function updateDudeX (dude, move) {
  let velocityX = dude.jumpedFromVelocityX
  if (move[LEFT]) { velocityX -= 5 }
  if (move[RIGHT]) { velocityX += 5 }
  const x = min(DUDE_MAX_X, max(0, dude.x + velocityX ))
  return assign({}, dude, { x, velocityX })
}

function updateDudeY (dude, platforms, move) {
  let { y, jumpedFromVelocityX, velocityY, gravity } = dude
  const platform = getPlatformBelow(dude, platforms)
  const standing = isStanding(dude, platform)

  if (standing) { jumpedFromVelocityX = 0 }
  if (standing && move[UP]) {
    velocityY = 10
    if (platform) {
      velocityY += platform.velocityY || 0
      jumpedFromVelocityX = platform.velocityX || 0
    }
  }
  const minY = (platform && !move[DOWN]) ? platform.y + platform.height : 0
  y = min(DUDE_MAX_Y, max(minY, y + velocityY))
  velocityY = y === minY ? 0 : velocityY - gravity // set velocityY to 0 when standing
  if (y === DUDE_MAX_Y && velocityY > 0) { velocityY = 0 } // when we bump against the ceiling
  return assign({}, dude, { y, velocityY, jumpedFromVelocityX })
}

function updatePlatform (platform) {
  let { x, y, velocityX, velocityY, width, height } = platform
  if (velocityX) {
    const maxX = WORLD_WIDTH - width
    x = min(maxX, max(0, x + velocityX))
    if ((velocityX > 0 && x == maxX) || (velocityX < 0 && x == 0)) {
      velocityX = -velocityX
    }
  }
  if (velocityY) {
    const maxY = WORLD_HEIGHT - height
    y = min(maxY, max(0, y + velocityY))
    if ((velocityY > 0 && y == maxY) || (velocityY < 0 && y == 0)) {
      velocityY = -velocityY
    }
  }
  return assign({}, platform, { x, y, velocityX, velocityY })
}

function isStanding (dude, platformBelow) {
  if (dude.velocityY > 0) { return false }
  if (dude.y === 0 ) { return true }
  return platformBelow && dude.y === platformBelow.y + platformBelow.height
}

function isStandingOrSuperCloseToPlatform (dude, platformBelow) {
  if (!platformBelow || dude.velocityY > 0) { return false }
  const surfaceY = platformBelow.y + platformBelow.height
  return dude.y === surfaceY || dude.y - surfaceY < platformBelow.velocityY
}

function getPlatformBelow (dude, platforms) {
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

function dudeOverCoin (dude, coin) {
  return dude.x <= coin.x + coin.width && dude.x + DUDE_WIDTH >= coin.x &&
         dude.y <= coin.y + coin.height && dude.y + DUDE_HEIGHT >= coin.y
}

