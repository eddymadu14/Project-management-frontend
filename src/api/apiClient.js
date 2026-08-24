
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://your-backend-api.com/api", // change this to your backend URL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;
