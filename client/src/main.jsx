import { createRoot } from "react-dom/client";
import "./index.css";
import { AuthProvider } from "./context/auth-context";
import App from "./App";
import { InstructorContextProvider } from "./context/instructor-context/InstructorContext";
import { StudentContextProvider } from "./context/student-context/StudentContext";

createRoot(document.getElementById("root")).render(
	<AuthProvider>
		<InstructorContextProvider>
			<StudentContextProvider>
				<App />
			</StudentContextProvider>
		</InstructorContextProvider>
	</AuthProvider>
);
