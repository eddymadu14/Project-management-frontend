
import axios from "axios";

import { useAuth } from "../context/AuthContext"; // or useAuth hook if possible

// Create a reusable Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api/", // your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});


// // Add token automatically for each request
// api.interceptors.request.use((config) => {
//   const token = useAuth(); // or localStorage.getItem("token")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });


export default api;
