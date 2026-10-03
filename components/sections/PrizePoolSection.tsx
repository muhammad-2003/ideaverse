'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Sparkles, Gift, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useSiteContent } from '@/lib/content/useSiteContent';

export const PrizePoolSection: React.FC = () => {
  const { content } = useSiteContent();
  const prizeData = content.prizePool;

  const isTba = prizeData.status === 'tba';

  return (
    <section id="prizes" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="orange" size="md">
              {prizeData.statusBadge || (isTba ? 'Sponsorship in Progress' : 'Confirmed Prize Pool')}
            </Badge>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black font-display text-brand-darkText tracking-tight uppercase">
            {prizeData.headline || 'PRIZE POOL & SPONSOR AWARDS'}
          </h2>

          {/* Official Sponsor & Prize Pool Note */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-50 via-brand-navy/5 to-slate-50 border border-slate-200/80 shadow-inner max-w-2xl mx-auto text-center">
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {prizeData.note}
            </p>
          </div>
        </div>

        {/* Prize Pool Blocks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {prizeData.blocks.map((block, idx) => {
            const isFirst = idx === 0;
            return (
              <motion.div
                key={block.id || block.title || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full"
              >
                <Card
                  className={`h-full flex flex-col justify-between p-6 sm:p-7 relative transition-all duration-300 hover:-translate-y-1 ${
                    isFirst
                      ? 'border-2 border-brand-orange bg-gradient-to-b from-orange-50/40 via-white to-white shadow-xl shadow-orange-500/10'
                      : 'border-slate-200 bg-white hover:border-brand-navy hover:shadow-lg'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                          isFirst
                            ? 'bg-gradient-to-br from-brand-orange to-amber-500 text-white'
                            : idx === 1
                            ? 'bg-gradient-to-br from-slate-700 to-slate-900 text-white'
                            : idx === 2
                            ? 'bg-gradient-to-br from-brand-blue to-cyan-500 text-white'
                            : 'bg-gradient-to-br from-purple-600 to-brand-purple text-white'
                        }`}
                      >
                        {isFirst ? (
                          <Trophy className="w-6 h-6" />
                        ) : idx === 1 ? (
                          <Award className="w-6 h-6" />
                        ) : idx === 2 ? (
                          <Flame className="w-6 h-6" />
                        ) : (
                          <Gift className="w-6 h-6" />
                        )}
                      </div>

                      {block.badge && (
                        <span
                          className={`text-[10px] font-mono font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                            isFirst
                              ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {block.badge}
                        </span>
                      )}
                    </div>

                    {/* Title & Value */}
                    <div>
                      <h3 className="text-lg font-black font-display text-brand-darkText">
                        {block.title}
                      </h3>
                      <div
                        className={`text-xl sm:text-2xl font-black font-display mt-1 ${
                          isFirst ? 'text-brand-orange' : 'text-brand-navy'
                        }`}
                      >
                        {block.amount}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {block.description}
                    </p>

                    {/* Perks List */}
                    {block.perks && block.perks.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-2">
                        {block.perks.map((perk, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-start gap-2 text-xs text-slate-700 font-medium"
                          >
                            <CheckCircle2
                              className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                                isFirst ? 'text-brand-orange' : 'text-emerald-500'
                              }`}
                            />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Guarantee */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-blue" />
          <span>All awards and certificates are officially validated by IU Entrepreneurship Society & Iqra University.</span>
        </div>
      </div>
    </section>
  );
};
