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
  updateGauge: (gauge: Gauge) => void
  setColour: (colour: string) => void
}

const SAVED_DATA_KEY = "charts_data"
const CM_TO_PX = 37.8

export const LayoutContext = createContext<ContextType>({
  gauge: undefined,
  layout: undefined,
  updateGauge: () => undefined,
  colour: undefined,
  setColour: () => undefined,
})

export function Layout({ children }: PropsWithChildren<unknown>) {
  const [gauge, setGauge] = useState<Gauge>()
  const [layout, setLayout] = useState<LayoutType>()
  const [colour, setColour] = useState<string>()

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

  return (
    <LayoutContext.Provider
      value={{
        gauge,
        layout,
        updateGauge,
        colour,
        setColour: updateColour,
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
  const stsPerRow = window.screen.width / stitchWidth
  const numberOfRows = window.screen.height / rowHeight

  return {
    stitchWidth: `${stitchWidth}px`,
    rowHeight: `${rowHeight}px`,
    stsPerRow,
    numberOfRows,
  }
}
