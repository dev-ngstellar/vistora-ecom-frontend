'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Modal, Rate } from 'antd';
import { Product } from '@/types/catalogue.types';
import { ShoppingBag, Check, ExternalLink, ShieldCheck, Star } from 'lucide-react';
import { useCartMutations } from '@/hooks/use-shopping';
import { brandConfig } from '@/config';

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, open, onClose }) => {
  const { addToCart } = useCartMutations();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) return null;

  const images = product.images?.map((img) => img.imageUrl) || [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
  ];
  const activeImage = selectedImage || images[0];

  // Extract unique color variants and sizes
  const colorVariants = Array.from(
    new Map(
      product.variants
        ?.filter((v) => v.color)
        .map((v) => [v.color, { color: v.color!, hex: v.colorHex || '#1A1A1A' }])
    ).values()
  );

  const availableSizes = Array.from(
    new Set(product.variants?.filter((v) => v.size).map((v) => v.size!))
  );

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const compareAtNum = product.compareAtPrice
    ? typeof product.compareAtPrice === 'string'
      ? parseFloat(product.compareAtPrice)
      : product.compareAtPrice
    : null;

  const isOutOfStock = product.status === 'OUT_OF_STOCK' || product.status === 'INACTIVE';

  const handleAddToCart = () => {
    const matchingVariant = product.variants?.find(
      (v) => (!selectedColor || v.color === selectedColor) && (!selectedSize || v.size === selectedSize)
    );

    addToCart.mutate({
      productId: product.id,
      variantId: matchingVariant?.id,
      quantity,
      productName: product.name,
      productSlug: product.slug,
      price: priceNum,
      imageUrl: activeImage,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={840}
      centered
      className="quick-view-modal"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
        {/* Left: Gallery View */}
        <div className="space-y-3.5">
          <div className="relative aspect-[3/4] rounded-[22px] overflow-hidden bg-[#F8FAFC] border border-[#ECECEC] shadow-inner group">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {compareAtNum && compareAtNum > priceNum && (
              <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#B5123B] text-white shadow-md">
                {Math.round(((compareAtNum - priceNum) / compareAtNum) * 100)}% OFF
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-20 rounded-[14px] overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img
                      ? 'border-[#B5123B] ring-2 ring-[#B5123B]/20 scale-95 shadow-xs'
                      : 'border-[#ECECEC] opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Variant Selection */}
        <div className="space-y-5 text-xs flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block bg-[#FDF2F5] text-[#B5123B] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                {product.category?.name || 'Luxury Line'}
              </span>
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100 text-amber-600 font-extrabold text-[11px]">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 (128)</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] mt-2.5 leading-snug tracking-tight">
              {product.name}
            </h2>

            {/* Price Tag */}
            <div className="flex items-baseline gap-2.5 mt-3">
              <span className="text-2xl sm:text-3xl font-black text-[#111111]">
                {brandConfig.currency.symbol}{priceNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>
              {compareAtNum && compareAtNum > priceNum && (
                <span className="text-sm font-semibold text-[#6B7280] line-through">
                  {brandConfig.currency.symbol}{compareAtNum.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-[#6B7280] font-normal text-xs mt-3 leading-relaxed border-t border-[#ECECEC] pt-3">
              {product.shortDescription || product.description || 'Handcrafted editorial luxury item tailored with supreme precision.'}
            </p>

            {/* Color Swatch Picker */}
            {colorVariants.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase tracking-wider text-[#111111] text-[10px]">
                    COLOR SWATCH: <span className="text-[#B5123B] font-black">{selectedColor || colorVariants[0]?.color}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {colorVariants.map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      title={c.color}
                      onClick={() => setSelectedColor(c.color)}
                      className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center shadow-xs ${
                        (selectedColor || colorVariants[0]?.color) === c.color
                          ? 'border-[#B5123B] ring-2 ring-[#B5123B]/30 scale-110'
                          : 'border-[#ECECEC] hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {(selectedColor || colorVariants[0]?.color) === c.color && (
                        <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="font-extrabold uppercase tracking-wider text-[#111111] text-[10px] block">
                  AVAILABLE SIZES
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 rounded-xl font-extrabold transition-all text-xs ${
                        (selectedSize || availableSizes[0]) === sz
                          ? 'bg-[#111111] text-white shadow-sm'
                          : 'bg-[#F8FAFC] text-[#6B7280] border border-[#ECECEC] hover:border-[#111111] hover:text-[#111111]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mt-4 space-y-2">
              <span className="font-extrabold uppercase tracking-wider text-[#111111] text-[10px] block">
                QUANTITY
              </span>
              <div className="flex items-center border border-[#ECECEC] rounded-full w-fit bg-[#F8FAFC] p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-black text-[#111111] hover:bg-[#FDF2F5] hover:text-[#B5123B] transition-colors"
                >
                  -
                </button>
                <span className="px-4 font-black text-[#111111] text-xs">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-black text-[#111111] hover:bg-[#FDF2F5] hover:text-[#B5123B] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3 border-t border-[#ECECEC]">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCart.isPending}
              className={`w-full h-12 rounded-full font-extrabold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#B5123B] hover:bg-[#8E0E2E] active:scale-[0.99] text-white shadow-[#B5123B]/20'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Shopping Bag'}</span>
            </button>

            <div className="flex items-center justify-between text-[11px] text-[#6B7280] font-semibold pt-1">
              <span className="flex items-center gap-1.5 text-[#111111]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Insured Express Delivery</span>
              </span>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="font-extrabold text-[#B5123B] hover:text-[#8E0E2E] flex items-center gap-1 transition-colors"
              >
                <span>Full Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
