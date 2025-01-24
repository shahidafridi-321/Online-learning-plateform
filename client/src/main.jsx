import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/Router";
import App from "./App";
import AuthProvider from "./context/auth-context";

createRoot(document.getElementById("root")).render(
	<RouterProvider router={routes}>
		<AuthProvider>
			<App />
		</AuthProvider>
	</RouterProvider>
);
