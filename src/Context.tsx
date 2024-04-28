import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react"
import {
  getCurrentColour,
  getGauge,
  getLines,
  getPattern,
  persistCurrentColour,
  persistGauge,
  persistLines,
  persistPattern,
} from "./storage-utils"
import {
  Dimensions,
  DrawingMode,
  Gauge,
  GridPosition,
  Metadata,
  StitchGrid,
  Updaters,
} from "./types"

const CM_TO_PX = 37.8

const applyPatternToGrid = (dimensions?: Dimensions) => {
  if (!dimensions?.numberOfRows || !dimensions.stsPerRow) {
    return
  }

  const grid: StitchGrid = Array.from({ length: dimensions.numberOfRows }).map(
    () => Array.from({ length: dimensions.stsPerRow })
  )
  const persistedPattern = getPattern()
  if (!persistedPattern) return grid

  persistedPattern.forEach((row: string[], rowNumber: number) => {
    row.forEach((cell, column) => {
      if (cell) {
        grid[rowNumber][column] = cell
      }
    })
  })

  return grid
}

const DataContext = createContext<Metadata>({ drawingMode: "stitch" })
export const UpdaterContext = createContext<Updaters>({
  setGauge: () => undefined,
  setCurrentColour: () => undefined,
  setDrawingMode: () => undefined,
  updateCurrentLine: () => undefined,
  clearChart: () => undefined,
  drawStitch: () => undefined,
})

export function useData() {
  try {
    return useContext(DataContext)
  } catch (e) {
    throw new Error("useData hook can only be used within DataContext")
  }
}
export function useUpdaters() {
  try {
    return useContext(UpdaterContext)
  } catch (e) {
    throw new Error("useUpdaters hook can only be used within DataContext")
  }
}

export function Provider({ children }: PropsWithChildren<unknown>) {
  const [gauge, setGauge] = useState<Gauge>(getGauge)
  const [currentColour, setCurrentColour] = useState<string>(getCurrentColour)
  const [drawingMode, setDrawingMode] = useState<DrawingMode>("stitch")
  const [lines, setLines] = useState<GridPosition[][]>(getLines)

  const [dimensions, setDimensions] = useState(getDimensions(gauge))
  const [pattern, setPattern] = useState<StitchGrid | undefined>(() =>
    applyPatternToGrid(dimensions)
  )

  const updateGauge = useCallback((gauge: Gauge) => {
    setGauge(gauge)
    persistGauge(gauge)
    const dimensions = getDimensions(gauge)
    setDimensions(dimensions)
    setPattern(applyPatternToGrid(dimensions))
  }, [])

  const updateCurrentColour = useCallback((colour: string) => {
    setCurrentColour(colour)
    persistCurrentColour(colour)
  }, [])

  const drawStitch = useCallback(
    ({ y: row, x: column }: GridPosition) => {
      if (drawingMode !== "stitch" || !pattern) return

      const currentStitchColour = pattern[row][column]
      const newStitchColour = currentStitchColour ? undefined : currentColour
      const newPattern = [
        ...pattern.slice(0, row),
        [
          ...pattern[row].slice(0, column),
          newStitchColour,
          ...pattern[row].slice(column + 1),
        ],
        ...pattern.slice(row + 1),
      ]

      setPattern(newPattern)
      persistPattern(newPattern)
    },
    [pattern, currentColour, drawingMode]
  )

  const clearChart = useCallback(() => {
    if (!pattern) return

    const clearedPattern = pattern.map((row) => row.map(() => undefined))
    setPattern(clearedPattern)
    persistPattern(clearedPattern)
    setLines([])
    persistLines([])
  }, [pattern])

  const changeDrawingMode = useCallback(
    (newDrawingMode: DrawingMode) => {
      // already in line drawing mode, ditch the current line
      if (drawingMode === "line") {
        setLines(lines.slice(0, -1))
      }

      // switching to drawing mode, create a new line
      if (newDrawingMode === "line") {
        setLines([...lines, []])
      }

      setDrawingMode(newDrawingMode)
    },
    [lines, drawingMode]
  )

  const updateCurrentLine = useCallback(
    ({ x, y }: GridPosition) => {
      const finishedLines = lines.slice(0, -1) ?? []
      const currentLine = lines.at(-1) ?? []

      const secondLastPoint = currentLine?.at(-2)
      const lastPoint = currentLine?.at(-1)

      // backtracking along line, delete
      if (secondLastPoint?.x === x && secondLastPoint?.y === y) {
        const updatedLine = currentLine.slice(0, -1)
        setLines([...finishedLines, updatedLine])

        // finished drawing
      } else if (lastPoint?.x === x && lastPoint?.y === y) {
        persistLines(lines)
        setDrawingMode("stitch")

        // add next point
      } else {
        currentLine?.push({ x, y })
        setLines([...finishedLines, currentLine])
      }
    },
    [lines]
  )

  return (
    <UpdaterContext.Provider
      value={{
        setGauge: updateGauge,
        setCurrentColour: updateCurrentColour,
        setDrawingMode: changeDrawingMode,
        drawStitch,
        updateCurrentLine,
        clearChart,
      }}
    >
      <DataContext.Provider
        value={{
          gauge,
          currentColour,
          drawingMode,
          dimensions,
          pattern,
          lines,
        }}
      >
        {children}
      </DataContext.Provider>
    </UpdaterContext.Provider>
  )
}

const getDimensions = ({
  stitchGauge,
  rowGauge,
}: Gauge): Dimensions | undefined => {
  if (!stitchGauge || !rowGauge) return

  const gridWidth = window.innerWidth
  const gridHeight = window.innerHeight
  const stitchWidth = (10 / stitchGauge) * CM_TO_PX
  const rowHeight = (10 / rowGauge) * CM_TO_PX
  const stsPerRow = gridWidth / stitchWidth
  const numberOfRows = gridHeight / rowHeight

  return {
    gridWidth,
    gridHeight,
    stitchWidth: `${stitchWidth}px`,
    rowHeight: `${rowHeight}px`,
    stsPerRow,
    numberOfRows,
  }
}
