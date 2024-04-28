import { RefObject, useEffect, useRef, useState } from "react"
import { Lines } from "./line/Lines"
import { Stitches } from "./stitch/Stitches"
import { GridPosition, Lines as LinesType } from "../types"
import { useData } from "../Context"

export function Grid() {
  const { dimensions } = useData()
  const gridRef = useRef<HTMLDivElement>(null)
  const [gridHasRendered, setGridHasRendered] = useState(false)

  useEffect(() => {
    if (gridRef.current) {
      setGridHasRendered(true)
    }
  }, [])

  if (!dimensions?.rowHeight || !dimensions.stitchWidth) return null

  return (
    <div ref={gridRef}>
      <Stitches />
      {gridHasRendered && (
        <Lines
          convertGridReferencesToCoordinates={getAbsoluteCoordinates(gridRef)}
        />
      )}
    </div>
  )
}

function getAbsoluteCoordinates(gridRef: RefObject<HTMLElement>) {
  return (lines: LinesType) =>
    lines.map((line: GridPosition[]) =>
      line.map(({ y: row, x: column }) => {
        const rowElement = gridRef.current?.querySelectorAll(".row")[row]
        const cell = rowElement?.querySelectorAll(".column")[column]
        if (!cell) return { x: -1, y: -1 }

        const { top, left } = cell.getBoundingClientRect()
        return { x: left, y: top }
      })
    )
}
