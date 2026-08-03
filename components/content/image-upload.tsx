'use client';

import React, { useState } from 'react';
import { Input, Button, Modal } from 'antd';
import { Upload, Image as ImageIcon, Link as LinkIcon, Sparkles } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string) => void;
  label?: string;
  recommendedAspect?: string;
}

const PRESET_IMAGES = [
  { label: 'Couture Silk Gown', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop' },
  { label: 'Tailored Suit', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&auto=format&fit=crop' },
  { label: 'Luxury Handbag', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1600&auto=format&fit=crop' },
  { label: 'Jewelry & Accessories', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&auto=format&fit=crop' },
  { label: 'Runway Fashion', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&auto=format&fit=crop' },
];

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = '',
  onChange,
  label = 'Banner Image URL',
  recommendedAspect = '16:9 (Desktop 1920x1080)',
}) => {
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  const handleSelectPreset = (url: string) => {
    if (onChange) onChange(url);
    setIsPresetsOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
        <span className="text-[11px] text-slate-400 font-medium">Recommended: {recommendedAspect}</span>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="https://images.unsplash.com/..."
          prefix={<LinkIcon className="w-4 h-4 text-slate-400 mr-1" />}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="rounded-2xl text-xs"
        />

        <Button
          type="default"
          icon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
          onClick={() => setIsPresetsOpen(true)}
          className="rounded-2xl text-xs font-bold whitespace-nowrap"
        >
          Presets
        </Button>
      </div>

      {/* Image Preview Box */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 h-36">
          <img src={value} alt="Banner Preview" className="w-full h-full object-cover" />
        </div>
      ) : (
        <div
          onClick={() => setIsPresetsOpen(true)}
          className="cursor-pointer border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 p-6 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-800/40 transition-colors"
        >
          <ImageIcon className="w-8 h-8 mx-auto text-slate-400 mb-1" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Click to Select Luxury Presets or Paste URL</p>
          <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WebP supported</p>
        </div>
      )}

      {/* Preset Modal */}
      <Modal
        title="Select High-Resolution Luxury Fashion Asset"
        open={isPresetsOpen}
        onCancel={() => setIsPresetsOpen(false)}
        footer={null}
        width={600}
      >
        <div className="grid grid-cols-2 gap-3 py-4">
          {PRESET_IMAGES.map((img) => (
            <div
              key={img.url}
              onClick={() => handleSelectPreset(img.url)}
              className="cursor-pointer group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:ring-2 hover:ring-indigo-600 transition-all h-28"
            >
              <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-white text-xs font-bold">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
