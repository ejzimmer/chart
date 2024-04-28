import { Controls } from "./Controls"
import { Grid } from "./Grid"
import { Layout } from "./LayoutContext"

// delete lines
// make pretty, a11y, error handling
// publish
// when adding a new colour, automatically select it
// minimise controls?

function App() {
  return (
    <Layout>
      <Controls />
      <Grid />
    </Layout>
  )
}

export default App
