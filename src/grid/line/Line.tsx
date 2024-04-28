import { Fragment } from "react"
import { GridPosition } from "../../types"

type Props = {
  vertices: GridPosition[]
  onClick: () => void
}

const RADIUS = 4

export function Line({ vertices, onClick }: Props) {
  return (
    <g style={{ cursor: "crosshair" }} onClick={onClick}>
      {vertices.map(({ x, y }, index) => {
        const previousPoint = vertices[index - 1]
        return (
          <Fragment key={index}>
            <circle cx={x} cy={y} r={RADIUS} fill="currentColor" />
            {previousPoint && (
              <path
                d={`M${previousPoint.x},${previousPoint.y} L${x},${y}`}
                strokeWidth="4"
                stroke="red"
              />
            )}
          </Fragment>
        )
      })}
    </g>
  )
}
