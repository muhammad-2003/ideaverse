'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/sections/Navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { PreviousEditionSection } from '@/components/sections/PreviousEditionSection';
import { EventIntroSection } from '@/components/sections/EventIntroSection';
import { PrizePoolSection } from '@/components/sections/PrizePoolSection';
import { ProcessTimelineSection } from '@/components/sections/ProcessTimelineSection';
import { FormatMatrixSection } from '@/components/sections/FormatMatrixSection';
import { WhyIdeaVerseSection } from '@/components/sections/WhyIdeaVerseSection';
import { EligibilitySection } from '@/components/sections/EligibilitySection';
import { LogoWallSection } from '@/components/sections/LogoWallSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { ConversionCTASection } from '@/components/sections/ConversionCTASection';
import { Footer } from '@/components/sections/Footer';
import { LeadFormModal } from '@/components/forms/LeadFormModal';
import { HandoffModal } from '@/components/forms/HandoffModal';
import { IdeaVerseLead } from '@/types/lead';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isHandoffModalOpen, setIsHandoffModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<IdeaVerseLead | null>(null);

  const handleOpenApply = () => {
    router.push('/apply');
  };

  const handleLeadSuccess = (lead: IdeaVerseLead) => {
    setCurrentLead(lead);
    setIsLeadModalOpen(false);
    setIsHandoffModalOpen(true);
  };

  return (
    <main className="min-h-screen relative bg-background text-brand-darkText overflow-x-hidden">
      {/* Sticky Header Navigation */}
      <Navigation onOpenApply={handleOpenApply} />

      {/* Hero Section */}
      <HeroSection onOpenApply={handleOpenApply} />

      {/* Storytelling & Social Proof */}
      <PreviousEditionSection />

      {/* Core Event Overview */}
      <EventIntroSection />

      {/* Prize Pool & Awards Section (Configurable via Admin) */}
      <PrizePoolSection />

      {/* 6-Stage Process Timeline */}
      <ProcessTimelineSection />

      {/* Participation Formats (Physical vs Virtual) */}
      <FormatMatrixSection />

      {/* Value Pillars */}
      <WhyIdeaVerseSection />

      {/* Eligibility & Startup Stages */}
      <EligibilitySection />

      {/* Startup Logo Wall */}
      <LogoWallSection />

      {/* FAQ Accordion */}
      <FAQSection />

      {/* Main Conversion Callout */}
      <ConversionCTASection onOpenApply={handleOpenApply} />

      {/* Footer */}
      <Footer />

      {/* Lead Form Modal (Step 1) */}
      <LeadFormModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSuccess={handleLeadSuccess}
      />

      {/* Official Form Handoff Modal (Step 2) */}
      <HandoffModal
        isOpen={isHandoffModalOpen}
        onClose={() => setIsHandoffModalOpen(false)}
        lead={currentLead}
      />
    </main>
  );
}
