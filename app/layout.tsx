import type { Metadata } from 'next';
import './globals.css';
import { eventConfig } from '@/config/event';

export const metadata: Metadata = {
  title: 'IdeaVerse 2.0 | Startup Pitching & Showcase Competition',
  description:
    'IdeaVerse 2.0 brings together student founders and emerging startups for a premier startup pitching and showcase competition at Iqra University under Spectrum 2.0.',
  keywords: [
    'IdeaVerse 2.0',
    'Spectrum 2.0',
    'Iqra University',
    'IU Entrepreneurship Society',
    'Startup Competition Sindh',
    'Karachi Startups',
    'Student Entrepreneurship',
    'Pitching Competition',
    'Startup Showcase',
  ],
  openGraph: {
    title: 'IdeaVerse 2.0 | Startup Pitching & Showcase Competition',
    description:
      'Where Ideas Become Ventures. Pitch, connect, showcase and take your venture further at Iqra University.',
    siteName: 'IdeaVerse 2.0',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IdeaVerse 2.0 | Startup Pitching & Showcase Competition',
    description:
      'Where Ideas Become Ventures. Pitch, connect, showcase and take your venture further at Iqra University.',
  },
};

import { LiveChatWidget } from '@/components/chat/LiveChatWidget';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-brand-darkText antialiased min-h-screen selection:bg-brand-orange selection:text-white">
        {children}
        <LiveChatWidget />
      </body>
    </html>
  );
}
