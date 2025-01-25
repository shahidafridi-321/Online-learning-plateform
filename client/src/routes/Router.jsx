import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { AuthPage } from "@/pages/auth";

export const routes = createBrowserRouter([
	{
		path: "/auth",
		element: <AuthPage />,
	},
]);
