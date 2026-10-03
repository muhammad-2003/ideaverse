'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { leadFormSchema, LeadFormSchemaType } from '@/lib/validation/lead';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { createLead, recordGlobalFormClick } from '@/lib/supabase/service';
import { IdeaVerseLead } from '@/types/lead';
import { eventConfig } from '@/config/event';

export default function ApplyPage() {
  const router = useRouter();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasClickedGoogleForm, setHasClickedGoogleForm] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<IdeaVerseLead | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeadFormSchemaType>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      startup_name: '',
      team_lead_name: '',
      email: '',
      phone: '',
      institution: '',
      city: '',
      website_url: '',
      applied_on_official_link: 'No',
      official_link_clicked: false,
      contact_consent: true,
      promotional_consent: false,
    },
  });

  const appliedStatus = watch('applied_on_official_link');

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setLogoError(null);

    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setLogoError('Please upload a PNG, JPG, or WebP image format.');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setLogoError('Logo image must be smaller than 4MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setLogoPreview(dataUrl);
      setValue('startup_logo_url', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenGoogleForm = () => {
    setHasClickedGoogleForm(true);
    setValue('official_link_clicked', true);
    setValue('applied_on_official_link', 'Yes', { shouldValidate: true });
    recordGlobalFormClick();
    fetch('/api/track-click', { method: 'POST' }).catch((err) =>
      console.error('Click tracking error:', err)
    );
    window.open(eventConfig.googleFormUrl, '_blank', 'noopener,noreferrer');
  };

  const onSubmit = async (data: LeadFormSchemaType) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const leadRecord = await createLead({
        startup_name: data.startup_name,
        team_lead_name: data.team_lead_name,
        email: data.email,
        phone: data.phone,
        institution: data.institution,
        city: data.city,
        startup_logo_url: logoPreview || null,
        website_url: data.website_url || null,
        applied_on_official_link: data.applied_on_official_link,
        official_link_clicked: hasClickedGoogleForm || Boolean(data.official_link_clicked),
        official_link_clicked_at: hasClickedGoogleForm ? new Date().toISOString() : null,
        contact_consent: data.contact_consent,
        promotional_consent: data.promotional_consent,
      });

      setIsSubmitting(false);

      if (data.applied_on_official_link === 'Yes') {
        router.push(`/application/${leadRecord.public_reference}`);
      } else {
        setSubmittedLead(leadRecord);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN AFTER SUBMISSION
  if (submittedLead) {
    return (
      <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-2xl space-y-8 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <Badge variant="emerald" size="md">
              Application Submitted Successfully
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-brand-navy">
              Welcome to IdeaVerse 2.0!
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto">
              Your startup application for <strong className="text-brand-navy">{submittedLead.startup_name}</strong> has been received by the organizing committee.
            </p>
          </div>

          {/* Reference Card */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 max-w-md mx-auto text-left">
            <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Your Public Reference Code
            </div>
            <div className="text-2xl font-mono font-black text-brand-orange tracking-wider">
              {submittedLead.public_reference}
            </div>
            <div className="text-xs text-slate-500">
              Save this code to check your screening status and view your custom poster.
            </div>
          </div>

          {/* Next Steps Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href={`/application/${submittedLead.public_reference}`}
              className="w-full sm:w-auto"
            >
              <Button variant="primary" size="lg" icon={Sparkles} className="w-full py-4 text-xs uppercase tracking-wider font-extrabold">
                View Status & Digital Poster
              </Button>
            </Link>

            <Link href="/" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full py-4 text-xs uppercase tracking-wider font-extrabold">
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-brand-navy hover:text-brand-orange transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to IdeaVerse 2.0</span>
          </Link>

          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/ideaverse_20_logo.png"
              alt="IdeaVerse 2.0"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 space-y-8">
        {/* Page Title & Subtitle */}
        <div className="text-center space-y-3">
          <Badge variant="orange" size="md">
            Official Application Portal
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-black font-display text-brand-navy tracking-tight uppercase">
            APPLY FOR{' '}
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange bg-clip-text text-transparent">
              IDEAVERSE 2.0.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto">
            Submit your startup profile to enter Sindh&apos;s premier pitching & showcase competition under Spectrum 2.0.
          </p>
        </div>

        {/* Application Form Card */}
        <Card className="p-6 sm:p-10 bg-white border-slate-200 shadow-2xl space-y-8 text-left">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {submitError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                <span>{submitError}</span>
              </div>
            )}

            {/* SECTION 1: STARTUP & FOUNDER PROFILE */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-slate-100 flex items-center gap-2 text-xs font-mono font-bold text-brand-navy uppercase tracking-widest">
                <Building2 className="w-4 h-4 text-brand-orange" />
                <span>Section 1: Startup & Founder Profile</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Startup Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                    Startup Name <span className="text-brand-orange">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      {...register('startup_name')}
                      placeholder="e.g. Quantum Pay"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.startup_name && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.startup_name.message}</p>
                  )}
                </div>

                {/* Team Lead Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                    Team Lead Name <span className="text-brand-orange">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      {...register('team_lead_name')}
                      placeholder="Full Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.team_lead_name && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.team_lead_name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                    Email Address <span className="text-brand-orange">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="founder@startup.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                    WhatsApp / Phone <span className="text-brand-orange">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      {...register('phone')}
                      placeholder="+92 300 1234567"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Institution */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                    Institution / University <span className="text-brand-orange">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      {...register('institution')}
                      placeholder="e.g. Iqra University, NED, FAST..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.institution && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.institution.message}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                    City <span className="text-brand-orange">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      {...register('city')}
                      placeholder="e.g. Karachi, Hyderabad, Sukkur..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
                    />
                  </div>
                  {errors.city && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.city.message}</p>
                  )}
                </div>
              </div>

              {/* Website URL (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                  Website / Social Link <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    {...register('website_url')}
                    placeholder="https://yourstartup.com or LinkedIn / Instagram URL"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
                  />
                </div>
                {errors.website_url && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.website_url.message}</p>
                )}
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1.5">
                  Startup Logo <span className="text-slate-400 font-normal">(Recommended for Showcase Wall & Poster)</span>
                </label>

                <div className="flex items-center gap-4">
                  <label className="flex-1 border-2 border-dashed border-slate-200 hover:border-brand-orange rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="w-5 h-5 text-brand-orange" />
                      <span className="text-xs font-bold text-brand-navy">
                        Click to upload startup logo
                      </span>
                      <span className="text-[10px] text-slate-500">
                        PNG, JPG, WebP up to 4MB
                      </span>
                    </div>
                  </label>

                  {logoPreview && (
                    <div className="relative w-20 h-20 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null);
                          setValue('startup_logo_url', '');
                        }}
                        className="absolute top-1 right-1 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-full p-0.5 text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
                {logoError && <p className="text-xs text-red-500 font-medium mt-1">{logoError}</p>}
              </div>
            </div>

            {/* SECTION 2: OFFICIAL GOOGLE FORM LINK */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-brand-navy text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-orange uppercase tracking-widest">
                <ExternalLink className="w-4 h-4 text-brand-orange" />
                <span>Section 2: Official University Application</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black font-display text-white">
                  Please apply officially here:
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Applications are officially collected and verified by Iqra University via Google Forms. Click the button below to open the official application link.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleOpenGoogleForm}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-[1.02]"
                >
                  <span>Open Official Google Form</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {hasClickedGoogleForm && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Google Form link opened in a new tab!</span>
                </div>
              )}
            </div>

            {/* SECTION 3: CONFIRMATION QUESTION */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="block text-xs font-extrabold uppercase tracking-wider text-brand-navy">
                Did you apply on the given link? <span className="text-brand-orange">*</span>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    value="Yes"
                    {...register('applied_on_official_link')}
                    className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
                  />
                  <span className="text-sm font-bold text-slate-900">Yes</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    value="No"
                    {...register('applied_on_official_link')}
                    className="w-4 h-4 text-brand-orange focus:ring-brand-orange"
                  />
                  <span className="text-sm font-bold text-slate-900">No</span>
                </label>
              </div>

              {errors.applied_on_official_link && (
                <p className="text-xs text-red-500 font-medium">{errors.applied_on_official_link.message}</p>
              )}
            </div>

            {/* SECTION 4: CONSENTS */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-700 leading-relaxed font-medium">
                <input
                  type="checkbox"
                  {...register('contact_consent')}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-orange focus:ring-brand-orange focus:ring-offset-0"
                />
                <span>
                  <strong className="text-brand-navy font-bold">Required:</strong> I agree that the IdeaVerse organizing team may contact me via WhatsApp or Email regarding my application and event updates.
                </span>
              </label>
              {errors.contact_consent && (
                <p className="text-xs text-red-500 font-medium ml-7">{errors.contact_consent.message}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-600 leading-relaxed font-medium">
                <input
                  type="checkbox"
                  {...register('promotional_consent')}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-orange focus:ring-brand-orange focus:ring-offset-0"
                />
                <span>
                  <strong className="text-slate-800 font-bold">Optional:</strong> I allow IdeaVerse & IU Entrepreneurship Society to feature our startup name and logo in promotional media and showcase walls.
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full py-4 text-xs sm:text-sm uppercase tracking-wider font-extrabold"
                isLoading={isSubmitting}
                icon={Sparkles}
              >
                Submit Application
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
