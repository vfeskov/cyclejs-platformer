import { WORLD_WIDTH, WORLD_HEIGHT, SCALE } from './config'

const { min, max, floor } = Math

const GRAVITY = 0.4,
      DUDE_WIDTH = 20,
      DUDE_HEIGHT = 40,
      MIN_PLATFORM_W = 40,
      PLATFORM_H = 20

export function generateLevel () {
  const dude = makeDude()
  const platforms = makePlatforms()
  const coin = makeCoin(platforms)

  return { dude, platforms, coin, newLevel: true }
}

function makeDude () {
  return {
    x: randomInt(0, WORLD_WIDTH - DUDE_WIDTH * SCALE),
    y: 0,
    w: floor(DUDE_WIDTH * SCALE),
    h: floor(DUDE_HEIGHT * SCALE),
    vX: 0,
    vY: 0,
    g: GRAVITY * SCALE
  }
}

function makePlatforms (platforms = [], baseLeftX = 0, baseRightX = WORLD_WIDTH, baseY = 0) {
  if (baseY >= 800) { return platforms }

  let vX = 0,
      vY = 0,
      moveOffsetX = 0,
      moveOffsetY = 0
  if (randomInt(0, 3) === 0) { // every fourth platform is moving
    let v = (randomInt(0, 1) === 0 ? 1 : -1) * randomInt(1, 3) * SCALE,
        moveOffset = randomInt(100 * SCALE, 200 * SCALE)
    if (randomInt(0, 1) === 0) { // half of them moves horizontally
      vX = v
      moveOffsetX = moveOffset
    } else { // another half - vertically
      vY = v
      moveOffsetY = moveOffset
    }
  }
  let w = randomInt(40 * SCALE, 200 * SCALE), x
  if (platforms.length) {
    let offset = randomInt(0, 120 * SCALE),
        leftSideX = baseLeftX - w - offset,
        rightSideX = baseRightX + offset,
        side
    if (rightSideX > WORLD_WIDTH - w) {
      side = 0
    } else if (leftSideX < 0) {
      side = 1
    } else {
      side = randomInt(0, 1)
    }
    x = side === 0 ? leftSideX : rightSideX
  } else {
    x = randomInt(baseLeftX, baseRightX - w)
  }
  let maxX = min(WORLD_WIDTH - w, x + moveOffsetX),
      minX = max(0, x - moveOffsetX),
      h = floor(PLATFORM_H * SCALE),
      maxY = min(WORLD_HEIGHT - h, baseY + 120 * SCALE - h),
      minY = baseY + 70 * SCALE,
      y = randomInt(minY, maxY)
  maxY = min(WORLD_HEIGHT - h, y + moveOffsetY)
  minY = y

  const newPlatform = { x, y, w, h, vX, vY, minX, maxX, minY, maxY }

  return makePlatforms(platforms.concat(newPlatform), minX, maxX + w, maxY + h)
}

function makeCoin(platforms) {
  const top = platforms[platforms.length - 1],
        w = 40 * SCALE,
        h = w,
        x = randomInt(max(0, top.minX - 120 * SCALE), min(WORLD_WIDTH - w, top.maxX + 120 * SCALE)),
        y = top.minY + 40

  return { x, y, w, h }
}

function randomInt(min, max) {
  return floor(Math.random() * (max - min + 1)) + floor(min)
}
