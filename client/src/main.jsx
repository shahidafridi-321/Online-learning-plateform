import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/auth-context";
import App from "./App";

createRoot(document.getElementById("root")).render(
	<AuthProvider>
		<App />
	</AuthProvider>
);
