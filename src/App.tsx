import { Controls } from "./Controls"
import { Grid } from "./Grid"
import { Layout } from "./LayoutContext"
// pick colours
// draw lines
// clear pattern
// clear stitch
// redraw pattern when grid resizes
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
