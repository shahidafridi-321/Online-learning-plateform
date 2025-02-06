import { courseCategories } from "@/config";
import BannerImage from "../../../public/hero-img.jpg";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context/StudentContext";
import { fetchStudentViewCourseListService } from "@/services";

export const StudentHomePage = () => {
	const { studentViewCourseList, setStudentViewCourseList } =
		useContext(StudentContext);

	const fetchAllStudentViewCourses = async () => {
		const response = await fetchStudentViewCourseListService();
		if (response?.success) {
			setStudentViewCourseList(response.data);
		}
	};

	useEffect(() => {
		fetchAllStudentViewCourses();
	}, []);

	return (
		<div className="min-h-screen ">
			<section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
				<div className="lg:w-1/2 lg:pr-12">
					<h1 className="text-4xl font-bold mb-4">Learning that gets you</h1>
					<p className="text-xl">
						Skills for your present and your future. Get Started with US
					</p>
				</div>
				<div className="lg:w-full mb-8 lg:mb-0">
					<img
						src={BannerImage}
						alt="BannerImage"
						width={400}
						height={300}
						className="w-full h-auto rounded-lg shadow-lg"
					/>
				</div>
			</section>
			<section className="py-8 px-4 lg:px-8 bg-gray-100">
				<h2 className="text-2xl font-bold mb-6">Course Catagories</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
					{courseCategories.map((catagoryItem) => (
						<Button
							key={catagoryItem.id}
							className="justify-start"
							variant="outline"
						>
							{catagoryItem.label}
						</Button>
					))}
				</div>
			</section>
			<section className="py-12 px-4 lg:px-8">
				<h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{studentViewCourseList && studentViewCourseList.length > 0 ? (
						studentViewCourseList.map((courseItem) => (
							<div
								key={courseItem?._id}
								className="border rounded-lg overflow-hidden shadow cursor-pointer"
							>
								<img
									src={courseItem?.image}
									alt={courseItem.title}
									width={300}
									height={150}
									className="w-full h-40 object-cover"
								/>
								<div className="p-4">
									<h3 className="font-bold mb-2">{courseItem.title}</h3>
									<p className="text-sm text-gray-700 mb-2">
										{courseItem.instructorName}
									</p>
									<p className="font-bold text-[16px]">${courseItem.pricing}</p>
								</div>
							</div>
						))
					) : (
						<h2>No Courses Found</h2>
					)}
				</div>
			</section>
		</div>
	);
};
