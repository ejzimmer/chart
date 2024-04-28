type Props = {
  colour?: string
  onClick: () => void
}

export function Stitch({ colour, onClick }: Props) {
  return (
    <div
      style={{
        borderTop: "1px solid",
        borderRight: "1px solid",
        backgroundColor: colour ?? "transparent",
        cursor: "pointer",
        height: "100%",
      }}
      onClick={onClick}
    />
  )
}
