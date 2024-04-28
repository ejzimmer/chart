import { ChangeEvent, useCallback, useState } from "react"
import { Colour } from "./Colour"
import { getColours, persistColours } from "../storage-utils"
import { useData, useUpdaters } from "../Context"
import { LineControl } from "./LineControl"
import { ClearChart } from "./ClearChart"
import { GaugeInput } from "./GaugeInput"
import { ColourPicker } from "./ColourPicker"

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
        display: "flex",
        alignItems: "center",
        gap: "8px",
        margin: "0",
        boxSizing: "border-box",
      }}
    >
      <GaugeInput
        label="sts/10cm"
        value={gauge?.stitchGauge ?? ""}
        onChange={(value) => updateGauge("stitch", value)}
      />
      <GaugeInput
        label="rows/10cm"
        value={gauge?.rowGauge ?? ""}
        onChange={(value) => updateGauge("row", value)}
      />
      <ColourPicker onChange={addColour} />
      {colours.map((colour) => (
        <Colour
          key={colour}
          colour={colour}
          isSelected={colour === currentColour}
          selectColour={() => setCurrentColour(colour)}
          removeColour={() => removeColour(colour)}
        />
      ))}
      <LineControl
        mode="draw"
        isChecked={drawingMode === "line"}
        onChange={() =>
          setDrawingMode(drawingMode === "line" ? "stitch" : "line")
        }
      />
      <LineControl
        mode="clear"
        isChecked={drawingMode === "delete-line"}
        onChange={() =>
          setDrawingMode(
            drawingMode === "delete-line" ? "stitch" : "delete-line"
          )
        }
      />
      <ClearChart onClick={clearChart} />
    </fieldset>
  )
}
