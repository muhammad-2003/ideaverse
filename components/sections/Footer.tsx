'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Mail } from 'lucide-react';
import { eventConfig } from '@/config/event';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 pt-12 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 relative z-10">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left">
          {/* Brand & Logos Col */}
          <div className="md:col-span-6 space-y-4 sm:space-y-6">
            {/* Header Picture Banner */}
            <div className="max-w-[260px] sm:max-w-xs">
              <img
                src="/images/ideaverse_20_logo.png"
                alt="IdeaVerse 2.0 Startup Pitching & Showcase Competition"
                className="w-full object-contain"
              />
            </div>

            {/* SEAMLESS LOGOS SHOWCASE STRIP */}
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center gap-5 sm:gap-6">
              {/* Iqra University Logo */}
              <img
                src="/images/iqra_university_logo.png"
                alt="Iqra University"
                className="h-7 sm:h-9 w-auto object-contain"
              />

              <span className="h-6 w-px bg-slate-200" />

              {/* Spectrum 2.0 Logo */}
              <img
                src="/images/spectrum_20_logo.jpg"
                alt="IU Spectrum 2.0 Logo"
                className="h-8 sm:h-9 w-auto object-contain rounded-lg shadow-sm"
              />

              <span className="h-6 w-px bg-slate-200" />

              {/* Horizontal IUES Logo */}
              <img
                src="/images/iues_logo.png"
                alt="IU Entrepreneurship Society"
                className="h-7 sm:h-9 w-auto object-contain"
              />
            </div>

            <p className="text-xs text-slate-600 max-w-md leading-relaxed font-medium">
              Startup Pitching &amp; Showcase Competition taking the startup stage from Karachi to all of Sindh. Organized by the <strong>IU Entrepreneurship Society &amp; IU Core</strong> under <strong>Spectrum 2.0</strong> at Iqra University, Karachi.
            </p>

            <div className="text-[11px] font-mono text-slate-500">
              President: <strong>{eventConfig.leadership.president}</strong> | Patron: <strong>{eventConfig.leadership.patron}</strong>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={eventConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-rose-50/50 transition-all min-h-[44px] min-w-[44px] shadow-2xs group"
                aria-label="Instagram"
                title="Follow IU Entrepreneurship Society on Instagram"
              >
                <Instagram className="w-4 h-4 text-slate-700 group-hover:text-[#E4405F] transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-navy">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><a href="#experience" className="hover:text-brand-orange transition-colors py-1 inline-block">The Big Picture</a></li>
              <li><a href="#previous-edition" className="hover:text-brand-orange transition-colors py-1 inline-block">IdeaVerse 1.0 vs 2.0</a></li>
              <li><a href="#structure" className="hover:text-brand-orange transition-colors py-1 inline-block">Three Days Pathway</a></li>
              <li><a href="#how-it-works" className="hover:text-brand-orange transition-colors py-1 inline-block">Participation &amp; Fees</a></li>
              <li><a href="#prizes" className="hover:text-brand-orange transition-colors py-1 inline-block">Scoring &amp; Marquee</a></li>
              <li><a href="#eligibility" className="hover:text-brand-orange transition-colors py-1 inline-block">Eligibility</a></li>
              <li><a href="#faq" className="hover:text-brand-orange transition-colors py-1 inline-block">FAQ</a></li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-navy">
              Ecosystem &amp; Contact
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><span className="text-brand-navy font-bold">{eventConfig.university}</span></li>
              <li><span className="text-brand-orange font-bold">{eventConfig.organizer}</span></li>
              <li><span className="text-brand-navy font-bold">{eventConfig.parentEvent}</span></li>
              <li>
                <a
                  href={`mailto:${eventConfig.contactEmail}`}
                  className="hover:text-brand-orange transition-colors inline-flex items-center gap-1.5 py-0.5"
                  title="Send email"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{eventConfig.contactEmail}</span>
                </a>
              </li>
              <li><Link href="/privacy" className="hover:text-brand-orange transition-colors py-1 inline-block">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Slanted Tagline Banner */}
        <div className="py-6 sm:py-8 border-y border-slate-200 text-center font-display font-black text-lg sm:text-2xl md:text-3xl tracking-widest text-brand-navy uppercase">
          10 NOV VIRTUAL • 11 NOV PHYSICAL • 14 NOV SHOWCASE MARQUEE
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} IdeaVerse 2.0. All rights reserved.</p>
          <p className="flex flex-wrap items-center justify-center gap-1">
            <span>Parent Event:</span>
            <strong className="text-brand-navy font-bold">IU Spectrum 2.0</strong>
            <span>| Host:</span>
            <strong className="text-brand-orange font-bold">IU Entrepreneurship Society &amp; IU Core</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
