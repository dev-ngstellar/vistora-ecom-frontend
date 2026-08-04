export interface NavItemConfig {
  label: string;
  href: string;
  protected?: boolean;
}

export interface FooterLinkGroup {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export const navigationConfig = {
  mainNav: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Wishlist', href: '/wishlist', protected: true },
    { label: 'Cart', href: '/cart' },
    { label: 'Orders', href: '/orders', protected: true },
    { label: 'Profile', href: '/profile', protected: true },
  ] as NavItemConfig[],

  footerGroups: {
    catalog: {
      title: 'Catalog',
      links: [
        { label: 'Shop All', href: '/shop' },
        { label: 'Women\'s Couture', href: '/shop?category=women' },
        { label: 'Men\'s Apparel', href: '/shop?category=men' },
        { label: 'Luxury Accessories', href: '/shop?category=accessories' },
        { label: 'Saved Wishlist', href: '/wishlist' },
      ],
    },
    account: {
      title: 'Customer Account',
      links: [
        { label: 'My Profile', href: '/profile' },
        { label: 'Order History', href: '/orders' },
        { label: 'View Shopping Cart', href: '/cart' },
        { label: 'Checkout', href: '/checkout' },
      ],
    },
    company: {
      title: 'Company & Legal',
      links: [
        { label: 'About Vistora', href: '/about' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Help & FAQs', href: '/faq' },
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  } as Record<string, FooterLinkGroup>,
};
