'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { eventConfig } from '@/config/event';

interface NavigationProps {
  onOpenApply: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onOpenApply }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Experience', href: '#experience' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Format', href: '#format' },
    { label: 'Eligibility', href: '#eligibility' },
    { label: 'Previous Edition', href: '#previous-edition' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-2xl border-b border-slate-200 py-3 shadow-md shadow-slate-200/50'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Main IdeaVerse 2.0 Header Banner */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="h-11 sm:h-13 max-w-[200px] xs:max-w-[240px] sm:max-w-[300px] flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/images/ideaverse_20_logo.png"
                alt="IdeaVerse 2.0 Banner"
                className="h-full w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav Links (1024px+) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-extrabold uppercase tracking-widest text-brand-navy hover:text-brand-orange transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-orange after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Link href="/apply">
              <Button
                variant="primary"
                size="md"
                icon={Sparkles}
                className="text-xs uppercase tracking-widest px-5 py-2.5"
              >
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Mobile & Tablet Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link href="/apply">
              <Button
                variant="primary"
                size="sm"
                icon={Sparkles}
                className="text-[10px] sm:text-xs uppercase tracking-wider px-3.5 py-2"
              >
                Apply
              </Button>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-brand-navy hover:text-brand-orange hover:bg-slate-100 transition-colors focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 sm:px-6 pt-4 pb-6 space-y-4 shadow-2xl">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-extrabold uppercase tracking-widest text-brand-navy hover:text-brand-orange py-2.5 border-b border-slate-100 flex items-center"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
