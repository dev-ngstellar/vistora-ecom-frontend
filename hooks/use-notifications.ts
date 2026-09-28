'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService, AppNotification } from '@/services/notification.service';
import { useAuth } from '@/context/auth-context';

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (limit?: number) => ['notifications', 'list', limit] as const,
  count: ['notifications', 'count'] as const,
};

export const useNotifications = (limit = 20) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isStaff = user && ['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(user.role);

  const notificationsQuery = useQuery({
    queryKey: notificationKeys.list(limit),
    queryFn: () => notificationService.getNotifications(limit),
    enabled: Boolean(user),
    refetchInterval: isStaff ? 8000 : 15000, // Poll every 8s for staff to get instant real-time order alerts
    refetchOnWindowFocus: true,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const previousData = queryClient.getQueryData<{ notifications: AppNotification[]; meta?: any }>(
        notificationKeys.list(limit),
      );

      if (previousData) {
        queryClient.setQueryData(notificationKeys.list(limit), {
          ...previousData,
          notifications: previousData.notifications.map((n) =>
            n.id === id ? { ...n, status: 'READ' as const, readAt: new Date().toISOString() } : n,
          ),
          meta: previousData.meta
            ? { ...previousData.meta, unreadCount: Math.max(0, (previousData.meta.unreadCount || 1) - 1) }
            : undefined,
        });
      }

      return { previousData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const previousData = queryClient.getQueryData<{ notifications: AppNotification[]; meta?: any }>(
        notificationKeys.list(limit),
      );

      if (previousData) {
        queryClient.setQueryData(notificationKeys.list(limit), {
          ...previousData,
          notifications: previousData.notifications.map((n) => ({
            ...n,
            status: 'READ' as const,
            readAt: new Date().toISOString(),
          })),
          meta: previousData.meta ? { ...previousData.meta, unreadCount: 0 } : undefined,
        });
      }

      return { previousData };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const notifications = notificationsQuery.data?.notifications || [];
  const unreadCount =
    notificationsQuery.data?.meta?.unreadCount !== undefined
      ? notificationsQuery.data.meta.unreadCount
      : notifications.filter((n) => n.status === 'UNREAD').length;

  return {
    notifications,
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    isRefetching: notificationsQuery.isRefetching,
    refetch: notificationsQuery.refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllRead: markAllAsReadMutation.isPending,
  };
};
