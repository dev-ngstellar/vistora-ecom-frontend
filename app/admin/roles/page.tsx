'use client';

import React, { useState } from 'react';
import { useRoleDetails, useRoleMutations, useRoles, useRoleStats } from '@/hooks/use-admin';
import { Role } from '@/types/admin.types';
import { SalesStatCard } from '@/components/sales/sales-stat-card';
import { PermissionMatrix } from '@/components/admin/permission-matrix';
import {
  Table,
  Button,
  Modal,
  Drawer,
  Form,
  Input,
  Tag,
  Dropdown,
  Card,
  Space,
  Avatar,
} from 'antd';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Users,
  Lock,
  MoreHorizontal,
  Eye,
  Key,
  Shield,
  Layers,
  CheckCircle,
} from 'lucide-react';
import dayjs from 'dayjs';

export default function AdminRolesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [form] = Form.useForm();

  const { data: roles, isLoading: isRolesLoading } = useRoles();
  const { data: statsData, isLoading: isStatsLoading } = useRoleStats();
  const { createRole, updateRole } = useRoleMutations();

  const handleOpenDrawer = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        permissions: role.permissions || {
          dashboard: ['read'],
          catalog: ['read'],
          sales: ['read'],
          customers: ['read'],
          content: ['read'],
          administration: ['read'],
          settings: ['read'],
        },
      });
    } else {
      setEditingRole(null);
      form.resetFields();
      form.setFieldsValue({
        permissions: {
          dashboard: ['read'],
          catalog: ['read'],
          sales: ['read'],
          customers: ['read'],
          content: ['read'],
          administration: ['read'],
          settings: ['read'],
        },
      });
    }
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (values: any) => {
    if (editingRole) {
      await updateRole.mutateAsync({
        id: editingRole.id,
        data: {
          description: values.description,
          permissions: values.permissions,
        },
      });
    } else {
      await createRole.mutateAsync(values);
    }
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'SUPER_ADMIN':
        return <Tag color="purple" className="font-extrabold text-xs rounded-lg px-2.5 py-0.5">Super Admin</Tag>;
      case 'ADMIN':
        return <Tag color="indigo" className="font-extrabold text-xs rounded-lg px-2.5 py-0.5">Store Admin</Tag>;
      case 'MANAGER':
        return <Tag color="blue" className="font-extrabold text-xs rounded-lg px-2.5 py-0.5">Store Manager</Tag>;
      default:
        return <Tag color="default" className="font-bold text-xs rounded-lg px-2.5 py-0.5">{roleName}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Role Name & Description',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Role) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
                {name}
              </span>
              {getRoleBadge(name)}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">{record.description}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Assigned Staff Users',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => (
        <span className="font-black text-slate-900 dark:text-white text-xs">
          {count || 0} user(s)
        </span>
      ),
    },
    {
      title: 'Configured Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (matrix: any) => {
        if (!matrix) return <span className="text-slate-400 text-xs">Default Scopes</span>;
        const count = Object.values(matrix).reduce((acc: number, arr: any) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
        return <Tag color="blue" className="font-bold text-xs rounded-md">{count} Scopes Configured</Tag>;
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span className="text-xs text-slate-500">{dayjs(date).format('MMM D, YYYY')}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Role) => (
        <Button
          type="default"
          icon={<Edit className="w-4 h-4 text-indigo-600" />}
          onClick={() => handleOpenDrawer(record)}
          className="rounded-xl font-bold text-xs"
        >
          Edit Permission Matrix
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Roles & Permissions</h1>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenDrawer()}
          className="rounded-2xl font-bold bg-slate-900 dark:bg-indigo-600"
        >
          Create New Role
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SalesStatCard
          title="Configured System Roles"
          value={statsData?.totalRoles || roles?.length || 0}
          icon={ShieldCheck}
          colorScheme="indigo"
        />
        <SalesStatCard
          title="Assigned Staff Accounts"
          value={statsData?.totalUsers || 0}
          icon={Users}
          colorScheme="emerald"
        />
        <SalesStatCard
          title="Security Modules Guarded"
          value="7 Modules"
          icon={Lock}
          colorScheme="purple"
        />
      </div>

      {/* Roles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles?.map((role) => (
          <div
            key={role.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                {getRoleBadge(role.name)}
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {role.userCount || 0} user(s)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-4">
                {role.description || 'System access control role.'}
              </p>
            </div>

            <Button
              type="dashed"
              icon={<Edit className="w-4 h-4 text-indigo-600" />}
              onClick={() => handleOpenDrawer(role)}
              className="w-full rounded-2xl font-bold text-xs border-slate-300 dark:border-slate-700"
            >
              Edit Matrix & Access
            </Button>
          </div>
        ))}
      </div>

      {/* Roles Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="font-black text-slate-900 dark:text-white text-base mb-4">Role Audit Table</h3>
        <Table
          dataSource={roles || []}
          columns={columns}
          rowKey="id"
          loading={isRolesLoading}
          pagination={false}
        />
      </div>

      {/* Create / Edit Role Drawer */}
      <Drawer
        title={
          <span className="font-black text-slate-900 dark:text-white text-base">
            {editingRole ? `Permission Matrix — ${editingRole.name}` : 'Create New System Role'}
          </span>
        }
        placement="right"
        width={780}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={createRole.isPending || updateRole.isPending}
            className="bg-slate-900 dark:bg-indigo-600 font-bold rounded-xl"
          >
            Save Role Permissions
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="space-y-6 pt-2">
          {!editingRole && (
            <Form.Item
              name="name"
              label="Role Name Code"
              rules={[{ required: true, message: 'Role name is required' }]}
            >
              <Input placeholder="e.g. AUDITOR or SUPPORT_AGENT" className="uppercase font-mono" />
            </Form.Item>
          )}

          <Form.Item name="description" label="Role Description">
            <Input.TextArea rows={2} placeholder="Describe the responsibilities and scope of this role..." />
          </Form.Item>

          <Form.Item name="permissions" label="Module Permission Matrix">
            <PermissionMatrix
              value={form.getFieldValue('permissions')}
              onChange={(matrix) => form.setFieldValue('permissions', matrix)}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
