import React, { useContext, useRef } from "react";
import { InstructorContext } from "@/context/instructor-context/InstructorContext";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { courseCurriculumInitialFormData } from "@/config";
import {
	mediaBulkUploadService,
	mediaDeleteService,
	mediaUploadService,
} from "@/services";
import { MediaProgressBar } from "../MediaProgressBar";
import { VideoPlayer } from "../video-player/VideoPlayer";
import { Upload, Trash2 } from "lucide-react";

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
		setCourseCurriculumFormData([
			...courseCurriculumFormData,
			{ ...courseCurriculumInitialFormData[0], type: "video" },
		]);
	}

	function handleCourseTitleChange(event, currentIndex) {
		let updatedData = [...courseCurriculumFormData];
		updatedData[currentIndex].title = event.target.value;
		setCourseCurriculumFormData(updatedData);
	}

	function handleFreePreviewChange(currentValue, currentIndex) {
		let updatedData = [...courseCurriculumFormData];
		updatedData[currentIndex].freePreview = currentValue;
		setCourseCurriculumFormData(updatedData);
	}

	function handleLectureTypeChange(event, currentIndex) {
		let updatedData = [...courseCurriculumFormData];
		const newType = event.target.value;
		updatedData[currentIndex].type = newType;
		updatedData[currentIndex].videoUrl =
			newType === "video" ? updatedData[currentIndex].videoUrl : "";
		updatedData[currentIndex].public_id =
			newType === "video" ? updatedData[currentIndex].public_id : "";
		updatedData[currentIndex].textContent =
			newType === "text" ? updatedData[currentIndex].textContent : "";
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
					updatedData[currentIndex].videoUrl = response?.data?.url;
					updatedData[currentIndex].public_id = response?.data?.public_id;
					setCourseCurriculumFormData(updatedData);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setMediaUploadProgress(false);
			}
		}
	}

	async function handleReplaceVideo(currentIndex) {
		let updatedData = [...courseCurriculumFormData];
		const currentPublicId = updatedData[currentIndex].public_id;
		const deleteResponse = await mediaDeleteService(currentPublicId);
		if (deleteResponse?.success) {
			updatedData[currentIndex].videoUrl = "";
			updatedData[currentIndex].public_id = "";
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
				if (typeof value === "boolean") return true;
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
			}
		} catch (e) {
			console.log(e);
		} finally {
			setMediaUploadProgress(false);
		}
	}

	async function handleDeleteLecture(currentIndex) {
		let updatedData = [...courseCurriculumFormData];
		const currentPublicId = updatedData[currentIndex].public_id;
		if (updatedData[currentIndex].type === "video") {
			const response = await mediaDeleteService(currentPublicId);
			if (response?.success) {
				updatedData = updatedData.filter((_, index) => index !== currentIndex);
				setCourseCurriculumFormData(updatedData);
			}
		} else {
			updatedData = updatedData.filter((_, index) => index !== currentIndex);
			setCourseCurriculumFormData(updatedData);
		}
	}

	return (
		<Card className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
			<CardHeader className="flex flex-row justify-between items-center">
				<CardTitle className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
					Course Curriculum
				</CardTitle>
				<Button
					variant="outline"
					className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					onClick={handleOpenBulkUploadDialog}
				>
					<Upload className="w-4 h-5 mr-2" />
					Bulk Upload
				</Button>
				<Input
					type="file"
					ref={bulkUploadInputRef}
					accept="video/*"
					multiple
					className="hidden"
					id="bulk-media-upload"
					onChange={handleMediaBulkUpload}
				/>
			</CardHeader>
			<CardContent>
				<Button
					className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow-md mb-4 transition-colors"
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
						<div
							key={index}
							className="border p-5 rounded-md bg-gray-50 dark:bg-gray-700"
						>
							<div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
								<h3 className="font-semibold text-gray-800 dark:text-gray-100">
									Lecture {index + 1}
								</h3>
								<Input
									name={`title-${index + 1}`}
									placeholder="Enter lecture title"
									className="flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md"
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
									<Label
										htmlFor={`freePreview-${index + 1}`}
										className="text-gray-700 dark:text-gray-300"
									>
										Free Preview
									</Label>
								</div>
								<select
									value={curriculumItem.type}
									onChange={(event) => handleLectureTypeChange(event, index)}
									className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
								>
									<option value="video">Video</option>
									<option value="text">Text</option>
								</select>
							</div>
							<div className="mt-4">
								{curriculumItem.type === "video" ? (
									<>
										{curriculumItem.videoUrl ? (
											<div className="flex flex-col sm:flex-row gap-4 items-center">
												<VideoPlayer
													url={curriculumItem.videoUrl}
													width="100%"
													height="200px"
													className="rounded-md"
												/>
												<Button
													onClick={() => handleReplaceVideo(index)}
													className="bg-yellow-500 hover:bg-yellow-600 text-white mt-2 sm:mt-0 transition-colors"
												>
													Replace Video
												</Button>
												<Button
													onClick={() => handleDeleteLecture(index)}
													className="bg-red-600 hover:bg-red-700 text-white transition-colors"
												>
													<Trash2 className="w-4 h-4 mr-2" />
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
												className="mb-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md"
											/>
										)}
									</>
								) : (
									<>
										<Textarea
											placeholder="Enter text lecture content"
											value={curriculumItem.textContent}
											onChange={(event) => {
												let updatedData = [...courseCurriculumFormData];
												updatedData[index].textContent = event.target.value;
												setCourseCurriculumFormData(updatedData);
											}}
											className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
										/>
										<div className="mt-2">
											<Button
												onClick={() => handleDeleteLecture(index)}
												className="bg-red-600 hover:bg-red-700 text-white transition-colors"
											>
												<Trash2 className="w-4 h-4 mr-2" />
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
