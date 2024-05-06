import { Controls } from "./controls/Controls"
import { Grid } from "./grid/Grid"
import { Provider } from "./Context"
import React from "react"

// add row numbers - make it adjustable where you put row 1?
// highlight current row/mark off done rows
// import/export files - as json, as image?

function App() {
  return (
    <Provider>
      <Grid />
      <Controls />
    </Provider>
  )
}

export default App
