'use client';

import React, { useState } from 'react';
import { useProducts } from '@/hooks/use-catalogue';
import { brandConfig } from '@/config';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  PackageX,
  RefreshCw,
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import Image from 'next/image';

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: productsData, isLoading } = useProducts({ limit: 50 });

  const products = productsData?.items || [];
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getProductStock = (p: any) =>
    p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0;

  const totalStock = products.reduce((sum, p) => sum + getProductStock(p), 0);
  const lowStockCount = products.filter((p) => {
    const s = getProductStock(p);
    return s > 0 && s <= 10;
  }).length;
  const outOfStockCount = products.filter((p) => getProductStock(p) === 0).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time warehouse stock tracking, inventory levels, and replenishment alerts.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Total Units in Stock</span>
            <span className="text-2xl font-black text-slate-900">{totalStock}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Low Stock Warning</span>
            <span className="text-2xl font-black text-amber-600">{lowStockCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-red-50 text-red-600">
            <PackageX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase">Out of Stock</span>
            <span className="text-2xl font-black text-red-600">{outOfStockCount}</span>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Search Filter Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by product name or SKU..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-maroon"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                <th className="p-4">Product Details</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                    Loading inventory data...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                    No products matched your inventory search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const stock = getProductStock(product);
                  const primaryImage = product.images?.find((i) => i.isPrimary)?.imageUrl || product.images?.[0]?.imageUrl;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative shrink-0">
                            {primaryImage ? (
                              <Image src={primaryImage} alt={product.name} fill className="object-cover" />
                            ) : (
                              <Boxes className="w-5 h-5 text-slate-300 m-auto" />
                            )}
                          </div>
                          <span className="font-bold text-slate-900 line-clamp-1">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-slate-500">{product.sku}</td>
                      <td className="p-4 text-slate-600">{product.category?.name || 'General'}</td>
                      <td className="p-4 font-extrabold text-slate-900">
                        {brandConfig.currency.symbol}{Number(product.price).toFixed(2)}
                      </td>
                      <td className="p-4 font-bold text-slate-900">{stock} units</td>
                      <td className="p-4">
                        {stock === 0 ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                            Out of Stock
                          </span>
                        ) : stock <= 10 ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
