import xs from 'xstream'
import {
  generateLevel,
  updateDude,
  updatePlatform,
  thingsIntersect
} from '../../game'
const { assign } = Object

export function model ({ move$, restart$ }, { Client }) {
  const restartReducer$ = restart$.map(size => () => generateLevel(size, Client.touchSupport))

  const moveReducer$ = move$
    .map(move => move.split('').map(moveInDir => moveInDir === '1'))
    .map(move => {
      return (prevState = {}) => {
        if (!prevState.playground) { return }

        const { playground } = prevState
        let { dude, platforms, coin, finished } = playground

        if (finished) { return playground }

        const oldPlatforms = platforms
        platforms = platforms.map(updatePlatform)
        dude = updateDude(dude, { oldPlatforms, platforms }, move)
        finished = thingsIntersect(dude, coin)

        return assign({}, playground, { dude, platforms, coin, finished, newLevel: false })
      }
    })

  return xs.merge(moveReducer$, restartReducer$)
}

