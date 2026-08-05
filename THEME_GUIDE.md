# Vistora Commerce — Storefront Theme Development Guide

Welcome to the **Vistora Commerce Theme Development Guide**. This document explains how to build, customize, and deploy customer storefront themes on the Vistora Commerce Platform.

---

## 1. Architectural Philosophy

Vistora Commerce uses a **Headless, Decoupled Commerce Engine Architecture**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           STOREFRONT THEME                              │
│              (Tailwind CSS + Pure Presentation Components)              │
├─────────────────────────────────────────────────────────────────────────┤
│                        CONFIGURATION SYSTEM                             │
│       (@/config — brand, navigation, seo, social profile links)         │
├─────────────────────────────────────────────────────────────────────────┤
│                         PLATFORM LAYER                                  │
│       (@/platform — Hooks, Services, DTO Types, Auth Context, Axios)    │
├─────────────────────────────────────────────────────────────────────────┤
│                      BACKEND REST APIs & DATABASE                       │
│    (Express.js + Prisma ORM + PostgreSQL Database + Admin Portal)       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Rules for Theme Developers:
1. **Never modify Backend, Database, APIs, or Admin Panel code.** The backend engine is 100% generic and reusable.
2. **Never call Axios or fetch APIs directly inside UI components.** All data fetching and mutations MUST flow through `@/platform/hooks`.
3. **Keep Presentation Decoupled.** Components in your theme folder (`themes/<theme-name>/`) should handle layout, styling, and UI interactions only.
4. **Use the Configuration System for Identity.** Brand name, logo text, support emails, currency symbols, and footer links are driven by `@/config` and environment variables.

---

## 2. Directory Structure Conventions

Storefront themes live under `frontend/themes/`:

```
frontend/
├── config/                         # Central Configuration System
│   ├── brand.config.ts             # Brand identity, support contact, currency
│   ├── navigation.config.ts        # Header nav links, footer link groups
│   ├── seo.config.ts               # Title templates, default meta, Json-LD
│   ├── social.config.ts            # Social profile URLs (Instagram, Twitter, etc.)
│   └── index.ts
│
├── platform/                       # Headless Platform Engine (DO NOT EDIT FOR THEMES)
│   ├── hooks/                      # React Query data & mutation hooks
│   ├── services/                   # Typed API Client Services
│   ├── types/                      # TypeScript DTOs & Contracts
│   ├── context/                    # AuthContext & Session management
│   ├── lib/                        # Axios client & Query Client
│   └── index.ts
│
├── themes/                         # Storefront Themes Directory
│   ├── luxury/                     # Theme 1: Luxury Couture Theme
│   └── minimal/                    # Theme 2: Minimal Modern Theme
│       ├── config/
│       │   └── theme-tokens.ts     # Visual design tokens (colors, font, radii)
│       ├── components/             # Theme presentation components
│       │   ├── minimal-header.tsx
│       │   ├── minimal-footer.tsx
│       │   ├── minimal-hero.tsx
│       │   ├── minimal-product-card.tsx
│       │   └── minimal-category-card.tsx
│       └── pages/
│           └── minimal-home-page.tsx
│
└── app/
    └── (customer)/                 # Next.js App Router Customer Pages
        ├── page.tsx                # Active theme homepage router
        ├── minimal/page.tsx        # Minimal theme proof-of-architecture route
        ├── shop/page.tsx
        ├── product/[slug]/page.tsx
        ├── cart/page.tsx
        └── checkout/page.tsx
```

---

## 3. Consuming the Platform Layer (`@/platform`)

All data and actions needed by your theme are exported cleanly from `@/platform`:

### Available Data & Mutation Hooks

```typescript
import { 
  useProducts, 
  useCategories, 
  useCollections, 
  useBanners, 
  usePublicCMSPage,
  useCartMutations, 
  useWishlistMutations 
} from '@/platform/hooks';
```

#### Hook Usage Examples:

```typescript
// 1. Fetch products with filters
const { data: productsData, isLoading } = useProducts({ limit: 8, featured: true });
const products = productsData?.items || [];

// 2. Fetch department categories
const { data: categories } = useCategories();

// 3. Fetch position-filtered banners
const { data: bannersData } = useBanners({ position: 'HERO_SLIDER', isActive: true });

// 4. Cart & Wishlist Mutations
const { addToCart } = useCartMutations();
const { addToWishlist } = useWishlistMutations();

// Trigger mutation:
addToCart.mutate({ productId: 'prod_123', quantity: 1 });
addToWishlist.mutate({ productId: 'prod_123' });
```

---

## 4. Consuming the Configuration System (`@/config`)

