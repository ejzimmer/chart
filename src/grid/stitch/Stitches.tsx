import { useData, useUpdaters } from "../../Context"
import { Corner } from "./Corner"
import { Stitch } from "./Stitch"

export function Stitches() {
  const { dimensions, pattern, drawingMode } = useData()
  const { updateCurrentLine, startFill, endFill, fillStitch } = useUpdaters()

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
                onMouseDown={() => {
                  startFill({ x: columnIndex, y: rowIndex })
                }}
                onMouseEnter={() => fillStitch({ x: columnIndex, y: rowIndex })}
                onMouseUp={() => endFill()}
              >
                {columnIndex === 0
                  ? rowIndex
                  : rowIndex === row.length - 1
                  ? columnIndex
                  : ""}
              </Stitch>
              {drawingMode.includes("line") && (
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
