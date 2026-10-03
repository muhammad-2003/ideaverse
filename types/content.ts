export interface PreviousEditionHighlight {
  id: string;
  title: string;
  subtitle: string;
  bgImage: string;
  icon?: string;
  gradient?: string;
}

export interface PrizeBlock {
  id: string;
  title: string;
  amount: string;
  description: string;
  badge?: string;
  perks?: string[];
}

export interface PrizePoolConfig {
  headline: string;
  note: string;
  status: 'announced' | 'tba';
  statusBadge: string;
  blocks: PrizeBlock[];
}

export interface FeaturedStartup {
  id: string;
  name: string;
  tag: string;
  logoUrl?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteContent {
  previousEdition: PreviousEditionHighlight[];
  prizePool: PrizePoolConfig;
  featuredStartups: FeaturedStartup[];
  faqs: FAQItem[];
}
