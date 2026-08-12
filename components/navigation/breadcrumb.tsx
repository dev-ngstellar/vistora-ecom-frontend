'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home, LayoutDashboard } from 'lucide-react';

interface DynamicBreadcrumbProps {
  className?: string;
  admin?: boolean;
}

const segmentNameMap: Record<string, string> = {
  admin: 'Admin',
  dashboard: 'Dashboard',
  products: 'Products',
  categories: 'Categories',
  brands: 'Brands',
  collections: 'Collections',
  inventory: 'Inventory',
  orders: 'Orders',
  customers: 'Customers',
  reviews: 'Reviews',
  coupons: 'Coupons',
  banners: 'Banners',
  cms: 'CMS & Content',
  users: 'Users Management',
  roles: 'Roles & Permissions',
  reports: 'Reports & Analytics',
  settings: 'Settings',
  shop: 'Shop',
  search: 'Search',
  cart: 'Shopping Cart',
  wishlist: 'My Wishlist',
  profile: 'My Profile',
  checkout: 'Checkout',
  product: 'Shop',
  about: 'About Us',
  contact: 'Contact Us',
  faq: 'FAQ',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms of Service',
};

export const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({
  className = '',
  admin = false,
}) => {
  const pathname = usePathname();

  if (!pathname || pathname === '/' || (admin && pathname === '/admin/dashboard')) {
    return null;
  }

  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    let href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    const segmentKey = segment.toLowerCase();

    let formattedName =
      segmentNameMap[segmentKey] ||
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

    // Redirect /product segment to /shop catalog route
    if (segmentKey === 'product') {
      href = '/shop';
      formattedName = 'Shop';
    }

    return {
      href,
      name: formattedName,
      isLast,
    };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-[11px] font-semibold text-[#64748B] h-8 sm:h-9 overflow-x-auto whitespace-nowrap scrollbar-none py-1 mb-1 ${className}`}
    >
      <ol className="flex items-center gap-1.5 shrink-0">
        <li>
          <Link
            href={admin ? '/admin/dashboard' : '/'}
            className="flex items-center gap-1 text-[#64748B] hover:text-[#A50025] transition-colors"
          >
            {admin ? <LayoutDashboard className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
            <span className="inline">{admin ? 'Admin' : 'Home'}</span>
          </Link>
        </li>

        {breadcrumbs.map((crumb, idx) => (
          <li key={idx} className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-300 text-[10px]">›</span>
            {crumb.isLast ? (
              <span className="font-bold text-[#111827] truncate max-w-[220px] sm:max-w-sm">
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-[#64748B] hover:text-[#A50025] transition-colors truncate max-w-[140px] sm:max-w-xs"
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
