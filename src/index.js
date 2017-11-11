import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'
import { canvasDriver } from 'cycle-canvas'
import { timeDriver } from '@cycle/time'
import { App } from './app'
import { clientDriver } from './drivers/client'
import { preventDefaultDriver } from './drivers/prevent-default'
import onionify from 'cycle-onionify';

const main = onionify(App)

const drivers = {
  DOM: makeDOMDriver('#root'),
  Canvas: canvasDriver,
  Time: timeDriver,
  Client: clientDriver,
  preventDefault: preventDefaultDriver
}

run(main, drivers)
