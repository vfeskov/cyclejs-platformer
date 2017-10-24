import xs from 'xstream'
import { adapt } from '@cycle/run/lib/adapt'

export function consoleLogDriver (sink$) {
  sink$.addListener({
    next: console.log,
    error: e => { throw e },
    complete: () => null
  })
  return adapt(xs.empty())
}
