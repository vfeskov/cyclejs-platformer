import xs from 'xstream'

export const TOUCH_SECTOR_ACTIONS_MAP = [
  [[-91.46, -37.88], [-91.46,  37.89], '0001'],
  [[-91.46,  37.89], [-37.88,  91.46], '1001'],
  [[-37.88,  91.46], [37.9,    91.46], '1000'],
  [[37.9,    91.46], [91.46,   37.88], '1100'],
  [[91.46,   37.88], [91.46,  -37.88], '0100'],
  [[91.46,  -37.88], [37.88,  -91.46], '0110'],
  [[37.88,  -91.46], [-37.89, -91.46], '0010'],
  [[-37.89, -91.46], [-91.46, -37.88], '0011']
]

export function intent ({ DOM }) {
  return xs.merge(
    DOM.select('svg').events('touchstart'),
    DOM.select('svg').events('touchmove'),
    DOM.select('svg').events('touchend')
  )
  .map(({ type, currentTarget, targetTouches, view }) =>
    type === 'touchend' ? '0000' : TOUCH_SECTOR_ACTIONS_MAP
      .filter(([start, end], index) => {
        const point = [
          targetTouches[0].clientX,
          view.innerHeight - targetTouches[0].clientY
        ]
        window.ev = currentTarget
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
