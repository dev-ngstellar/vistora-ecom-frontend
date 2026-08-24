'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ProductImage } from '@/types/catalogue.types';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images?: ProductImage[];
  productName: string;
  selectedImageOverride?: string | null;
  selectedVariantImageUrls?: string[] | null;
  selectedColor?: string | null;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images = [],
  productName,
  selectedImageOverride,
  selectedVariantImageUrls,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Display variant images if a variant with images is selected, otherwise show master product images
  const displayImages = React.useMemo(() => {
    // 1. Explicit variant image URLs if provided for active variant
    if (selectedVariantImageUrls && selectedVariantImageUrls.length > 0) {
      const variantList: ProductImage[] = [];
      const seen = new Set<string>();
      selectedVariantImageUrls.forEach((url, idx) => {
        if (url && !seen.has(url)) {
          seen.add(url);
          variantList.push({
            id: `var-img-${idx}-${url}`,
            productId: 'variant',
            imageUrl: url,
            altText: productName,
            isPrimary: idx === 0,
            sortOrder: idx,
          });
        }
      });
      if (variantList.length > 0) return variantList;
    }

    // 2. Return deduplicated master product defaultImages
    const result: ProductImage[] = [];
    const resultSet = new Set<string>();
    defaultImages.forEach((img) => {
      if (img.imageUrl && !resultSet.has(img.imageUrl)) {
        resultSet.add(img.imageUrl);
        result.push(img);
      }
    });

    return result;
  }, [defaultImages, selectedVariantImageUrls, productName]);

  const primaryImage = displayImages.find((img) => img.isPrimary) || displayImages[0];
  const [selectedImage, setSelectedImage] = useState<string>(
    selectedImageOverride || primaryImage.imageUrl,
  );
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);

  useEffect(() => {
    if (selectedImageOverride) {
      setSelectedImage(selectedImageOverride);
    } else if (displayImages.length > 0) {
      setSelectedImage(displayImages[0].imageUrl);
    }
  }, [selectedImageOverride, displayImages]);

  const currentIndex = displayImages.findIndex((img) => img.imageUrl === selectedImage);
  const activeIndex = currentIndex >= 0 ? currentIndex + 1 : 1;

  const handlePrevImage = () => {
    if (displayImages.length <= 1) return;
    const prevIdx = (currentIndex - 1 + displayImages.length) % displayImages.length;
    setSelectedImage(displayImages[prevIdx].imageUrl);
  };

  const handleNextImage = () => {
    if (displayImages.length <= 1) return;
    const nextIdx = (currentIndex + 1) % displayImages.length;
    setSelectedImage(displayImages[nextIdx].imageUrl);
  };

  // Close modal when pressing Escape key & handle Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isZoomOpen) return;
      if (e.key === 'Escape') {
        setIsZoomOpen(false);
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage();
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
  }, [isZoomOpen, currentIndex, displayImages]);

  return (
    <div className="flex flex-col sm:flex-row gap-2.5 items-start w-full">
      {/* Vertical Thumbnails Column */}
      {displayImages.length > 1 && (
        <div className="flex sm:flex-col items-center gap-2 overflow-x-auto sm:overflow-y-auto max-h-[380px] w-full sm:w-14 shrink-0 order-2 sm:order-1 scrollbar-none pb-1 sm:pb-0">
          {displayImages.map((img, idx) => (
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
        {displayImages.length > 1 && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider z-10">
            {activeIndex} / {displayImages.length}
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

      {/* Fullscreen Pure Product Image Lightbox Modal via React Portal */}
      {isZoomOpen && isMounted && createPortal(
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-[9999999] bg-[#0A0A0C] flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200 cursor-pointer select-none"
        >
          {/* Top Header Bar: Image Counter & Close Button */}
          <div className="w-full flex items-center justify-between z-[10000000] max-w-6xl">
            {displayImages.length > 1 ? (
              <div className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold tracking-wider border border-white/20">
                {activeIndex} of {displayImages.length}
              </div>
            ) : (
              <div />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomOpen(false);
              }}
              className="p-2.5 sm:px-4 sm:py-2 rounded-full bg-[#A50025] text-white hover:bg-[#7D001C] hover:scale-105 transition-all duration-200 shadow-xl flex items-center justify-center gap-2 font-bold text-xs"
              aria-label="Close Fullscreen View"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Close (Esc)</span>
            </button>
          </div>

          {/* Centered Main Image Box (100% Opaque Portal, Clean Product Image Only) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[78vh] my-auto rounded-2xl overflow-hidden bg-transparent cursor-default flex items-center justify-center"
          >
            {/* Previous Image Arrow */}
            {displayImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all hover:scale-110 border border-white/20 shadow-lg"
                title="Previous Image (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Pure Product Image */}
            <Image
              src={selectedImage}
              alt={productName}
              fill
              priority
              sizes="100vw"
              className="object-contain p-2"
            />

            {/* Next Image Arrow */}
            {displayImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all hover:scale-110 border border-white/20 shadow-lg"
                title="Next Image (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Close Control */}
          <div className="z-[10000000] flex items-center gap-3">
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
        </div>,
        document.body
      )}
    </div>
  );
};
