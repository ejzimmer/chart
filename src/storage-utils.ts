import { Gauge, GridPosition, StitchGrid } from "./types"

const GAUGE_KEY = "chart_gauge"
const PATTERN_KEY = "chart_pattern"
const LINES_KEY = "chart_lines"
const CURRENT_COLOUR_KEY = "chart_current_colour"
const COLOURS_KEY = "chart_colours"

type Key =
  | typeof GAUGE_KEY
  | typeof PATTERN_KEY
  | typeof LINES_KEY
  | typeof CURRENT_COLOUR_KEY
  | typeof COLOURS_KEY

const persist = (key: Key, data: any) => {
  localStorage.setItem(key, JSON.stringify(data))
}
const get = (key: Key) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : data
}

export const persistPattern = (pattern: StitchGrid) => {
  persist(PATTERN_KEY, pattern)
}
export const getPattern = () => get(PATTERN_KEY)

export const persistLines = (lines: GridPosition[][]) =>
  persist(LINES_KEY, lines)
export const getLines = () => get(LINES_KEY) ?? []

export const persistColours = (colours: string[]) =>
  persist(COLOURS_KEY, colours)
export const getColours = () => get(COLOURS_KEY) ?? []

export const persistGauge = (gauge: Gauge) => persist(GAUGE_KEY, gauge)
export const getGauge = () => {
  const { stitchGauge, rowGauge } = get(GAUGE_KEY) ?? {}
  return {
    stitchGauge: stitchGauge && Number.parseFloat(stitchGauge),
    rowGauge: rowGauge && Number.parseFloat(rowGauge),
  }
}

export const persistCurrentColour = (colour: string) =>
  persist(CURRENT_COLOUR_KEY, colour)
export const getCurrentColour = () => get(CURRENT_COLOUR_KEY)
