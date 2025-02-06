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
						width={"600px"}
						height={"400px"}
						className="w-10/12 h-[400px] rounded-lg shadow-lg"
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
		</div>
	);
};
