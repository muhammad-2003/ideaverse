'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, ExternalLink, ShieldCheck, ArrowLeft, AlertCircle, Copy, Check, Sparkles } from 'lucide-react';
import { getLeadByReference, updateOfficialFormStatus } from '@/lib/supabase/service';
import { IdeaVerseLead, OfficialFormStatus } from '@/types/lead';
import { eventConfig } from '@/config/event';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PosterContainer } from '@/components/future-posters/PosterContainer';
import { mapLeadToPosterData } from '@/lib/poster-data';

export default function ApplicationStatusPage() {
  const params = useParams();
  const router = useRouter();
  const ref = params?.ref as string;

  const [lead, setLead] = useState<IdeaVerseLead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selfReportedSuccess, setSelfReportedSuccess] = useState(false);

  useEffect(() => {
    async function loadLead() {
      if (!ref) return;
      try {
        setIsLoading(true);
        const record = await getLeadByReference(ref);
        setLead(record);
      } catch (err) {
        console.error('Error loading lead status:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLead();
  }, [ref]);

  const handleSelfReport = async () => {
    if (!lead) return;
    try {
      setIsUpdating(true);
      const updated = await updateOfficialFormStatus(lead.public_reference, 'self_reported_complete');
      if (updated) {
        setLead(updated);
        setSelfReportedSuccess(true);
      }
    } catch (err) {
      console.error('Self report error:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenGoogleForm = async () => {
    if (!lead) return;
    try {
      await updateOfficialFormStatus(lead.public_reference, 'opened');
      window.open(eventConfig.googleFormUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      window.open(eventConfig.googleFormUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const copyStatusLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-mono">Loading application profile...</p>
        </div>
      </main>
    );
  }

  if (!lead) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4 text-center">
        <Card className="max-w-md p-8 space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold font-display text-white">Application Not Found</h2>
          <p className="text-xs text-slate-400">
            No application record matches the reference code <code className="text-brand-cyan">{ref}</code>.
          </p>
          <Button onClick={() => router.push('/')} variant="primary" size="md" icon={ArrowLeft} iconPosition="left">
            Return to Homepage
          </Button>
        </Card>
      </main>
    );
  }

  const posterData = mapLeadToPosterData(lead);

  return (
    <main className="min-h-screen bg-background text-slate-100 py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to IdeaVerse 2.0</span>
          </Link>

          <button
            onClick={copyStatusLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Link Copied!' : 'Copy Portal Link'}</span>
          </button>
        </div>

        {/* Application Banner */}
        <Card className="p-4 sm:p-8 space-y-5 sm:space-y-6 bg-surface/90 border-brand-cyan/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-brand-cyan">REFERENCE: {lead.public_reference}</span>
                <Badge variant={lead.official_form_status === 'self_reported_complete' ? 'emerald' : 'amber'} size="sm">
                  {lead.official_form_status === 'self_reported_complete'
                    ? 'Self-Reported Submitted'
                    : lead.official_form_status === 'opened'
                    ? 'Form Opened'
                    : 'Started'}
                </Badge>
              </div>

              <h1 className="text-3xl font-black font-display text-white">{lead.startup_name}</h1>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Lead: {lead.team_lead_name} • {lead.institution} ({lead.city})
              </p>
            </div>

            {lead.startup_logo_url && (
              <div className="w-16 h-16 rounded-2xl bg-surface-hover border border-white/10 p-2 flex items-center justify-center flex-shrink-0">
                <img src={lead.startup_logo_url} alt={lead.startup_name} className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>

          {/* Status Progression Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. Website Profile</span>
              </div>
              <p className="text-[11px] text-slate-300">Saved on {new Date(lead.created_at || '').toLocaleDateString()}</p>
            </div>

            {/* Step 2 */}
            <div className={`p-4 rounded-xl border space-y-1 ${
              lead.official_form_status === 'self_reported_complete' || lead.official_form_status === 'verified'
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-amber-500/10 border-amber-500/30'
            }`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${
                lead.official_form_status === 'self_reported_complete' || lead.official_form_status === 'verified'
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}>
                {lead.official_form_status === 'self_reported_complete' || lead.official_form_status === 'verified' ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                <span>2. Official Google Form</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {lead.official_form_status === 'self_reported_complete'
                  ? 'Self-Reported as Submitted'
                  : 'Action Required'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl bg-surface border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <ShieldCheck className="w-4 h-4" />
                <span>3. Screening Review</span>
              </div>
              <p className="text-[11px] text-slate-500">Pending Committee Review</p>
            </div>
          </div>

          {/* Action Box / Self Reporting Section */}
          {lead.official_form_status !== 'self_reported_complete' && lead.official_form_status !== 'verified' ? (
            <div className="p-6 rounded-2xl bg-surface-hover/80 border border-amber-500/30 space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-display text-white">Finished Your Official Application?</h3>
                <p className="text-xs text-slate-300">
                  Submitting your profile on this website was Step 1. Please ensure you have completed the official Iqra University Google Form.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Button
                  onClick={handleSelfReport}
                  variant="primary"
                  size="md"
                  icon={CheckCircle2}
                  isLoading={isUpdating}
                  className="w-full sm:w-auto text-xs uppercase"
                >
                  Yes, I&apos;ve Submitted It
                </Button>

                <Button
                  onClick={handleOpenGoogleForm}
                  variant="outline"
                  size="md"
                  icon={ExternalLink}
                  className="w-full sm:w-auto text-xs uppercase"
                >
                  Open Official Google Form
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-left">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>Official Form Self-Reported as Completed</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Thank you! We have recorded that you completed the official application. Please note that all applications undergo official committee screening and shortlisting before pitch invitations are issued.
              </p>
            </div>
          )}
        </Card>

        {/* Poster Readiness Module */}
        <PosterContainer data={posterData} />
      </div>
    </main>
  );
}
