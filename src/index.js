import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'
import { makeCanvasDriver } from 'cycle-canvas'
import { timeDriver } from '@cycle/time'
import { App } from './app'
import { WORLD_HEIGHT, WORLD_WIDTH } from './model'

const main = App

const drivers = {
  DOM: makeDOMDriver('controls'),
  Canvas: makeCanvasDriver('canvas', { width: WORLD_WIDTH, height: WORLD_HEIGHT }),
  Time: timeDriver
}

run(main, drivers)
