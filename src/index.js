import { run } from '@cycle/run'
import { makeDOMDriver } from '@cycle/dom'
import { timeDriver } from '@cycle/time'
import { App } from './app'

const main = App

const drivers = {
  DOM: makeDOMDriver('#root'),
  Time: timeDriver
}

run(main, drivers)
