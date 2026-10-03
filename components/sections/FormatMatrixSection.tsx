'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building, Laptop, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';

export const FormatMatrixSection: React.FC = () => {
  return (
    <section id="format" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <Badge variant="blue" size="md">
            Unified Competition Framework
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-darkText tracking-tight leading-tight px-2">
            PARTICIPATION{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              FORMATS.
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-2">
            One single judging framework. Location determines your initial pitching medium.
          </p>
        </div>

        {/* Dual Pitching Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
          {/* Format 1: Karachi & IU */}
          <Card className="p-5 sm:p-8 space-y-5 sm:space-y-6 bg-white border-slate-200 shadow-xl border-t-4 border-t-brand-blue">
            <div className="flex items-center justify-between">
              <Badge variant="blue" size="sm">
                In-Person Pitch
              </Badge>
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue">
                <Building className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black font-display text-brand-darkText">
                Karachi & Iqra University Startups
              </h3>
              <p className="text-xs text-brand-blue font-mono font-bold mt-1 uppercase">
                PHYSICAL PITCHING ROUNDS
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Teams based in Karachi or representing Iqra University participate in live physical pitching sessions in front of the judging panel at Iqra University Main Campus.
            </p>

            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0" />
                <span>Live presentation to on-site panel</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0" />
                <span>Direct networking with judges & visitors</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0" />
                <span>Eligibility for physical showcase marquee</span>
              </li>
            </ul>
          </Card>

          {/* Format 2: Other Cities in Sindh */}
          <Card className="p-5 sm:p-8 space-y-5 sm:space-y-6 bg-white border-slate-200 shadow-xl border-t-4 border-t-brand-purple">
            <div className="flex items-center justify-between">
              <Badge variant="purple" size="sm">
                Online Pitch
              </Badge>
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                <Laptop className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black font-display text-brand-darkText">
                Other Cities Across Sindh
              </h3>
              <p className="text-xs text-brand-purple font-mono font-bold mt-1 uppercase">
                VIRTUAL PITCHING ROUNDS
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Founders from Hyderabad, Sukkur, Larkana, and other cities across Sindh participate via live virtual presentation rooms with equal judging standards.
            </p>

            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-purple shrink-0" />
                <span>Seamless online screen & pitch presentation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-purple shrink-0" />
                <span>Equal evaluation under central framework</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-purple shrink-0" />
                <span>Selected finalists invited to physical marquee</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Dynamic Convergence Box */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange text-white text-center space-y-3 sm:space-y-4 shadow-2xl">
          <Badge variant="slate" size="md" className="bg-white/20 text-white border-white/30">
            The Shared Destination
          </Badge>

          <h3 className="text-lg xs:text-xl sm:text-3xl lg:text-4xl font-black font-display text-white tracking-tight uppercase leading-snug">
            SELECTED STARTUPS ➔ STARTUP SHOWCASE MARQUEE ➔ SPECTRUM 2.0
          </h3>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
            Regardless of whether your initial pitch was physical or virtual, top selected ventures advance to exhibit their product live in the flagship Spectrum 2.0 Marquee.
          </p>
        </div>
      </div>
    </section>
  );
};
