import axiosInstance from "@/api/axiosInstance";

export const approveCourseService = async (courseId) => {
	const data = await axiosInstance.post(`/admin/approve-course/${courseId}`);
	return data;
};

export const rejectCourseService = async (courseId) => {
	const data = await axiosInstance.post(`/admin/reject-course/${courseId}`);
	return data;
};
