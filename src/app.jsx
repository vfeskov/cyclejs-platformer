import xs from 'xstream'
import isolate from '@cycle/isolate';
import { TouchController } from './components/touch-controller'
import { KeyboardController } from './components/keyboard-controller'
import { Playground } from './components/playground'
import { ScrollFixer } from './components/scroll-fixer'

export function App (sources) {
  const components = [
    isolate(KeyboardController, 'keyboard')(sources),
    isolate(TouchController, 'touch')(sources),
    isolate(ScrollFixer)(sources),
    isolate(Playground, { onion: playgroundLens() })(sources)
  ]

  const sinks = mergeSinks(components)

  return sinks
}

function playgroundLens() {
  return {
    get: (state = {}) => ({ move: mergeMoves(state), playground: state.playground }),
    set: (state, childState) => ({ ...state, playground: childState })
  }

  function mergeMoves({ keyboard = '0000', touch = '0000' }) {
    return (parseInt(keyboard, 2) | parseInt(touch, 2) + 16).toString(2).replace('1', '')
  }
}

function mergeSinks(components) {
  const onion = xs.merge(...components.filter(c => c.onion).map(c => c.onion))
  return Object.assign({}, ...components, { onion })
}
