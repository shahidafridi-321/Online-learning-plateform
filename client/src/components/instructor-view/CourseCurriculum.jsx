import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import React, { useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { courseCurriculumInitialFormData } from "@/config";

export const CourseCurriculum = () => {
	const { courseCurriculumFormData, setCourseCurriculumFormData } =
		useContext(InstructorContext);

	const handleNewLecture = () => {
		setCourseCurriculumFormData([
			...courseCurriculumFormData,
			{
				...courseCurriculumInitialFormData[0],
			},
		]);
	};

	console.log(courseCurriculumFormData);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create Course Curriculum</CardTitle>
			</CardHeader>
			<CardContent>
				<Button onClick={handleNewLecture}>Add Lecture</Button>
				<div className="mt-4 space-y-4">
					{courseCurriculumFormData.map((curriculumItem, index) => (
						<div className="border p-5 rounded-md" key={curriculumItem.title}>
							<div className="flex gap-5 items-center">
								<h3 className="font-semibold">Lecture {index + 1}</h3>
								<Input
									name={`title-${index + 1}`}
									placeholder="Enter Lecture Title"
									className="max-w-96"
								/>
								<div className="flex items-center space-x-2">
									<Switch checked={false} id={`freePreview-${index + 1}`} />
									<Label htmlFor={`freePreview-${index + 1}`}>
										Free Preview
									</Label>
								</div>
							</div>
							<div className="mt-6">
								<Input type="file" accept="video/*" className="mb-4" />
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
