import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useContext } from "react";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import {
	courseCurriculumInitialFormData,
	courseLandingInitialFormData,
} from "@/config";

export const InstructorCourses = ({ listOfCourses }) => {
	const navigate = useNavigate();
	const {
		setCurrentEditedCourseId,
		setCourseLandingFormData,
		setCourseCurriculumFormData,
	} = useContext(InstructorContext);

	return (
		<Card>
			<CardHeader className="flex justify-between flex-row items-center">
				<CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
				<Button
					className="p-5"
					onClick={() => {
						setCurrentEditedCourseId(null);
						setCourseCurriculumFormData(courseCurriculumInitialFormData);
						setCourseLandingFormData(courseLandingInitialFormData);
						navigate("/instructor/create-new-course");
					}}
				>
					Create New Course
				</Button>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Course</TableHead>
								<TableHead>Students</TableHead>
								<TableHead>Revenue</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{listOfCourses && listOfCourses.length > 0
								? listOfCourses.map((course) => (
										<TableRow key={course.title}>
											<TableCell className="font-medium">
												{course?.title}
											</TableCell>
											<TableCell>{course?.students?.length}</TableCell>
											<TableCell>
												${course?.students?.length * course?.pricing}
											</TableCell>
											<TableCell className="text-right">
												<Button
													onClick={() => {
														navigate(`/instructor/edit-course/${course?._id}`);
													}}
													variant="ghost"
													size="sm"
												>
													<Edit className="h-6 w-6" />
												</Button>
												<Button variant="ghost" size="sm">
													<Delete className="h-6 w-6" />
												</Button>
											</TableCell>
										</TableRow>
								  ))
								: null}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};
