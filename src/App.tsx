import { Controls } from "./Controls"
import { Grid } from "./Grid"
import { Layout } from "./LayoutContext"

// delete points off lines
// delete whole lines
// clear pattern
// clear stitch
// make pretty, a11y, error handling
// publish
// favicon & title

function App() {
  return (
    <Layout>
      <Controls />
      <Grid />
    </Layout>
  )
}

export default App
