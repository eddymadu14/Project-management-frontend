
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";
import toast from "react-hot-toast";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast.success("Project deleted");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Delete failed");
      console.error("Delete error:", error.response?.data || error.message);
    },
  });
};