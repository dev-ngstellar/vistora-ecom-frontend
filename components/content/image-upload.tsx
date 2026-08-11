'use client';

import React, { useState, useRef } from 'react';
import { Input, Button, Modal } from 'antd';
import { Upload, Image as ImageIcon, Link as LinkIcon, Sparkles, FolderOpen, Loader2, X } from 'lucide-react';
import { uploadService } from '@/services/catalogue.service';
import toast from 'react-hot-toast';

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
  label = 'Banner Image Asset',
  recommendedAspect = '16:9 (Desktop 1920x1080)',
}) => {
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | File[] | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPG, PNG, WEBP, SVG)');
      return;
    }

    setIsUploading(true);
    try {
      const uploaded = await uploadService.uploadSingle(file);
      if (onChange) onChange(uploaded.url);
      toast.success('Image uploaded successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectPreset = (url: string) => {
    if (onChange) onChange(url);
    setIsPresetsOpen(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-3">
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
        <span className="text-[11px] text-slate-400 font-medium">Recommended: {recommendedAspect}</span>
      </div>

      {/* Input Action Bar */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Paste Image URL or select local file below..."
          prefix={<LinkIcon className="w-4 h-4 text-slate-400 mr-1 shrink-0" />}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="rounded-2xl text-xs flex-1"
        />

        {/* Manual Upload Button */}
        <Button
          type="primary"
          icon={isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl text-xs font-bold bg-[#A50025] hover:bg-[#7D001C] border-none whitespace-nowrap shadow-2xs"
        >
          {isUploading ? 'Uploading...' : 'Upload File'}
        </Button>

        {/* Preset Selector Button */}
        <Button
          type="default"
          icon={<Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
          onClick={() => setIsPresetsOpen(true)}
          className="rounded-2xl text-xs font-bold whitespace-nowrap"
        >
          Presets
        </Button>
      </div>

      {/* Upload Dropzone / Image Preview Box */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 h-40 group">
          <img src={value} alt="Banner Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 p-4">
            <Button
              type="primary"
              icon={<FolderOpen className="w-3.5 h-3.5" />}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 border-none"
            >
              Replace File
            </Button>
            <Button
              type="default"
              danger
              icon={<X className="w-3.5 h-3.5" />}
              onClick={() => onChange && onChange('')}
              className="rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 border-none"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`cursor-pointer border-2 border-dashed p-6 rounded-2xl text-center transition-all ${
            isDragging
              ? 'border-[#A50025] bg-[#FFF0F3]'
              : 'border-slate-200 dark:border-slate-800 hover:border-[#A50025] bg-slate-50/50 dark:bg-slate-800/40'
          }`}
        >
          {isUploading ? (
            <div className="space-y-2 py-2">
              <Loader2 className="w-8 h-8 mx-auto text-[#A50025] animate-spin" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Uploading File to Server...</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-[#FFF0F3] text-[#A50025] mx-auto flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                Click to browse files or drop local image here
              </p>
              <p className="text-[11px] text-slate-400">
                Supports JPG, PNG, WEBP, SVG (Max 10MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preset Luxury Image Selection Modal */}
      <Modal
        title="Select High-Resolution Presets"
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
              className="cursor-pointer group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:ring-2 hover:ring-[#A50025] transition-all h-28"
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
