import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout.tsx";
import Landing from "./Landing/Landing.tsx";
import Authentication from "./Authentication/Authentication";
import EventsList from "./EventsList/EventsList.tsx";
import EventsRedactor from "./EventsRedactor/EventsRedactor.tsx";

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
