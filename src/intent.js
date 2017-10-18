import dropRepeats from 'xstream/extra/dropRepeats'
import xs from 'xstream'

export const UP = 0,
             RIGHT = 1,
             DOWN = 2,
             LEFT = 3

export const KEY_DIRECTION_MAP = {
  38: UP,     // arrow up
  87: UP,     // w
  32: UP,     // space
  39: RIGHT,  // arrow right
  68: RIGHT,  // d
  40: DOWN,   // arrow down
  83: DOWN,   // s
  37: LEFT,   // arrow left
  65: LEFT    // a
}

export const TOUCH_SECTOR_ACTIONS_MAP = [
  [[-91.46, -37.88], [-91.46, 37.89],  '0001'],
  [[-91.46, 37.89],  [-37.88, 91.46],  '1001'],
  [[-37.88, 91.46],  [37.9, 91.46],    '1000'],
  [[37.9, 91.46],    [91.46, 37.88],   '1100'],
  [[91.46, 37.88],   [91.46, -37.88],  '0100'],
  [[91.46, -37.88],  [37.88, -91.46],  '0110'],
  [[37.88, -91.46],  [-37.89, -91.46], '0010'],
  [[-37.89, -91.46], [-91.46, -37.88], '0011']
]

export function intent ({ DOM, Time }) {
  return xs.merge(
      keypressActions(DOM),
      touchActions(DOM)
    )
    .compose(dropRepeats())
    .map(actions => Time.periodic(20).mapTo(actions).startWith(actions))
    .flatten()
}

function keypressActions(DOM) {
  return xs.merge(
      DOM.select('body').events('keydown'),
      DOM.select('body').events('keyup')
    )
    .filter(({ type, keyCode }) => KEY_DIRECTION_MAP[keyCode] !== undefined)
    .map(({ type, keyCode }) => {
      const isRequested = type === 'keydown' ? 1 : 0
      const direction = KEY_DIRECTION_MAP[keyCode]
      return [direction, isRequested]
    })
    .fold((actions, [direction, isRequested]) => {
      const newActions = actions.split('')
      newActions[direction] = isRequested
      return newActions.join('')
    }, '0000')
}

function touchActions(DOM) {
  return xs.merge(
      DOM.select('svg').events('touchstart'),
      DOM.select('svg').events('touchmove'),
      DOM.select('svg').events('touchend')
    )
    .map(({ type, currentTarget, targetTouches, view }) =>
      type === 'touchend' ? '0000' : TOUCH_SECTOR_ACTIONS_MAP
        .filter(([start, end], index) => {
          const point = [
            targetTouches[0].clientX,
            view.innerHeight - targetTouches[0].clientY
          ]
          const targetRect = currentTarget.getBoundingClientRect();
          const center = [
            targetRect.x + 100,
            view.innerHeight - targetRect.y - 100
          ]
          return isInsideSector(point, center, start, end)
        })
        .reduce((match, sector) => sector[2], '0000')
    )
}

function areClockwise(v1, v2) {
  return -v1[0] * v2[1] + v1[1] * v2[0] > 0;
}

function isOutsideRadius(v, radius) {
  return v[0] * v[0] + v[1] * v[1] >= radius * radius;
}

function isInsideSector(point, center, start, end) {
  const relPoint = [
    point[0] - center[0],
    point[1] - center[1]
  ]
  return !areClockwise(end, relPoint) &&
         areClockwise(start, relPoint) &&
         isOutsideRadius(relPoint, 40);
}
