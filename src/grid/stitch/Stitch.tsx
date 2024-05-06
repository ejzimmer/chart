import { PropsWithChildren } from "react"

type Props = {
  colour?: string
  onMouseDown: () => void
  onMouseEnter: () => void
  onMouseUp: () => void
}

export function Stitch({
  colour,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div
      style={{
        borderTop: "1px solid",
        borderRight: "1px solid",
        backgroundColor: colour ?? "transparent",
        cursor: "pointer",
        height: "100%",
        fontFamily: "sans-serif",
        color: "hsl(0 0% 40%)",
        fontSize: "80%",
      }}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
    >
      {children}
    </div>
  )
}
