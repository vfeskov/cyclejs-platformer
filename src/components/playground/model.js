import xs from 'xstream'
import {
  generateLevel,
  updateDude,
  updatePlatform,
  thingsIntersect
} from '../../game'

export function model ({ move$, restart$ }) {
  const restartReducer$ = restart$
    .mapTo((prevState = { playground: {} }) =>
      prevState.playground.finished ? generateLevel() : prevState.playground
    )

  const moveReducer$ = move$
    .map(move => move.split('').map(moveInDir => moveInDir === '1'))
    .map(move => {
      return (prevState = {}) => {
        if (!prevState.playground) { return generateLevel() }

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

