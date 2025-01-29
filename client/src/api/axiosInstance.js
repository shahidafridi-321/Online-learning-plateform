import axios from "axios";

const axiosInstance = axios.create({
	baseURL: "http://localhost:5002",
});
axiosInstance.interceptors.request.use(
	(config) => {
		const tokenString = sessionStorage.getItem("accessToken");

		if (tokenString) {
			try {
				const accessToken = JSON.parse(tokenString); 
				if (accessToken) {
					config.headers.Authorization = `Bearer ${accessToken}`;
				}
			} catch (error) {
				console.error("Error parsing accessToken:", error);
				sessionStorage.removeItem("accessToken");
			}
		}

		return config;
	},
	(err) => Promise.reject(err)
);

export default axiosInstance;
