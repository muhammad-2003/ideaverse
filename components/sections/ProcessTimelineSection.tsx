'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { eventConfig } from '@/config/event';

export const ProcessTimelineSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 relative bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <Badge variant="navy" size="md">
            The Journey
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-navy tracking-tight leading-tight px-2">
            HOW IDEAVERSE{' '}
            <span className="bg-gradient-to-r from-brand-navy via-[#003B66] to-brand-orange bg-clip-text text-transparent">
              WORKS.
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium px-2">
            A structured 6-stage path designed to evaluate, elevate, and celebrate emerging ventures.
          </p>
        </div>

        {/* Timeline Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {eventConfig.timelineSteps.map((item, idx) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className="relative p-6 sm:p-8 h-full flex flex-col justify-between group hover:border-brand-orange bg-white border-slate-200 shadow-md">
                <div className="space-y-4">
                  {/* Step Number Badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-brand-orange group-hover:text-brand-navy transition-colors">
                      {item.step}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
                  </div>

                  <h3 className="text-xl font-black font-display text-brand-navy tracking-tight group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono font-bold">
                  <span>STAGE {item.step} OF 06</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
