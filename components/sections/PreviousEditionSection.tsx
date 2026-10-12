'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Award, Users, Mic, Flame, Trophy, Star, ArrowRight, CheckCircle2, Globe2, Building, ExternalLink, Play } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { eventConfig } from '@/config/event';
import { useSiteContent } from '@/lib/content/useSiteContent';

const spectrumPhotos = [
  {
    title: 'Concert Night at Iqra University',
    subtitle: 'Main campus arena packed under the Silver Jubilee celebration banner with live stage performances.',
    tag: 'Main Stage Concert',
    image: '/images/spectrum_concert_night.jpg',
  },
  {
    title: 'IU Bazaar: 30+ Brands & Startup Stalls',
    subtitle: 'Student startups, retail partners, and food brands exhibiting live with heavy campus footfall.',
    tag: 'Student Stalls & Brands',
    image: '/images/spectrum_iu_bazaar.jpg',
  },
  {
    title: 'Packed Arena & Campus Excitement',
    subtitle: 'Thousands of students, alumni, and participants gathering across all Iqra University campuses.',
    tag: 'Audience & Crowd',
    image: '/images/spectrum_packed_crowd.jpg',
  },
  {
    title: 'Grand Concert with Red Bull',
    subtitle: 'Electrifying music performances and festival atmosphere celebrating youth innovation.',
    tag: 'Red Bull Stage',
    image: '/images/spectrum_grand_concert.jpg',
  },
];

export const PreviousEditionSection: React.FC = () => {
  const { content } = useSiteContent();

  return (
    <section id="previous-edition" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <Badge variant="orange" size="md">
            Evolution &amp; Expansion
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-darkText tracking-tight leading-tight px-2">
            IDEAVERSE 1.0{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              VS 2.0.
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-2 font-medium">
            From Karachi&apos;s campus ecosystems to an all-Sindh entrepreneurial stage.
          </p>
        </div>

        {/* OFFICIAL 1.0 VS 2.0 COMPARISON MATRIX CARDS (Page 2 of Event Plan) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 max-w-5xl mx-auto">
          {/* Card 1: IdeaVerse 1.0 */}
          <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-lg space-y-5 text-left border-t-4 border-t-slate-500">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="slate" size="sm" className="font-mono">
                  IDEAVERSE 1.0 | SPECTRUM 2025
                </Badge>
                <h3 className="text-xl sm:text-2xl font-black font-display text-slate-800 mt-2">
                  Karachi Edition
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Building className="w-6 h-6" />
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span><strong>Karachi only:</strong> Universities, startups, and all IU campuses in Karachi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span><strong>40+ registrations</strong> and 25 competing startups.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span>Participants from <strong>Iqra University, IBA, Bahria University, and Sir Syed University</strong> with industry experts involved.</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
              Scope: Metropolitan Karachi Campuses
            </div>
          </Card>

          {/* Card 2: IdeaVerse 2.0 */}
          <Card className="p-6 sm:p-8 bg-white border-slate-200 shadow-xl space-y-5 text-left border-t-4 border-t-brand-orange ring-1 ring-brand-orange/20">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="orange" size="sm" className="font-mono">
                  IDEAVERSE 2.0 | SPECTRUM 2.0
                </Badge>
                <h3 className="text-xl sm:text-2xl font-black font-display text-brand-navy mt-2">
                  All of Sindh
                </h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <Globe2 className="w-6 h-6" />
              </div>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                <span><strong>Open to startups across Sindh</strong>, not just Karachi.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                <span><strong>Virtual pitching</strong> for out-of-Karachi teams; <strong>physical pitching</strong> at Iqra University.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                <span><strong>One unified judging framework:</strong> location decides pitch format, never the category.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                <span><strong>Top 10–15 startups</strong> exhibit live in the IdeaVerse Startup Showcase Marquee.</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-100 text-[11px] font-mono font-bold text-brand-orange uppercase tracking-wider">
              Scope: Taking the startup stage to all of Sindh
            </div>
          </Card>
        </div>

        {/* SPECTRUM 1.0 REAL EVENT HIGHLIGHTS GALLERY */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left border-b border-slate-200 pb-4">
            <div>
              <div className="text-xs font-mono font-bold text-brand-orange uppercase tracking-widest">
                Official Campus Archival Proof
              </div>
              <h3 className="text-xl sm:text-3xl font-black font-display text-brand-navy mt-1">
                SPECTRUM 1.0 IN PICTURES
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Glimpses of high-energy startup stalls, packed arenas, and cultural concerts at Iqra University.
              </p>
            </div>

            <a
              href="https://facebook.com/share/v/19PwrBW6Pa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white font-mono text-xs font-bold transition-all shadow-md shrink-0 w-fit"
            >
              <Play className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
              <span>Watch Spectrum Video Recap</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          {/* 4 Photos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {spectrumPhotos.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="overflow-hidden p-0 bg-white border-slate-200 shadow-lg hover:shadow-xl hover:border-brand-orange transition-all duration-300 group">
                  {/* Photo Container */}
                  <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-300 border border-white/20 shadow-sm">
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  {/* Caption & Description */}
                  <div className="p-5 sm:p-6 text-left space-y-1.5">
                    <h4 className="text-base sm:text-lg font-black font-display text-brand-darkText group-hover:text-brand-orange transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {item.subtitle}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
