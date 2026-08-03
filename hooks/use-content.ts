import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contentService } from '@/services/content.service';
import { Banner, CMSPage } from '@/types/content.types';
import { message } from 'antd';

export const contentKeys = {
  allBanners: ['content', 'banners'] as const,
  bannersList: (params?: Record<string, any>) => [...contentKeys.allBanners, 'list', params] as const,
  bannerDetails: (id: string) => [...contentKeys.allBanners, 'details', id] as const,

  allCMSPages: ['content', 'cms'] as const,
  cmsList: (params?: Record<string, any>) => [...contentKeys.allCMSPages, 'list', params] as const,
  cmsDetails: (id: string) => [...contentKeys.allCMSPages, 'details', id] as const,
  cmsPublic: (slug: string) => [...contentKeys.allCMSPages, 'public', slug] as const,
};

// ==================== BANNERS HOOKS ====================
export const useBanners = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: contentKeys.bannersList(params),
    queryFn: () => contentService.getBanners(params),
  });
};

export const useBannerDetails = (id: string) => {
  return useQuery({
    queryKey: contentKeys.bannerDetails(id),
    queryFn: () => contentService.getBannerById(id),
    enabled: Boolean(id),
  });
};

export const useBannerMutations = () => {
  const queryClient = useQueryClient();

  const createBanner = useMutation({
    mutationFn: (data: Partial<Banner>) => contentService.createBanner(data),
    onSuccess: () => {
      message.success('Banner created successfully');
      queryClient.invalidateQueries({ queryKey: contentKeys.allBanners });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to create banner');
    },
  });

  const updateBanner = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Banner> }) =>
      contentService.updateBanner(id, data),
    onSuccess: (_, variables) => {
      message.success('Banner updated successfully');
      queryClient.invalidateQueries({ queryKey: contentKeys.allBanners });
      queryClient.invalidateQueries({ queryKey: contentKeys.bannerDetails(variables.id) });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update banner');
    },
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      contentService.toggleBannerStatus(id, isActive),
    onSuccess: () => {
      message.success('Banner status updated');
      queryClient.invalidateQueries({ queryKey: contentKeys.allBanners });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update status');
    },
  });

  const deleteBanner = useMutation({
    mutationFn: (id: string) => contentService.deleteBanner(id),
    onSuccess: () => {
      message.success('Banner deleted successfully');
      queryClient.invalidateQueries({ queryKey: contentKeys.allBanners });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to delete banner');
    },
  });

  return { createBanner, updateBanner, toggleStatus, deleteBanner };
};

// ==================== CMS HOOKS ====================
export const useCMSPages = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: contentKeys.cmsList(params),
    queryFn: () => contentService.getCMSPages(params),
  });
};

export const useCMSPageDetails = (id: string) => {
  return useQuery({
    queryKey: contentKeys.cmsDetails(id),
    queryFn: () => contentService.getCMSPageById(id),
    enabled: Boolean(id),
  });
};

export const usePublicCMSPage = (slug: string) => {
  return useQuery({
    queryKey: contentKeys.cmsPublic(slug),
    queryFn: () => contentService.getPublicCMSPageBySlug(slug),
    enabled: Boolean(slug),
  });
};

export const useCMSMutations = () => {
  const queryClient = useQueryClient();

  const createPage = useMutation({
    mutationFn: (data: Partial<CMSPage>) => contentService.createCMSPage(data),
    onSuccess: () => {
      message.success('CMS Page created successfully');
      queryClient.invalidateQueries({ queryKey: contentKeys.allCMSPages });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to create CMS page');
    },
  });

  const updatePage = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CMSPage> }) =>
      contentService.updateCMSPage(id, data),
    onSuccess: (_, variables) => {
      message.success('CMS Page updated successfully');
      queryClient.invalidateQueries({ queryKey: contentKeys.allCMSPages });
      queryClient.invalidateQueries({ queryKey: contentKeys.cmsDetails(variables.id) });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update CMS page');
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      contentService.updateCMSPageStatus(id, status),
    onSuccess: () => {
      message.success('Page publication status updated');
      queryClient.invalidateQueries({ queryKey: contentKeys.allCMSPages });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update status');
    },
  });

  const deletePage = useMutation({
    mutationFn: (id: string) => contentService.deleteCMSPage(id),
    onSuccess: () => {
      message.success('CMS Page deleted successfully');
      queryClient.invalidateQueries({ queryKey: contentKeys.allCMSPages });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to delete CMS page');
    },
  });

  return { createPage, updatePage, updateStatus, deletePage };
};
