import React, { useContext } from "react";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { mediaUploadService } from "@/services";

export const CourseSetting = () => {
	const { courseLandingFormData, setCourseLandingFormData } =
		useContext(InstructorContext);

		
	const handleImageUploadChange = async (event) => {
		const seletedImage = event.target.files[0];
		if (seletedImage) {
			const imageFormData = new FormData();
			imageFormData.append("file", seletedImage);
			try {
				const response = await mediaUploadService(imageFormData);
				if (response.success) {
					setCourseLandingFormData({
						...courseLandingFormData,
						image: response.data.url,
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
	};
	return (
		<Card>
			<CardHeader>
				<CardTitle>Course Setting</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-3">
					<Label>Upload Course Image</Label>
					<Input
						type="file"
						className="mb-4"
						accept="image/*"
						onChange={(event) => handleImageUploadChange(event)}
					/>
				</div>
			</CardContent>
		</Card>
	);
};
