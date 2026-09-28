import { apiClient } from '@/lib/axios';
import { ApiEnvelope } from '@/types/auth.types';

export interface AppNotification {
  id: string;
  userId: string;
  type: 'ORDER' | 'PAYMENT' | 'SHIPPING' | 'PROMOTION' | 'SYSTEM' | string;
  title: string;
  message: string;
  status: 'UNREAD' | 'READ';
  actionUrl: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationMeta {
  unreadCount: number;
  totalCount: number;
}

export const notificationService = {
  getNotifications: async (limit = 20): Promise<{ notifications: AppNotification[]; meta?: NotificationMeta }> => {
    const res = await apiClient.get<ApiEnvelope<AppNotification[]>>('/notifications', { params: { limit } });
    return {
      notifications: res.data.data || [],
      meta: res.data.meta as NotificationMeta | undefined,
    };
  },

  getNotificationCount: async () => {
    const res = await apiClient.get<ApiEnvelope<{ unreadCount: number; totalCount: number }>>('/notifications/count');
    return res.data.data;
  },

  markAsRead: async (id: string) => {
    const res = await apiClient.patch<ApiEnvelope<null>>(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await apiClient.patch<ApiEnvelope<null>>('/notifications/read-all');
    return res.data;
  },
};
