import { ChangeEvent, useCallback, useState } from "react"
import { Colour } from "./Colour"
import { getColours, persistColours } from "../storage-utils"
import { useData, useUpdaters } from "../Context"

const initialiseColours = () => {
  const colours = getColours()
  return colours.length > 0 ? colours : ["black"]
}

export function Controls() {
  const { setGauge, setCurrentColour, setDrawingMode, clearChart } =
    useUpdaters()
  const { gauge, currentColour, drawingMode } = useData()

  const updateGauge = useCallback(
    (type: "row" | "stitch", value: string) => {
      const newGauge = value && Number.parseFloat(value)
      setGauge({ ...gauge, [`${type}Gauge`]: newGauge })
    },
    [gauge, setGauge]
  )

  const [colours, setColours] = useState<string[]>(initialiseColours)
  const addColour = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newColours = Array.from(new Set([...colours, event.target.value]))
      setColours(newColours)
      persistColours(newColours)
    },
    [colours]
  )
  const removeColour = useCallback(
    (colour: string) => {
      const updatedColours = colours.filter((c) => c !== colour)
      setColours(updatedColours)
      persistColours(updatedColours)

      if (currentColour === colour) {
        setCurrentColour("black")
      }
    },
    [colours, setCurrentColour, currentColour]
  )

  return (
    <fieldset
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        background: "white",
      }}
    >
      <label>
        sts/10cm{" "}
        <input
          type="number"
          value={gauge?.stitchGauge ?? ""}
          onChange={(event) => updateGauge("stitch", event.target.value)}
        />
      </label>
      <label>
        rows/10cm{" "}
        <input
          type="number"
          value={gauge?.rowGauge ?? ""}
          onChange={(event) => updateGauge("row", event.target.value)}
        />
      </label>
      <input type="color" onChange={addColour} />
      {colours.map((colour) => (
        <Colour
          key={colour}
          colour={colour}
          isSelected={colour === currentColour}
          selectColour={() => setCurrentColour(colour)}
          removeColour={() => removeColour(colour)}
        />
      ))}
      <label>
        draw line
        <input
          type="checkbox"
          checked={drawingMode === "line"}
          onChange={() =>
            setDrawingMode(drawingMode === "line" ? "stitch" : "line")
          }
        />
      </label>
      <label>
        clear line
        <input
          type="checkbox"
          checked={drawingMode === "delete-line"}
          onChange={() =>
            setDrawingMode(
              drawingMode === "delete-line" ? "stitch" : "delete-line"
            )
          }
        />
      </label>
      <button onClick={clearChart}>clear chart</button>
    </fieldset>
  )
}
