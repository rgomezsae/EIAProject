export const CHART_COLORS = {
  green: '#78C239',
  blue: '#0097DA',
  violet: '#A78BFA',
  amber: '#F59E0B',
  pink: '#EC4899',
  red: '#EF4444',
  muted: '#64748B',
}

export const SERIES_COLORS = [
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.violet,
  CHART_COLORS.amber,
  CHART_COLORS.pink,
]

export const AXIS_STYLE = {
  fontSize: 12,
  fill: '#64748B',
  fontFamily: "'Inter', sans-serif",
}

export const GRID_STYLE = {
  stroke: '#334155',
  strokeDasharray: '4 4',
}

export const CARTESIAN_GRID_PROPS = {
  stroke: '#334155',
  strokeDasharray: '4 4',
  vertical: false,
}

export const X_AXIS_PROPS = {
  tick: AXIS_STYLE,
  axisLine: { stroke: '#334155' },
  tickLine: false,
}

export const Y_AXIS_PROPS = {
  tick: AXIS_STYLE,
  axisLine: false,
  tickLine: false,
}
