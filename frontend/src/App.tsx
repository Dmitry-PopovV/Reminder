//import style from './App.module.css';
import routerPaths from "./routerPaths";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <RouterProvider router={routerPaths} />
  )
}

export default App;
