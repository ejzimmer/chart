import { useCallback, useContext, useEffect, useState } from "react"
import { LayoutContext } from "./LayoutContext"
import { Stitch } from "./Stitch"

type StitchGrid = (string | undefined)[][]

const PATTERN_KEY = "pattern"

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

export function Grid() {
  const { layout, colour } = useContext(LayoutContext)
  const [stitches, setStitches] = useState<StitchGrid>([])

  useEffect(() => {
    layout &&
      setStitches(initialisePattern(layout?.numberOfRows, layout.stsPerRow))
  }, [layout])

  const drawStitch = useCallback(
    (row: number, column: number) => {
      const newStitches = [
        ...stitches.slice(0, row),
        [
          ...stitches[row].slice(0, column),
          colour,
          ...stitches[row].slice(column + 1),
        ],
        ...stitches.slice(row + 1),
      ]

      setStitches(newStitches)
      persistPattern(newStitches)
    },
    [stitches, colour]
  )

  if (!layout) return null

  return (
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
  )
}
