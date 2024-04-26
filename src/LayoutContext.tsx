import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react"

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
}

const SAVED_DATA_KEY = "charts_data"
const LINES_KEY = "charts_lines"
const CM_TO_PX = 37.8

const persistLines = (lines: [number, number][][]) => {
  console.log("persistingLines", lines)
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
})

export function Layout({ children }: PropsWithChildren<unknown>) {
  const [gauge, setGauge] = useState<Gauge>()
  const [layout, setLayout] = useState<LayoutType>()
  const [colour, setColour] = useState<string>()
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
    if (stitchGauge && rowGauge) {
      setGauge({
        stitchGauge: Number.parseFloat(stitchGauge),
        rowGauge: Number.parseFloat(rowGauge),
      })
      setLayout({ ...getLayout({ stitchGauge, rowGauge }) })
    }
    if (colour) {
      setColour(colour)
    }
  }, [])

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
        inLineMode,
        switchLineMode,
        addVertex,
        lines,
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
