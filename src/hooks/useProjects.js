import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await apiClient.get("/projects");
      return data;
    },
  });
};

