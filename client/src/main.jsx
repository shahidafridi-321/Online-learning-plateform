import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/Router";
import AuthProvider from "./context/auth-context";

createRoot(document.getElementById("root")).render(
	<AuthProvider>
		<RouterProvider router={routes} />
	</AuthProvider>
);
