import xs from 'xstream'
import { adapt } from '@cycle/run/lib/adapt'

export function preventDefaultDriver (sink$) {
  sink$.addListener({
    next: e => e.preventDefault(),
    error: e => { throw e },
    complete: () => null
  })
  return adapt(xs.empty())
}
