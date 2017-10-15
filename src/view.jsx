import { WORLD_HEIGHT, WORLD_WIDTH, DUDE_HEIGHT, DUDE_WIDTH } from './model'

export const WORLD_BORDER = 0.5

export const WORLD_STYLE = {
  border: `${WORLD_BORDER}vmin solid black`,
  boxSizing: 'border-box',
  height: `${WORLD_HEIGHT + WORLD_BORDER * 2}vmin`,
  margin: '5vmin auto',
  position: 'relative',
  width: `${WORLD_WIDTH + WORLD_BORDER * 2}vmin`
}

export const BASE_DUDE_STYLE = {
  background: 'red',
  display: 'block',
  height: `${DUDE_HEIGHT}vmin`,
  position: 'absolute',
  width: `${DUDE_WIDTH}vmin`
}

export function dudeElement({x, y}) {
  const dudeStyle = Object.assign({ bottom: `${y}vmin`, left: `${x}vmin` }, BASE_DUDE_STYLE)
  return <dude style={dudeStyle}></dude>
}

export const BASE_PLATFORM_STYLE = {
  background: 'blue',
  display: 'block',
  position: 'absolute'
}

export function platformElement({x, y, width, height}) {
  const platformStyle = Object.assign({
    bottom: `${y}vmin`,
    height: `${height}vmin`,
    left: `${x}vmin`,
    width: `${width}vmin`
  }, BASE_PLATFORM_STYLE)
  return <platform style={platformStyle}></platform>
}

export function view(state$, Time) {
  return state$
    .compose(Time.throttleAnimation)
    .map(({ dude, platforms }) =>
      <div style={WORLD_STYLE}>
        {platforms.map(platform => platformElement(platform))}
        {dudeElement(dude)}
      </div>
    )
}
