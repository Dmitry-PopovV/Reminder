import { createBrowserRouter } from "react-router-dom";
import Calendar from "./Calendar/Calendar.tsx";
import Lending from "./Landing/Landing.tsx";

const routerPaths = createBrowserRouter([
  {
    path: "/",
    element: <Lending />,
  },
  {
    path: "/calendar",
    element: <Calendar />,
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
