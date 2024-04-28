import React, { useState } from "react"

type Props = {
  onClick: () => void
}

export function ClearChart({ onClick }: Props) {
  const [isHovered, setHovered] = useState(false)

  return (
    <button
      aria-label="clear chart"
      style={{
        width: "30px",
        height: "30px",
        border: "1px solid",
        borderRadius: "5px",
        background: "none",
        padding: 0,
        boxSizing: "content-box",
        cursor: "pointer",
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 100 100">
        <g stroke={`hsl(210 50% 50%)`} strokeWidth="2">
          <line x1="20" y1="0" x2="20" y2="100" />
          <line x1="40" y1="0" x2="40" y2="100" />
          <line x1="60" y1="0" x2="60" y2="100" />
          <line x1="80" y1="0" x2="80" y2="100" />

          <line x1="0" y1="20" x2="100" y2="20" />
          <line x1="0" y1="40" x2="100" y2="40" />
          <line x1="0" y1="60" x2="100" y2="60" />
          <line x1="0" y1="80" x2="100" y2="80" />
        </g>
        <g
          strokeWidth={isHovered ? 8 : 4}
          stroke="black"
          fill="none"
          transform="rotate(45, 50, 50)"
        >
          <circle cx="50" cy="50" r="40" />
          <line x1="50" y1="10" x2="50" y2="90" />
        </g>
      </svg>
    </button>
  )
}
