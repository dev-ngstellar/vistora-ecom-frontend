import { UserRole } from '@/types/auth.types';

export type AccountStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'DELETED';

export interface PermissionScope {
  read?: boolean;
  write?: boolean;
  delete?: boolean;
  export?: boolean;
}

export type ModuleName =
  | 'dashboard'
  | 'catalog'
  | 'sales'
  | 'customers'
  | 'content'
  | 'administration'
  | 'settings';

export type PermissionMatrix = Record<ModuleName, string[]>;

export interface Role {
  id: string;
  name: UserRole;
  description?: string | null;
  permissions?: PermissionMatrix | null;
  userCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StaffUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  status: AccountStatus;
  role: Role;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
  auditLogs?: Array<{
    id: string;
    module: string;
    action: string;
    createdAt: string;
  }>;
}

export interface AdminUserStats {
  totalUsers: number;
  activeUsers: number;
  superAdmins: number;
  managers: number;
  admins: number;
}

export interface RoleStats {
  totalRoles: number;
  totalUsers: number;
  roleDistribution: Array<{
    name: UserRole;
    count: number;
  }>;
}

export interface AdminPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
