import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { eventConfig } from '@/config/event';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 text-left">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to IdeaVerse 2.0</span>
        </Link>

        <div className="space-y-2">
          <h1 className="text-3xl font-black font-display text-white">Privacy & Data Handling Policy</h1>
          <p className="text-xs text-slate-400 font-mono">
            {eventConfig.name} • {eventConfig.organizer} • {eventConfig.university}
          </p>
        </div>

        <Card className="p-8 space-y-6 bg-surface/80">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Collection of Application Data</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              When you fill out the Step 1 application form on our website, we collect your startup name, team lead name, email address, phone/WhatsApp number, institution, city, logo image, and social links.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Contact Consent</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your required contact consent allows the IdeaVerse organizing team (IU Entrepreneurship Society) to reach out regarding application updates, screening results, pitch schedules, and event logistics.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Separate Promotional Consent</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Promotional permission is strictly optional. If checked, you grant permission for IdeaVerse and IU Entrepreneurship Society to feature your startup name and logo in event promotional materials, social media graphics, and the event showcase wall.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Data Protection</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              We do not sell or share applicant data with unauthorized third parties. All lead records are stored securely using encrypted Supabase databases with Row Level Security policies.
            </p>
          </section>
        </Card>
      </div>
    </main>
  );
}
