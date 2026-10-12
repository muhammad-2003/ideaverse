'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, MapPin, Store, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { eventConfig } from '@/config/event';

export const EventIntroSection: React.FC = () => {
  return (
    <section id="experience" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        {/* Main Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="blue" size="md">
                The Big Picture
              </Badge>
              <Badge variant="orange" size="md">
                Under Spectrum 2.0
              </Badge>
            </div>

            <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-darkText tracking-tight uppercase leading-[1.05]">
              WHAT IDEAVERSE 2.0{' '}
              <span className="bg-gradient-to-r from-brand-navy via-brand-blue to-brand-orange bg-clip-text text-transparent">
                IS.
              </span>
            </h2>

            <p className="text-base sm:text-lg md:text-xl text-slate-800 leading-relaxed font-semibold">
              IdeaVerse 2.0 is a startup pitching and showcase competition under Spectrum 2.0. It gives student-led and emerging startups a stage to pitch, meet entrepreneurs and industry professionals, and exhibit their ventures in a live showcase. This year it opens up to all of Sindh.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Organized by the <strong className="text-brand-orange">{eventConfig.organizer}</strong> at <strong className="text-brand-darkText">{eventConfig.university}</strong>, IdeaVerse 2.0 brings together ambitious founders from Iqra University, Karachi, and across Sindh under one unified judging framework.
            </p>

            {/* SEAMLESS PREMIUM BRAND LOGOS HUB */}
            <div className="pt-2 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Official Organizing Ecosystem
              </div>

              <div className="flex flex-wrap items-center justify-start gap-6 sm:gap-8 pt-1">
                {/* Iqra University Logo */}
                <img
                  src="/images/iqra_university_logo.png"
                  alt="Iqra University Official Logo"
                  className="h-10 sm:h-12 w-auto object-contain hover:scale-105 transition-transform"
                />

                <span className="h-8 w-px bg-slate-200 hidden sm:inline-block" />

                {/* Spectrum 2.0 Logo */}
                <img
                  src="/images/spectrum_20_logo.jpg"
                  alt="IU Spectrum 2.0 Logo"
                  className="h-11 sm:h-12 w-auto object-contain rounded-xl shadow-md hover:scale-105 transition-transform"
                />

                <span className="h-8 w-px bg-slate-200 hidden sm:inline-block" />

                {/* Horizontal IUES Logo */}
                <img
                  src="/images/iues_logo.png"
                  alt="IU Entrepreneurship Society Logo"
                  className="h-9 sm:h-11 w-auto object-contain hover:scale-105 transition-transform"
                />
              </div>

              <div className="text-[11px] font-mono text-slate-500 pt-1">
                Society Leadership: President: <strong>{eventConfig.leadership.president}</strong> | Patron: <strong>{eventConfig.leadership.patron}</strong>
              </div>
            </div>
          </div>

          {/* 4 Pillars representing the official specs */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Card className="p-5 sm:p-6 space-y-2.5 sm:space-y-3 bg-white border-slate-200 shadow-md hover:border-brand-navy transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-navy/10 border border-brand-navy/20 flex items-center justify-center text-brand-navy">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black font-display text-brand-darkText uppercase">3 Event Days</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                10 Nov (Virtual), 11 Nov (Physical), and 14 Nov (Showcase Marquee).
              </p>
            </Card>

            <Card className="p-5 sm:p-6 space-y-2.5 sm:space-y-3 bg-white border-slate-200 shadow-md hover:border-brand-orange transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black font-display text-brand-darkText uppercase">30–40 Startups</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                10–15 IU teams &amp; 20–25 external startups from across Sindh.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 space-y-2.5 sm:space-y-3 bg-white border-slate-200 shadow-md hover:border-brand-navy transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-navy/10 border border-brand-navy/20 flex items-center justify-center text-brand-navy">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black font-display text-brand-darkText uppercase">All of Sindh</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Unified judging: location decides pitch format only, never the category.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 space-y-2.5 sm:space-y-3 bg-white border-slate-200 shadow-md hover:border-emerald-500 transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <Store className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black font-display text-brand-darkText uppercase">10–15 Booths</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Top selected ventures exhibit live in the ground-floor IdeaVerse Marquee.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
