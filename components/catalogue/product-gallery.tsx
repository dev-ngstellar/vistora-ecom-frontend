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
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
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
      {/* Main Image Container */}
      <div className="relative w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md group">
        <Image
          src={selectedImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300 group-hover:scale-105"
        />

        {/* Zoom trigger button */}
        <button
          onClick={() => setIsZoomOpen(true)}
          className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/80 backdrop-blur-md text-slate-800 hover:bg-white hover:text-indigo-600 shadow-md transition z-10"
          title="Zoom Image"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails Row */}
      {defaultImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {defaultImages.map((img) => (
            <button
              key={img.id}
              onClick={() => setSelectedImage(img.imageUrl)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                selectedImage === img.imageUrl
                  ? 'border-indigo-600 ring-2 ring-indigo-200 scale-105'
                  : 'border-slate-200 hover:border-slate-400 opacity-75 hover:opacity-100'
              }`}
            >
              <Image
                src={img.imageUrl}
                alt={img.altText || productName}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Zoom Modal */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition z-50"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh] rounded-3xl overflow-hidden">
            <Image
              src={selectedImage}
              alt={productName}
              fill
              sizes="100vw"
              className="object-contain object-center"
            />
          </div>
        </div>
      )}
    </div>
  );
};
