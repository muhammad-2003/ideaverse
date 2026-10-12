'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, FileText, SearchCheck, CreditCard, ShieldCheck, Users, Info } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { eventConfig } from '@/config/event';

const stepIcons = [FileText, SearchCheck, CreditCard, ShieldCheck];

export const ProcessTimelineSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 relative bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <Badge variant="navy" size="md">
            Participation Process
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-navy tracking-tight leading-tight px-2">
            WHO JOINS, HOW THEY ENTER,{' '}
            <span className="bg-gradient-to-r from-brand-navy via-[#003B66] to-brand-orange bg-clip-text text-transparent">
              HOW THEY WIN.
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium px-2">
            A clear 4-stage qualification pathway from application to verified pitching.
          </p>
        </div>

        {/* 4-Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {eventConfig.timelineSteps.map((item, idx) => {
            const IconComponent = stepIcons[idx] || CheckCircle2;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="relative p-6 sm:p-7 h-full flex flex-col justify-between group hover:border-brand-orange bg-white border-slate-200 shadow-md">
                  <div className="space-y-4 text-left">
                    {/* Step Number & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-3xl font-black text-brand-orange group-hover:text-brand-navy transition-colors">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-brand-navy group-hover:bg-brand-orange/10 group-hover:text-brand-orange transition-colors">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-xl font-black font-display text-brand-navy tracking-tight group-hover:text-brand-orange transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono font-bold">
                    <span>STEP {item.step} OF 04</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* PARTICIPATION TARGETS & REGISTRATION FEES ROW (Page 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Target Participation Card */}
          <Card className="lg:col-span-6 p-6 sm:p-8 bg-white border-slate-200 shadow-md space-y-5 text-left flex flex-col justify-between">
            <div className="space-y-4">
              <Badge variant="blue" size="sm">
                Target Participation
              </Badge>
              <h3 className="text-xl sm:text-2xl font-black font-display text-brand-navy">
                Cohort Breakdown &amp; Capacity
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                IdeaVerse 2.0 accommodates a total cohort of <strong>30–40 startups</strong>, with a maximum of <strong>4 members per startup/team</strong>.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-brand-navy/5 border border-brand-navy/15 text-center">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-brand-navy">10–15</div>
                  <div className="text-[11px] font-bold text-slate-600 uppercase mt-1">IU Startups / Teams</div>
                </div>

                <div className="p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/15 text-center">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-brand-blue">20–25</div>
                  <div className="text-[11px] font-bold text-slate-600 uppercase mt-1">External Teams Across Sindh</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-mono">
              <Users className="w-4 h-4 text-brand-orange shrink-0" />
              <span>Maximum 4 members per startup/team</span>
            </div>
          </Card>

          {/* Registration Fees Card */}
          <Card className="lg:col-span-6 p-6 sm:p-8 bg-white border-slate-200 shadow-md space-y-5 text-left flex flex-col justify-between">
            <div className="space-y-4">
              <Badge variant="orange" size="sm">
                Registration Fees
              </Badge>
              <h3 className="text-xl sm:text-2xl font-black font-display text-brand-navy">
                Fee Structure (Per Startup / Team)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase text-slate-500">
                    IU Participants
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-brand-navy">
                    {eventConfig.fees.iu}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    Per startup / team
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-orange-50/60 border border-brand-orange/30 text-left space-y-1">
                  <div className="text-[10px] font-mono font-bold uppercase text-brand-orange">
                    External Participants
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-brand-orange">
                    {eventConfig.fees.external}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    Karachi and other Sindh cities
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{eventConfig.fees.note}</span>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
