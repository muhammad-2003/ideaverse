'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldAlert, Users, Layers, Award } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { eventConfig } from '@/config/event';

export const EligibilitySection: React.FC = () => {
  return (
    <section id="eligibility" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <Badge variant="blue" size="md">
            Qualification Criteria
          </Badge>
          <h2 className="text-3xl xs:text-4xl sm:text-6xl font-black font-display text-brand-darkText tracking-tight">
            WHO SHOULD{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              APPLY?
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-2">
            IdeaVerse is tailored for serious working prototypes and operational early-stage ventures.
          </p>
        </div>

        {/* Stage Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          {eventConfig.eligibleStages.map((stage, idx) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card className={`p-5 sm:p-6 h-full flex flex-col justify-between bg-white border-slate-200 shadow-md ${stage.recommended ? 'border-2 border-brand-blue shadow-lg' : ''}`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={stage.recommended ? 'blue' : 'slate'} size="sm">
                      {stage.recommended ? 'Recommended Stage' : 'Eligible Stage'}
                    </Badge>
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold font-display text-brand-darkText">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {stage.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Team Limit & Pure Idea Rule Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          <Card className="p-5 sm:p-8 flex flex-col xs:flex-row items-start gap-3.5 sm:gap-5 bg-slate-50 border-slate-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-lg sm:text-xl font-bold font-display text-brand-darkText">
                Team Size Constraint
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Maximum <strong className="text-brand-blue">4 members</strong> per team (including Team Lead). All team members must be registered in the official application.
              </p>
            </div>
          </Card>

          <Card className="p-5 sm:p-8 flex flex-col xs:flex-row items-start gap-3.5 sm:gap-5 bg-amber-50 border-amber-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-lg sm:text-xl font-bold font-display text-brand-darkText">
                Stage Policy Note
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Pure napkin/idea-stage concepts without a working prototype or MVP are <strong className="text-amber-700">not eligible</strong>. Demonstrable execution capacity is required.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
