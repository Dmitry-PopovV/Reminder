import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout.tsx";
import Landing from "./components/Landing/Landing.tsx";
import Authentication from "./components/Authentication/Authentication";
import EventsList from "./components/EventsList/EventsList.tsx";
import EventsRedactor from "./components/EventsRedactor/EventsRedactor.tsx";

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
                        element: <EventsList />,
                    },
                    {
                        path: "/calendar/redactor",
                        element: <EventsRedactor />,
                    }
                ],
            }
        ]
    },
]);

export default routerPaths
