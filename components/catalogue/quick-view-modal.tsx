'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Modal, Button, Tag, Rate, message } from 'antd';
import { Product } from '@/types/catalogue.types';
import { ShoppingBag, Heart, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { useCartMutations } from '@/hooks/use-shopping';

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

  const handleAddToCart = () => {
    const matchingVariant = product.variants?.find(
      (v) => (!selectedColor || v.color === selectedColor) && (!selectedSize || v.size === selectedSize)
    );

    addToCart.mutate({
      productId: product.id,
      variantId: matchingVariant?.id,
      quantity,
    });
    onClose();
  };

  const priceNum = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={860}
      className="quick-view-modal"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
        {/* Left: Gallery View */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img ? 'border-indigo-600 scale-95' : 'border-slate-200 opacity-60 hover:opacity-100'
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
            <div className="flex items-center justify-between">
              <span className="font-extrabold uppercase tracking-widest text-indigo-600">
                {product.category?.name || 'Couture'}
              </span>
              <Rate disabled defaultValue={5} className="text-xs text-amber-400" />
            </div>

            <h2 className="text-2xl font-serif font-light text-slate-900 dark:text-white mt-1">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ${priceNum.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-slate-400 line-through font-medium">
                  ${parseFloat(String(product.compareAtPrice)).toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-slate-600 dark:text-slate-300 font-light mt-3 leading-relaxed">
              {product.shortDescription || product.description || 'Handcrafted editorial fashion piece engineered for timeless luxury.'}
            </p>

            {/* Color Swatch Picker */}
            {colorVariants.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-[10px]">
                    Color Swatch: <span className="text-indigo-600">{selectedColor || colorVariants[0]?.color}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {colorVariants.map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      title={c.color}
                      onClick={() => setSelectedColor(c.color)}
                      className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                        (selectedColor || colorVariants[0]?.color) === c.color
                          ? 'border-indigo-600 ring-2 ring-indigo-400/40 scale-110'
                          : 'border-slate-300'
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

            {/* Size Selector Buttons */}
            {availableSizes.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-[10px] block">
                  Available Sizes
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {availableSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 rounded-xl border font-bold transition-all text-xs ${
                        (selectedSize || availableSizes[0]) === sz
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
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
              <span className="font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 text-[10px] block">
                Quantity
              </span>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-full w-fit bg-slate-50 dark:bg-slate-800/60">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 rounded-l-full"
                >
                  -
                </button>
                <span className="px-4 font-bold text-slate-900 dark:text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 rounded-r-full"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="primary"
              size="large"
              block
              icon={<ShoppingBag className="w-4 h-4" />}
              onClick={handleAddToCart}
              className="bg-slate-900 dark:bg-indigo-600 font-extrabold uppercase tracking-widest text-xs h-12 rounded-full shadow-lg"
            >
              Add to Shopping Bag
            </Button>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Insured Express Delivery
              </span>

              <Link
                href={`/product/${product.slug}`}
                onClick={onClose}
                className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Full Details</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
