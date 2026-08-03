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
  shop: 'Shop Catalog',
  search: 'Search Results',
  cart: 'Shopping Cart',
  wishlist: 'My Wishlist',
  profile: 'My Profile',
  checkout: 'Checkout',
  product: 'Product',
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
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    const formattedName =
      segmentNameMap[segment.toLowerCase()] ||
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

    return {
      href,
      name: formattedName,
      isLast,
    };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs font-medium text-slate-500 py-3 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5">
        <li>
          <Link
            href={admin ? '/admin/dashboard' : '/'}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            {admin ? <LayoutDashboard className="w-3.5 h-3.5" /> : <Home className="w-3.5 h-3.5" />}
            <span className="sr-only sm:not-sr-only sm:inline">{admin ? 'Admin' : 'Home'}</span>
          </Link>
        </li>

        {breadcrumbs.map((crumb, idx) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {crumb.isLast ? (
              <span className="font-semibold text-slate-800 truncate max-w-[180px] sm:max-w-xs">
                {crumb.name}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-slate-500 hover:text-indigo-600 transition-colors truncate max-w-[140px] sm:max-w-xs"
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
