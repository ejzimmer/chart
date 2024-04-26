import { Fragment } from "react"

export type Path = [number, number][]

type Props = {
  lines: Path[]
}

const RADIUS = 4

export function Lines({ lines }: Props) {
  const width = window.innerWidth
  const height = window.innerHeight

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
      }}
    >
      {lines.map((vertices, index) => (
        <Line key={index} vertices={vertices} />
      ))}
    </svg>
  )
}

function Line({ vertices }: { vertices: Path }) {
  return (
    <>
      {vertices.map(([x, y], index) => {
        const previousPoint = vertices[index - 1]
        return (
          <Fragment key={index}>
            <circle cx={x} cy={y} r={RADIUS} fill="currentColor" />
            {previousPoint && (
              <path
                d={`M${previousPoint[0]},${previousPoint[1]} L${x},${y}`}
                strokeWidth="4"
                stroke="red"
              />
            )}
          </Fragment>
        )
      })}
    </>
  )
}
