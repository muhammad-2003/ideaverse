'use client';

import React, { useState } from 'react';
import { ExternalLink, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { eventConfig } from '@/config/event';
import { IdeaVerseLead } from '@/types/lead';
import { updateOfficialFormStatus } from '@/lib/supabase/service';
import { useRouter } from 'next/navigation';

interface HandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: IdeaVerseLead | null;
}

export const HandoffModal: React.FC<HandoffModalProps> = ({
  isOpen,
  onClose,
  lead,
}) => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  if (!lead) return null;

  const statusUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/application/${lead.public_reference}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(statusUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenOfficialForm = async () => {
    try {
      setIsOpening(true);
      await updateOfficialFormStatus(lead.public_reference, 'opened');
      window.open(eventConfig.googleFormUrl, '_blank', 'noopener,noreferrer');
      router.push(`/application/${lead.public_reference}`);
      onClose();
    } catch (err) {
      console.error('Handoff error:', err);
      window.open(eventConfig.googleFormUrl, '_blank', 'noopener,noreferrer');
      router.push(`/application/${lead.public_reference}`);
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
    >
      <div className="text-center space-y-6 py-2">
        {/* Step 1 Complete Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-md shadow-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-200">
            Step 1 Complete
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-brand-navy mt-3">
            YOUR IDEAVERSE PROFILE HAS BEEN CREATED
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed font-medium">
            Welcome aboard, <span className="text-brand-orange font-bold">{lead.startup_name}</span>! Now complete the official Iqra University application to be considered for screening.
          </p>
        </div>

        {/* Profile Card Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-500 pb-2 border-b border-slate-200 font-medium">
            <span>Reference ID</span>
            <span className="font-mono text-brand-navy font-bold">{lead.public_reference}</span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span>Team Lead</span>
            <span className="font-bold text-brand-navy">{lead.team_lead_name}</span>
          </div>
          <div className="flex justify-between items-center text-slate-700">
            <span>Institution / City</span>
            <span className="font-bold text-brand-navy">{lead.institution} ({lead.city})</span>
          </div>
        </div>

        {/* Status Bookmark Link */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-left">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-[11px] font-bold text-brand-navy">Your Application Status Portal</p>
              <p className="text-[10px] text-slate-500 truncate font-mono">{statusUrl}</p>
            </div>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-brand-navy hover:border-brand-navy transition-colors flex-shrink-0 shadow-sm"
              title="Copy status link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* CTA to Google Form */}
        <div className="space-y-3 pt-2">
          <Button
            onClick={handleOpenOfficialForm}
            variant="primary"
            size="lg"
            className="w-full py-4 text-xs sm:text-sm font-extrabold uppercase tracking-wider"
            isLoading={isOpening}
            icon={ExternalLink}
          >
            Complete Official Application
          </Button>

          <p className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>Opens the official Iqra University Google Form in a new window</span>
          </p>
        </div>
      </div>
    </Modal>
  );
};
