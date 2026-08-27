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
  paypalEmail: "jordancodefreelancer@protonmail.com",
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
  // Human section — leave empty until you add a real photo + social links.
  // The "Meet Jordan" block only renders once photoUrl is set.
  photoUrl: "",
  // Social profiles — editable live from the Admin Studio (Upgrades & Tools).
  // Empty = the corresponding icon is hidden. githubUrl doubles as the profile
  // link in the Meet Jordan block; repoUrl stays as the portfolio repository.
  linkedinUrl: "",
  githubUrl: "",
  facebookUrl: "",
  discordUrl: "",
  // Public repository — shown as transparency proof (commit history = audit trail).
  repoUrl: "https://github.com/steamytooolz-commits/JordaPortfolio",
  // Loom teardown video of the sample build — shown in the reviews section
  // once you record one (empty = button hidden).
  loomUrl: "",
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

