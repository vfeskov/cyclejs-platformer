import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'
import { makeCanvasDriver } from 'cycle-canvas'
import { timeDriver } from '@cycle/time'
import { App } from './app'
import { WORLD_HEIGHT, WORLD_WIDTH } from './game/config'
import { clientDriver } from './drivers/client'
import { preventDefaultDriver } from './drivers/prevent-default'
import { consoleLogDriver } from './drivers/console-log'
import onionify from 'cycle-onionify';

const main = onionify(App)

const drivers = {
  DOM: makeDOMDriver('#root'),
  Canvas: makeCanvasDriver('canvas', { width: WORLD_WIDTH, height: WORLD_HEIGHT }),
  Time: timeDriver,
  Client: clientDriver,
  preventDefault: preventDefaultDriver,
  consoleLog: consoleLogDriver
}

run(main, drivers)
