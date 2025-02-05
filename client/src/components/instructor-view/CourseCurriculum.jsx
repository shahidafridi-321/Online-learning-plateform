import React, { useContext, useRef } from "react";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea"; // Assuming you have a Textarea component
import { courseCurriculumInitialFormData } from "@/config";
import {
	mediaBulkUploadService,
	mediaDeleteService,
	mediaUploadService,
} from "@/services";
import { MediaProgressBar } from "../MediaProgressBar";
import { VideoPlayer } from "../video-player/VideoPlayer";
import { Upload } from "lucide-react";
import { Select, SelectContent, SelectItem } from "../ui/select";

export function CourseCurriculum() {
	const {
		courseCurriculumFormData,
		setCourseCurriculumFormData,
		mediaUploadProgress,
		setMediaUploadProgress,
		mediaUploadProgressPercentage,
		setMediaUploadProgressPercentage,
	} = useContext(InstructorContext);

	const bulkUploadInputRef = useRef(null);

	function handleNewLecture() {
		// Here we default to a video lecture. You can adjust if needed.
		setCourseCurriculumFormData([
			...courseCurriculumFormData,
			{
				...courseCurriculumInitialFormData[0],
				// Ensure that lecture type and fields are correctly initialized:
				type: "video",
				title: "",
				videoUrl: "",
				public_id: "",
				textContent: "",
			},
		]);
	}

	// When lecture title changes
	function handleCourseTitleChange(event, currentIndex) {
		let updatedData = [...courseCurriculumFormData];
		updatedData[currentIndex] = {
			...updatedData[currentIndex],
			title: event.target.value,
		};
		setCourseCurriculumFormData(updatedData);
	}

	// Handle free preview toggle
	function handleFreePreviewChange(currentValue, currentIndex) {
		let updatedData = [...courseCurriculumFormData];
		updatedData[currentIndex] = {
			...updatedData[currentIndex],
			freePreview: currentValue,
		};
		setCourseCurriculumFormData(updatedData);
	}

	// Change lecture type (video or text)
	function handleLectureTypeChange(event, currentIndex) {
		let updatedData = [...courseCurriculumFormData];
		const newType = event.target.value;
		updatedData[currentIndex] = {
			...updatedData[currentIndex],
			type: newType,

			// Reset fields that are not applicable for the selected type
			videoUrl: newType === "video" ? updatedData[currentIndex].videoUrl : "",
			public_id: newType === "video" ? updatedData[currentIndex].public_id : "",
			textContent:
				newType === "text" ? updatedData[currentIndex].textContent : "",
		};
		setCourseCurriculumFormData(updatedData);
	}

	async function handleSingleLectureUpload(event, currentIndex) {
		const selectedFile = event.target.files[0];

		if (selectedFile) {
			const videoFormData = new FormData();
			videoFormData.append("file", selectedFile);

			try {
				setMediaUploadProgress(true);
				const response = await mediaUploadService(
					videoFormData,
					setMediaUploadProgressPercentage
				);
				if (response.success) {
					let updatedData = [...courseCurriculumFormData];
					updatedData[currentIndex] = {
						...updatedData[currentIndex],
						videoUrl: response?.data?.url,
						public_id: response?.data?.public_id,
					};
					setCourseCurriculumFormData(updatedData);
					setMediaUploadProgress(false);
				}
			} catch (error) {
				console.log(error);
			}
		}
	}

	async function handleReplaceVideo(currentIndex) {
		let updatedData = [...courseCurriculumFormData];
		const currentPublicId = updatedData[currentIndex].public_id;
		const deleteResponse = await mediaDeleteService(currentPublicId);

		if (deleteResponse?.success) {
			updatedData[currentIndex] = {
				...updatedData[currentIndex],
				videoUrl: "",
				public_id: "",
			};
			setCourseCurriculumFormData(updatedData);
		}
	}
	function isCourseCurriculumFormDataValid() {
		return courseCurriculumFormData.every((item) => {
			if (!item || typeof item !== "object") return false;
			if (item.title.trim() === "") return false;
			if (item.type === "video") {
				return item.videoUrl.trim() !== "";
			} else if (item.type === "text") {
				return item.textContent.trim() !== "";
			}
			return false;
		});
	}

	function handleOpenBulkUploadDialog() {
		bulkUploadInputRef.current?.click();
	}

	function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
		return arr.every((obj) => {
			return Object.entries(obj).every(([key, value]) => {
				if (typeof value === "boolean") {
					return true;
				}
				return value === "";
			});
		});
	}

	async function handleMediaBulkUpload(event) {
		const selectedFiles = Array.from(event.target.files);
		const bulkFormData = new FormData();
		selectedFiles.forEach((file) => bulkFormData.append("files", file));

		try {
			setMediaUploadProgress(true);
			const response = await mediaBulkUploadService(
				bulkFormData,
				setMediaUploadProgressPercentage
			);
			if (response?.success) {
				let updatedData = areAllCourseCurriculumFormDataObjectsEmpty(
					courseCurriculumFormData
				)
					? []
					: [...courseCurriculumFormData];

				updatedData = [
					...updatedData,
					...response?.data.map((item, index) => ({
						type: "video",
						videoUrl: item?.url,
						public_id: item?.public_id,
						title: `Lecture ${updatedData.length + index + 1}`,
						textContent: "",
						freePreview: false,
					})),
				];
				setCourseCurriculumFormData(updatedData);
				setMediaUploadProgress(false);
			}
		} catch (e) {
			console.log(e);
			setMediaUploadProgress(false);
		}
	}

	async function handleDeleteLecture(currentIndex) {
		let updatedData = [...courseCurriculumFormData];
		const currentPublicId = updatedData[currentIndex].public_id;

		// For video lectures, try to delete the uploaded media.
		if (updatedData[currentIndex].type === "video") {
			const response = await mediaDeleteService(currentPublicId);
			if (response?.success) {
				updatedData = updatedData.filter((_, index) => index !== currentIndex);
				setCourseCurriculumFormData(updatedData);
			}
		} else {
			// For text lectures, just remove the lecture.
			updatedData = updatedData.filter((_, index) => index !== currentIndex);
			setCourseCurriculumFormData(updatedData);
		}
	}

	return (
		<Card>
			<CardHeader className="flex flex-row justify-between">
				<CardTitle>Create Course Curriculum</CardTitle>
				<div>
					<Input
						type="file"
						ref={bulkUploadInputRef}
						accept="video/*"
						multiple
						className="hidden"
						id="bulk-media-upload"
						onChange={handleMediaBulkUpload}
					/>
					<Button
						as="label"
						htmlFor="bulk-media-upload"
						variant="outline"
						className="cursor-pointer"
						onClick={handleOpenBulkUploadDialog}
					>
						<Upload className="w-4 h-5 mr-2" />
						Bulk Upload
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<Button
					disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
					onClick={handleNewLecture}
				>
					Add Lecture
				</Button>
				{mediaUploadProgress && (
					<MediaProgressBar
						isMediaUploading={mediaUploadProgress}
						progress={mediaUploadProgressPercentage}
					/>
				)}
				<div className="mt-4 space-y-4">
					{courseCurriculumFormData.map((curriculumItem, index) => (
						<div className="border p-5 rounded-md" key={index}>
							<div className="flex gap-5 items-center">
								<h3 className="font-semibold">Lecture {index + 1}</h3>
								<Input
									name={`title-${index + 1}`}
									placeholder="Enter lecture title"
									className="max-w-96"
									onChange={(event) => handleCourseTitleChange(event, index)}
									value={curriculumItem.title}
								/>
								<div className="flex items-center space-x-2">
									<Switch
										onCheckedChange={(value) =>
											handleFreePreviewChange(value, index)
										}
										checked={curriculumItem.freePreview}
										id={`freePreview-${index + 1}`}
									/>
									<Label htmlFor={`freePreview-${index + 1}`}>
										Free Preview
									</Label>
								</div>

								<select
									value={curriculumItem.type}
									onChange={(event) => handleLectureTypeChange(event, index)}
									className="border rounded p-1"
								>
									<option value="video">Video</option>
									<option value="text">Text</option>
								</select>
							</div>
							<div className="mt-6">
								{curriculumItem.type === "video" ? (
									<>
										{curriculumItem.videoUrl ? (
											<div className="flex gap-3">
												<VideoPlayer
													url={curriculumItem.videoUrl}
													width="450px"
													height="200px"
												/>
												<Button onClick={() => handleReplaceVideo(index)}>
													Replace Video
												</Button>
												<Button
													onClick={() => handleDeleteLecture(index)}
													className="bg-red-900"
												>
													Delete Lecture
												</Button>
											</div>
										) : (
											<Input
												type="file"
												accept="video/*"
												onChange={(event) =>
													handleSingleLectureUpload(event, index)
												}
												className="mb-4"
											/>
										)}
									</>
								) : (
									<>
										{/* For text lectures, display a textarea */}
										<Textarea
											placeholder="Enter text lecture content"
											value={curriculumItem.textContent}
											onChange={(event) => {
												let updatedData = [...courseCurriculumFormData];
												updatedData[index] = {
													...updatedData[index],
													textContent: event.target.value,
												};
												setCourseCurriculumFormData(updatedData);
											}}
										/>
										<div className="mt-2">
											<Button
												onClick={() => handleDeleteLecture(index)}
												className="bg-red-900"
											>
												Delete Lecture
											</Button>
										</div>
									</>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
