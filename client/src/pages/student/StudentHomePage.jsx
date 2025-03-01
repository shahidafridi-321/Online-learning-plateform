import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { StudentContext } from "@/context/student-context/StudentContext";
import { fetchStudentViewCourseListService, getAllReviews } from "@/services";
import { Link, useNavigate } from "react-router-dom";
import { HeroSection } from "./HeroSection";
import { AuthContext } from "@/context/auth-context";
import { checkCoursePurchaseInfoService } from "@/services";
import { features, learningPaths } from "@/config/student-home-page-data";

export const StudentHomePage = () => {
	const { studentViewCourseList, setStudentViewCourseList } =
		useContext(StudentContext);
	const { auth } = useContext(AuthContext);
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [testimonials, setTestimonials] = useState([]);

	// Navigation handler for course categories
	const handleNavigateToCoursesPage = async (getCurrentId) => {
		sessionStorage.removeItem("filters");
		const currentFilter = { category: [getCurrentId] };
		sessionStorage.setItem("filters", JSON.stringify(currentFilter));
		navigate("/courses");
	};

	// Fetch all courses for students
	const fetchAllStudentViewCourses = async () => {
		const response = await fetchStudentViewCourseListService();
		if (response?.success) {
			setStudentViewCourseList(response.data);
		}
	};

	// Navigate to course details or progress based on purchase status
	const handleCourseNavigate = async (getCurrentCourseId) => {
		const response = await checkCoursePurchaseInfoService(
			getCurrentCourseId,
			auth?.user?._id
		);
		if (response?.success) {
			navigate(
				response?.data
					? `/course-progress/${getCurrentCourseId}`
					: `/course/details/${getCurrentCourseId}`
			);
		}
	};

	useEffect(() => {
		const fetchCourses = async () => {
			setIsLoading(true);
			await fetchAllStudentViewCourses();
			setIsLoading(false);
		};
		fetchCourses();
	}, []);

	// Data for Why Choose Us Section

	// Data for Testimonials Section
	const fetchReviews = async () => {
		const response = await getAllReviews();
		if (response.success) {
			setTestimonials(response.data);
		}
	};
	useEffect(() => {
		fetchReviews();
	}, []);

	// Data for Learning Paths Section

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<HeroSection />

			<section className="py-12 px-4 lg:px-12">
				<h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-center">
					Course Categories
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{courseCategories.map((categoryItem) => (
						<Button
							key={categoryItem.id}
							className="justify-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full py-2 shadow transition transform hover:-translate-y-1"
							variant="outline"
							onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
						>
							{categoryItem.label}
						</Button>
					))}
				</div>
			</section>

			<section className="py-16 px-4 lg:px-12 bg-gradient-to-br from-indigo-100 to-gray-200 dark:from-indigo-900 dark:to-gray-800">
				<h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-10 text-center">
					Featured Courses
				</h2>
				{isLoading ? (
					<div className="text-center text-gray-700 dark:text-gray-300">
						Loading courses...
					</div>
				) : studentViewCourseList && studentViewCourseList.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
						{studentViewCourseList.slice(0, 4).map((courseItem) => (
							<div
								key={courseItem?._id}
								onClick={() => handleCourseNavigate(courseItem._id)}
								className="cursor-pointer bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl"
							>
								<img
									src={courseItem?.image}
									alt={courseItem.title}
									className="w-full h-60 object-cover transition duration-300 hover:opacity-90"
								/>
								<div className="p-6">
									<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
										{courseItem?.title}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
										By{" "}
										<span className="font-medium">
											{courseItem.instructorName}
										</span>
									</p>
									<div className="flex justify-between items-center">
										<p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
											${courseItem.pricing}
										</p>
										<Button
											variant="outline"
											size="sm"
											className="hover:bg-indigo-600 hover:text-white"
										>
											Learn More
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<h2 className="text-4xl font-extrabold text-center text-gray-700 dark:text-gray-300">
						No Courses Found
					</h2>
				)}
			</section>

			{/* Learning Paths Section */}
			<section className="py-16 px-4 lg:px-12 bg-gray-100 dark:bg-gray-800">
				<h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-10 text-center">
					Explore Learning Paths
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{learningPaths.map((path, index) => (
						<div
							key={index}
							className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition duration-300"
						>
							<div className="text-4xl mb-4">{path.icon}</div>
							<h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
								{path.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-300 mb-4">
								{path.description}
							</p>
							<Button
								variant="link"
								className="text-indigo-600 dark:text-indigo-400 p-0"
								onClick={() => navigate(path.link)}
							>
								Start Path →
							</Button>
						</div>
					))}
				</div>
			</section>

			{/* Why Choose Us Section with Statistics */}
			<section className="py-16 px-4 lg:px-12 bg-white dark:bg-gray-900">
				<h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-10 text-center">
					Why Choose Us
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
					{features.map((feature, index) => (
						<div key={index} className="flex flex-col items-center text-center">
							<div className="mb-6 p-4 bg-indigo-100 dark:bg-indigo-900 rounded-full">
								{feature.icon}
							</div>
							<h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
								{feature.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								{feature.description}
							</p>
						</div>
					))}
				</div>
				<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
					<div>
						<h3 className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
							{studentViewCourseList.length}+
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Courses Available
						</p>
					</div>
					<div>
						<h3 className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
							{studentViewCourseList.reduce((acc, cur) => {
								return acc + cur.students.length;
							}, 0)}
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Students Enrolled
						</p>
					</div>
					<div>
						<h3 className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
							98%
						</h3>
						<p className="text-gray-600 dark:text-gray-300">
							Satisfaction Rate
						</p>
					</div>
				</div>
			</section>

			{/* Testimonials Section with Enhanced Design */}
			<section className="py-16 px-4 lg:px-12 bg-gradient-to-r from-gray-200 to-indigo-100 dark:from-gray-800 dark:to-indigo-900">
				<h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 mb-10 text-center">
					What Our Students Say
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{testimonials.map((testimonial, index) =>
						testimonial?.approved ? (
							<div
								key={index}
								className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl"
							>
								<p className="text-gray-600 dark:text-gray-300 mb-4 italic">
									&quot;{testimonial.quote}&quot;
								</p>
								<div className="flex items-center">
									<img
										src={testimonial.image}
										alt={testimonial.userName}
										className="w-14 h-14 rounded-full mr-4 border-2 border-indigo-600 dark:border-indigo-400"
									/>
									<div>
										<h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
											{testimonial.userName}
										</h4>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{testimonial.role}
										</p>
									</div>
								</div>
							</div>
						) : null
					)}
				</div>
			</section>

			{/* Call to Action Section with Newsletter */}
			<section className="py-16 px-4 lg:px-12 text-center bg-indigo-700 dark:bg-indigo-900 text-white">
				<h2 className="text-4xl font-extrabold mb-6">
					Ready to Transform Your Future?
				</h2>
				<p className="text-lg mb-8 max-w-2xl mx-auto">
					Join thousands of learners and start mastering new skills with our
					expertly crafted courses.
				</p>
				<div className="flex justify-center gap-4 mb-10">
					<Button
						className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold py-3 px-6"
						onClick={() => navigate("/courses")}
					>
						Explore Courses
					</Button>
					<Button
						className="bg-indigo-500 hover:bg-indigo-600 font-semibold py-3 px-6"
						onClick={() => navigate("/auth")}
					>
						Get Started
					</Button>
				</div>
				<div className="max-w-md mx-auto">
					<p className="text-lg mb-4">
						Stay updated with our latest courses and offers!
					</p>
					<form className="flex">
						<input
							type="email"
							placeholder="Your email address"
							className="flex-1 p-3 rounded-l-lg text-gray-800 focus:outline-none"
						/>
						<Button className="bg-indigo-500 h-full hover:bg-indigo-600 rounded-l-none rounded-r-lg p-4">
							Subscribe
						</Button>
					</form>
				</div>
			</section>
		</div>
	);
};
