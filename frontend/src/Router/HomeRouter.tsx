import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Calendar from "../Calendar/Calendar.tsx";
import Lending from "../Lending/Lending.tsx";

const HomeRouter = createBrowserRouter([
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

export default function HomeRouterProvider() {
  return (
    <RouterProvider router={HomeRouter} />
  )
}
