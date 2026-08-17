'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/catalogue.types';
import { Maximize2, X } from 'lucide-react';

interface ProductGalleryProps {
  images?: ProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = [],
  productName,
}) => {
  const defaultImages = images.length > 0 ? images : [
    {
      id: 'default-1',
      productId: '1',
      imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=800',
      altText: productName,
      isPrimary: true,
      sortOrder: 0,
    },
  ];

  const primaryImage = defaultImages.find((img) => img.isPrimary) || defaultImages[0];
  const [selectedImage, setSelectedImage] = useState<string>(primaryImage.imageUrl);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
      }
    };

    if (isZoomOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomOpen]);

  const currentIndex = defaultImages.findIndex((img) => img.imageUrl === selectedImage);
  const activeIndex = currentIndex >= 0 ? currentIndex + 1 : 1;

  return (
    <div className="flex flex-col sm:flex-row gap-2.5 items-start w-full">
      {/* Vertical Thumbnails Column (Amazon/Flipkart Style) */}
      {defaultImages.length > 1 && (
        <div className="flex sm:flex-col items-center gap-2 overflow-x-auto sm:overflow-y-auto max-h-[380px] w-full sm:w-14 shrink-0 order-2 sm:order-1 scrollbar-none pb-1 sm:pb-0">
          {defaultImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img.imageUrl)}
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 bg-[#F7F8FA] p-1 ${
                selectedImage === img.imageUrl
                  ? 'border-[#A50025] ring-2 ring-[#A50025]/20 scale-105'
                  : 'border-[#E5E7EB] hover:border-slate-400 opacity-80 hover:opacity-100'
              }`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || `${productName} thumbnail ${idx + 1}`}
                fill
                sizes="60px"
                className="object-contain p-0.5"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Compact Product Image Box */}
      <div className="relative w-full h-[320px] sm:h-[380px] sm:flex-1 rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#E5E7EB] shadow-2xs group flex items-center justify-center order-1 sm:order-2">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 35vw"
          className="object-contain p-3 transition-all duration-500 group-hover:scale-105 cursor-pointer"
          onClick={() => setIsZoomOpen(true)}
        />

        {/* Image Counter Badge */}
        {defaultImages.length > 1 && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider z-10">
            {activeIndex} / {defaultImages.length}
          </div>
        )}

        {/* Zoom Trigger Button */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-white/90 backdrop-blur-md text-[#111827] hover:text-[#A50025] hover:bg-white shadow-xs transition-all z-10"
          title="Click to view full image"
          aria-label="Zoom Image"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Fullscreen Image Zoom Modal */}
      {isZoomOpen && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          {/* Top Floating Close Bar */}
          <div className="fixed top-4 right-4 z-[100000] flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomOpen(false);
              }}
              className="p-3 rounded-full bg-[#A50025] text-white hover:bg-[#7D001C] hover:scale-110 transition-all duration-200 shadow-xl flex items-center justify-center gap-1.5 font-bold text-xs"
              aria-label="Close Fullscreen View"
              title="Close (Esc)"
            >
              <X className="w-5 h-5 text-white" />
              <span className="hidden sm:inline">Close (Esc)</span>
            </button>
          </div>

          {/* Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl h-[70vh] rounded-2xl overflow-hidden bg-transparent p-2 cursor-default flex items-center justify-center"
          >
            <Image
              src={selectedImage}
              alt={productName}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {/* Bottom Close Button */}
          <div className="mt-3 z-[100000]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomOpen(false);
              }}
              className="px-6 py-2.5 rounded-full bg-[#A50025] text-white text-xs font-black uppercase tracking-wider hover:bg-[#7D001C] transition-all shadow-md flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Close Fullscreen (Esc)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
