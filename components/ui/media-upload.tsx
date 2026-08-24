'use client';

import React, { useState, useRef } from 'react';
import { uploadService } from '@/services/catalogue.service';
import { Upload, X, Star, ArrowLeft, ArrowRight, Loader2, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export interface UploadedMediaItem {
  imageUrl: string;
  isPrimary?: boolean;
  altText?: string;
  sortOrder?: number;
}

interface MediaUploadProps {
  multiple?: boolean;
  value?: string | string[] | UploadedMediaItem[];
  onChange?: (value: any) => void;
  maxCount?: number;
  accept?: string;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  multiple = false,
  value,
  onChange,
  maxCount = 10,
  accept = 'image/jpeg,image/png,image/webp,image/svg+xml,image/gif',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Normalize initial value to items array or single string
  const items: UploadedMediaItem[] = React.useMemo(() => {
    if (!value) return [];
    if (typeof value === 'string') return [{ imageUrl: value, isPrimary: true }];
    if (Array.isArray(value)) {
      return value.map((item, idx) => {
        if (typeof item === 'string') return { imageUrl: item, isPrimary: idx === 0, sortOrder: idx };
        return { ...item, isPrimary: item.isPrimary ?? idx === 0, sortOrder: item.sortOrder ?? idx };
      });
    }
    return [];
  }, [value]);

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (fileArray.length === 0) {
      toast.error('Please select valid image files (JPG, PNG, WEBP, SVG, GIF)');
      return;
    }

    if (multiple && items.length + fileArray.length > maxCount) {
      toast.error(`Maximum ${maxCount} images allowed`);
      return;
    }

    setIsUploading(true);
    try {
      if (!multiple || fileArray.length === 1) {
        const uploaded = await uploadService.uploadSingle(fileArray[0]);
        if (multiple) {
          const newItems = [
            ...items,
            { imageUrl: uploaded.url, isPrimary: items.length === 0, sortOrder: items.length },
          ];
          onChange?.(newItems);
        } else {
          onChange?.(uploaded.url);
        }
        toast.success('Image uploaded successfully');
      } else {
        const uploadedList = await uploadService.uploadMultiple(fileArray);
        const newItems = [
          ...items,
          ...uploadedList.map((res, idx) => ({
            imageUrl: res.url,
            isPrimary: items.length === 0 && idx === 0,
            sortOrder: items.length + idx,
          })),
        ];
        onChange?.(newItems);
        toast.success(`${uploadedList.length} images uploaded successfully`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!multiple) {
      onChange?.(null);
      return;
    }
    const updated = items.filter((_, idx) => idx !== index);
    // Ensure primary item exists if items remain
    if (updated.length > 0 && !updated.some((i) => i.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange?.(updated);
    toast.success('Image removed from gallery');
  };

  const handleSetPrimary = (index: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!multiple || index === 0) return;

    const updated = [...items];
    const [selected] = updated.splice(index, 1);
    const reordered = [selected, ...updated].map((item, idx) => ({
      ...item,
      isPrimary: idx === 0,
      sortOrder: idx,
    }));
    onChange?.(reordered);
    toast.success('Set as primary image');
  };

  const handleMove = (index: number, direction: 'left' | 'right', e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (!multiple) return;
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;

    // reassign sortOrder and ensure first is primary if needed
    const finalItems = updated.map((item, idx) => ({
      ...item,
      isPrimary: idx === 0,
      sortOrder: idx,
    }));
    onChange?.(finalItems);
  };

  return (
    <div className="space-y-3">
      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <span className="text-xs font-bold text-slate-700">Uploading media file(s)...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <div className="p-3 rounded-full bg-white shadow-xs text-indigo-600 border border-slate-200">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Drag & Drop or <span className="text-indigo-600 underline">Browse Files</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                Supports JPG, PNG, WEBP, SVG, GIF (Max 10MB per file)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Grid (Multiple Mode) */}
      {multiple && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {items.map((item, index) => (
            <div
              key={item.imageUrl + index}
              onClick={(e) => {
                if (!item.isPrimary) {
                  handleSetPrimary(index, e);
                }
              }}
              className={`group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border-2 transition shadow-xs cursor-pointer ${
                item.isPrimary ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-slate-200 hover:border-amber-400'
              }`}
            >
              <img src={item.imageUrl} alt="Uploaded Media" className="w-full h-full object-cover" />

              {/* Primary Badge or Make Primary Button (Top Left) */}
              {item.isPrimary ? (
                <span className="absolute top-2 left-2 z-10 bg-indigo-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 pointer-events-none">
                  <Star className="w-3 h-3 fill-white" /> Primary
                </span>
              ) : (
                <button
                  type="button"
                  onClick={(e) => handleSetPrimary(index, e)}
                  className="absolute top-2 left-2 z-20 bg-amber-500 hover:bg-amber-600 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 transition-transform hover:scale-105"
                  title="Click to set as primary image"
                >
                  <Star className="w-3 h-3 fill-white" /> Make Primary
                </button>
              )}

              {/* Always-Visible Delete Button (Top Right) */}
              <button
                type="button"
                onClick={(e) => handleRemove(index, e)}
                className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition-transform hover:scale-110 focus:outline-none"
                title="Delete Image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              {/* Actions Overlay for Reordering (On Hover) */}
              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-2 z-10 pointer-events-none">
                <div className="flex items-center justify-between pointer-events-auto">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={(e) => handleMove(index, 'left', e)}
                    className="p-1 rounded-md bg-white/80 text-slate-800 disabled:opacity-30 hover:bg-white"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-white font-bold">#{index + 1}</span>
                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={(e) => handleMove(index, 'right', e)}
                    className="p-1 rounded-md bg-white/80 text-slate-800 disabled:opacity-30 hover:bg-white"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Single Mode Preview */}
      {!multiple && value && typeof value === 'string' && (
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 shadow-xs group bg-slate-100 mt-2">
          <img src={value} alt="Media Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onChange?.(null);
            }}
            className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-md transition-transform hover:scale-110 z-20"
            title="Delete Image"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
