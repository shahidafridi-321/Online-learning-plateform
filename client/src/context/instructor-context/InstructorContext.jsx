import {
	courseCurriculumInitialFormData,
	courseLandingInitialFormData,
} from "@/config";
import { createContext, useState, useMemo } from "react";

export const InstructorContext = createContext(null);

export const InstructorContextProvider = ({ children }) => {
	const [courseLandingFormData, setCourseLandingFormData] = useState(
		courseLandingInitialFormData
	);
	const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
		courseCurriculumInitialFormData
	);

	const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
	const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
		useState(0);

	const [instructorCoursesList, setInstructorCoursesList] = useState([]);

	const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

	const value = useMemo(
		() => ({
			courseLandingFormData,
			setCourseLandingFormData,
			courseCurriculumFormData,
			setCourseCurriculumFormData,
			mediaUploadProgress,
			setMediaUploadProgress,
			mediaUploadProgressPercentage,
			setMediaUploadProgressPercentage,
			instructorCoursesList,
			setInstructorCoursesList,
			currentEditedCourseId,
			setCurrentEditedCourseId,
		}),
		[
			courseLandingFormData,
			courseCurriculumFormData,
			mediaUploadProgress,
			mediaUploadProgressPercentage,
			instructorCoursesList,
			currentEditedCourseId,
		]
	);
	return (
		<InstructorContext.Provider value={value}>
			{children}
		</InstructorContext.Provider>
	);
};
