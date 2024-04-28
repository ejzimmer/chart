import React, { useState } from "react"

type Props = {
  isChecked: boolean
  onChange: () => void
  mode: "draw" | "clear"
}

export function LineControl({ mode, isChecked, onChange }: Props) {
  const [isHovered, setHovered] = useState(false)
  const radius = isHovered ? 8 : 6

  return (
    <label
      aria-label={`${mode} line`}
      style={{
        width: "30px",
        height: "30px",
        border: "1px solid",
        borderRadius: "5px",
        outline: isChecked ? "2px solid" : "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        style={{
          position: "fixed",
          top: "-100%",
          width: 0,
          height: 0,
          visibility: "hidden",
        }}
      />
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
        <path
          d="M14,36 L42,76 82,22"
          strokeWidth={isHovered ? 8 : 4}
          stroke="red"
          fill="none"
          strokeDasharray={mode === "clear" ? "4 8" : undefined}
        />
        <circle cx="14" cy="36" r={radius} />
        <circle cx="42" cy="76" r={radius} />
        <circle cx="82" cy="22" r={radius} />
      </svg>
    </label>
  )
}
