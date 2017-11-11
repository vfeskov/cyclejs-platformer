import xs from 'xstream'
import isolate from '@cycle/isolate';

import { TouchController } from './components/touch-controller'
import { KeyboardController } from './components/keyboard-controller'
import { Playground } from './components/playground'
import { ScrollFixer } from './components/scroll-fixer'

export function App (sources) {
  const keyboardController = isolate(KeyboardController, 'keyboard')(sources)
  const touchController = isolate(TouchController, 'touch')(sources)
  const scrollFixer = isolate(ScrollFixer)(sources)
  const playground = isolate(Playground, { onion: playgroundLens() })(sources)

  const sinks = {
    DOM: xs.combine(playground.DOM, touchController.DOM)
      .map(([playgroundEl, touchControllerEl]) => {
        return <div id="wrapper">
          {playgroundEl}
          {touchControllerEl}
        </div>
      }),
    onion: xs.merge(keyboardController.onion, touchController.onion, playground.onion),
    Canvas: playground.Canvas,
    preventDefault: scrollFixer.preventDefault
  }

  return sinks
}

function playgroundLens() {
  return {
    get: (state = {}) => ({ move: mergeMoves(state), playground: state.playground }),
    set: (state, childState) => ({ ...state, playground: childState })
  }

  function mergeMoves({ keyboard = '0000', touch = '0000' }) {
    if (keyboard === '0000') { return touch }
    if (touch === '0000') { return keyboard }
    return [0, 1, 2, 3].map(i => keyboard[i] === touch[i] === '0' ? '0' : '1').join('')
  }
}
