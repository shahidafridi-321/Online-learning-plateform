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
import { StudentViewCourses } from "@/pages/student/StudentViewCourses";
import { StudentViewCourseDetailsPage } from "@/pages/student/StudentViewCourseDetailsPage";
import { TextLecturePage } from "@/pages/student/TextLecturePage";
import { PaypalPaymentReturnPage } from "@/pages/student/PaypalPaymentReturnPage";
import { StudentCoursesPage } from "@/pages/student/StudentCoursesPage";
import { CourseProgressPage } from "@/pages/student/CourseProgressPage";
import { EmailVerificationPage } from "@/pages/email-verification/EmailVerificationPage";
import { StudentReviewPage } from "@/pages/student/StudentReviewPage";
import { ReviewApproveRejectPage } from "@/pages/super-admin/ReviewApproveRejectPage";
import { AdminCommonLayout } from "@/components/admin-view/AdminCommonLayout";
import { StudentEmailVerificationPage } from "@/pages/student/StudentEmailVerificationPage";
import { AdminDashboardPage } from "@/pages/super-admin/AdminDashboardPage";
import { AdminCoursesPage } from "@/pages/super-admin/AdminCoursesPage";

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
		path: "/verify-email",
		element: <ProtectedRoute element={<EmailVerificationPage />} />,
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
			{
				path: "/courses",
				element: <StudentViewCourses />,
			},
			{
				path: "/course/details/:id",
				element: <StudentViewCourseDetailsPage />,
			},
			{
				path: "/course/details/:courseId/lecture/:lectureId",
				element: <TextLecturePage />,
			},
			{
				path: "/payment-return",
				element: <PaypalPaymentReturnPage />,
			},
			{
				path: "/student-courses",
				element: <StudentCoursesPage />,
			},
			{
				path: "/course-progress/:id",
				element: <CourseProgressPage />,
			},
			{
				path: "/create-course-review",
				element: <StudentReviewPage />,
			},
			{
				path: "/student/email-verification",
				element: <StudentEmailVerificationPage />,
			},
		],
	},
	{
		/* path: "/admin",
		element: <ProtectedRoute element={<AdminDashboardPage />} />,
		children: [
			{
				path: "approve-reject-review",
				element: <ReviewApproveRejectPage />,
			},
			{
				path: "dashboard",
				element: <AdminDashboardPage />,
			}, */
		// {
		//   path: "courses",
		//   element: <AdminCoursesPage />,
		// },
		// {
		//   path: "users",
		//   element: <AdminUsersPage />,
		// },
		//],

		path: "/admin",
		element: <ProtectedRoute element={<AdminCommonLayout />} />,
		children: [
			{ path: "dashboard", element: <AdminDashboardPage /> },
			{ path: "approve-reject-review", element: <ReviewApproveRejectPage /> },
			{ path: "courses", element: <AdminCoursesPage /> },
		],
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);
