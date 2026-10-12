'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldAlert, Users, Layers, Award, Plane } from 'lucide-react';
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
            Qualification &amp; Eligibility
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-darkText tracking-tight leading-tight px-2">
            WHO SHOULD{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              APPLY?
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-2 font-medium">
            IdeaVerse 2.0 targets student-led and emerging startups with demonstrable proof-of-concept or operational traction.
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
                <div className="space-y-3 text-left">
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

        {/* Team Limit, Stage Policy, and Travel Policy Cards (From PDF Pages 4 & 6) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
          <Card className="p-5 sm:p-6 flex flex-col justify-between bg-slate-50 border-slate-200">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-display text-brand-darkText">
                Team Size Constraint
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Maximum <strong className="text-brand-blue">4 members</strong> per startup/team (including Team Lead). All team members must be listed in the application.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-mono font-bold text-slate-500">
              Target Cohort: 30–40 Startups Total
            </div>
          </Card>

          <Card className="p-5 sm:p-6 flex flex-col justify-between bg-slate-50 border-slate-200">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center text-brand-orange shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-display text-brand-darkText">
                Stage Evaluation Policy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Startup stage is considered when assessing validation and traction; stage and location do not create separate categories. Pure idea concepts without prototypes are ineligible.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-mono font-bold text-brand-orange">
              Unified 8-Criteria Scoring Framework
            </div>
          </Card>

          <Card className="p-5 sm:p-6 flex flex-col justify-between bg-slate-50 border-slate-200">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                <Plane className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold font-display text-brand-darkText">
                Travel &amp; Accommodation Note
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                No travel or accommodation support is provided for out-of-Karachi participants; showcase startups arrange their own travel for the 14 Nov Marquee.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-mono font-bold text-slate-500">
              Virtual Pitching via Zoom on 10 Nov
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
