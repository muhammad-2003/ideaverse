'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Sparkles, CheckCircle2, ShieldCheck, Flame, Store, MapPin, Calendar, Users, Percent, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { eventConfig } from '@/config/event';
import { useSiteContent } from '@/lib/content/useSiteContent';

export const PrizePoolSection: React.FC = () => {
  const { content } = useSiteContent();
  const prizeData = content.prizePool;

  return (
    <section id="prizes" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 relative bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20">
        {/* PART 1: EVALUATION CRITERIA (ONE UNIFIED FRAMEWORK) - Page 4 */}
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <Badge variant="blue" size="md">
              Scoring Matrix
            </Badge>
            <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-darkText tracking-tight uppercase leading-tight px-2">
              EVALUATION{' '}
              <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
                CRITERIA.
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-medium px-2">
              One unified 8-criteria scoring framework for every participating startup across Sindh.
            </p>
          </div>

          {/* 8 Criteria Grid with Percentages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {eventConfig.evaluationCriteria.map((item, idx) => {
              const isHighWeight = item.percentage === 15;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Card className={`p-5 sm:p-6 h-full flex flex-col justify-between bg-white border-slate-200 shadow-sm hover:shadow-md transition-all ${isHighWeight ? 'border-t-4 border-t-brand-blue' : 'border-t-4 border-t-slate-400'}`}>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black font-mono text-brand-navy">
                          {item.percentage}%
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${isHighWeight ? 'bg-brand-blue/10 text-brand-blue' : 'bg-slate-100 text-slate-600'}`}>
                          Weight
                        </span>
                      </div>

                      <h3 className="text-base font-black font-display text-brand-darkText">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100">
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isHighWeight ? 'bg-brand-blue' : 'bg-slate-400'}`}
                          style={{ width: `${(item.percentage / 15) * 100}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Evaluation Framework Callout from Page 4 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-brand-blue/20 max-w-4xl mx-auto text-left flex items-start gap-3">
            <Percent className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <strong className="text-brand-navy">Total: 100%.</strong> Startup stage is considered when assessing validation and traction; stage and location do not create separate categories.
            </div>
          </div>
        </div>

        {/* PART 2: THE IDEAVERSE MARQUEE (SHOWCASE) - Page 5 */}
        <div className="p-6 sm:p-10 lg:p-12 rounded-3xl bg-slate-900 text-white space-y-8 sm:space-y-12 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Text & Layout Specs */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <Badge variant="orange" size="md">
                Startup Showcase
              </Badge>

              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight uppercase">
                THE IDEAVERSE MARQUEE
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                On Saturday 14 Nov, the top 10–15 startups from both virtual and physical rounds advance to exhibit their ventures live in the dedicated IdeaVerse Marquee on the Ground Floor of Iqra University Main Campus.
              </p>

              {/* Meta specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                  <div className="text-[10px] font-mono text-amber-300 uppercase">WHERE</div>
                  <div className="font-bold text-white mt-0.5">{eventConfig.marquee.where}</div>
                </div>

                <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                  <div className="text-[10px] font-mono text-amber-300 uppercase">WHEN</div>
                  <div className="font-bold text-white mt-0.5">{eventConfig.marquee.when}</div>
                </div>

                <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                  <div className="text-[10px] font-mono text-amber-300 uppercase">WHO</div>
                  <div className="font-bold text-white mt-0.5">{eventConfig.marquee.who}</div>
                </div>

                <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                  <div className="text-[10px] font-mono text-amber-300 uppercase">SETUP</div>
                  <div className="font-bold text-white mt-0.5">{eventConfig.marquee.setup}</div>
                </div>
              </div>

              {/* In The Render 4 Elements */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  In The Marquee Layout
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                  {eventConfig.marquee.features.map((feat) => (
                    <div key={feat.number} className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                      <span className="w-5 h-5 rounded-full bg-brand-orange text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                        {feat.number}
                      </span>
                      <div>
                        <div className="font-bold text-white">{feat.title}</div>
                        <div className="text-[11px] text-slate-400 leading-snug">{feat.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Architectural Floorplan Schematic (No Render Image) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="rounded-2xl p-6 sm:p-8 bg-slate-950 border border-white/20 shadow-2xl relative space-y-6 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Ground Floor Marquee • Layout Plan
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded bg-white/10 border border-white/15">
                    10–15 Stalls
                  </span>
                </div>

                {/* Visual Blueprint Diagram */}
                <div className="space-y-4">
                  {/* Item 1: Entrance Arch */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-brand-navy via-brand-blue to-brand-orange text-white flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-white text-brand-navy font-mono font-black text-xs flex items-center justify-center shrink-0">
                        1
                      </span>
                      <div>
                        <div className="text-xs font-black uppercase tracking-wider">Grand Entrance Arch</div>
                        <div className="text-[10px] text-white/80">IdeaVerse 2.0 &amp; Society Branding</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-white/20 px-2 py-0.5 rounded">Entryway</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="text-center text-slate-500 font-mono text-xs">▼ Main Entry Point ▼</div>

                  {/* Exhibition Area with Central Walkway & Booths */}
                  <div className="grid grid-cols-12 gap-2 p-3 rounded-xl bg-slate-900 border border-white/10">
                    {/* Left Booth Row (Backdrop + Counter) */}
                    <div className="col-span-4 space-y-2">
                      <div className="text-[9px] font-mono text-slate-400 uppercase text-center">Row A Stalls</div>
                      <div className="p-2.5 rounded-lg bg-white/10 border border-white/15 space-y-1 text-center">
                        <div className="text-[10px] font-bold text-amber-300">Backdrop Panels (2)</div>
                        <div className="text-[9px] text-slate-300 font-mono">Front Counter (3)</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/10 border border-white/15 space-y-1 text-center">
                        <div className="text-[10px] font-bold text-amber-300">Backdrop Panels (2)</div>
                        <div className="text-[9px] text-slate-300 font-mono">Front Counter (3)</div>
                      </div>
                    </div>

                    {/* Central Walkway */}
                    <div className="col-span-4 rounded-lg bg-brand-orange/15 border border-brand-orange/30 p-3 flex flex-col items-center justify-center text-center">
                      <span className="w-6 h-6 rounded-full bg-brand-orange text-white font-mono font-bold text-xs flex items-center justify-center mb-1">
                        4
                      </span>
                      <div className="text-[11px] font-black text-amber-300 uppercase leading-tight">
                        Open Walkway
                      </div>
                      <div className="text-[9px] text-slate-300 mt-1 leading-snug">
                        Visitors, Judges &amp; Industry Guests
                      </div>
                    </div>

                    {/* Right Booth Row (Backdrop + Counter) */}
                    <div className="col-span-4 space-y-2">
                      <div className="text-[9px] font-mono text-slate-400 uppercase text-center">Row B Stalls</div>
                      <div className="p-2.5 rounded-lg bg-white/10 border border-white/15 space-y-1 text-center">
                        <div className="text-[10px] font-bold text-amber-300">Backdrop Panels (2)</div>
                        <div className="text-[9px] text-slate-300 font-mono">Front Counter (3)</div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-white/10 border border-white/15 space-y-1 text-center">
                        <div className="text-[10px] font-bold text-amber-300">Backdrop Panels (2)</div>
                        <div className="text-[9px] text-slate-300 font-mono">Front Counter (3)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Tentative Marquee Floorplan Specification</span>
                  <span className="text-amber-300 font-bold">Saturday 14 Nov 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PART 3: SPONSORSHIP SUPPORT & PRIZES - Page 6 */}
        <div className="space-y-8 sm:space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
            <Badge variant="orange" size="md">
              {prizeData.statusBadge}
            </Badge>

            <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-darkText tracking-tight uppercase leading-tight px-2">
              {prizeData.headline}
            </h2>

            {/* Official Sponsor & Prize Pool Note */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-50 via-brand-navy/5 to-slate-50 border border-slate-200/80 shadow-inner max-w-3xl mx-auto text-center space-y-2">
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {prizeData.note}
              </p>
              <div className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                Notice: No prize amount is publicly committed until confirmed.
              </div>
            </div>
          </div>

          {/* Prize Pool Blocks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                    <div className="space-y-4 text-left">
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
                              : 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white'
                          }`}
                        >
                          {isFirst ? (
                            <Trophy className="w-6 h-6" />
                          ) : idx === 1 ? (
                            <Award className="w-6 h-6" />
                          ) : idx === 2 ? (
                            <Flame className="w-6 h-6" />
                          ) : (
                            <Store className="w-6 h-6" />
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
                          className={`text-base sm:text-lg font-bold font-display mt-1 ${
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

          {/* KEY NOTES ROW FROM PAGE 6 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 max-w-4xl mx-auto">
            <div className="text-xs font-mono font-bold text-brand-navy uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-orange" />
              <span>Official Event Policy Notes</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-brand-orange font-bold">•</span>
                <span><strong>Travel &amp; Accommodation:</strong> No travel or accommodation support for out-of-Karachi participants; showcase startups arrange their own.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-orange font-bold">•</span>
                <span><strong>Venue &amp; Layout:</strong> Final venue allocation and marquee layout confirmed before the event.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-orange font-bold">•</span>
                <span><strong>Registration Fees:</strong> Registration fees are tentative, pending departmental approval.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
