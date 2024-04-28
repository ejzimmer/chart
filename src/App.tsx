import { Controls } from "./controls/Controls"
import { Grid } from "./grid/Grid"
import { Provider } from "./Context"

// delete lines
// make pretty, a11y, error handling
// publish
// when adding a new colour, automatically select it
// minimise controls?

function App() {
  return (
    <Provider>
      <Controls />
      <Grid />
    </Provider>
  )
}

export default App
