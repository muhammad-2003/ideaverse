'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Sparkles, Award, Users, Mic, Flame, Trophy, Star } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useSiteContent } from '@/lib/content/useSiteContent';

const iconMap: Record<string, React.ElementType> = {
  Mic,
  Sparkles,
  Users,
  Award,
  Flame,
  Trophy,
  Star,
  Camera,
};

export const PreviousEditionSection: React.FC = () => {
  const { content } = useSiteContent();
  const highlights = content.previousEdition;

  return (
    <section id="previous-edition" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="orange" size="md">
            Proof of Impact
          </Badge>
          <h2 className="text-4xl sm:text-6xl font-black font-display text-brand-darkText tracking-tight">
            THIS WAS{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              IDEAVERSE.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Ideas were pitched. Founders were discovered. Connections were made.{' '}
            <strong className="text-brand-blue">Now it&apos;s your turn.</strong>
          </p>
        </div>

        {/* Dynamic Editorial Photo & Narrative Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {highlights.map((item, idx) => {
            const IconComponent = (item.icon && iconMap[item.icon]) ? iconMap[item.icon] : Sparkles;
            const gradient = item.gradient || 'from-brand-blue to-brand-purple';

            return (
              <motion.div
                key={item.id || item.title || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <Card className="group overflow-hidden p-0 h-[380px] flex flex-col justify-end relative border-slate-200 hover:border-brand-blue shadow-xl">
                  {/* Background Image with Crisp Overlay */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={item.bgImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                  </div>

                  {/* Content Overlay */}
                  <div className="relative z-10 p-8 space-y-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} p-0.5 shadow-lg`}>
                      <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-brand-blue" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-black font-display text-white group-hover:text-brand-cyan transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-200 leading-relaxed max-w-md">
                      {item.subtitle}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
