import dropRepeats from 'xstream/extra/dropRepeats'
import xs from 'xstream'

import { UP, RIGHT, DOWN, LEFT, DIRECTIONS, REQUESTED, NOT_REQUESTED } from './constants'

export const KEY_2_DIRECTION_MAP = {
  38: UP,     // arrow up
  87: UP,     // w
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
    .filter(({ type, keyCode }) => KEY_2_DIRECTION_MAP[keyCode])
    .map(({ type, keyCode }) => {
      const actionType = type === 'keydown' ? REQUESTED : NOT_REQUESTED
      const direction = KEY_2_DIRECTION_MAP[keyCode]
      return ({ [direction]: actionType })
    })
    .fold((actions, action) => Object.assign({}, actions, action), {})
    .compose(dropRepeats((newActions, oldActions) => !DIRECTIONS.some(d => newActions[d] !== oldActions[d])))
    .map(actions => Time.periodic(10).mapTo(actions).startWith(actions))
    .flatten()
}


