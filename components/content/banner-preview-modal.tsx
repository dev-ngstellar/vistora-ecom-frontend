'use client';

import React, { useState } from 'react';
import { Modal, Button, Radio } from 'antd';
import { Monitor, Smartphone, ExternalLink } from 'lucide-react';
import { Banner } from '@/types/content.types';

interface BannerPreviewModalProps {
  banner: Banner | null;
  open: boolean;
  onClose: () => void;
}

export const BannerPreviewModal: React.FC<BannerPreviewModalProps> = ({
  banner,
  open,
  onClose,
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  if (!banner) return null;

  const bgImage = device === 'mobile' && banner.mobileImageUrl ? banner.mobileImageUrl : banner.imageUrl;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose} className="bg-slate-900 font-bold">
          Close Preview
        </Button>,
      ]}
      width={device === 'desktop' ? 900 : 420}
      title={
        <div className="flex items-center justify-between pr-8">
          <span className="font-black text-slate-900 dark:text-white text-base">
            Banner Preview — {banner.title}
          </span>

          <Radio.Group value={device} onChange={(e) => setDevice(e.target.value)} size="small">
            <Radio.Button value="desktop">
              <span className="flex items-center gap-1.5 font-bold">
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </span>
            </Radio.Button>
            <Radio.Button value="mobile">
              <span className="flex items-center gap-1.5 font-bold">
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </span>
            </Radio.Button>
          </Radio.Group>
        </div>
      }
    >
      <div className="py-4">
        {/* Device Container Frame */}
        <div
          className={`mx-auto rounded-3xl overflow-hidden shadow-2xl relative border-4 border-slate-900 bg-slate-950 transition-all ${
            device === 'desktop' ? 'h-[380px] w-full' : 'h-[540px] w-[340px]'
          }`}
        >
          <img src={bgImage} alt={banner.title} className="w-full h-full object-cover opacity-80" />

          {/* Banner Hero Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-8 text-white">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-2.5 py-1 rounded-md w-fit mb-2 border border-indigo-800/50">
              {banner.position.replace(/_/g, ' ')}
            </span>

            <h2
              className={`font-black tracking-tight leading-tight ${
                device === 'desktop' ? 'text-3xl' : 'text-xl'
              }`}
            >
              {banner.title}
            </h2>

            {banner.subtitle && (
              <p
                className={`text-slate-300 font-medium mt-1 line-clamp-2 ${
                  device === 'desktop' ? 'text-sm' : 'text-xs'
                }`}
              >
                {banner.subtitle}
              </p>
            )}

            {banner.buttonText && (
              <button className="mt-4 px-6 py-2.5 bg-white text-slate-900 font-black rounded-2xl text-xs w-fit hover:bg-slate-100 flex items-center gap-1.5 shadow-lg">
                <span>{banner.buttonText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
