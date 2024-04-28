type Props = {
  colour: string
  isSelected: boolean
  selectColour: () => void
  removeColour: () => void
}

export function Colour({
  colour,
  isSelected,
  selectColour,
  removeColour,
}: Props) {
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
