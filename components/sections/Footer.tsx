'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Linkedin, Mail } from 'lucide-react';
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
                alt="IdeaVerse 2.0 Header Banner"
                className="w-full object-contain"
              />
            </div>

            {/* SEAMLESS LOGOS SHOWCASE STRIP (No Clunky Boxes!) */}
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center gap-5 sm:gap-6">
              {/* Iqra University Logo (Enlarged) */}
              <img
                src="/images/iqra_university_logo.png"
                alt="Iqra University"
                className="h-7 sm:h-10 w-auto object-contain"
              />

              <span className="h-6 w-px bg-slate-200" />

              {/* Spectrum 2.0 Logo */}
              <img
                src="/images/spectrum_20_logo.jpg"
                alt="IU Spectrum 2.0 Logo"
                className="h-8 sm:h-10 w-auto object-contain rounded-lg shadow-sm"
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
              Sindh&apos;s premier startup pitching & showcase competition under Spectrum 2.0 (*Where Talent Meets the Nation*). Organized by the IU Entrepreneurship Society (*Innovate | Initiate | Impact*) at Iqra University.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={eventConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-brand-orange hover:border-brand-orange transition-all min-h-[44px] min-w-[44px]"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={eventConfig.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-brand-orange hover:border-brand-orange transition-all min-h-[44px] min-w-[44px]"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href={`mailto:${eventConfig.contactEmail}`}
                className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:text-brand-orange hover:border-brand-orange transition-all min-h-[44px] min-w-[44px]"
                aria-label="Contact Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-navy">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><a href="#experience" className="hover:text-brand-orange transition-colors py-1 inline-block">Experience</a></li>
              <li><a href="#how-it-works" className="hover:text-brand-orange transition-colors py-1 inline-block">How It Works</a></li>
              <li><a href="#format" className="hover:text-brand-orange transition-colors py-1 inline-block">Participation Formats</a></li>
              <li><a href="#eligibility" className="hover:text-brand-orange transition-colors py-1 inline-block">Eligibility</a></li>
              <li><a href="#faq" className="hover:text-brand-orange transition-colors py-1 inline-block">FAQ</a></li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-brand-navy">
              Ecosystem & Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><span className="text-brand-navy font-bold">{eventConfig.university}</span></li>
              <li><span className="text-brand-orange font-bold">{eventConfig.organizer}</span></li>
              <li><span className="text-brand-navy font-bold">{eventConfig.parentEvent}</span></li>
              <li><Link href="/privacy" className="hover:text-brand-orange transition-colors py-1 inline-block">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Slanted Tagline Banner */}
        <div className="py-6 sm:py-8 border-y border-slate-200 text-center font-display font-black text-xl sm:text-3xl md:text-4xl tracking-widest text-brand-navy uppercase">
          BUILD • PITCH • CONNECT • SHOWCASE
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} IdeaVerse 2.0. All rights reserved.</p>
          <p className="flex flex-wrap items-center justify-center gap-1">
            <span>Parent Event:</span>
            <strong className="text-brand-navy font-bold">IU Spectrum 2.0</strong>
            <span>| Host:</span>
            <strong className="text-brand-orange font-bold">IU Entrepreneurship Society</strong>
          </p>
        </div>
      </div>
    </footer>
  );
};
