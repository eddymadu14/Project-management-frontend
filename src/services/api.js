
import axios from "axios";


// Create a reusable Axios instance
const api = axios.create({
  baseURL: `{import.meta.env.VITE_API_URL}`/api, // your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: handle global errors in one place
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem("token");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
