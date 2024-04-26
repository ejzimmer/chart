import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react"
import { StitchGrid } from "./Grid"

type Gauge = {
  stitchGauge: number
  rowGauge: number
}

type LayoutType = {
  stitchWidth: string
  rowHeight: string
  stsPerRow: number
  numberOfRows: number
}

type StoredData = {
  gauge: Gauge
  colour: string
}

type ContextType = Partial<StoredData> & {
  layout?: LayoutType
  inLineMode: boolean
  updateGauge: (gauge: Gauge) => void
  setColour: (colour: string) => void
  switchLineMode: () => void
  addVertex: (x: number, y: number) => void
  lines: [number, number][][]
  drawStitch: (x: number, y: number) => void
  pattern: StitchGrid
  clearChart: () => void
}

const SAVED_DATA_KEY = "charts_data"
const LINES_KEY = "charts_lines"
const PATTERN_KEY = "pattern"
const CM_TO_PX = 37.8

const persistPattern = (pattern: StitchGrid) => {
  localStorage.setItem(PATTERN_KEY, JSON.stringify(pattern))
}
const initialisePattern = (rows: number, columns: number) => {
  const grid: StitchGrid = Array.from({ length: rows }).map(() =>
    Array.from({ length: columns })
  )
  const persistedPattern = localStorage.getItem(PATTERN_KEY)
  if (!persistedPattern) return grid

  JSON.parse(persistedPattern).forEach((row: string[], rowNumber: number) => {
    row.forEach((cell, column) => {
      if (cell) {
        grid[rowNumber][column] = cell
      }
    })
  })

  return grid
}

const persistLines = (lines: [number, number][][]) => {
  localStorage.setItem(LINES_KEY, JSON.stringify(lines))
}
const initialiseLines = () => {
  const persistedLines = localStorage.getItem(LINES_KEY)
  return persistedLines ? JSON.parse(persistedLines) : []
}

export const LayoutContext = createContext<ContextType>({
  gauge: undefined,
  layout: undefined,
  inLineMode: false,
  updateGauge: () => undefined,
  colour: undefined,
  setColour: () => undefined,
  switchLineMode: () => undefined,
  addVertex: () => undefined,
  lines: [],
  clearChart: () => undefined,
  pattern: [],
  drawStitch: () => undefined,
})

export function Layout({ children }: PropsWithChildren<unknown>) {
  const [gauge, setGauge] = useState<Gauge>()
  const [layout, setLayout] = useState<LayoutType>()
  const [colour, setColour] = useState<string>()
  const [pattern, setPattern] = useState<StitchGrid>([])
  const [inLineMode, setInLineMode] = useState(false)
  const [lines, setLines] = useState<Array<[number, number]>[]>(initialiseLines)

  const startDrawing = useCallback(() => {
    setInLineMode(true)
    setLines([...lines, []])
  }, [lines])
  const stopDrawing = useCallback(() => {
    setInLineMode(false)
    persistLines(lines)
  }, [lines])

  useEffect(() => {
    const data = localStorage.getItem(SAVED_DATA_KEY)
    if (!data) return

    const { stitchGauge, rowGauge, colour } = JSON.parse(data)
    if (!stitchGauge || !rowGauge) {
      return
    }

    setGauge({
      stitchGauge: Number.parseFloat(stitchGauge),
      rowGauge: Number.parseFloat(rowGauge),
    })
    const layout = getLayout({ stitchGauge, rowGauge })
    setLayout(layout)
    if (colour) {
      setColour(colour)
    }
    setPattern(initialisePattern(layout.numberOfRows, layout.stsPerRow))
  }, [])

  const drawStitch = useCallback(
    (row: number, column: number) => {
      const currentStitchColour = pattern[row][column]
      const newStitchColour = currentStitchColour ? undefined : colour
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
    [pattern, colour]
  )
  const clearChart = useCallback(() => {
    const clearedPattern = pattern.map((row) => row.map(() => undefined))
    setPattern(clearedPattern)
    persistPattern(clearedPattern)
    setLines([])
    persistLines([])
  }, [pattern])

  const updateStorage = useCallback(
    (data: Partial<StoredData>) => {
      const dataToStore = {
        ...gauge,
        colour,
        ...data,
      }
      localStorage.setItem(SAVED_DATA_KEY, JSON.stringify(dataToStore))
    },
    [gauge, colour]
  )

  const updateGauge = useCallback(
    (gauge: Gauge) => {
      updateStorage({ gauge })
      setGauge(gauge)
      setLayout({ ...getLayout(gauge) })
    },
    [updateStorage]
  )
  const updateColour = useCallback(
    (colour: string) => {
      updateStorage({ colour })
      setColour(colour)
    },
    [updateStorage]
  )

  const switchLineMode = useCallback(() => {
    if (inLineMode) {
      stopDrawing()
    } else {
      startDrawing()
    }
  }, [inLineMode, startDrawing, stopDrawing])
  const addVertex = useCallback(
    (x: number, y: number) => {
      const finishedLines = lines.slice(0, -1) ?? []
      const currentLine = lines.at(-1) ?? []

      const lastPoint = currentLine?.at(-1)
      if (lastPoint?.[0] === x && lastPoint?.[1] === y) {
        stopDrawing()
      } else {
        currentLine?.push([x, y])
        setLines([...finishedLines, currentLine])
      }
    },
    [lines, stopDrawing]
  )

  return (
    <LayoutContext.Provider
      value={{
        gauge,
        layout,
        updateGauge,
        colour,
        setColour: updateColour,
        pattern,
        drawStitch,
        inLineMode,
        switchLineMode,
        addVertex,
        lines,
        clearChart,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

const getLayout = ({
  stitchGauge,
  rowGauge,
}: {
  stitchGauge: number
  rowGauge: number
}) => {
  const stitchWidth = (10 / stitchGauge) * CM_TO_PX
  const rowHeight = (10 / rowGauge) * CM_TO_PX
  const stsPerRow = window.innerWidth / stitchWidth
  const numberOfRows = window.innerHeight / rowHeight

  return {
    stitchWidth: `${stitchWidth}px`,
    rowHeight: `${rowHeight}px`,
    stsPerRow,
    numberOfRows,
  }
}
