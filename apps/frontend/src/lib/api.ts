import axios from "axios";

const api = axios.create({
	// biome-ignore lint/style/useNamingConvention: <explanation>
	baseURL: import.meta.env.URL ?? "https://cusw-workspace.sa.chula.ac.th/api2", // Adjust this according to your API base URL
	withCredentials: true, // Send cookies with requests if needed
});

// Request Interceptor: Attach token to headers
// api.interceptors.request.use(
// 	(config) => {
// 		const token = window.localStorage.getItem("token"); // Retrieve token from storage
// 		if (token) {
// 			config.headers.Authorization = `Bearer ${token}`;
// 		}
// 		return config;
// 	},
// 	(error) => {
// 		return Promise.reject(error);
// 	},
// );

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response) {
			if (error.response.status === 401) {
				// Handle unauthorized (e.g., redirect to login)
				console.error("Unauthorized, redirecting to login...");
				window.location.href = "/login";
			}
		}
		return Promise.reject(error);
	},
);

export default api;
