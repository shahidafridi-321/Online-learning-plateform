import React, { useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FormControls } from "../ui/common-form/FormControls";
import { courseLandingPageFormControls } from "@/config";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";

export const CourseLanding = () => {
	const { courseLandingFormData, setCourseLandingFormData } =
		useContext(InstructorContext);
	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Landing</CardTitle>
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
