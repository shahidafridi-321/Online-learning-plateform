import React, { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FormControls } from "../ui/common-form/FormControls";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";

export const CourseLanding = () => {
	const { courseLandingFormData, setCourseLandingFormData } =
		useContext(InstructorContext);
	return (
		<Card className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
			<CardHeader>
				<CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
					Course Landing Page
				</CardTitle>
			</CardHeader>
			<CardContent>
				<FormControls
					formControls={courseLandingPageFormControls}
					formData={courseLandingFormData}
					setFormData={setCourseLandingFormData}
				/>
			</CardContent>
		</Card>
	);
};
