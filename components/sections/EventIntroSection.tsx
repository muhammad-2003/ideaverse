'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lightbulb, Compass, Zap } from 'lucide-react';
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
            <Badge variant="blue" size="md">
              Spectrum 2.0 Parent Ecosystem
            </Badge>

            <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-darkText tracking-tight uppercase leading-[1.05]">
              WHERE TALENT MEETS THE NATION{' '}
              <span className="bg-gradient-to-r from-brand-navy via-brand-blue to-brand-orange bg-clip-text text-transparent">
                IN SINDH.
              </span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-medium">
              IdeaVerse 2.0 is the official flagship startup pitching and showcase competition under <strong className="text-brand-navy">{eventConfig.parentEvent}</strong>, organized by the <strong className="text-brand-orange">{eventConfig.organizer}</strong> at <strong className="text-brand-darkText">{eventConfig.university}</strong>.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Driven by the motto <strong className="text-brand-orange">&quot;Innovate | Initiate | Impact&quot;</strong>, we connect student-led ventures and emerging startups from Iqra University, Karachi, and across Sindh to present before expert judges and showcase their solutions in the flagship Spectrum 2.0 Marquee.
            </p>

            {/* SEAMLESS PREMIUM BRAND LOGOS HUB */}
            <div className="pt-2 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                Official Organizing Brand Ecosystem
              </div>

              <div className="flex flex-wrap items-center justify-start gap-6 sm:gap-8 pt-2">
                {/* Iqra University Logo (Enlarged) */}
                <img
                  src="/images/iqra_university_logo.png"
                  alt="Iqra University Official Logo"
                  className="h-10 sm:h-14 w-auto object-contain hover:scale-105 transition-transform"
                />

                <span className="h-8 w-px bg-slate-200 hidden sm:inline-block" />

                {/* Spectrum 2.0 Logo */}
                <img
                  src="/images/spectrum_20_logo.jpg"
                  alt="IU Spectrum 2.0 Logo"
                  className="h-11 sm:h-14 w-auto object-contain rounded-xl shadow-md hover:scale-105 transition-transform"
                />

                <span className="h-8 w-px bg-slate-200 hidden sm:inline-block" />

                {/* Horizontal IUES Logo */}
                <img
                  src="/images/iues_logo.png"
                  alt="IU Entrepreneurship Society Logo"
                  className="h-9 sm:h-12 w-auto object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Card className="p-5 sm:p-6 space-y-2.5 sm:space-y-3 bg-white border-slate-200 shadow-md hover:border-brand-navy transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-navy/10 border border-brand-navy/20 flex items-center justify-center text-brand-navy">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black font-display text-brand-darkText uppercase">Startup Culture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fostering genuine venture execution over simple academic exercises.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 space-y-2.5 sm:space-y-3 bg-white border-slate-200 shadow-md hover:border-brand-orange transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black font-display text-brand-darkText uppercase">Execution First</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Focusing on working prototypes, functional MVPs, and early traction.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 space-y-2.5 sm:space-y-3 bg-white border-slate-200 shadow-md hover:border-brand-navy transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-navy/10 border border-brand-navy/20 flex items-center justify-center text-brand-navy">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black font-display text-brand-darkText uppercase">Regional Reach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connecting talent from Karachi to cities across Sindh via hybrid pitching.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 space-y-2.5 sm:space-y-3 bg-white border-slate-200 shadow-md hover:border-emerald-500 transition-colors">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-black font-display text-brand-darkText uppercase">Showcase Stage</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Selected finalists earn a booth in the Spectrum 2.0 Marquee.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
