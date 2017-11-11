import xs from 'xstream'
import { TOUCH_SECTOR_MOVE_MAP } from './config'

export function intent ({ DOM, Client }) {
  if (!Client.touchSupport) {
    return xs.empty()
  }

  const controller = DOM.select('svg')
  const events = ['touchstart', 'touchmove', 'touchend']
    .map(e => controller.events(e))
  const dimensions$ = xs.combine(Client.viewportSize$, controller.element())
    .map(([view, controllerEl]) => ({
      targetRect: controllerEl.getBoundingClientRect(),
      view
    }))
  return xs.combine(dimensions$, xs.merge(...events))
    .map(([ dimensions, event ]) => {
      const { view, targetRect } = dimensions
      const { type, targetTouches } = event
      if (type === 'touchend') { return '0000' }
      return TOUCH_SECTOR_MOVE_MAP
        .filter(([start, end], index) => {
          const point = [
            targetTouches[0].clientX,
            view.height - targetTouches[0].clientY
          ]
          const center = [
            targetRect.x + targetRect.width / 2,
            view.height - targetRect.y - targetRect.height / 2
          ]
          return isInsideSector(point, center, start, end, 40 / 200 * targetRect.width)
        })
        .reduce((match, sector) => sector[2], '0000')
    })
    .startWith('0000')
    .map(move => () => move)
}

function areClockwise (v1, v2) {
  return -v1[0] * v2[1] + v1[1] * v2[0] > 0;
}

function isOutsideRadius (v, radius) {
  return v[0] * v[0] + v[1] * v[1] >= radius * radius;
}

function isInsideSector (point, center, start, end, minRadius) {
  const relPoint = [
    point[0] - center[0],
    point[1] - center[1]
  ]
  return !areClockwise(end, relPoint) &&
         areClockwise(start, relPoint) &&
         isOutsideRadius(relPoint, minRadius);
}
