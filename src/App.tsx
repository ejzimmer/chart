import { Controls } from "./controls/Controls"
import { Grid } from "./grid/Grid"
import { Provider } from "./Context"

function App() {
  return (
    <Provider>
      <Grid />
      <Controls />
    </Provider>
  )
}

export default App
