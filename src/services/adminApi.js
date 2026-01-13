
import api from "./api"; // re-uses src/services/api.js

export const adminApi = {
  fetchUsers: (params = {}) => api.get("/admin/users", { params }),
  updateUserStatus: (userId, body) => api.patch(`/admin/users/${userId}`, body),
  fetchTransactions: (params = {}) => api.get("/admin/transactions", { params }),
  approveTransaction: (id) => api.post(`/admin/transactions/${id}/approve`),
  rejectTransaction: (id, reason) => api.post(`/admin/transactions/${id}/reject`, { reason }),
  fetchLogs: (params = {}) => api.get("/admin/logs", { params }),
};
