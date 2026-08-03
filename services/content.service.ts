import { apiClient } from '@/lib/axios';
import { ApiEnvelope } from '@/types/auth.types';
import { Banner, CMSPage, ContentPaginationMeta } from '@/types/content.types';

export const contentService = {
  // ==================== BANNERS ====================
  getBanners: async (params?: Record<string, any>) => {
    const res = await apiClient.get<ApiEnvelope<Banner[]>>('/banners', { params });
    return {
      banners: res.data.data,
      meta: res.data.meta as ContentPaginationMeta | undefined,
    };
  },

  getBannerById: async (id: string) => {
    const res = await apiClient.get<ApiEnvelope<Banner>>(`/banners/${id}`);
    return res.data.data;
  },

  createBanner: async (data: Partial<Banner>) => {
    const res = await apiClient.post<ApiEnvelope<Banner>>('/banners', data);
    return res.data.data;
  },

  updateBanner: async (id: string, data: Partial<Banner>) => {
    const res = await apiClient.put<ApiEnvelope<Banner>>(`/banners/${id}`, data);
    return res.data.data;
  },

  toggleBannerStatus: async (id: string, isActive: boolean) => {
    const res = await apiClient.patch<ApiEnvelope<Banner>>(`/banners/${id}/status`, { isActive });
    return res.data.data;
  },

  deleteBanner: async (id: string) => {
    const res = await apiClient.delete<ApiEnvelope<null>>(`/banners/${id}`);
    return res.data.data;
  },

  // ==================== CMS PAGES ====================
  getCMSPages: async (params?: Record<string, any>) => {
    const res = await apiClient.get<ApiEnvelope<CMSPage[]>>('/cms-pages', { params });
    return {
      pages: res.data.data,
      meta: res.data.meta as ContentPaginationMeta | undefined,
    };
  },

  getCMSPageById: async (id: string) => {
    const res = await apiClient.get<ApiEnvelope<CMSPage>>(`/cms-pages/${id}`);
    return res.data.data;
  },

  getPublicCMSPageBySlug: async (slug: string) => {
    const res = await apiClient.get<ApiEnvelope<CMSPage>>(`/cms-pages/public/${slug}`);
    return res.data.data;
  },

  createCMSPage: async (data: Partial<CMSPage>) => {
    const res = await apiClient.post<ApiEnvelope<CMSPage>>('/cms-pages', data);
    return res.data.data;
  },

  updateCMSPage: async (id: string, data: Partial<CMSPage>) => {
    const res = await apiClient.put<ApiEnvelope<CMSPage>>(`/cms-pages/${id}`, data);
    return res.data.data;
  },

  updateCMSPageStatus: async (id: string, status: string) => {
    const res = await apiClient.patch<ApiEnvelope<CMSPage>>(`/cms-pages/${id}/status`, { status });
    return res.data.data;
  },

  deleteCMSPage: async (id: string) => {
    const res = await apiClient.delete<ApiEnvelope<null>>(`/cms-pages/${id}`);
    return res.data.data;
  },
};
