import xs from 'xstream'
import {
  generateLevel,
  updatePlatforms,
  updateDude,
  thingsIntersect
} from '../../game'
const { assign } = Object

export function model ({ move$, restart$ }, { Time, Client }) {
  const restartReducer$ = restart$.map(size => () => generateLevel(size, Client.touchSupport))

  const moveReducer$ = move$
    .map(move => move.split('').map(moveInDir => moveInDir === '1'))
    .map(move => Time.animationFrames().map(({ normalizedDelta }) => ({ normalizedDelta, move })))
    .flatten()
    .map(({ normalizedDelta, move }) => {
      return (prevState = {}) => {
        if (!prevState.playground) { return }

        const { playground } = prevState
        let { dude, platforms, coin, finished } = playground

        if (finished) { return playground }

        const oldPlatforms = platforms
        platforms = updatePlatforms(platforms, normalizedDelta)
        dude = updateDude(dude, { oldPlatforms, platforms }, move, normalizedDelta)
        finished = thingsIntersect(dude, coin)

        return assign({}, playground, { dude, platforms, coin, finished, newLevel: false })
      }
    })

  return xs.merge(moveReducer$, restartReducer$)
}

