import { courseCategories } from "@/config";
import BannerImage from "../../../public/hero-img.jpg";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context/StudentContext";
import { fetchStudentViewCourseListService } from "@/services";
import { useNavigate } from "react-router-dom";

export const StudentHomePage = () => {
	const { studentViewCourseList, setStudentViewCourseList } =
		useContext(StudentContext);
	const navigate = useNavigate();

	const fetchAllStudentViewCourses = async () => {
		const response = await fetchStudentViewCourseListService();
		if (response?.success) {
			setStudentViewCourseList(response.data);
		}
	};

	useEffect(() => {
		fetchAllStudentViewCourses();
	}, []);

	// Clear filters on unmount
	useEffect(() => {
		return () => {
			sessionStorage.removeItem("filters");
		};
	}, []);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Section */}
			<section className="flex flex-col lg:flex-row items-center justify-between py-12 px-4 lg:px-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-lg shadow-lg">
				<div className="lg:w-1/2 text-center lg:text-left">
					<h1 className="text-5xl font-extrabold text-white mb-6">
						Learning that Gets You Ahead
					</h1>
					<p className="text-xl text-white mb-8">
						Unlock your potential with skills for today and tomorrow.
					</p>
					<Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 font-semibold rounded-full shadow-lg">
						Get Started
					</Button>
				</div>
				<div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
					<img
						src={BannerImage}
						alt="Banner"
						className="w-96 h-auto rounded-lg shadow-2xl"
					/>
				</div>
			</section>

			{/* Course Categories Section */}
			<section className="py-12 px-4 lg:px-12">
				<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
					Course Categories
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{courseCategories.map((categoryItem) => (
						<Button
							key={categoryItem.id}
							className="justify-center bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 rounded-full py-2 shadow transition transform hover:-translate-y-1"
							variant="outline"
						>
							{categoryItem.label}
						</Button>
					))}
				</div>
			</section>

			{/* Featured Courses Section */}
			<section className="py-12 px-4 lg:px-12">
				<h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
					Featured Courses
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
					{studentViewCourseList && studentViewCourseList.length > 0 ? (
						studentViewCourseList.map((courseItem) => (
							<div
								key={courseItem?._id}
								onClick={() => navigate(`/course/details/${courseItem?._id}`)}
								className="cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl bg-white rounded-lg overflow-hidden"
							>
								<img
									src={courseItem?.image}
									alt={courseItem.title}
									className="w-full h-56 object-cover"
								/>
								<div className="p-4">
									<h3 className="text-2xl font-semibold text-gray-800 mb-2">
										{courseItem?.title}
									</h3>
									<p className="text-sm text-gray-600 mb-2">
										By{" "}
										<span className="font-bold">
											{courseItem.instructorName}
										</span>
									</p>
									<p className="text-lg font-bold text-indigo-600">
										${courseItem.pricing}
									</p>
								</div>
							</div>
						))
					) : (
						<h2 className="text-4xl font-extrabold text-center text-gray-700">
							No Courses Found
						</h2>
					)}
				</div>
			</section>
		</div>
	);
};
