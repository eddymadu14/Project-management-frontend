import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import apiClient from "../../api/apiClient";

export const useLogout = () => {
  const { logout, token } = useAuth();

  return useMutation({
    mutationFn: async () => {
      // Only call backend if a token exists
      if (token) {
        try {
          await apiClient.post("/users/logout");
        } catch (err) {
          // silent fail if backend unreachable, user still logged out
          console.warn("Backend logout failed:", err.message);
        }
      }

      // Always clear local session
      logout();
    },
    onSuccess: () => {
      toast.success("Logged out successfully");
    },
    onError: (error) => {
      console.error("Logout error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Logout failed locally");
    },
  });
};