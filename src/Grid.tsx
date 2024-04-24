import {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import { LayoutContext } from "./LayoutContext"
import { Stitch } from "./Stitch"
import { Corner } from "./Corner"
import { Line } from "./Line"

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
  const { layout, colour, inLineMode, addVertex, lines } =
    useContext(LayoutContext)
  const [stitches, setStitches] = useState<StitchGrid>([])
  const gridRef = useRef<HTMLDivElement>(null)

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

  const coordinates = getAbsoluteCoordinates(lines, gridRef)

  return (
    <div ref={gridRef}>
      {coordinates.map((line, index) => (
        <Line key={index} vertices={line} />
      ))}

      {stitches.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }} className="row">
          {row.map((stitch, columnIndex) => (
            <div
              style={{ flexGrow: 0, flexShrink: 0, position: "relative" }}
              className="column"
              key={`${rowIndex}${columnIndex}`}
            >
              <Stitch
                width={layout.stitchWidth}
                height={layout.rowHeight}
                colour={stitch}
                changeColour={() => drawStitch(rowIndex, columnIndex)}
              />
              {inLineMode && (
                <Corner onClick={() => addVertex(rowIndex, columnIndex)} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function getAbsoluteCoordinates(
  lines: [number, number][][],
  gridRef: RefObject<HTMLElement>
): [number, number][][] {
  return lines.map((line) =>
    line.map(([row, column]) => {
      const rowElement = gridRef.current?.querySelectorAll(".row")[row]
      const cell = rowElement?.querySelectorAll(".column")[column]
      if (!cell) return [-1, -1]

      const { top, left } = cell.getBoundingClientRect()
      return [left, top]
    })
  )
}
