const { min, max, floor, round } = Math
const { assign } = Object

const TOUCH_CONTROLLER_WIDTH = 204

// base values, which are multipled by dynamic scale that depends on viewport size
const WORLD_WIDTH = 1000,
      WORLD_HEIGHT = 1000,

      GRAVITY = 0.25,
      DUDE_WIDTH = 20,
      DUDE_HEIGHT = 40,
      MIN_JUMP_H = 70,
      MAX_JUMP_H = 120,
      DUDE_BASE_V_X = 4,
      DUDE_BASE_V_Y = 8,

      MIN_PLATFORM_W = 40,
      MAX_PLATFORM_W = 200,
      PLATFORM_H = 20,
      MIN_PLATFORM_MOVE_OFFSET = 100,
      MAX_PLATFORM_MOVE_OFFSET = 200,

      COIN_W = 40,
      COIN_H = 40,

      FINAL_TEXT_X = 500,
      FINAL_TEXT_Y = 500,
      FINAL_TEXT_FONT_SIZE = 76

export function generateLevel (clientSize, touchSupport) {
  const world = makeWorld(clientSize, touchSupport)
  const dude = makeDude(world)
  const platforms = makePlatforms(world)
  const coin = makeCoin(world, platforms)
  const finalText = makeFinalText(world, touchSupport)

  return { world, dude, platforms, coin, finalText, finished: false, newLevel: true }
}

function makeWorld (clientSize, touchSupport) {
  let width, height
  const touchControllerWidth = touchSupport ? TOUCH_CONTROLLER_WIDTH : 0
  if (clientSize.width > clientSize.height) {
    width = floor(min(clientSize.height, clientSize.width - touchControllerWidth))
    height = width
  } else {
    height = floor(min(clientSize.width, clientSize.height - touchControllerWidth))
    width = height
  }
  const scale = width / WORLD_WIDTH

  return { width, height, scale }
}

function makeDude ({ width, height, scale }) {
  const tmpDude = {
    x: randomInt(0, width - DUDE_WIDTH * scale),
    y: 0,
    w: floor(DUDE_WIDTH * scale),
    h: floor(DUDE_HEIGHT * scale),
    baseVX: DUDE_BASE_V_X * scale,
    baseVY: DUDE_BASE_V_Y * scale,
    vX: 0,
    vY: 0,
    g: GRAVITY * scale
  }
  return assign({}, tmpDude, {
    maxX: width - tmpDude.w,
    maxY: height - tmpDude.h
  })
}

function makePlatforms (world, platforms = [], baseLeftX = 0, baseRightX, baseY = 0) {
  if (baseY >= 0.8 * world.height) { return platforms }

  baseRightX = baseRightX || world.width

  let vX = 0,
      vY = 0,
      moveOffsetX = 0,
      moveOffsetY = 0
  if (randomInt(0, 3) === 0) { // every fourth platform is moving
    let v = (randomInt(0, 1) === 0 ? 1 : -1) * randomInt(1, 3) * world.scale,
        moveOffset = randomInt(
          MIN_PLATFORM_MOVE_OFFSET * world.scale,
          MAX_PLATFORM_MOVE_OFFSET * world.scale
        )
    if (randomInt(0, 1) === 0) { // half of them moves horizontally
      vX = v
      moveOffsetX = moveOffset
    } else { // another half - vertically
      vY = v
      moveOffsetY = moveOffset
    }
  }
  let w = randomInt(MIN_PLATFORM_W * world.scale, MAX_PLATFORM_W * world.scale), x
  if (platforms.length) {
    let offset = randomInt(0, MAX_JUMP_H * world.scale),
        leftSideX = baseLeftX - w - offset,
        rightSideX = baseRightX + offset,
        side
    if (rightSideX > world.width - w) {
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
  let maxX = min(world.width - w, x + moveOffsetX),
      minX = max(0, x - moveOffsetX),
      h = floor(PLATFORM_H * world.scale),
      maxY = min(world.height - h, baseY + MAX_JUMP_H * world.scale - h),
      minY = baseY + MIN_JUMP_H * world.scale,
      y = randomInt(minY, maxY)
  maxY = min(world.height - h, y + moveOffsetY)
  minY = y

  const newPlatform = { x, y, w, h, vX, vY, minX, maxX, minY, maxY }

  return makePlatforms(world, platforms.concat(newPlatform), minX, maxX + w, maxY + h)
}

function makeCoin (world, platforms) {
  const top = platforms[platforms.length - 1],
        w = COIN_W * world.scale,
        h = w,
        x = randomInt(max(0, top.minX - MAX_JUMP_H * world.scale), min(world.width - w, top.maxX + MAX_JUMP_H * world.scale)),
        y = top.minY + COIN_H * world.scale

  return { x, y, w, h }
}

function randomInt (min, max) {
  return floor(Math.random() * (max - min + 1)) + floor(min)
}

function makeFinalText (world) {
  return {
    x: round(FINAL_TEXT_X * world.scale),
    y: round(FINAL_TEXT_Y * world.scale),
    fontSize: round(FINAL_TEXT_FONT_SIZE * world.scale)
  }
}
