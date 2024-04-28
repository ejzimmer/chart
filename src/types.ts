export type Gauge = {
  stitchGauge?: number
  rowGauge?: number
}

export type Dimensions = {
  gridWidth: number
  gridHeight: number
  stitchWidth: string
  rowHeight: string
  stsPerRow: number
  numberOfRows: number
}

export type StitchGrid = (string | undefined)[][]
export type GridPosition = { x: number; y: number }
export type Lines = GridPosition[][]
export type DrawingMode = "stitch" | "line" | "delete-line"

type StoredData = {
  gauge: Gauge
  pattern: StitchGrid
  lines: Lines
  currentColour: string
}

export type Metadata = Partial<StoredData> & {
  dimensions?: Dimensions
  drawingMode: DrawingMode
}

export type Updaters = {
  setGauge: (gauge: Gauge) => void
  setCurrentColour: (colour: string) => void
  setDrawingMode: (mode: DrawingMode) => void
  updateCurrentLine: (corner: GridPosition) => void
  drawStitch: (stitch: GridPosition) => void
  clearChart: () => void
}
