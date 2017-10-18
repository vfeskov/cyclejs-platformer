import { mockDOMSource } from '@cycle/dom'
import { mockTimeSource } from '@cycle/time'
import { intent, UP, RIGHT, DOWN, LEFT, REQUESTED } from './intent'

describe('Intent', () => {
  it('emits requested actions when corresponding keys are pressed', done => {
    const Time = mockTimeSource()

    const keyEventMap = type => ({
      '◁': { type, keyCode: 37 },
      '△': { type, keyCode: 32 },
      '▷': { type, keyCode: 39 },
      '▽': { type, keyCode: 40 }
    })
    const keydown$  = Time.diagram('-◁-◁-△---▷----▽-▽-', keyEventMap('keydown'))
    const keyup$    = Time.diagram('-------◁----▷△---▽', keyEventMap('keyup'))
    const expected$ = Time.diagram('∅◁-◁-◸-△-◹--△∅▽-▽∅', {
      '∅': '0000',
      '◁': '0001',
      '◸': '1001',
      '△': '1000',
      '◹': '1100',
      '▽': '0010'
    })

    const DOM = mockDOMSource({
      body: {
        keydown: keydown$,
        keyup: keyup$
      }
    })

    const actual$ = intent({ DOM, Time })

    Time.assertEqual(actual$, expected$)

    Time.run(done);
  })
})
