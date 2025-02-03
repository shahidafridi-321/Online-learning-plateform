import axiosInstance from "@/api/axiosInstance";

export const registerService = async (formData) => {
	const { data } = await axiosInstance.post("/auth/register", {
		...formData,
		role: "user",
	});
	return data;
};

export const loginService = async (formData) => {
	const { data } = await axiosInstance.post("/auth/login", formData);
	return data;
};

export const checkAuthService = async () => {
	const { data } = await axiosInstance.get("/auth/check-auth");
	return data;
};

export const mediaUploadService = async (formData, onProgressCallback) => {
	const { data } = await axiosInstance.post("/media/upload", formData, {
		onUploadProgress: (ProgressEvent) => {
			const percentCompleted = Math.round(
				(ProgressEvent.loaded * 100) / ProgressEvent.total
			);
			onProgressCallback(percentCompleted);
		},
	});
	return data;
};

export const mediaDeleteService = async (id) => {
	const { data } = await axiosInstance.delete(`/media/delete/${id}`);
	return data;
};

export const fetchInstructorCourseListService = async () => {
	const { data } = await axiosInstance.get(`/instructor/course/get`);
	return data;
};

export const addNewCourseService = async (formData) => {
	const { data } = await axiosInstance.post(`/instructor/course/add`, formData);
	return data;
};

export const fetchInstructorCourseDetailsService = async (id) => {
	const { data } = await axiosInstance.get(
		`/instructor/course/get/detials/${id}`
	);
	return data;
};

export const updateCourseByIdService = async (id, formData) => {
	const { data } = await axiosInstance.put(
		`/instructor/course/update/${id}`,
		formData
	);
	return data;
};
