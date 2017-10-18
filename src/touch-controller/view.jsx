import { TOUCH_SECTOR_ACTIONS_MAP } from './intent'

export function view (actions$) {
  return actions$.map(actions => {
    const paths = TOUCH_SECTOR_ACTIONS_MAP.map(([start, end, actionsWhenActive]) => [
      `M0 0 ${start[0]} ${-start[1]}A99 99 0 0 1 ${end[0]} ${-end[1]}Z`,
      actionsWhenActive
    ])

    const fillColor = actionsWhenActive => actionsWhenActive === actions ? 'white' : '#222'

    return <svg width="200" height="200" viewBox="0 0 200 200">
      <g transform="translate(100,100)" stroke="white" strokeWidth="20">
        {paths.map(([path, actionsWhenActive], i) => <path d={path} fill={fillColor(actionsWhenActive)}></path>)}
        <circle cx="0" cy="0" r="40" fill={fillColor('0000')}></circle>
      </g>
    </svg>
  })
}
