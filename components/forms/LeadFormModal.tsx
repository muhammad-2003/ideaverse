'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, CheckCircle2, AlertCircle, Sparkles, Building2, User, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { leadFormSchema, LeadFormSchemaType } from '@/lib/validation/lead';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { createLead } from '@/lib/supabase/service';
import { IdeaVerseLead } from '@/types/lead';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (lead: IdeaVerseLead) => void;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
        applied_on_official_link: data.applied_on_official_link || 'No',
        official_link_clicked: Boolean(data.official_link_clicked),
        contact_consent: data.contact_consent,
        promotional_consent: data.promotional_consent,
      });

      setIsSubmitting(false);
      onSuccess(leadRecord);
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(err.message || 'Failed to save application profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start Your Application"
      subtitle="Step 1 of 2: Create your IdeaVerse startup profile"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
        {submitError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Grid Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Startup Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1">
              Startup Name <span className="text-brand-orange">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                {...register('startup_name')}
                placeholder="e.g. Acme Tech"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
              />
            </div>
            {errors.startup_name && (
              <p className="text-xs text-red-500 font-medium mt-1">{errors.startup_name.message}</p>
            )}
          </div>

          {/* Team Lead Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1">
              Email Address <span className="text-brand-orange">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                {...register('email')}
                type="email"
                placeholder="founder@domain.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone / WhatsApp */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1">
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

        {/* Website / Links (Optional) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1">
            Website / Social Link <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              {...register('website_url')}
              placeholder="https://yourstartup.com or LinkedIn / Instagram"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-orange focus:bg-white transition-colors"
            />
          </div>
          {errors.website_url && (
            <p className="text-xs text-red-500 font-medium mt-1">{errors.website_url.message}</p>
          )}
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy mb-1">
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
                  Click to upload logo
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

        {/* Separated Consent Checkboxes */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          {/* Required Contact Consent */}
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

          {/* Optional Promotional Consent */}
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

        {/* Form CTA */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full py-4 text-xs sm:text-sm uppercase tracking-wider font-extrabold"
            isLoading={isSubmitting}
            icon={Sparkles}
          >
            Continue to Official Application
          </Button>
          <p className="text-[11px] text-center text-slate-500 font-medium mt-2">
            Your profile will be saved securely before opening the Iqra University official application form.
          </p>
        </div>
      </form>
    </Modal>
  );
};
