import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useState,
} from "react"
import { LayoutContext } from "./LayoutContext"

export type ControlsData = {
  stitchWidth: string
  rowHeight: string
  stsPerRow: number
  numberOfRows: number
  colour?: string
}

const COLOURS_KEY = "colours"

const persistColours = (colours: string[]) => {
  localStorage.setItem(COLOURS_KEY, JSON.stringify(colours))
}
const initialiseColours = () => {
  const data = localStorage.getItem(COLOURS_KEY)
  const colours = data && JSON.parse(data)
  return Array.isArray(colours) && colours.length > 0 ? colours : ["black"]
}

export function Controls() {
  const {
    gauge,
    updateGauge,
    setColour,
    colour: currentColour,
    inLineMode,
    switchLineMode,
    clearChart,
  } = useContext(LayoutContext)
  const [stitchGauge, setStitchGauge] = useState<number | undefined>(
    gauge?.stitchGauge
  )
  const [rowGauge, setRowGauge] = useState<number | undefined>(gauge?.rowGauge)
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
        setColour("black")
      }
    },
    [colours, setColour, currentColour]
  )

  const onSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault()
      if (!stitchGauge || !rowGauge) return

      updateGauge({ stitchGauge, rowGauge })
    },
    [stitchGauge, rowGauge, updateGauge]
  )

  return (
    <form action="#" onSubmit={onSubmit}>
      <label>
        sts/10cm{" "}
        <input
          type="number"
          value={stitchGauge ?? ""}
          onChange={(event) =>
            setStitchGauge(Number.parseFloat(event.target.value))
          }
        />
      </label>
      <label>
        rows/10cm{" "}
        <input
          type="number"
          value={rowGauge ?? ""}
          onChange={(event) =>
            setRowGauge(Number.parseFloat(event.target.value))
          }
        />
      </label>
      <input type="color" onChange={addColour} />
      {colours.map((colour) => (
        <Colour
          key={colour}
          colour={colour}
          isSelected={colour === currentColour}
          selectColour={() => setColour(colour)}
          removeColour={() => removeColour(colour)}
        />
      ))}
      <label>
        draw line
        <input type="checkbox" checked={inLineMode} onChange={switchLineMode} />
      </label>
      <button onClick={clearChart}>clear chart</button>
      <button onClick={onSubmit}>submit</button>
    </form>
  )
}

type ColourProps = {
  colour: string
  isSelected: boolean
  selectColour: () => void
  removeColour: () => void
}

function Colour({
  colour,
  isSelected,
  selectColour,
  removeColour,
}: ColourProps) {
  return (
    <div style={{ background: colour }}>
      <input
        type="radio"
        name="colours"
        value={colour}
        onClick={selectColour}
        defaultChecked={isSelected}
      />
      <button type="button" onClick={removeColour}>
        remove {colour}
      </button>
    </div>
  )
}
