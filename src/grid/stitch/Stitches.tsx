import { useData, useUpdaters } from "../../Context"
import { Corner } from "./Corner"
import { Stitch } from "./Stitch"

export function Stitches() {
  const { dimensions, pattern, drawingMode } = useData()
  const { drawStitch, updateCurrentLine } = useUpdaters()

  if (!dimensions || !pattern) return null

  return (
    <>
      {pattern.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${row.length}, ${dimensions.stitchWidth})`,
            gridTemplateRows: dimensions.rowHeight,
          }}
          className="row"
        >
          {row.map((stitch, columnIndex) => (
            <div
              style={{ position: "relative" }}
              className="column"
              key={`${rowIndex}${columnIndex}`}
            >
              <Stitch
                colour={stitch}
                onClick={() => drawStitch({ y: rowIndex, x: columnIndex })}
              />
              {drawingMode !== "stitch" && (
                <Corner
                  onClick={() =>
                    updateCurrentLine({ y: rowIndex, x: columnIndex })
                  }
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  )
}
