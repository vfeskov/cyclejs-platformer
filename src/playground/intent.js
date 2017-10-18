import dropRepeats from 'xstream/extra/dropRepeats'
import xs from 'xstream'

export function intent ({ request, Time }) {
  return request
    .compose(dropRepeats())
    .map(request => Time.periodic(20).mapTo(request).startWith(request))
    .flatten()
}
