import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import { AuthPage } from "@/pages/auth";
import { RouteGuard } from "@/components/route-guard/RouteGuard";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { InstructorDashboardPage } from "@/pages/instructor/InstructorDashboardPage";
import { StudentViewCommonLayout } from "@/components/student-view/StudentViewCommonLayout";
import { StudentHomePage } from "@/pages/student/StudentHomePage";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { AddNewCoursePage } from "@/pages/instructor/AddNewCoursePage";

const ProtectedRoute = ({ element }) => {
	const { auth, loading } = useContext(AuthContext);
	return (
		<RouteGuard
			authenticated={auth?.authenticate}
			user={auth?.user}
			element={element}
			loading={loading}
		/>
	);
};

export const routes = createBrowserRouter([
	{
		path: "/auth",
		element: <ProtectedRoute element={<AuthPage />} />,
	},
	{
		path: "/instructor",
		element: <ProtectedRoute element={<InstructorDashboardPage />} />,
	},
	{
		path: "/instructor/create-new-course",
		element: <ProtectedRoute element={<AddNewCoursePage />} />,
	},
	{
		path: "/instructor/edit-course/:courseId",
		element: <ProtectedRoute element={<AddNewCoursePage />} />,
	},
	{
		path: "/",
		element: <ProtectedRoute element={<StudentViewCommonLayout />} />,
		children: [
			{
				path: "/",
				element: <StudentHomePage />,
			},
			{
				path: "/home",
				element: <StudentHomePage />,
			},
		],
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
