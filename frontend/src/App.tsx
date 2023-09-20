import routerPaths from "./routerPaths";
import { RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <RouterProvider router={routerPaths} />
  )
}

export default App;
