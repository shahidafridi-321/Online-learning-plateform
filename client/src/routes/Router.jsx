import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { AuthPageRoot } from "@/pages/auth";

export const routes = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/auth",
		element: <AuthPageRoot />,
	},
]);
