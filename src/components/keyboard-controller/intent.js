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

export function intent ({ DOM }) {
  return xs.merge(
      DOM.select('body').events('keydown'),
      DOM.select('body').events('keyup')
    )
    .filter(({ keyCode }) => KEY_DIRECTION_MAP[keyCode] !== undefined)
    .map(({ type, keyCode }) => {
      const isRequested = type === 'keydown' ? 1 : 0
      const direction = KEY_DIRECTION_MAP[keyCode]
      return [direction, isRequested]
    })
    .map(([direction, isRequested]) => {
      return (prevMove = '0000') => {
        const move = prevMove.split('')
        move[direction] = isRequested
        return move.join('')
      }
    })
}
