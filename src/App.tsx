import React, { useCallback, useMemo, useRef, useState } from "react"

const GAUGE_KEY = "gauge"
const CM_TO_PX = 37.8

const getGaugeFromStorage = () => {
  const value = localStorage.getItem(GAUGE_KEY)
  if (!value) return

  const gauge = JSON.parse(value)
  return {
    rows: Number.parseInt(gauge.rows),
    sts: Number.parseInt(gauge.sts),
  }
}

const COLOURS = ["transparent", "currentColor"]

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
    const numberOfStitches = stsPerRow * numberOfRows

    return { stitchWidth, rowHeight, stsPerRow, numberOfStitches }
  }, [gauge])

  const [stitches, setStitches] = useState<Array<string>>(
    Array.from({ length: layout.numberOfStitches }).map(() => COLOURS[0])
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

  const changeColour = useCallback((index: number) => {
    setStitches((stitches) => {
      const stitch = stitches[index]
      const oldColourIndex = COLOURS.findIndex((colour) => colour === stitch)
      const newColourIndex = (oldColourIndex + 1) % COLOURS.length

      return [
        ...stitches.slice(0, index),
        COLOURS[newColourIndex],
        ...stitches.slice(index + 1),
      ]
    })
  }, [])

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${layout.stsPerRow}, ${layout.stitchWidth}px)`,
          gridAutoRows: `${layout.rowHeight}px`,
        }}
      >
        {stitches.map((stitchColour, index) => (
          <Stitch
            key={index}
            colour={stitchColour}
            changeColour={() => changeColour(index)}
          />
        ))}
      </div>
    </>
  )
}

function Stitch({
  colour,
  changeColour,
}: {
  colour: string
  changeColour: () => void
}) {
  return (
    <div
      style={{
        borderTop: "2px solid",
        borderRight: "2px solid",
        backgroundColor: colour,
      }}
      onClick={changeColour}
    />
  )
}

export default App
