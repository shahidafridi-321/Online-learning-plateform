import axiosInstance from "@/api/axiosInstance";

export const getAllCourseNotificationsService = async (instructorId) => {
	try {
		const { data } = await axiosInstance.get(
			`/instructor/get/all/notifications/${instructorId}`
		);
		return data;
	} catch (error) {
		return {
			success: false,
			message: error.response?.data?.message || "Failed to fetch notifications",
		};
	}
};

export const markNotificationAsReadService = async (notificationId) => {
	try {
		const { data } = await axiosInstance.put(
			`/instructor/notifications/${notificationId}/read`
		);
		return data;
	} catch (error) {
		return {
			success: false,
			message:
				error.response?.data?.message || "Failed to mark notification as read",
		};
	}
};

export const deleteNotificationService = async (notificationId) => {
	try {
		const { data } = await axiosInstance.delete(
			`/instructor/notifications/${notificationId}`
		);
		return data;
	} catch (error) {
		return {
			success: false,
			message: error.response?.data?.message || "Failed to delete notification",
		};
	}
};
