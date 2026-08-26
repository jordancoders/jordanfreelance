import type { Metadata } from 'next';
import './globals.css';
import { FAQ_DATA, SITE_CONFIG } from '@/data/portfolioData';
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  title: {
    default: 'Jordan Peters Coder Freelancing — Custom Web Apps & Dashboards in South Africa',
    template: '%s | Jordan Peters Coder Freelancing',
  },
  description:
    'AI-orchestrated custom web software for South African SMEs with a human quality gate. 48-hour staging demo, POPIA-aligned data handling, 7-day data erasure policy, and production-ready quality.',
  keywords: [
    'Jordan Peters',
    'Coder Freelancing',
    'Jordan Peters Coder Freelancing',
    'Freelance Developer South Africa',
    'Custom Web App Developer',
    'Dashboard Developer Cape Town',
    'POPIA-Aligned Developer',
    'Next.js Developer SA',
    'SME Web Apps South Africa',
    '48 Hour Staging Demo',
    'AI-Orchestrated Development',
    'AI Quality Gate',
  ],
  authors: [{ name: 'Jordan Peters', url: SITE_CONFIG.siteUrl }],
  creator: 'Jordan Peters Coder Freelancing',
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: SITE_CONFIG.siteUrl,
    title: 'Jordan Peters Coder Freelancing — Custom Web Apps & Dashboards for SA SMEs',
    description:
      'AI-orchestrated agency-quality code with a human quality gate, at zero risk. See a live 48-hour staging demo of your application before committing.',
    siteName: 'Jordan Peters Coder Freelancing',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Tourism & Booking Dashboard Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jordan Peters Coder Freelancing | Freelance Software Developer SA',
    description: 'AI-orchestrated custom web apps for South African SMEs with a 48-hour staging demo guarantee — every line human-reviewed.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Jordan Peters Coder Freelancing — Software Development',
  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  '@id': SITE_CONFIG.siteUrl,
  url: SITE_CONFIG.siteUrl,
  telephone: '+27848600638',
  email: 'jordancodefreelancer@protonmail.com',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'ZA',
    addressRegion: 'Western Cape / South Africa',
  },
  priceRange: 'Quote-based',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '17:00',
  },
  knowsAbout: [
    'Software Development',
    'Next.js',
    'React',
    'Tailwind CSS',
    'POPIA Compliance',
    'Firebase',
    'Web Dashboards',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_DATA.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Inline script: apply saved theme before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark');else if(t==='light')document.documentElement.classList.remove('dark');else if(matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-orange-500 selection:text-white">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-orange-500 focus:text-white focus:font-bold focus:text-sm focus:shadow-lg focus:outline-none">
          Skip to main content
        </a>
        <div id="main-content" tabIndex={-1} />
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
