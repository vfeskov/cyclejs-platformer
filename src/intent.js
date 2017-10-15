import dropRepeats from 'xstream/extra/dropRepeats'
import xs from 'xstream'

export const UP = 0,
             RIGHT = 1,
             DOWN = 2,
             LEFT = 3

export const KEY_2_DIRECTION_MAP = {
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

export function intent({ DOM, Time }) {
  return xs.merge(
      DOM.select('body').events('keydown'),
      DOM.select('body').events('keyup')
    )
    .filter(({ type, keyCode }) => KEY_2_DIRECTION_MAP[keyCode] !== undefined)
    .map(({ type, keyCode }) => {
      const isRequested = type === 'keydown' ? 1 : 0
      const direction = KEY_2_DIRECTION_MAP[keyCode]
      return [direction, isRequested]
    })
    .fold((actions, [direction, isRequested]) => {
      const newActions = [].concat(actions)
      newActions[direction] = isRequested
      return newActions
    }, [0, 0, 0, 0])
    .compose(dropRepeats((actions, oldActions) => actions.join() === oldActions.join()))
    .map(actions => Time.periodic(20).mapTo(actions).startWith(actions))
    .flatten()
    .filter(actions => actions.some(isRequested => isRequested))
}


