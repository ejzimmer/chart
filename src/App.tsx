import { Controls } from "./Controls"
import { Grid } from "./Grid"
import { Layout } from "./LayoutContext"

// clear stitch
// make pretty, a11y, error handling
// publish
// favicon & title
// delete lines

function App() {
  return (
    <Layout>
      <Controls />
      <Grid />
    </Layout>
  )
}

export default App
