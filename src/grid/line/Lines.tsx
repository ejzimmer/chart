import { useData, useUpdaters } from "../../Context"
import { Line } from "./Line"
import { Lines as LinesType } from "../../types"
import { useMemo } from "react"

type Props = {
  convertGridReferencesToCoordinates: (lines: LinesType) => {
    x: number
    y: number
  }[][]
}

export function Lines({ convertGridReferencesToCoordinates }: Props) {
  const { dimensions, lines, drawingMode } = useData()
  const { clearLine } = useUpdaters()

  const coordinates = useMemo(
    () => (lines ? convertGridReferencesToCoordinates(lines) : []),
    [lines, convertGridReferencesToCoordinates]
  )

  if (!dimensions) return null

  return (
    <svg
      viewBox={`0 0 ${dimensions?.gridWidth} ${dimensions.gridHeight}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: drawingMode === "delete-line" ? "auto" : "none",
      }}
    >
      {coordinates.map((vertices, index) => (
        <Line
          key={index}
          vertices={vertices}
          onClick={() => clearLine(index)}
        />
      ))}
    </svg>
  )
}
