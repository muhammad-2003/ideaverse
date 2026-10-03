'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useSiteContent } from '@/lib/content/useSiteContent';

export const LogoWallSection: React.FC = () => {
  const { content } = useSiteContent();
  const startups =
    content.featuredStartups && content.featuredStartups.length > 0
      ? content.featuredStartups
      : [];

  // Triplicate list for continuous infinite looping
  const displayList =
    startups.length > 0
      ? [...startups, ...startups, ...startups]
      : [];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const currentScrollRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  // Sync ref with state
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Robust Auto-play Animation with Float Accumulator (solves browser scrollLeft integer rounding)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || displayList.length === 0) return;

    let animId: number;
    let lastTime = performance.now();
    currentScrollRef.current = container.scrollLeft;

    // Keep accumulator updated on any native scroll
    const onScroll = () => {
      if (isDraggingRef.current) {
        currentScrollRef.current = container.scrollLeft;
      }
    };
    container.addEventListener('scroll', onScroll, { passive: true });

    const step = (now: number) => {
      const delta = Math.min((now - lastTime) / 16.67, 2.5);
      lastTime = now;

      if (!isDraggingRef.current && container) {
        const oneSetWidth = container.scrollWidth / 3;

        // Loop seamlessly once scrolled past 2 sets or back before 0
        if (oneSetWidth > 50) {
          if (currentScrollRef.current >= oneSetWidth * 2) {
            currentScrollRef.current -= oneSetWidth;
            container.scrollLeft = Math.round(currentScrollRef.current);
          } else if (currentScrollRef.current <= 5) {
            currentScrollRef.current += oneSetWidth;
            container.scrollLeft = Math.round(currentScrollRef.current);
          }
        }

        // Advance by ~1px per frame (smooth continuous 60fps autoplay)
        currentScrollRef.current += 1.0 * delta;
        container.scrollLeft = Math.round(currentScrollRef.current);
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('scroll', onScroll);
    };
  }, [displayList.length]);

  // Touch handlers for mobile
  const handleTouchStart = () => {
    setIsDragging(true);
    if (scrollContainerRef.current) {
      currentScrollRef.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      currentScrollRef.current = scrollContainerRef.current.scrollLeft;
    }
  };

  // Mouse drag-to-scroll handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftPos(scrollContainerRef.current.scrollLeft);
    currentScrollRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollContainerRef.current) {
        currentScrollRef.current = scrollContainerRef.current.scrollLeft;
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      currentScrollRef.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftPos - walk;
    currentScrollRef.current = scrollContainerRef.current.scrollLeft;
  };

  return (
    <section className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* Centered Clean Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3 px-2">
          <Badge variant="blue" size="sm">
            Ecosystem Momentum
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black font-display text-brand-darkText tracking-tight leading-tight break-words">
            THE NEXT WAVE IS{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              ALREADY BUILDING.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Verified applicant startups and ventures exhibiting at the IdeaVerse 2.0 Showcase Marquee.
          </p>
        </div>

        {/* Continuous Autoplay Showcase Rail */}
        {displayList.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400 font-medium bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <Sparkles className="w-6 h-6 mx-auto text-brand-orange mb-2" />
            <p>New applicant ventures will appear on this wall as applications are submitted and verified.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Subtle Gradient Edge Fades on Desktop */}
            <div className="hidden sm:block pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10" />
            <div className="hidden sm:block pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10" />

            {/* Continuous Autoplay Track */}
            <div
              ref={scrollContainerRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              className="flex items-center gap-3.5 sm:gap-5 overflow-x-auto no-scrollbar py-3 px-1 select-none cursor-grab active:cursor-grabbing"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {displayList.map((item, idx) => (
                <div
                  key={`${item.id || item.name}-${idx}`}
                  className="flex items-center gap-3 sm:gap-3.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-800 shrink-0 w-[240px] xs:w-[260px] sm:w-[280px] hover:border-brand-navy hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Logo or Branded Initial Avatar */}
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shrink-0 shadow-2xs"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-brand-navy via-brand-blue to-brand-purple flex items-center justify-center font-black text-sm text-white shrink-0 shadow-xs border border-white/20">
                      {item.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight truncate">
                        {item.name}
                      </h4>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                      {item.tag || 'Applicant Startup'}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-brand-navy uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 inline-block" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="text-center text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1.5 px-2">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-blue shrink-0" />
          <span>Verified startups with promotional consent displayed on this showcase wall.</span>
        </div>
      </div>
    </section>
  );
};
