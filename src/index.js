import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'
import { makeCanvasDriver } from 'cycle-canvas'
import { timeDriver } from '@cycle/time'
import { App } from './app'
import { WORLD_HEIGHT, WORLD_WIDTH } from './components/playground/model'
import { clientDriver } from './drivers/client'
import { preventDefaultDriver } from './drivers/prevent-default'
import onionify from 'cycle-onionify';

const main = onionify(App)

const drivers = {
  DOM: makeDOMDriver('#root'),
  Canvas: makeCanvasDriver('canvas', { width: WORLD_WIDTH, height: WORLD_HEIGHT }),
  Time: timeDriver,
  Client: clientDriver,
  preventDefault: preventDefaultDriver
}

run(main, drivers)
