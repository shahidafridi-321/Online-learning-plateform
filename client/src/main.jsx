import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/auth-context";
import App from "./App";
import { InstructorContextProvider } from "./context/instructor-context/InstructorContext";
import { StudentContextProvider } from "./context/student-context/StudentContext";
import { Toaster } from "react-sonner";

createRoot(document.getElementById("root")).render(
	<AuthProvider>
		<InstructorContextProvider>
			<StudentContextProvider>
				<Toaster position="top-right" richColors />
				<App />
			</StudentContextProvider>
		</InstructorContextProvider>
	</AuthProvider>
);
