'use client';

import React from 'react';
import Link from 'next/link';
import { brandConfig, socialConfig } from '@/config';
import {
  ShoppingBag,
  User,
  Building2,
  Headphones,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Lock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight
} from 'lucide-react';

export const CustomerFooter: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-white pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Features Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-slate-800">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1E293B]/70 border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-[#A50025]/20 text-[#A50025] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#E66001]" />
            </div>
            <div>
              <h5 className="text-xs font-extrabold text-white">Free Delivery</h5>
              <p className="text-[11px] text-slate-300 font-normal">On orders over ₹1500</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1E293B]/70 border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-[#A50025]/20 text-[#A50025] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#E66001]" />
            </div>
            <div>
              <h5 className="text-xs font-extrabold text-white">Authentic Products</h5>
              <p className="text-[11px] text-slate-300 font-normal">Curated top sellers</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1E293B]/70 border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-[#A50025]/20 text-[#A50025] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-[#E66001]" />
            </div>
            <div>
              <h5 className="text-xs font-extrabold text-white">Secure Checkout</h5>
              <p className="text-[11px] text-slate-300 font-normal">100% Encrypted Payment</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[#1E293B]/70 border border-slate-800">
            <div className="w-10 h-10 rounded-full bg-[#A50025]/20 text-[#A50025] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-[#E66001]" />
            </div>
            <div>
              <h5 className="text-xs font-extrabold text-white">Easy Returns</h5>
              <p className="text-[11px] text-slate-300 font-normal">Hassle-free customer support</p>
            </div>
          </div>
        </div>

        {/* 5 Column Adaptable Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-10 border-b border-slate-800">
          
          {/* Column 1: Vistora Brand */}
          <div className="lg:col-span-1 space-y-3.5">
            <Link href="/" className="inline-block bg-white p-2 rounded-xl shadow-xs">
              <img
                src={brandConfig.logoUrl}
                alt={brandConfig.name}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-xs font-bold text-[#E66001] tracking-wide">
              One Destination. Endless Choices.
            </p>
            <p className="text-xs text-slate-300 font-normal leading-relaxed">
              Centralized marketplace for curated cosmetics, lip colors, skincare, and traditional sarees.
            </p>
          </div>

          {/* Column 2: SHOP */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <ShoppingBag className="w-4 h-4 text-[#E66001]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">SHOP</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-200 font-medium">
              <li><Link href="/shop" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> All Products</Link></li>
              <li><Link href="/shop?category=lipsticks" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> Lipsticks & Lip Colors</Link></li>
              <li><Link href="/shop?category=lip-gloss" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> Lip Gloss & Shimmer</Link></li>
              <li><Link href="/shop?category=kajal-eyeliner" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> Kajal & Eyeliners</Link></li>
              <li><Link href="/shop?category=skincare" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> Skincare & Eye Care</Link></li>
              <li><Link href="/shop?category=sarees-handloom" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> Sarees & Handloom</Link></li>
            </ul>
          </div>

          {/* Column 3: CUSTOMER */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <User className="w-4 h-4 text-[#E66001]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">CUSTOMER</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-200 font-medium">
              <li><Link href="/profile" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> My Account</Link></li>
              <li><Link href="/orders" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> My Orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> Cart (Bag)</Link></li>
              <li><Link href="/contact" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> Help & Support</Link></li>
            </ul>
          </div>

          {/* Column 4: COMPANY */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Building2 className="w-4 h-4 text-[#E66001]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">COMPANY</h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-200 font-medium">
              <li><Link href="/about" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> About Vistora</Link></li>
              <li><Link href="/faq" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> FAQ</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#E66001] transition-colors flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-slate-500" /> Terms of Service</Link></li>
            </ul>
          </div>

          {/* Column 5: CONTACT & SUPPORT */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Headphones className="w-4 h-4 text-[#E66001]" />
              <h4 className="text-xs font-black uppercase tracking-wider text-white">CONTACT</h4>
            </div>
            <div className="space-y-2 text-xs text-slate-200 font-normal">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E66001] shrink-0 mt-0.5" />
                <span>Vistora Commerce, Promenade Towers, Mumbai, MH 400001</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E66001] shrink-0" />
                <a href="mailto:support@vistoracommerce.com" className="hover:text-[#E66001] transition-colors">support@vistoracommerce.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E66001] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[#E66001] transition-colors">+91 98765 43210</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & High-Visibility Social Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-300 font-medium">
          <p>© {new Date().getFullYear()} Vistora Commerce. All rights reserved.</p>
          
          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Follow Us:</span>
            
            {socialConfig.links.instagram && (
              <a
                href={socialConfig.links.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1E293B] border border-slate-700 text-white hover:bg-[#A50025] hover:border-[#A50025] flex items-center justify-center transition-all duration-200 shadow-xs"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {socialConfig.links.facebook && (
              <a
                href={socialConfig.links.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1E293B] border border-slate-700 text-white hover:bg-[#A50025] hover:border-[#A50025] flex items-center justify-center transition-all duration-200 shadow-xs"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {socialConfig.links.twitter && (
              <a
                href={socialConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1E293B] border border-slate-700 text-white hover:bg-[#A50025] hover:border-[#A50025] flex items-center justify-center transition-all duration-200 shadow-xs"
                aria-label="Twitter"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
            {socialConfig.links.linkedin && (
              <a
                href={socialConfig.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1E293B] border border-slate-700 text-white hover:bg-[#A50025] hover:border-[#A50025] flex items-center justify-center transition-all duration-200 shadow-xs"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
