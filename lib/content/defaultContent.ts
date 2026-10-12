import { SiteContent } from '@/types/content';
import { eventConfig } from '@/config/event';

export const defaultSiteContent: SiteContent = {
  previousEdition: [
    {
      id: 'highlight-1',
      title: 'Concert Night at Iqra University',
      subtitle: 'Massive student crowd and university celebration at the main campus stage under the Silver Jubilee celebration banner.',
      icon: 'Mic',
      gradient: 'from-brand-blue to-brand-purple',
      bgImage: '/images/spectrum_concert_night.jpg',
    },
    {
      id: 'highlight-2',
      title: 'IU Bazaar: 30+ Brands & Startup Stalls',
      subtitle: 'Student startups, commercial brands, and emerging ventures exhibiting their products live to thousands of campus attendees.',
      icon: 'Users',
      gradient: 'from-brand-purple to-cyan-500',
      bgImage: '/images/spectrum_iu_bazaar.jpg',
    },
    {
      id: 'highlight-3',
      title: 'Packed Arena & Campus Engagement',
      subtitle: 'Energetic campus-wide participation bringing together students, faculty, and industry leaders from across universities in Karachi.',
      icon: 'Sparkles',
      gradient: 'from-cyan-500 to-emerald-500',
      bgImage: '/images/spectrum_packed_crowd.jpg',
    },
    {
      id: 'highlight-4',
      title: 'Grand Concert with Red Bull',
      subtitle: 'Electrifying main stage performances and musical celebrations closing out Spectrum with high-energy youth culture.',
      icon: 'Award',
      gradient: 'from-brand-orange to-amber-500',
      bgImage: '/images/spectrum_grand_concert.jpg',
    },
  ],
  prizePool: {
    headline: 'SPONSORSHIP SUPPORT & AWARDS',
    status: 'tba',
    statusBadge: 'Subject to Sponsorship & Budget',
    note: 'Prize money for top finalists is planned and subject to sponsorship and final budget. No prize amount is publicly committed until confirmed. All finalists, judges, and speakers receive official certificates and shields.',
    blocks: [
      {
        id: 'prize-1',
        title: 'Grand Champion (1st Place)',
        amount: 'Cash Reward + Official Trophy',
        description: 'Top overall venture across physical & virtual tracks evaluated under the 8-criteria unified framework. Spectrum main stage trophy presentation.',
        badge: '1st Prize',
        perks: [
          'Spectrum 2.0 Main Stage Trophy',
          'Cash Reward (Subject to Sponsorship)',
          'Premier Marquee Showcase Booth',
          'Official University Shield & Certificate',
        ],
      },
      {
        id: 'prize-2',
        title: '1st Runner-Up (2nd Place)',
        amount: 'Cash Reward + Official Shield',
        description: 'Recognizing superior market validation, product traction, innovative execution, and viable business economics.',
        badge: '2nd Prize',
        perks: [
          'Official Society Silver Shield',
          'Cash Reward (Subject to Sponsorship)',
          'IdeaVerse Marquee Exhibition Space',
          'Official Certificate of Excellence',
        ],
      },
      {
        id: 'prize-3',
        title: '2nd Runner-Up (3rd Place)',
        amount: 'Cash Reward + Official Shield',
        description: 'Awarded for exceptional technical execution, impactful problem-solution fit, and compelling pitch delivery.',
        badge: '3rd Prize',
        perks: [
          'Official Society Bronze Shield',
          'Cash Reward (Subject to Sponsorship)',
          'Marquee Showcase Booth',
          'Official Certificate of Merit',
        ],
      },
      {
        id: 'prize-4',
        title: 'Top 10–15 Showcase Finalists',
        amount: 'Marquee Booths + Shields',
        description: 'Top 10–15 selected startups exhibit in the IdeaVerse Marquee on Saturday 14 Nov at IU Main Campus Ground Floor with branded backdrops and counters.',
        badge: 'Top 10–15 Finalists',
        perks: [
          'Dedicated Booth Backdrop Panel',
          'Front Counter with Startup Name',
          'Access to Visitors, Guests & Judges',
          'Official Certificate of Finalist Participation',
        ],
      },
    ],
  },
  featuredStartups: [
    { id: 'startup-1', name: 'QuantumPay', tag: 'Fintech • MVP' },
    { id: 'startup-2', name: 'EcoGrid', tag: 'Cleantech • Prototype' },
    { id: 'startup-3', name: 'HealthPulse', tag: 'Healthtech • Traction' },
    { id: 'startup-4', name: 'AgriSense', tag: 'Agtech • Prototype' },
    { id: 'startup-5', name: 'LogiFlow', tag: 'Logistics • Revenue' },
    { id: 'startup-6', name: 'EduSphere', tag: 'Edtech • MVP' },
    { id: 'startup-7', name: 'CypherAI', tag: 'Deeptech • Prototype' },
    { id: 'startup-8', name: 'RetailPulse', tag: 'SaaS • Traction' },
  ],
  faqs: eventConfig.faqs.map((f, i) => ({
    id: `faq-${i + 1}`,
    question: f.question,
    answer: f.answer,
  })),
};
