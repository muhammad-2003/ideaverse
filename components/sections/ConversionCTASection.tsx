'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { eventConfig } from '@/config/event';

interface ConversionCTASectionProps {
  onOpenApply: () => void;
}

export const ConversionCTASection: React.FC<ConversionCTASectionProps> = ({ onOpenApply }) => {
  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange text-white">
      {/* Dynamic Background Flare */}
      <div className="absolute inset-0 bg-white/5 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center z-10 space-y-8">
        <Badge variant="slate" pulse size="md" className="bg-white/20 text-white border-white/30">
          {eventConfig.applicationsOpen ? 'Applications Officially Open' : 'Coming Soon'}
        </Badge>

        <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight text-white leading-[0.95] uppercase">
          YOUR IDEA
          <br />
          <span className="text-amber-300 drop-shadow-md">
            DESERVES A STAGE.
          </span>
        </h2>

        <p className="max-w-xl mx-auto text-base sm:text-xl text-slate-100 font-medium">
          Take the first step today. Create your IdeaVerse profile in less than 2 minutes and submit your official application for Spectrum 2.0.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/apply" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              icon={Sparkles}
              className="w-full sm:w-auto text-base uppercase tracking-wider py-5 px-12 text-brand-blue font-extrabold bg-white hover:bg-slate-100 shadow-2xl"
            >
              Start Your Application
            </Button>
          </Link>
        </div>

        <p className="text-xs text-slate-200 font-mono font-medium">
          {eventConfig.parentEvent} • {eventConfig.university} • {eventConfig.eventPeriod}
        </p>
      </div>
    </section>
  );
};
