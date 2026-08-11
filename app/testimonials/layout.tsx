import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Client Testimonials & Reviews',
  description:
    'Read verified client reviews from South African SME owners who experienced the 48-hour staging demo, AI-orchestrated builds, and POPIA-aligned software development.',
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
