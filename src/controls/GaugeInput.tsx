import { useState } from "react"

type Props = {
  label: string
  value: number | string
  onChange: (value: string) => void
}

export function GaugeInput({ label, value, onChange }: Props) {
  const [displayValue, setDisplayValue] = useState(value)

  return (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        textTransform: "uppercase",
        fontFamily: "sans-serif",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      <div>{label}</div>
      <input
        pattern="[0-9]*\.?[0-9]*"
        value={displayValue}
        onChange={(event) => {
          const value = event.target.value
          setDisplayValue(value)
          if (!isNaN(Number.parseFloat(value))) onChange(event.target.value)
        }}
        size={4}
        style={{
          border: "1px solid transparent",
          borderLeftColor: "currentColor",
          borderBottomColor: "currentColor",
          textAlign: "end",
          padding: 0,
        }}
      />
    </label>
  )
}
