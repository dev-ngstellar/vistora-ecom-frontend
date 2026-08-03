import { apiClient } from '@/lib/axios';
import { ApiEnvelope } from '@/types/auth.types';
import {
  AdminPaginationMeta,
  AdminUserStats,
  Role,
  RoleStats,
  StaffUser,
} from '@/types/admin.types';

export const adminService = {
  // ==================== STAFF USERS ====================
  getAdminUsers: async (params?: Record<string, any>) => {
    const res = await apiClient.get<ApiEnvelope<StaffUser[]>>('/admin/users', { params });
    return {
      users: res.data.data,
      meta: res.data.meta as AdminPaginationMeta | undefined,
    };
  },

  getAdminUserById: async (id: string) => {
    const res = await apiClient.get<ApiEnvelope<StaffUser>>(`/admin/users/${id}`);
    return res.data.data;
  },

  createStaffUser: async (data: Partial<StaffUser> & { passwordRaw: string; roleName: string }) => {
    const res = await apiClient.post<ApiEnvelope<StaffUser>>('/admin/users', data);
    return res.data.data;
  },

  updateStaffUser: async (id: string, data: Partial<StaffUser> & { roleName?: string }) => {
    const res = await apiClient.put<ApiEnvelope<StaffUser>>(`/admin/users/${id}`, data);
    return res.data.data;
  },

  updateUserStatus: async (id: string, status: string) => {
    const res = await apiClient.patch<ApiEnvelope<StaffUser>>(`/admin/users/${id}/status`, { status });
    return res.data.data;
  },

  resetPassword: async (id: string, password: string) => {
    const res = await apiClient.post<ApiEnvelope<null>>(`/admin/users/${id}/reset-password`, { password });
    return res.data.data;
  },

  getUserStats: async () => {
    const res = await apiClient.get<ApiEnvelope<AdminUserStats>>('/admin/users/stats');
    return res.data.data;
  },

  // ==================== ROLES & PERMISSIONS ====================
  getRoles: async () => {
    const res = await apiClient.get<ApiEnvelope<Role[]>>('/roles');
    return res.data.data;
  },

  getRoleById: async (id: string) => {
    const res = await apiClient.get<ApiEnvelope<Role>>(`/roles/${id}`);
    return res.data.data;
  },

  createRole: async (data: Partial<Role>) => {
    const res = await apiClient.post<ApiEnvelope<Role>>('/roles', data);
    return res.data.data;
  },

  updateRole: async (id: string, data: { description?: string; permissions?: any }) => {
    const res = await apiClient.put<ApiEnvelope<Role>>(`/roles/${id}`, data);
    return res.data.data;
  },

  getRoleStats: async () => {
    const res = await apiClient.get<ApiEnvelope<RoleStats>>('/roles/stats');
    return res.data.data;
  },
};
