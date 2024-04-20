import React, { useCallback, useMemo, useRef, useState } from "react"
// pick colours
// draw lines
// clear pattern
// clear stitch
// redraw pattern when grid resizes
// make pretty, a11y, error handling
// publish

const GAUGE_KEY = "gauge"
const PATTERN_KEY = "pattern"
const CM_TO_PX = 37.8

type Grid = (string | undefined)[][]

const persistPattern = (pattern: Grid) => {
  localStorage.setItem(PATTERN_KEY, JSON.stringify(pattern))
}
const initialisePattern = (rows: number, columns: number) => {
  const grid: Grid = Array.from({ length: rows }).map(() =>
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
const getGaugeFromStorage = () => {
  const value = localStorage.getItem(GAUGE_KEY)
  if (!value) return

  const gauge = JSON.parse(value)
  return {
    rows: Number.parseInt(gauge.rows),
    sts: Number.parseInt(gauge.sts),
  }
}

const COLOURS = ["currentColor", "transparent"]

function App() {
  const rowsInput = useRef<HTMLInputElement>(null)
  const stsInput = useRef<HTMLInputElement>(null)
  const [gauge, setGauge] = useState<{ rows: number; sts: number } | undefined>(
    getGaugeFromStorage
  )

  const layout = useMemo(() => {
    const stitchWidth = (10 / (gauge?.sts ?? 10)) * CM_TO_PX
    const rowHeight = (10 / (gauge?.rows ?? 10)) * CM_TO_PX
    const stsPerRow = window.screen.width / stitchWidth
    const numberOfRows = window.screen.height / rowHeight

    return {
      stitchWidth: `${stitchWidth}px`,
      rowHeight: `${rowHeight}px`,
      stsPerRow,
      numberOfRows,
    }
  }, [gauge])

  const [stitches, setStitches] = useState<Grid>(() =>
    initialisePattern(layout.numberOfRows, layout.stsPerRow)
  )

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!rowsInput.current?.value || !stsInput.current?.value) return
    const gauge = {
      rows: Number.parseInt(rowsInput.current?.value),
      sts: Number.parseInt(stsInput.current?.value),
    }
    setGauge(gauge)
    localStorage.setItem(GAUGE_KEY, JSON.stringify(gauge))
  }

  const drawStitch = useCallback(
    (row: number, column: number) => {
      const stitch = stitches[row][column]
      const oldColourIndex = COLOURS.findIndex((colour) => colour === stitch)
      const newColourIndex = (oldColourIndex + 1) % COLOURS.length

      const newStitches = [
        ...stitches.slice(0, row),
        [
          ...stitches[row].slice(0, column),
          COLOURS[newColourIndex],
          ...stitches[row].slice(column + 1),
        ],
        ...stitches.slice(row + 1),
      ]

      setStitches(newStitches)
      persistPattern(newStitches)
    },
    [stitches]
  )

  return (
    <>
      <form action="#" onSubmit={onSubmit}>
        <label>
          sts/10cm <input type="number" ref={stsInput} />
        </label>
        <label>
          rows/10cm <input type="number" ref={rowsInput} />
        </label>
        <button onClick={onSubmit}>submit</button>
      </form>
      <div>
        {stitches.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex" }}>
            {row.map((stitch, columnIndex) => (
              <Stitch
                key={`${rowIndex}${columnIndex}`}
                width={layout.stitchWidth}
                height={layout.rowHeight}
                colour={stitch}
                changeColour={() => drawStitch(rowIndex, columnIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

type StitchProps = {
  width: string
  height: string
  colour?: string
  changeColour: () => void
}

function Stitch({ width, height, colour, changeColour }: StitchProps) {
  return (
    <div
      style={{
        width,
        height,
        borderTop: "2px solid",
        borderRight: "2px solid",
        backgroundColor: colour ?? "transparent",
        cursor: "pointer",
        flexGrow: 0,
        flexShrink: 0,
      }}
      onClick={changeColour}
    />
  )
}

export default App
