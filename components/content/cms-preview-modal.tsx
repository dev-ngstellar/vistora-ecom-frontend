'use client';

import React from 'react';
import { Modal, Button, Tabs, Tag } from 'antd';
import { FileText, Globe, Search } from 'lucide-react';
import { CMSPage } from '@/types/content.types';
import dayjs from 'dayjs';

interface CMSPreviewModalProps {
  page: CMSPage | null;
  open: boolean;
  onClose: () => void;
}

export const CMSPreviewModal: React.FC<CMSPreviewModalProps> = ({ page, open, onClose }) => {
  if (!page) return null;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose} className="bg-slate-900 font-bold">
          Close Preview
        </Button>,
      ]}
      width={780}
      title={
        <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-base">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>Live CMS Page Preview — {page.title}</span>
        </div>
      }
    >
      <div className="py-2">
        <Tabs
          defaultActiveKey="live"
          items={[
            {
              key: 'live',
              label: (
                <span className="flex items-center gap-1.5 font-bold">
                  <Globe className="w-4 h-4" /> Live Webpage Render
                </span>
              ),
              children: (
                <div className="py-4 space-y-6 text-xs text-slate-800 dark:text-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                      <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                        https://vistoracommerce.com/{page.slug}
                      </span>
                      <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                        {page.title}
                      </h1>
                    </div>

                    <Tag
                      color={page.status === 'PUBLISHED' ? 'green' : 'orange'}
                      className="font-bold px-3 py-1 text-xs rounded-lg"
                    >
                      {page.status}
                    </Tag>
                  </div>

                  {/* Formatted Article Body */}
                  <div
                    className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-normal"
                    dangerouslySetInnerHTML={{ __html: page.content || '<p>No page content.</p>' }}
                  />

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Vistora Commerce Customer Editorial</span>
                    <span>Last Updated: {dayjs(page.updatedAt).format('MMMM D, YYYY')}</span>
                  </div>
                </div>
              ),
            },
            {
              key: 'seo',
              label: (
                <span className="flex items-center gap-1.5 font-bold">
                  <Search className="w-4 h-4" /> Google SERP Snippet
                </span>
              ),
              children: (
                <div className="py-6 space-y-4">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Search Engine Result Preview</h4>

                  {/* Google Card Simulation */}
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400 block font-normal">
                      https://vistoracommerce.com › {page.slug}
                    </span>
                    <h3 className="text-indigo-700 dark:text-indigo-400 font-bold text-base hover:underline cursor-pointer">
                      {page.metaTitle || page.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-normal line-clamp-2">
                      {page.metaDescription || 'No meta description configured for search engine indexing.'}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                    <p>
                      <span className="font-bold text-slate-900 dark:text-white">URL Slug: </span>
                      <span className="font-mono text-indigo-600">/{page.slug}</span>
                    </p>
                    <p>
                      <span className="font-bold text-slate-900 dark:text-white">Meta Keywords: </span>
                      <span className="text-slate-600 dark:text-slate-300">{page.metaKeywords || 'None'}</span>
                    </p>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </div>
    </Modal>
  );
};
