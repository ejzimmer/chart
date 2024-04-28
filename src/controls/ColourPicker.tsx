import React, { ChangeEvent, useRef, useState } from "react"

type Props = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const getColour = (hue: number, isLight: boolean) =>
  `hsl(${hue} ${isLight ? "95%" : "80%"} ${isLight ? "65%" : "50%"})`

export function ColourPicker({ onChange }: Props) {
  const [isHovered, setHovered] = useState(false)
  const squares = useRef(Array.from({ length: 9 }))

  return (
    <label
      style={{
        display: "flex",
        cursor: "pointer",
        borderRadius: "5px",
        overflow: "hidden",
        border: "1px solid",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 90 90" width="30px">
        {squares.current?.map((_, index) => {
          return (
            <rect
              key={index}
              x={(index % 3) * 30}
              y={Math.floor(index / 3) * 30}
              width="30"
              height="30"
              fill={getColour((360 / 9) * index, isHovered)}
            />
          )
        })}
        <path
          strokeWidth="2"
          stroke="white"
          fill={isHovered ? "hsl(0 0% 5%)" : "hsl(0 0% 15%"}
          d="M10,35 l25,0 0,-25 20,0 0,25 25,0 0,20 -25,0 0,25 -20,0 0,-25 -25,0z"
        />
      </svg>
      <input
        type="color"
        onChange={onChange}
        style={{
          position: "absolute",
          zIndex: -1,
        }}
      />
    </label>
  )
}
