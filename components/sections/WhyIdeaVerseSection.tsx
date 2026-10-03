'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Presentation, Network, LayoutGrid, Eye, Trophy, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { eventConfig } from '@/config/event';

export const WhyIdeaVerseSection: React.FC = () => {
  const pillars = [
    {
      title: 'PITCH',
      description: 'Present your technology, business model, and vision directly to experienced founders and judges.',
      icon: Presentation,
      color: 'text-brand-blue',
    },
    {
      title: 'CONNECT',
      description: 'Engage with fellow founders, mentors, investors, and entrepreneurial ecosystem leaders.',
      icon: Network,
      color: 'text-brand-purple',
    },
    {
      title: 'SHOWCASE',
      description: 'Selected ventures win dedicated exhibition space in the high-footfall Spectrum 2.0 Marquee.',
      icon: LayoutGrid,
      color: 'text-cyan-600',
    },
    {
      title: 'VISIBILITY',
      description: 'Build brand awareness for your startup across social channels, university media, and tech networks.',
      icon: Eye,
      color: 'text-amber-600',
    },
    {
      title: 'RECOGNITION',
      description: 'Top winning teams earn official trophies, university certificates, and ecosystem endorsement.',
      icon: Trophy,
      color: 'text-emerald-600',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="orange" size="md">
            Venture Acceleration
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-darkText tracking-tight leading-tight px-2">
            WHY PARTICIPATE IN{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              IDEAVERSE?
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium">
            More than a contest — an immersive springboard for ambitious technology founders.
          </p>
        </div>

        {/* Pillars Flex Container (Flawless Wrap across all Screen Widths) */}
        <div className="flex flex-wrap items-stretch justify-center gap-5 sm:gap-6 w-full">
          {pillars.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex-1 min-w-[220px] sm:min-w-[240px] max-w-[320px] w-full"
            >
              <Card className="p-5 sm:p-6 h-full flex flex-col justify-between bg-white border-slate-200 shadow-lg hover:border-brand-blue">
                <div className="space-y-3 sm:space-y-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-black font-display text-brand-darkText tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Prize Money Status Note */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-3 max-w-4xl mx-auto shadow-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>
              <strong>Prize Pool Note:</strong> Prize money details are planned and subject to final sponsorship confirmation.
            </span>
          </div>
          <Badge variant="amber" size="sm">
            {eventConfig.prizeMoneyConfirmed ? 'Confirmed' : 'Announcement Pending'}
          </Badge>
        </div>
      </div>
    </section>
  );
};
