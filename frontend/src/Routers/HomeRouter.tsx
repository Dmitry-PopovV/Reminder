import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Calendar from "../Calendar/Calendar.tsx";

const HomeRouter = createBrowserRouter([
    {
      path: "/",
      element: <>home page</>,
    },
    {
      path: "/calendar",
      element: <Calendar />,
    }
]);

export default function HomeRouterProvider() {
    return (
      <RouterProvider router={HomeRouter} />
    )
}
