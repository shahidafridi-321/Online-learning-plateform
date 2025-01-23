import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "@/pages/auth";
import App from "@/App";

export const routes = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/auth",
		element: <AuthPage />,
	},
]);
