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
        borderTop: "1px solid",
        borderRight: "1px solid",
        backgroundColor: colour ?? "transparent",
        cursor: "pointer",
      }}
      onClick={changeColour}
    />
  )
}
