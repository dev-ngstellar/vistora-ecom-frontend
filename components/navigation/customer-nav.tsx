'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  ShoppingBag, 
  Grid, 
  Heart, 
  ShoppingCart, 
  Package, 
  User 
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  protected?: boolean;
}

export const customerNavItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/shop', icon: ShoppingBag },
  { label: 'Wishlist', href: '/wishlist', icon: Heart, protected: true },
  { label: 'Cart', href: '/cart', icon: ShoppingCart },
  { label: 'Orders', href: '/orders', icon: Package, protected: true },
  { label: 'Profile', href: '/profile', icon: User, protected: true },
];

export const CustomerNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      {customerNavItems.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname === item.href || pathname.startsWith(item.href + '/');

        const IconComponent = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-maroon-light text-maroon font-bold shadow-xs'
                : 'text-slate-700 hover:text-maroon hover:bg-maroon-light/60'
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isActive ? 'text-maroon' : 'text-slate-400'}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
