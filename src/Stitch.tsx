type Props = {
  width: string
  height: string
  colour?: string
  changeColour: () => void
}

export function Stitch({ width, height, colour, changeColour }: Props) {
  return (
    <div
      style={{
        width,
        height,
        borderTop: "2px solid",
        borderRight: "2px solid",
        backgroundColor: colour ?? "transparent",
        cursor: "pointer",
        flexGrow: 0,
        flexShrink: 0,
      }}
      onClick={changeColour}
    />
  )
}
