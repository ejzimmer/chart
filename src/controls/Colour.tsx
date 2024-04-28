import React, { useState } from "react"

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
  const [isColourHovered, setColourHovered] = useState(false)
  const [isButtonHovered, setButtonHovered] = useState(false)

  return (
    <label
      aria-label={`select ${colour}`}
      style={{
        background: colour,
        position: "relative",
        width: "30px",
        height: "30px",
        borderRadius: "100%",
        border: "1px solid",
        outline: isSelected ? "2px solid black" : "none",
        outlineOffset: "2px",
        cursor: "pointer",
        opacity: isColourHovered ? 1 : 0.8,
      }}
      onMouseEnter={() => setColourHovered(true)}
      onMouseLeave={() => setColourHovered(false)}
    >
      <input
        type="radio"
        name="colours"
        value={colour}
        onChange={selectColour}
        checked={isSelected}
        style={{
          position: "fixed",
          top: "-110%",
          width: 0,
          height: 0,
          visibility: "hidden",
        }}
      />
      <button
        type="button"
        onClick={removeColour}
        aria-label={`remove ${colour}`}
        style={{
          position: "absolute",
          width: "15px",
          height: "15px",
          background: "white",
          border: "1px solid",
          borderRadius: "100%",
          top: "-3px",
          right: "-3px",
          padding: "0",
          cursor: "pointer",
          transform: `scale(${isButtonHovered ? 1.2 : 1})`,
        }}
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
      >
        <svg
          viewBox="0 0 10 10"
          stroke="black"
          strokeWidth="2"
          width="100%"
          height="100%"
        >
          <line x1="2" y1="2" x2="8" y2="8" />
          <line x1="8" y1="2" x2="2" y2="8" />
        </svg>
      </button>
    </label>
  )
}
