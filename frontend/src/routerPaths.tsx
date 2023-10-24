import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout.tsx";
import Landing from "./Landing/Landing.tsx";
import Authentication from "./Authentication/Authentication";

const routerPaths = createBrowserRouter([
  {
    path: "/",
    element: <Authentication />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/calendar",
        element: <Layout />,
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
    ]
  },
]);

export default routerPaths
