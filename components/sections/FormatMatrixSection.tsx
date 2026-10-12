'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building, Laptop, Sparkles, MapPin, CheckCircle2, ArrowRight, ShieldCheck, Store, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { eventConfig } from '@/config/event';

export const FormatMatrixSection: React.FC = () => {
  return (
    <section id="structure" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <Badge variant="blue" size="md">
            Event Structure
          </Badge>
          <h2 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black font-display text-brand-darkText tracking-tight leading-tight px-2 break-words">
            THREE DAYS,{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              ONE PATHWAY.
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 px-2 font-medium">
            Location decides the pitching format only; every startup competes under one unified category.
          </p>
        </div>

        {/* 3 Days Schedule Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Day 1: 10 Nov */}
          <Card className="p-6 sm:p-7 space-y-4 bg-white border-slate-200 shadow-lg border-t-4 border-t-brand-navy flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-brand-navy text-white">
                  TUE 10 NOV
                </span>
                <Laptop className="w-5 h-5 text-brand-navy" />
              </div>

              <h3 className="text-xl font-black font-display text-brand-navy">
                Virtual Pitching
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Startups from outside Karachi (within Sindh) pitch online on Zoom or a university-approved platform.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 font-semibold">
              Format: Live Online Screen Share &amp; Q&amp;A
            </div>
          </Card>

          {/* Day 2: 11 Nov */}
          <Card className="p-6 sm:p-7 space-y-4 bg-white border-slate-200 shadow-lg border-t-4 border-t-brand-blue flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-brand-blue text-white">
                  WED 11 NOV
                </span>
                <Building className="w-5 h-5 text-brand-blue" />
              </div>

              <h3 className="text-xl font-black font-display text-brand-navy">
                Physical Pitching
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Karachi-based and IU startups pitch in person at the IU Main Campus (CEIF Hall targeted, to be confirmed).
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 font-semibold">
              Venue: IU Main Campus (CEIF Hall targeted)
            </div>
          </Card>

          {/* Day 3: 14 Nov */}
          <Card className="p-6 sm:p-7 space-y-4 bg-white border-brand-orange/40 shadow-xl border-t-4 border-t-brand-orange flex flex-col justify-between ring-1 ring-brand-orange/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-brand-orange text-white">
                  SAT 14 NOV
                </span>
                <Store className="w-5 h-5 text-brand-orange" />
              </div>

              <h3 className="text-xl font-black font-display text-brand-orange">
                Startup Showcase
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Top 10–15 startups from both rounds exhibit in the IdeaVerse Marquee, IU Main Campus, Ground Floor.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] font-mono font-bold text-brand-orange">
              Exhibition: Ground Floor Marquee Area
            </div>
          </Card>
        </div>

        {/* HOW STARTUPS MOVE THROUGH THE EVENT (FLOWCHART SECTION) */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-8 shadow-inner">
          <div className="text-center space-y-1">
            <div className="text-xs font-mono font-bold text-brand-orange uppercase tracking-widest">
              Event Pathway Architecture
            </div>
            <h3 className="text-xl sm:text-3xl font-black font-display text-brand-navy">
              HOW STARTUPS MOVE THROUGH THE EVENT
            </h3>
          </div>

          {/* Flowchart Diagram */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Left: Two Entry Streams */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left space-y-1">
                <div className="text-[11px] font-mono font-bold text-brand-blue uppercase">
                  Startups Outside Karachi
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Other cities across Sindh
                </div>
                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Laptop className="w-3.5 h-3.5 text-brand-blue" />
                  <span>Virtual Pitch • Tue 10 Nov (Zoom)</span>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm text-left space-y-1">
                <div className="text-[11px] font-mono font-bold text-brand-navy uppercase">
                  Startups in Karachi + IU
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Karachi-based teams &amp; IU participants
                </div>
                <div className="pt-2 flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Building className="w-3.5 h-3.5 text-brand-navy" />
                  <span>Physical Pitch • Wed 11 Nov (CEIF Hall)</span>
                </div>
              </div>
            </div>

            {/* Middle: Unified Judging Box */}
            <div className="lg:col-span-4 text-center p-6 sm:p-7 rounded-2xl bg-white border-2 border-brand-blue/30 shadow-md space-y-3">
              <Badge variant="blue" size="sm">
                Central Scoring Engine
              </Badge>
              <h4 className="text-lg sm:text-xl font-black font-display text-brand-navy uppercase">
                UNIFIED JUDGING
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                One scoring framework with 8 criteria for every startup.
              </p>
              <div className="pt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-blue/10 text-brand-blue text-xs font-mono font-bold">
                <span>Top 10–15 Selected</span>
              </div>
            </div>

            {/* Right: Startup Showcase */}
            <div className="lg:col-span-4 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-600 text-white shadow-xl text-left space-y-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-extrabold bg-white/20 text-white uppercase tracking-wider">
                Culmination Stage
              </span>
              <h4 className="text-lg sm:text-xl font-black font-display text-white uppercase">
                STARTUP SHOWCASE
              </h4>
              <div className="text-xs font-mono font-bold text-amber-100">
                Sat 14 Nov • Ground Floor Marquee
              </div>
              <p className="text-xs text-amber-50 leading-relaxed font-medium">
                Selected startups present products and services, meeting thousands of visitors, industry guests, and participants.
              </p>
            </div>
          </div>

          {/* Good To Know Callout from PDF */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-left flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <strong className="text-slate-900">Good to know:</strong> Location decides the pitching format only; every startup competes in one unified category. The days between 11 and 14 Nov are used to evaluate pitches and select the showcase startups.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
