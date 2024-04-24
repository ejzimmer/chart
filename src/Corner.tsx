import { useState } from "react"

type Props = {
  onClick: () => void
}

export function Corner({ onClick }: Props) {
  const [isHovered, setHovered] = useState(false)

  return (
    <div
      style={{
        position: "absolute",
        width: "20px",
        height: "20px",
        left: "0",
        top: "0",
        transform: "translate(-50%,-50%)",
        borderRadius: "100%",
        borderWidth: "2px",
        borderStyle: isHovered ? "dashed" : "solid",
        borderColor: isHovered ? "blue" : "transparent",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    />
  )
}

// click on corner
// add corner to line, mark corner as part of line
// if there's more than one corner, draw a line between them
// if this corner is the last one in the line, remover the corner
