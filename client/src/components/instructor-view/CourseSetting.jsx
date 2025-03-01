import React, { useContext } from "react";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { mediaUploadService } from "@/services";
import { MediaProgressBar } from "../MediaProgressBar";
import { ImageIcon } from "lucide-react";

export const CourseSetting = () => {
	const {
		courseLandingFormData,
		setCourseLandingFormData,
		mediaUploadProgress,
		setMediaUploadProgress,
		mediaUploadProgressPercentage,
		setMediaUploadProgressPercentage,
	} = useContext(InstructorContext);

	const handleImageUploadChange = async (event) => {
		const selectedImage = event.target.files[0];
		if (selectedImage) {
			const imageFormData = new FormData();
			imageFormData.append("file", selectedImage);
			try {
				setMediaUploadProgress(true);
				const response = await mediaUploadService(
					imageFormData,
					setMediaUploadProgressPercentage
				);
				if (response.success) {
					setCourseLandingFormData({
						...courseLandingFormData,
						image: response.data.url,
					});
					setMediaUploadProgress(false);
				}
			} catch (error) {
				console.log(error);
				setMediaUploadProgress(false);
			}
		}
	};

	return (
		<Card className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
			<CardHeader>
				<CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
					Course Settings
				</CardTitle>
			</CardHeader>
			<div className="p-4">
				{mediaUploadProgress && (
					<MediaProgressBar
						isMediaUploading={mediaUploadProgress}
						progress={mediaUploadProgressPercentage}
					/>
				)}
			</div>
			<CardContent>
				{courseLandingFormData?.image ? (
					<img
						src={courseLandingFormData.image}
						alt="Course Preview"
						className="w-full h-48 object-cover rounded-md mb-4"
					/>
				) : (
					<div className="flex flex-col items-center justify-center w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-md mb-4">
						<ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
						<p className="text-gray-500 dark:text-gray-400 mt-2">
							No image uploaded
						</p>
					</div>
				)}
				<div className="flex flex-col gap-3">
					<Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
						Upload Course Image
					</Label>
					<Input
						type="file"
						accept="image/*"
						onChange={handleImageUploadChange}
						className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md"
					/>
				</div>
			</CardContent>
		</Card>
	);
};
