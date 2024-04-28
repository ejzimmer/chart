import { Controls } from "./controls/Controls"
import { Grid } from "./grid/Grid"
import { Provider } from "./Context"

// make pretty, a11y, error handling
// publish
// when adding a new colour, automatically select it
// minimise controls?

function App() {
  return (
    <Provider>
      <Grid />
      <Controls />
    </Provider>
  )
}

export default App
