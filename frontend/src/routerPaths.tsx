import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout.tsx";
import Landing from "./Landing/Landing.tsx";
import Authentication from "./Authentication/Authentication";

const routerPaths = createBrowserRouter([
  {
    path: "/",
    element: <Authentication><Landing /></Authentication>,
  },
  {
    path: "/calendar",
    element: <Authentication><Layout /></Authentication>,
    children: [
      {
        path: "/calendar/",
        element: <div>list</div>,
      },
      {
        path: "/calendar/redactor",
        element: <div>redactor</div>,
      }
    ],
  }
]);

export default routerPaths
