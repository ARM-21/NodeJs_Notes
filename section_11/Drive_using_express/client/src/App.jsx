
import YourFiles from "./components/yourfiles/YourFiles";
import Home from "./Home";
import { createBrowserRouter, RouterProvider } from "react-router"
import Directory from "./routes/images/Directory";
import './app.css'

const routes = createBrowserRouter([{
  path: '/',
  element: <Home />,
  children: [{
    path: '/:name/*',
    element: <Directory />,
  },
  {
    path: "/",
    element: <YourFiles />,
    index: true
  }]
}]
)
function App() {

  return <RouterProvider router={routes} />
}

export default App;