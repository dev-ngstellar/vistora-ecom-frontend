import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { Role, StaffUser } from '@/types/admin.types';
import { message } from 'antd';

export const adminKeys = {
  allUsers: ['admin', 'users'] as const,
  usersList: (params?: Record<string, any>) => [...adminKeys.allUsers, 'list', params] as const,
  userDetails: (id: string) => [...adminKeys.allUsers, 'details', id] as const,
  userStats: ['admin', 'users', 'stats'] as const,

  allRoles: ['admin', 'roles'] as const,
  rolesList: ['admin', 'roles', 'list'] as const,
  roleDetails: (id: string) => [...adminKeys.allRoles, 'details', id] as const,
  roleStats: ['admin', 'roles', 'stats'] as const,
};

// ==================== USERS HOOKS ====================
export const useAdminUsers = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: adminKeys.usersList(params),
    queryFn: () => adminService.getAdminUsers(params),
  });
};

export const useAdminUserDetails = (id: string) => {
  return useQuery({
    queryKey: adminKeys.userDetails(id),
    queryFn: () => adminService.getAdminUserById(id),
    enabled: Boolean(id),
  });
};

export const useAdminUserStats = () => {
  return useQuery({
    queryKey: adminKeys.userStats,
    queryFn: adminService.getUserStats,
  });
};

export const useAdminUserMutations = () => {
  const queryClient = useQueryClient();

  const createStaffUser = useMutation({
    mutationFn: (data: Partial<StaffUser> & { passwordRaw: string; roleName: string }) =>
      adminService.createStaffUser(data),
    onSuccess: () => {
      message.success('Staff user created successfully');
      queryClient.invalidateQueries({ queryKey: adminKeys.allUsers });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to create staff user');
    },
  });

  const updateStaffUser = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffUser> & { roleName?: string } }) =>
      adminService.updateStaffUser(id, data),
    onSuccess: (_, variables) => {
      message.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: adminKeys.allUsers });
      queryClient.invalidateQueries({ queryKey: adminKeys.userDetails(variables.id) });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update user');
    },
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminService.updateUserStatus(id, status),
    onSuccess: () => {
      message.success('Account status updated');
      queryClient.invalidateQueries({ queryKey: adminKeys.allUsers });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update status');
    },
  });

  const resetPassword = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      adminService.resetPassword(id, password),
    onSuccess: () => {
      message.success('User password reset successfully');
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to reset password');
    },
  });

  return { createStaffUser, updateStaffUser, toggleStatus, resetPassword };
};

// ==================== ROLES HOOKS ====================
export const useRoles = () => {
  return useQuery({
    queryKey: adminKeys.rolesList,
    queryFn: adminService.getRoles,
  });
};

export const useRoleDetails = (id: string) => {
  return useQuery({
    queryKey: adminKeys.roleDetails(id),
    queryFn: () => adminService.getRoleById(id),
    enabled: Boolean(id),
  });
};

export const useRoleStats = () => {
  return useQuery({
    queryKey: adminKeys.roleStats,
    queryFn: adminService.getRoleStats,
  });
};

export const useRoleMutations = () => {
  const queryClient = useQueryClient();

  const createRole = useMutation({
    mutationFn: (data: Partial<Role>) => adminService.createRole(data),
    onSuccess: () => {
      message.success('Role created successfully');
      queryClient.invalidateQueries({ queryKey: adminKeys.allRoles });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to create role');
    },
  });

  const updateRole = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { description?: string; permissions?: any } }) =>
      adminService.updateRole(id, data),
    onSuccess: (_, variables) => {
      message.success('Role permissions updated successfully');
      queryClient.invalidateQueries({ queryKey: adminKeys.allRoles });
      queryClient.invalidateQueries({ queryKey: adminKeys.roleDetails(variables.id) });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update role');
    },
  });

  return { createRole, updateRole };
};
