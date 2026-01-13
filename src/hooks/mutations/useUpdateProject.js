
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/apiClient";

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data } = await apiClient.put(`/projects/${id}`, updates);
      return data;
    },
    onSuccess: (_, variables) => {
      // Revalidate project list or a single project
      queryClient.invalidateQueries(["projects"]);
      queryClient.invalidateQueries(["project", variables.id]);
    },
    onError: (error) => {
      console.error("Update failed:", error.response?.data || error.message);
    },
  });
};
