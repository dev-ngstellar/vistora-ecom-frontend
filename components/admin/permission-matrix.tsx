'use client';

import React from 'react';
import { Checkbox, Tag } from 'antd';
import { ShieldCheck, Eye, Plus, Edit, Trash2, Download } from 'lucide-react';
import { ModuleName, PermissionMatrix as MatrixType } from '@/types/admin.types';

interface PermissionMatrixProps {
  value?: MatrixType;
  onChange?: (matrix: MatrixType) => void;
  disabled?: boolean;
}

const MODULES: Array<{ id: ModuleName; label: string; description: string }> = [
  { id: 'dashboard', label: 'Dashboard & Analytics', description: 'Overview metrics, revenue figures, and store activity.' },
  { id: 'catalog', label: 'Catalog & Inventory', description: 'Products, categories, brands, collections, and stock.' },
  { id: 'sales', label: 'Sales & Orders', description: 'Order processing, customer invoices, refunds, and shipment tracking.' },
  { id: 'customers', label: 'Customer Management', description: 'Customer directory, accounts, wishlist, and spending history.' },
  { id: 'content', label: 'Content Management', description: 'Hero banners, promo carousels, and CMS policy pages.' },
  { id: 'administration', label: 'Users & RBAC Roles', description: 'Staff user accounts, role definitions, and permission matrices.' },
  { id: 'settings', label: 'Store Settings & Config', description: 'Payment gateways, shipping methods, GST taxes, and integration keys.' },
];

const SCOPES = [
  { id: 'read', label: 'View / Read', icon: Eye, color: 'text-indigo-600' },
  { id: 'write', label: 'Create / Write', icon: Plus, color: 'text-emerald-600' },
  { id: 'delete', label: 'Delete', icon: Trash2, color: 'text-rose-600' },
  { id: 'export', label: 'Export Data', icon: Download, color: 'text-purple-600' },
];

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  value = {
    dashboard: ['read'],
    catalog: ['read'],
    sales: ['read'],
    customers: ['read'],
    content: ['read'],
    administration: ['read'],
    settings: ['read'],
  },
  onChange,
  disabled = false,
}) => {
  const handleToggle = (module: ModuleName, scope: string, checked: boolean) => {
    if (disabled) return;
    const currentScopes = value[module] || [];
    const newScopes = checked
      ? [...currentScopes, scope]
      : currentScopes.filter((s) => s !== scope);

    const updatedMatrix = {
      ...value,
      [module]: newScopes,
    };

    if (onChange) {
      onChange(updatedMatrix);
    }
  };

  const handleToggleRowAll = (module: ModuleName, checked: boolean) => {
    if (disabled) return;
    const updatedMatrix = {
      ...value,
      [module]: checked ? ['read', 'write', 'delete', 'export'] : [],
    };
    if (onChange) {
      onChange(updatedMatrix);
    }
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Granular Module Access Matrix</span>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        {MODULES.map((mod) => {
          const scopes = value[mod.id] || [];
          const isAllSelected = scopes.length === 4;

          return (
            <div key={mod.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="max-w-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 dark:text-white text-xs">{mod.label}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleToggleRowAll(mod.id, !isAllSelected)}
                      className="text-[10px] text-indigo-600 hover:underline font-semibold"
                    >
                      {isAllSelected ? 'Unselect All' : 'Select All'}
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{mod.description}</p>
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                {SCOPES.map((scope) => {
                  const Icon = scope.icon;
                  const isChecked = scopes.includes(scope.id);

                  return (
                    <label
                      key={scope.id}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-xl border transition-all ${
                        isChecked
                          ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
                          : 'border-slate-200/60 dark:border-slate-800 opacity-60'
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        disabled={disabled}
                        onChange={(e) => handleToggle(mod.id, scope.id, e.target.checked)}
                      />
                      <Icon className={`w-3.5 h-3.5 ${scope.color}`} />
                      <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{scope.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
