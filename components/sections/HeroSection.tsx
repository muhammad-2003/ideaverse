'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { eventConfig } from '@/config/event';

interface HeroSectionProps {
  onOpenApply: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenApply }) => {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center pt-28 xs:pt-32 sm:pt-36 pb-16 sm:pb-24 px-3 xs:px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
      {/* Background Flare */}
      <div className="absolute inset-0 bg-ideaverse-hero pointer-events-none" />
      <div className="absolute inset-0 bg-bright-grid bg-[size:24px_24px] xs:bg-[size:30px_30px] sm:bg-[size:40px_40px] pointer-events-none opacity-50" />

      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] xs:w-[350px] sm:w-[600px] md:w-[800px] h-[280px] xs:h-[350px] sm:h-[600px] md:h-[800px] bg-brand-navy/5 rounded-full blur-[80px] sm:blur-[160px] pointer-events-none animate-pulse-glow" />

      <div className="relative max-w-6xl mx-auto text-center z-10 space-y-8 sm:space-y-10 w-full">
        {/* PREMIUM SEAMLESS BRAND SHOWCASE HUB (No Clunky Boxes!) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-4 sm:p-6 rounded-3xl bg-white/95 border border-slate-200/90 shadow-2xl shadow-slate-200/80 backdrop-blur-2xl space-y-4 max-w-4xl mx-auto"
        >
          <div className="text-[10px] sm:text-xs font-mono font-bold text-slate-400 uppercase tracking-widest text-center">
            Official Competition Organizing Partners
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12 py-2">
            {/* Iqra University Logo (Increased Size & Premium Presentation) */}
            <div className="flex items-center gap-3 hover:scale-105 transition-transform">
              <img
                src="/images/iqra_university_logo.png"
                alt="Iqra University Official Logo"
                className="h-10 sm:h-14 md:h-16 w-auto object-contain"
              />
            </div>

            <span className="hidden sm:inline-block h-10 w-px bg-slate-200" />

            {/* Spectrum 2.0 Logo Highlight */}
            <div className="flex items-center gap-3 hover:scale-105 transition-transform">
              <img
                src="/images/spectrum_20_logo.jpg"
                alt="IU Spectrum 2.0 Logo"
                className="h-11 sm:h-14 md:h-16 w-auto object-contain rounded-xl shadow-md"
              />
            </div>

            <span className="hidden sm:inline-block h-10 w-px bg-slate-200" />

            {/* IUES Horizontal Logo Highlight */}
            <div className="flex items-center gap-3 hover:scale-105 transition-transform">
              <img
                src="/images/iues_logo.png"
                alt="IU Entrepreneurship Society Logo"
                className="h-9 sm:h-12 md:h-14 w-auto object-contain"
              />
            </div>
          </div>
        </motion.div>

        {/* OFFICIAL IDEAVERSE 2.0 PICTURE LOGO BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-4 sm:space-y-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="orange" pulse size="sm" className="sm:text-xs">
              {eventConfig.applicationsOpen ? 'Applications Officially Open' : 'Coming Soon'}
            </Badge>
            <Badge variant="navy" size="sm" className="sm:text-xs">
              Spectrum 2.0 Flagship Event
            </Badge>
          </div>

          {/* Large Hero Banner Picture */}
          <div className="max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-200/80">
            <img
              src="/images/ideaverse_20_logo.png"
              alt="IdeaVerse 2.0 Startup Pitching & Showcase Competition Header"
              className="w-full h-auto max-h-40 sm:max-h-60 md:max-h-72 object-contain mx-auto"
            />
          </div>

          <p className="max-w-3xl mx-auto text-xs xs:text-sm sm:text-base md:text-lg text-brand-navy font-sans font-medium leading-relaxed pt-1 sm:pt-2 px-3">
            Sindh&apos;s premier high-energy startup pitching & showcase competition. Bringing together student founders and emerging startups to build a bright entrepreneurial future.
          </p>
        </motion.div>

        {/* EVENT META BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 py-2.5 sm:py-4 px-4 sm:px-8 rounded-2xl sm:rounded-full bg-white border border-slate-200 shadow-md sm:shadow-xl shadow-slate-200/70 text-xs sm:text-sm text-brand-navy font-bold w-full sm:w-auto"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-orange shrink-0" />
            <span>{eventConfig.eventPeriod}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-navy shrink-0" />
            <span>{eventConfig.venue}</span>
          </div>
          <span className="hidden sm:inline text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-orange shrink-0" />
            <span>Up to {eventConfig.maxTeamSize} Members / Team</span>
          </div>
        </motion.div>

        {/* ACTION CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 pt-1 sm:pt-2"
        >
          <Link href="/apply" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              icon={Sparkles}
              className="w-full sm:w-auto text-xs sm:text-sm uppercase tracking-widest py-3.5 sm:py-5 px-8 sm:px-12 min-h-[44px]"
            >
              Apply for IdeaVerse 2.0
            </Button>
          </Link>

          <Button
            onClick={() => {
              const el = document.getElementById('experience');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            variant="secondary"
            size="lg"
            icon={ArrowRight}
            className="w-full sm:w-auto text-xs sm:text-sm uppercase tracking-widest py-3.5 sm:py-5 px-6 sm:px-10 min-h-[44px]"
          >
            Explore Experience
          </Button>
        </motion.div>

        {/* FEATURE PILLARS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 pt-4 sm:pt-10 text-left"
        >
          <div className="p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm sm:shadow-lg shadow-slate-200/50 hover:border-brand-navy transition-all hover:-translate-y-1">
            <div className="text-xs xs:text-sm sm:text-xl font-black font-display text-brand-navy truncate">KARACHI & IU</div>
            <div className="text-[9px] xs:text-[10px] sm:text-xs text-brand-orange font-bold font-mono mt-0.5 sm:mt-1 truncate">PHYSICAL PITCHING</div>
            <div className="text-[10px] xs:text-xs text-slate-500 mt-1 leading-snug">Live at Iqra University</div>
          </div>

          <div className="p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm sm:shadow-lg shadow-slate-200/50 hover:border-brand-orange transition-all hover:-translate-y-1">
            <div className="text-xs xs:text-sm sm:text-xl font-black font-display text-brand-navy truncate">SINDH CITIES</div>
            <div className="text-[9px] xs:text-[10px] sm:text-xs text-brand-navy font-bold font-mono mt-0.5 sm:mt-1 truncate">VIRTUAL PITCHING</div>
            <div className="text-[10px] xs:text-xs text-slate-500 mt-1 leading-snug">Live online pitch rooms</div>
          </div>

          <div className="p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm sm:shadow-lg shadow-slate-200/50 hover:border-brand-navy transition-all hover:-translate-y-1">
            <div className="text-xs xs:text-sm sm:text-xl font-black font-display text-brand-navy truncate">MARQUEE</div>
            <div className="text-[9px] xs:text-[10px] sm:text-xs text-brand-orange font-bold font-mono mt-0.5 sm:mt-1 truncate">STARTUP SHOWCASE</div>
            <div className="text-[10px] xs:text-xs text-slate-500 mt-1 leading-snug">Spectrum 2.0 Marquee</div>
          </div>

          <div className="p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm sm:shadow-lg shadow-slate-200/50 hover:border-emerald-500 transition-all hover:-translate-y-1">
            <div className="text-xs xs:text-sm sm:text-xl font-black font-display text-brand-navy truncate">RECOGNITION</div>
            <div className="text-[9px] xs:text-[10px] sm:text-xs text-emerald-600 font-bold font-mono mt-0.5 sm:mt-1 truncate">AWARDS & TROPHIES</div>
            <div className="text-[10px] xs:text-xs text-slate-500 mt-1 leading-snug">Official Endorsement</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
