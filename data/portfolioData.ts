import type { Project, ClientReview } from "@/lib/types";

export type { Project, ClientReview };

export interface Service {
  id: string;
  title: string;
  description: string;
  priceTag: string;
  features: string[];
  recommendedFor: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const SITE_CONFIG = {
  developerName: "Jordan Peters",
  tradingName: "Coder Freelancing",
  brandLine: "Jordan Peters Coder Freelancing",
  email: "jordancodefreelancer@protonmail.com",
  whatsappNumber: "0848600638",
  whatsappFormatted: "+27 84 860 0638",
  whatsappLink: "https://wa.me/27848600638",
  googleFormUrl: "https://forms.google.com",
  // Real scheduling link for the "Book 15-Min Discovery Call" button.
  // Swap in a Calendly/Cal.com link here when you have one; until then it
  // opens WhatsApp with a pre-filled booking message.
  discoveryCallUrl:
    "https://wa.me/27848600638?text=Hi%20Jordan%2C%20I%27d%20like%20to%20book%20a%2015-minute%20discovery%20call.",
  // E.164 phone format for tel: links (dialable from any country).
  phoneE164: "+27848600638",
  // Public price anchor — edit the amount here; shown on the Services page.
  priceAnchor: "Custom dashboards typically start from R 15,000 (excl. VAT).",
  paypalMeUrl: "https://www.paypal.com/paypalme/JordanPetersCapeTown",
  // Canonical public URL used for metadata, sitemap, robots.txt, and JSON-LD.
  siteUrl: "https://jpfreelance.dpdns.org",
  location: "South Africa (Remote)",
  coverage: "South Africa + Worldwide Remote",
  currencies: ["ZAR (R)", "USD ($)", "EUR (€)", "GBP (£)"],
  internationalPaymentMethods: ["PayPal", "Wise", "Direct EFT"],
  responseHours: "2 hours (Business Hours)",
  guaranteeNotice: "48-Hour Staging Guarantee | Production-Ready Delivery",
  popiaEraseDays: 7,
  logoUrl: "",
  // Human section — uses initials avatar until a real photo is added.
  photoUrl: "",
  // Social profiles — editable live from the Admin Studio (Upgrades & Tools).
  // Defaults visible but overridable; hide by clearing in admin.
  linkedinUrl: "https://www.linkedin.com/in/jordan-peters-coder",
  githubUrl: "https://github.com/steamytooolz-commits/JordaPortfolio",
  facebookUrl: "",
  discordUrl: "",
  // Public repository — shown as transparency proof (commit history = audit trail).
  repoUrl: "https://github.com/steamytooolz-commits/JordaPortfolio",
  // Loom teardown video of the sample build — placeholder until you record one.
  loomUrl: "https://www.loom.com/share/placeholder-jordan-peters-teardown",
  calUrl: "https://cal.com/jordan-peters/15min",
};

export const PROJECTS_DATA: Project[] = [];

export const SERVICES_DATA: Service[] = [
  {
    id: "custom-pitch-quote",
    title: "Custom App or Dashboard Pitch",
    description: "Tell me about your project and I’ll send you a transparent custom quote — an AI-orchestrated build with a human quality gate, delivered as a working staging demo in 48 hours.",
    priceTag: "Fast Custom Quote",
    features: [
      "48-Hour Live Staging Demo",
      "AI-orchestrated with a Human Quality Gate",
      "Every feature tested & human-reviewed",
      "Full Source Code Transfer upon approval",
      "POPIA Compliance & Confidentiality",
      "Deployment assistance on your own domain"
    ],
    recommendedFor: "SMEs and founders who want a direct assessment of their software idea with zero fluff."
  },
  {
    id: "booking-dashboard",
    title: "Booking & Operations Dashboard",
    description: "Replace WhatsApp + spreadsheets with a real booking engine — availability, deposits, dispatch and reporting in one place. Live in 48 hours for testing.",
    priceTag: "From R 12,000",
    features: [
      "Availability calendar & conflict prevention",
      "PayPal + EFT deposit tracking",
      "WhatsApp dispatch & client updates",
      "POPIA-safe data vault + 7-day erasure",
      "Role-based access for staff",
      "Exports for accounting"
    ],
    recommendedFor: "Tour operators, clinics, studios, and service SMEs drowning in manual bookings."
  },
  {
    id: "tourism-dispatch",
    title: "Tourism & Guide Dispatch Portal",
    description: "The sample-build you can click through today — vehicle allocation, guide mobiles, passport vault, and real-time tour boards for your ops team.",
    priceTag: "From R 15,000",
    features: [
      "Vehicle & guide allocation matrix",
      "Live bookings board (142+ active demo)",
      "AES-256 passport vault — auto-redact",
      "Driver mobile view + route PDFs",
      "Revenue & satisfaction analytics",
      "Staging → production in 48h"
    ],
    recommendedFor: "Safari, shuttle and tour SMEs ready to prove ops can be software, not chaos."
  },
  {
    id: "ecommerce-lite",
    title: "E-commerce Lite & Catalog",
    description: "A fast, mobile-first catalog with checkout, inventory and PayPal/EFT — without Shopify bloat or monthly rent. You own the code.",
    priceTag: "From R 10,000",
    features: [
      "Mobile-first catalog & search",
      "Cart, checkout & stock sync",
      "PayPal + EFT + manual orders",
      "Order dashboard for staff",
      "SEO + OG images out of the box",
      "Full code handover"
    ],
    recommendedFor: "Retailers who want a store they actually own — no lock-in."
  },
  {
    id: "mvp-scaffold",
    title: "Startup MVP Scaffold",
    description: "Validated MVP in 48h: auth, DB, file uploads, payments hook, and a deploy pipeline — so you can test with real users, not mockups.",
    priceTag: "From R 18,000",
    features: [
      "Auth + DB + storage wired",
      "Clickable 8–12 page scaffold",
      "PayPal/Wise/EFT payments ready",
      "Human-reviewed security audit",
      "Deploy to your domain — day 2",
      "Investor-ready demo link"
    ],
    recommendedFor: "Founders who need a fundable, testable product now — not a 3-month agency queue."
  },
  {
    id: "care-plan",
    title: "Care Plan & Handover",
    description: "14-day bug-fix warranty included. Add a care plan for updates, backups, and a human on call — or take the code and run.",
    priceTag: "From R 1,500/mo",
    features: [
      "14-day critical bug warranty",
      "Backups + dep updates",
      "Priority WhatsApp fixes",
      "Monthly invoice & portal",
      "Data-destruction certificate",
      "Cancel anytime — code stays yours"
    ],
    recommendedFor: "Teams who want peace of mind after handover without a retainer trap."
  }
];

export const FAQ_DATA: FaqItem[] = [
  {
    id: "faq-ai-accuracy",
    question: "How do you handle AI code generation and quality control?",
    answer: "Every AI-generated change passes through my quality gate before it reaches you. I “prompt-lock” the build to your exact scope, then manually audit each change for hardcoded secrets, SQL injection risks, deprecated functions, and off-brief features. Then you test the working staging demo yourself in 48 hours and approve before paying the balance — that demo is your final quality control."
  },
  {
    id: "faq-how-it-works",
    question: "How are you able to build full custom apps in 48 hours?",
    answer: "I orchestrate AI to write code at 10x speed, guided by constraint prompts locked to your brief. Before anything ships, every AI-generated change is reviewed by me — a human — for security holes, hallucinations, and scope drift. That’s the AI Quality Gate Process: AI-speed output with human-quality control, delivered as a working staging demo in 48 hours that you test yourself before paying the balance."
  },
  {
    id: "faq-cost",
    question: "How much does a custom build cost?",
    answer: "Each project gets a transparent custom quote based on its scope. Tell me about your project and you’ll receive a clear quote — with a working staging demo in 48 hours."
  },
  {
    id: "faq-deposit",
    question: "Why is a deposit required?",
    answer: "The deposit covers initial staging setup, infrastructure provisioning, and initial architecture labor before launching the 48-hour demo."
  },
  {
    id: "faq-see-code",
    question: "Can I see the working app before final payment?",
    answer: "Yes! You receive a live 48-hour staging demo link to click through and test all features in your browser before paying the balance."
  },
  {
    id: "faq-after-handover",
    question: "What happens after handover?",
    answer: "Every project includes a 14-day bug fix warranty after final delivery — critical bugs are fixed at no charge (as documented in the Refund & Guarantee Policy). You own the full source code, so you can take it to any developer at any time; ongoing support and maintenance can also be arranged if you want it."
  },
  {
    id: "faq-what-if-demo",
    question: "What if I don’t like the 48-hour staging demo?",
    answer: "That’s exactly why the demo exists before final payment. If the working staging link isn’t delivered within 48 hours of deposit confirmation, you get 100% of your deposit refunded immediately, plus 100% of unused API credits. If it is delivered and the build isn’t what you agreed, we fix it within the agreed revision rounds at no extra cost. You only pay the balance once you’re satisfied."
  },
  {
    id: "faq-ownership",
    question: "Who owns the final source code?",
    answer: "You do. 100% full source code ownership transfers to you upon final payment."
  }
];

