
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProject) => {
      const { data } = await apiClient.post("/projects", newProject);
      return data;
    },
    onSuccess: () => {
      // Refresh project list automatically
      queryClient.invalidateQueries(["projects"]);
    },
    onError: (error) => {
      console.error("Create project failed:", error.response?.data || error.message);
    },
  });
};