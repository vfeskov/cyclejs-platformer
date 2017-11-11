import xs from 'xstream'
import { TOUCH_SECTOR_MOVE_MAP } from './config'

export function intent ({ DOM, Client }) {
  if (!Client.touchSupport) {
    return xs.empty()
  }

  const events = ['touchstart', 'touchmove', 'touchend']
    .map(e => DOM.select('svg').events(e))
  return xs.merge(...events)
    .map(({ type, currentTarget, targetTouches, view }) =>
      type === 'touchend' ? '0000' : TOUCH_SECTOR_MOVE_MAP
        .filter(([start, end], index) => {
          const point = [
            targetTouches[0].clientX,
            view.innerHeight - targetTouches[0].clientY
          ]
          const targetRect = currentTarget.getBoundingClientRect();
          const center = [
            targetRect.x + targetRect.width / 2,
            view.innerHeight - targetRect.y - targetRect.height / 2
          ]
          return isInsideSector(point, center, start, end, 40 / 200 * targetRect.width)
        })
        .reduce((match, sector) => sector[2], '0000')
    )
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