Instead of hardcoding store identity strings or links, import from `@/config`:

```typescript
import { brandConfig, navigationConfig, seoConfig, socialConfig } from '@/config';

// Examples:
console.log(brandConfig.name);              // e.g. "Vistora Commerce"
console.log(brandConfig.logoLetter);        // e.g. "V"
console.log(brandConfig.currency.symbol);   // e.g. "$"
console.log(navigationConfig.mainNav);     // Header Nav Items Array
console.log(socialConfig.links.instagram);  // Instagram profile URL
```

---

## 5. Step-by-Step Guide to Creating a New Theme

Follow these steps to create a new theme (e.g. `themes/electronics`):

### Step 1: Create Theme Directory
Create folder `frontend/themes/electronics/` with subdirectories `config/`, `components/`, and `pages/`.

### Step 2: Define Theme Visual Tokens (`config/theme-tokens.ts`)
```typescript
export const electronicsThemeTokens = {
  name: 'Electronics',
  colors: {
    primary: 'bg-blue-600',
    accent: 'text-cyan-400',
    background: 'bg-slate-900',
  },
  layout: {
    borderRadius: 'rounded-xl',
  },
};
```

### Step 3: Create Theme Header (`components/electronics-header.tsx`)
```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { brandConfig, navigationConfig } from '@/config';
import { SearchBar } from '@/components/layout/search-bar';
import { UserMenu } from '@/components/layout/user-menu';

export const ElectronicsHeader: React.FC = () => {
  return (
    <header className="bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-extrabold text-lg text-blue-500">
          {brandConfig.name}
        </Link>
        <nav className="flex gap-4 text-xs font-bold uppercase">
          {navigationConfig.mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-blue-400">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <SearchBar />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
```

### Step 4: Create Theme Product Card (`components/electronics-product-card.tsx`)
```typescript
'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/platform/types';
import { useCartMutations } from '@/platform/hooks';
import { brandConfig } from '@/config';

export const ElectronicsProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCartMutations();
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <img src={product.images[0]?.imageUrl} alt={product.name} className="w-full aspect-square object-cover rounded-lg" />
      <h3 className="text-sm font-bold text-white truncate">{product.name}</h3>
      <div className="text-blue-400 font-extrabold">{brandConfig.currency.symbol}{price.toFixed(2)}</div>
      <button 
        onClick={() => addToCart.mutate({ productId: product.id })}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg"
      >
        Add to Cart
      </button>
    </div>
  );
};
```

### Step 5: Compose Homepage (`pages/electronics-home-page.tsx`)
```typescript
'use client';

import React from 'react';
import { useProducts, useCategories } from '@/platform/hooks';
import { ElectronicsHeader } from '../components/electronics-header';
import { ElectronicsProductCard } from '../components/electronics-product-card';

export const ElectronicsHomePage: React.FC = () => {
  const { data: productsData } = useProducts({ limit: 8 });
  const products = productsData?.items || [];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ElectronicsHeader />
      <main className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <h1 className="text-3xl font-extrabold">Featured Tech Essentials</h1>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {products.map((p) => (
            <ElectronicsProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </div>
  );
};
```

---

## 6. Theme Developer Do's and Don'ts

| Do | Don't |
|---|---|
| ✅ Import data hooks from `@/platform/hooks` | ❌ Never call `axios.get('/api/v1/products')` directly |
| ✅ Read store identity from `@/config` | ❌ Never hardcode store names, phone numbers, or `$`/currency |
| ✅ Place presentation components in `themes/<name>/` | ❌ Never edit backend controllers, services, routes, or Prisma schema |
| ✅ Use standard TypeScript DTOs from `@/platform/types` | ❌ Never mutate global window objects or private DOM elements |
| ✅ Pass data down via props to clean presentation cards | ❌ Never duplicate data fetching logic inside card components |

---

## 7. Rebranding Checklist for a New Client

To deploy Vistora Commerce for a new client:
1. Update `.env.local` or deployment environment variables:
   ```env
   NEXT_PUBLIC_BRAND_NAME="TechVerse Store"
   NEXT_PUBLIC_BRAND_SHORT_NAME="TECHVERSE"
   NEXT_PUBLIC_BRAND_LOGO_LETTER="T"
   NEXT_PUBLIC_CURRENCY_SYMBOL="₹"
   NEXT_PUBLIC_CURRENCY_CODE="INR"
   NEXT_PUBLIC_SUPPORT_EMAIL="support@techverse.com"
   ```
2. (Optional) Tweak `config/navigation.config.ts` or `config/social.config.ts` for client links.
3. Deploy! Backend, database, admin panel, and platform APIs will immediately serve the new brand.
