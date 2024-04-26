import { RefObject, useContext, useEffect, useRef, useState } from "react"
import { LayoutContext } from "./LayoutContext"
import { Stitch } from "./Stitch"
import { Corner } from "./Corner"
import { Lines, Path } from "./Line"

export type StitchGrid = (string | undefined)[][]

export function Grid() {
  const { layout, inLineMode, drawStitch, pattern, addVertex, lines } =
    useContext(LayoutContext)
  const [coordinates, setCoordinates] = useState<Path[]>()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    pattern && setCoordinates(getAbsoluteCoordinates(lines, gridRef))
  }, [pattern, lines])

  if (!layout) return null

  return (
    <div ref={gridRef}>
      {coordinates && <Lines lines={coordinates} />}

      {pattern.map((row, rowIndex) => (
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
  lines: Path[],
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
