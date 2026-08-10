'use client';

import React, { useState } from 'react';
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

  return (
    <div className="space-y-4">
      {/* Main Image Frame (Clean Contain Container) */}
      <div className="relative w-full aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden bg-[#F7F8FA] border border-[#E5E7EB] shadow-xs group flex items-center justify-center">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-2 transition-all duration-500 group-hover:scale-105"
        />

        {/* Zoom Trigger Button */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-3 right-3 p-2.5 rounded-xl bg-white/90 backdrop-blur-md text-[#111827] hover:text-[#A50025] hover:bg-white shadow-xs transition-all z-10"
          title="Zoom Image"
          aria-label="Zoom Image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Thumbnails Row */}
      {defaultImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {defaultImages.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img.imageUrl)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 bg-[#F7F8FA] p-1 ${selectedImage === img.imageUrl
                  ? 'border-[#A50025] ring-2 ring-[#A50025]/20 scale-105'
                  : 'border-[#E5E7EB] hover:border-slate-400 opacity-80 hover:opacity-100'
                }`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || productName}
                fill
                sizes="80px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Image Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-[#111827]/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-50"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh] rounded-2xl overflow-hidden bg-white/5 p-4">
            <Image
              src={selectedImage}
              alt={productName}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
