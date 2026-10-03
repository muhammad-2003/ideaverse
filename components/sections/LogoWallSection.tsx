'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useSiteContent } from '@/lib/content/useSiteContent';

export const LogoWallSection: React.FC = () => {
  const { content } = useSiteContent();
  const startups = content.featuredStartups && content.featuredStartups.length > 0
    ? content.featuredStartups
    : [];

  // Duplicate for seamless infinite marquee loop
  const displayList = [...startups, ...startups];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3 px-2">
          <Badge variant="blue" size="sm">
            Ecosystem Momentum
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl font-black font-display text-brand-darkText tracking-tight leading-tight">
            THE NEXT WAVE IS{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              ALREADY BUILDING.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Featuring applicant startups that have granted promotional display consent.
          </p>
        </div>

        {/* Infinite Marquee Container */}
        {displayList.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-medium">
            New applicant ventures will be showcased here as applications are validated.
          </div>
        ) : (
          <div className="relative overflow-hidden w-full py-3 sm:py-4 mask-horizontal">
            <div className="flex items-center gap-4 sm:gap-6 animate-marquee whitespace-nowrap">
              {displayList.map((item, idx) => (
                <div
                  key={`${item.id || item.name}-${idx}`}
                  className="inline-flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-white border border-slate-200 shadow-md text-slate-800 flex-shrink-0 hover:border-brand-blue transition-colors"
                >
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl object-contain bg-slate-100 p-1 border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center font-black text-xs text-white shrink-0">
                      {item.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight">{item.name}</div>
                    <div className="text-[9px] sm:text-[10px] text-slate-500 font-mono font-medium">{item.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-blue" />
          <span>Only verified startups with explicit promotional consent are displayed on this showcase wall.</span>
        </div>
      </div>
    </section>
  );
};
