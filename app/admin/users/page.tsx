'use client';

import React, { useState } from 'react';
import { useAdminUserMutations, useAdminUsers, useAdminUserStats } from '@/hooks/use-admin';
import { StaffUser } from '@/types/admin.types';
import { UserRole } from '@/types/auth.types';
import { SalesStatCard } from '@/components/sales/sales-stat-card';
import { StatusBadge } from '@/components/sales/status-badge';
import { ResetPasswordModal } from '@/components/admin/reset-password-modal';
import { UserActivityTimeline } from '@/components/admin/user-activity-timeline';
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Drawer,
  Form,
  Tag,
  Dropdown,
  Avatar,
  Space,
} from 'antd';
import {
  Users,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Search,
  Plus,
  Edit,
  Eye,
  KeyRound,
  MoreHorizontal,
  UserX,
  Lock,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';
import dayjs from 'dayjs';

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffUser | null>(null);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const [selectedUserForProfile, setSelectedUserForProfile] = useState<StaffUser | null>(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  const [resetPassUserId, setResetPassUserId] = useState<string | null>(null);
  const [resetPassUserName, setResetPassUserName] = useState<string>('');
  const [isResetPassOpen, setIsResetPassOpen] = useState(false);

  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data: statsData, isLoading: isStatsLoading } = useAdminUserStats();
  const { data: usersData, isLoading: isUsersLoading } = useAdminUsers({
    search: search || undefined,
    roleName: roleFilter,
    status: statusFilter,
    page,
    limit,
  });

  const { createStaffUser, updateStaffUser, toggleStatus, resetPassword } = useAdminUserMutations();

  const handleOpenCreateModal = () => {
    createForm.resetFields();
    createForm.setFieldsValue({ roleName: 'MANAGER' });
    setIsCreateModalOpen(true);
  };

  const handleOpenEditDrawer = (user: StaffUser) => {
    setEditingUser(user);
    editForm.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      roleName: user.role?.name || 'MANAGER',
    });
    setIsEditDrawerOpen(true);
  };

  const handleOpenProfileDrawer = (user: StaffUser) => {
    setSelectedUserForProfile(user);
    setIsProfileDrawerOpen(true);
  };

  const handleOpenResetPassword = (user: StaffUser) => {
    setResetPassUserId(user.id);
    setResetPassUserName(user.fullName);
    setIsResetPassOpen(true);
  };

  const handleCreateSubmit = async (values: any) => {
    await createStaffUser.mutateAsync(values);
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const handleEditSubmit = async (values: any) => {
    if (!editingUser) return;
    await updateStaffUser.mutateAsync({
      id: editingUser.id,
      data: values,
    });
    setIsEditDrawerOpen(false);
  };

  const handleToggleStatus = (user: StaffUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    Modal.confirm({
      title: `${newStatus === 'ACTIVE' ? 'Activate' : 'Suspend'} Account?`,
      content: `Are you sure you want to change access status for ${user.fullName}?`,
      okText: 'Yes, Confirm',
      okType: newStatus === 'SUSPENDED' ? 'danger' : 'primary',
      onOk: () => toggleStatus.mutate({ id: user.id, status: newStatus }),
    });
  };

  const handleConfirmResetPassword = async (id: string, newPass: string) => {
    await resetPassword.mutateAsync({ id, password: newPass });
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'SUPER_ADMIN':
        return <Tag color="purple" className="font-extrabold text-[11px] rounded-lg">Super Admin</Tag>;
      case 'ADMIN':
        return <Tag color="indigo" className="font-extrabold text-[11px] rounded-lg">Store Admin</Tag>;
      case 'MANAGER':
        return <Tag color="blue" className="font-extrabold text-[11px] rounded-lg">Store Manager</Tag>;
      default:
        return <Tag color="default" className="font-bold text-[11px] rounded-lg">{roleName}</Tag>;
    }
  };

  const columns = [
    {
      title: 'User Profile',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_: any, record: StaffUser) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-slate-900 text-white font-bold uppercase">
            {record.firstName[0]}
          </Avatar>
          <div>
            <button
              onClick={() => handleOpenProfileDrawer(record)}
              className="font-bold text-slate-900 dark:text-white hover:underline text-left block text-xs"
            >
              {record.fullName}
            </button>
            <span className="text-[11px] text-slate-500 font-medium">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Assigned Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: any) => getRoleBadge(role?.name || 'STAFF'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} category="account" />,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string | null) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {phone || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Last Active Session',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      render: (date: string | null) => (
        <span className="text-xs text-slate-500 font-medium">
          {date ? dayjs(date).format('MMM D, YYYY • h:mm A') : 'Never'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: StaffUser) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'profile',
                icon: <Eye className="w-4 h-4 text-indigo-600" />,
                label: 'View Profile & Activity',
                onClick: () => handleOpenProfileDrawer(record),
              },
              {
                key: 'edit',
                icon: <Edit className="w-4 h-4 text-emerald-600" />,
                label: 'Edit User Info',
                onClick: () => handleOpenEditDrawer(record),
              },
              {
                key: 'reset_pass',
                icon: <KeyRound className="w-4 h-4 text-amber-600" />,
                label: 'Reset Password',
                onClick: () => handleOpenResetPassword(record),
              },
              { type: 'divider' },
              {
                key: 'toggle_status',
                icon: record.status === 'ACTIVE' ? <ShieldAlert className="w-4 h-4 text-rose-600" /> : <ShieldCheck className="w-4 h-4 text-emerald-600" />,
                label: record.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account',
                onClick: () => handleToggleStatus(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreHorizontal className="w-4 h-4" />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Staff Administration & Access Control</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">User Management</h1>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenCreateModal}
          className="rounded-2xl font-bold bg-slate-900 dark:bg-indigo-600"
        >
          Create Staff User
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SalesStatCard
          title="Total Registered Users"
          value={statsData?.totalUsers || 0}
          icon={Users}
          colorScheme="indigo"
        />
        <SalesStatCard
          title="Active Accounts"
          value={statsData?.activeUsers || 0}
          icon={UserCheck}
          colorScheme="emerald"
        />
        <SalesStatCard
          title="Super Administrators"
          value={statsData?.superAdmins || 0}
          icon={Lock}
          colorScheme="purple"
        />
        <SalesStatCard
          title="Store Managers"
          value={statsData?.managers || 0}
          icon={ShieldCheck}
          colorScheme="amber"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by staff name, email or phone..."
          prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-2xl"
          allowClear
        />

        <Select
          placeholder="Filter Role"
          value={roleFilter}
          onChange={(val) => setRoleFilter(val)}
          className="w-44"
          allowClear
        >
          <Select.Option value="SUPER_ADMIN">Super Admin</Select.Option>
          <Select.Option value="ADMIN">Admin</Select.Option>
          <Select.Option value="MANAGER">Store Manager</Select.Option>
          <Select.Option value="CUSTOMER">Customer</Select.Option>
        </Select>

        <Select
          placeholder="Account Status"
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          className="w-36"
          allowClear
        >
          <Select.Option value="ACTIVE">Active</Select.Option>
          <Select.Option value="SUSPENDED">Suspended</Select.Option>
          <Select.Option value="PENDING">Pending</Select.Option>
        </Select>
      </div>

      {/* Users Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <Table
          dataSource={usersData?.users || []}
          columns={columns}
          rowKey="id"
          loading={isUsersLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: usersData?.meta?.total || 0,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
            showSizeChanger: true,
          }}
        />
      </div>

      {/* Create Staff User Modal */}
      <Modal
        title="Create New Staff User Account"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={() => createForm.submit()}
        confirmLoading={createStaffUser.isPending}
      >
        <Form form={createForm} layout="vertical" onFinish={handleCreateSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true, message: 'First name is required' }]}
            >
              <Input placeholder="John" />
            </Form.Item>

            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true, message: 'Last name is required' }]}
            >
              <Input placeholder="Doe" />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Valid email required' },
            ]}
          >
            <Input placeholder="john.doe@vistoracommerce.com" />
          </Form.Item>

          <Form.Item
            name="passwordRaw"
            label="Password"
            rules={[{ required: true, message: 'Password is required (min 8 chars)' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="phone" label="Phone Number">
              <Input placeholder="+91 98765 43210" />
            </Form.Item>

            <Form.Item name="roleName" label="Assigned Role" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="SUPER_ADMIN">Super Administrator</Select.Option>
                <Select.Option value="ADMIN">Store Admin</Select.Option>
                <Select.Option value="MANAGER">Store Manager</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Edit User Drawer */}
      <Drawer
        title="Edit Staff Account Details"
        placement="right"
        width={500}
        onClose={() => setIsEditDrawerOpen(false)}
        open={isEditDrawerOpen}
        extra={
          <Button
            type="primary"
            onClick={() => editForm.submit()}
            loading={updateStaffUser.isPending}
            className="bg-slate-900 dark:bg-indigo-600 font-bold rounded-xl"
          >
            Update User
          </Button>
        }
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit} className="pt-2">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </div>

          <Form.Item name="phone" label="Phone Number">
            <Input />
          </Form.Item>

          <Form.Item name="roleName" label="Assigned Role" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="SUPER_ADMIN">Super Administrator</Select.Option>
              <Select.Option value="ADMIN">Store Admin</Select.Option>
              <Select.Option value="MANAGER">Store Manager</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>

      {/* User Profile & Activity Drawer */}
      <Drawer
        title={
          selectedUserForProfile ? (
            <div className="flex items-center gap-3">
              <Avatar className="bg-slate-900 text-white font-bold">
                {selectedUserForProfile.firstName[0]}
              </Avatar>
              <div>
                <span className="font-black text-slate-900 dark:text-white block text-sm">
                  {selectedUserForProfile.fullName}
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {selectedUserForProfile.email}
                </span>
              </div>
            </div>
          ) : (
            'Staff Profile'
          )
        }
        placement="right"
        width={580}
        onClose={() => setIsProfileDrawerOpen(false)}
        open={isProfileDrawerOpen}
      >
        {selectedUserForProfile && (
          <div className="space-y-6 text-xs">
            {/* Meta Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Role & Access</span>
                {getRoleBadge(selectedUserForProfile.role?.name || 'STAFF')}
              </div>
              <p>
                <span className="text-slate-400">Account Status: </span>
                <StatusBadge status={selectedUserForProfile.status} category="account" />
              </p>
              <p>
                <span className="text-slate-400">Registered Date: </span>
                <span className="font-semibold">{dayjs(selectedUserForProfile.createdAt).format('MMMM D, YYYY')}</span>
              </p>
            </div>

            {/* Audit & Activity */}
            <UserActivityTimeline
              auditLogs={selectedUserForProfile.auditLogs}
              lastLoginAt={selectedUserForProfile.lastLoginAt}
            />
          </div>
        )}
      </Drawer>

      {/* Reset Password Modal */}
      <ResetPasswordModal
        userId={resetPassUserId}
        userName={resetPassUserName}
        open={isResetPassOpen}
        onClose={() => setIsResetPassOpen(false)}
        onConfirmReset={handleConfirmResetPassword}
      />
    </div>
  );
}
