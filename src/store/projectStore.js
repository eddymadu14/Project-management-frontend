
import { create } from "zustand";
import api from "../services/api";

export const useProjectStore = create((set) => ({
  projects: [],
  tasks: [],
  loading: false,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/projects");
      set({ projects: data });
    } finally {
      set({ loading: false });
    }
  },

  fetchTasks: async (projectId) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/tasks?projectId=${projectId}`);
      set({ tasks: data });
    } finally {
      set({ loading: false });
    }
  },
}));

