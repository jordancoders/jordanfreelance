import type { ObjectId } from "mongodb";

export type DocId = string | ObjectId;

// ─── Invoice / Quote ──────────────────────────────────────────────────────────

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceDeclaration {
  signatureDataUrl: string;
  signerName: string;
  acknowledged: boolean;
  signedAt: string;
  /** Who captured the signature: the client via their portal, or the developer in the studio. */
  signedBy?: "client" | "admin";
}

export interface Invoice {
  _id?: DocId;
  id: string;
  documentType: "Invoice" | "Quote";
  invoiceNumber: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  currency: "ZAR" | "USD";
  issueDate: string;
  dueDate: string;
  status: "Draft" | "Sent" | "Paid" | "Overdue" | "Accepted";
  items: InvoiceItem[];
  depositPercent: number;
  depositPaid: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  declaration?: InvoiceDeclaration;

  // ─── Quote-only proposal fields ────────────────────────────────────────
  /** Plain-English summary of the client's problem / what they need. */
  proposalSummary?: string;
  /** Your proposed solution — what you'll build and the approach. */
  proposalSolution?: string;
  /** Key deliverables the client receives (lines). */
  proposalDeliverables?: string[];
  /** Timeline overview — when they'll see staging, final delivery, etc. */
  proposalTimeline?: string;
  /** Risk reversal: guarantee, refund policy, warranty, etc. */
  proposalGuarantee?: string;
  /** Trust signals: testimonials, case studies, stats. */
  proposalSocialProof?: string;
  /** Clear next-step CTA: what happens when they accept. */
  proposalNextSteps?: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface Project {
  _id?: DocId;
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "dashboard" | "webapp" | "mvp" | "tourism" | "ecommerce" | "other";
  image: string;
  tech: string[];
  client: string;
  problem: string;
  solution: string;
  results: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  liveDemo?: string;
  embedUrl?: string;
  githubUrl?: string;
  status: "draft" | "published";
  featured?: boolean;
  pagesCount?: number;
  deliveryDays?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Client Review ────────────────────────────────────────────────────────────

export interface ClientReview {
  _id?: DocId;
  id: string;
  clientName: string;
  companyTitle: string;
  avatar: string;
  rating: number;
  content: string;
  projectId?: string;
  projectTitle?: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

// ─── Client Portal ────────────────────────────────────────────────────────────

export type ProgressStatus = "queued" | "in-progress" | "completed";
export type ClientAccountStatus = "pending" | "approved";

export interface ProgressUpdate {
  id: string;
  label: string;
  status: ProgressStatus;
  note?: string;
  date: string;
  startDate?: string;
  endDate?: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: "PayPal" | "EFT" | "Cash" | "Other";
  date: string;
  note?: string;
  /** Client-reported payments sit as "pending" until the admin confirms them.
   *  Admin-recorded payments (and confirmed ones) are "confirmed". */
  status?: "pending" | "confirmed";
  /** Who reported the payment: the client via their portal, or the admin in the studio. */
  reportedBy?: "client" | "admin";
  /** Base64 data-URL of a receipt / proof-of-payment screenshot. */
  proofUrl?: string;
}

export interface ClientMessage {
  id: string;
  from: "admin" | "client";
  text: string;
  ts: string;
}

export interface SharedAsset {
  id: string;
  label: string;
  url: string;
  type: "staging" | "repo" | "deliverable" | "document" | "other";
  addedAt: string;
}

export interface ActivityEntry {
  id: string;
  actor: "admin" | "client" | "system";
  action: string;
  detail?: string;
  ts: string;
}

export interface DocumentSnapshot {
  documentType: "Invoice" | "Quote";
  invoiceNumber: string;
  projectTitle: string;
  clientName: string;
  clientCompany: string;
  currency: "ZAR" | "USD";
  issueDate: string;
  dueDate: string;
  status: string;
  items: { description: string; quantity: number; rate: number }[];
  subtotal: number;
  depositPercent: number;
  depositAmount: number;
  /** How much of the deposit (or more) has actually been received — mirrors the invoice. */
  depositPaid: number;
  balance: number;
  notes: string;
}

export interface SignedDeclaration {
  signatureDataUrl: string;
  signerName: string;
  acknowledged: boolean;
  signedAt: string;
  /** Who captured the signature: the client via their portal, or the developer in the studio. */
  signedBy?: "client" | "admin";
}

export interface ClientPortalAccount {
  _id?: DocId;
  id: string;
  clientName: string;
  clientCompany: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  invoiceId?: string;
  document?: DocumentSnapshot;
  status: ClientAccountStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  progress: ProgressUpdate[];
  declaration?: SignedDeclaration;
  percentComplete?: number;
  payments: PaymentRecord[];
  messages: ClientMessage[];
  assets: SharedAsset[];
  activity: ActivityEntry[];
}

// ─── Minimal structural types (for snapshots & email drafts) ──────────────────

/** Minimal invoice shape accepted by email templates and document snapshots. */
export interface InvoiceLike {
  id?: string;
  documentType?: "Invoice" | "Quote";
  invoiceNumber?: string;
  clientName?: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;
  currency?: "ZAR" | "USD";
  issueDate?: string;
  dueDate?: string;
  status?: string;
  notes?: string;
  depositPercent?: number;
  depositPaid?: number;
  items?: { description?: string; quantity?: number; rate?: number }[];
  declaration?: InvoiceDeclaration;
  // Quote proposal fields
  proposalSummary?: string;
  proposalSolution?: string;
  proposalDeliverables?: string[];
  proposalTimeline?: string;
  proposalGuarantee?: string;
  proposalSocialProof?: string;
  proposalNextSteps?: string;
}

// ─── Site Config ──────────────────────────────────────────────────────────────

export interface SiteSocialLinks {
  linkedinUrl?: string;
  githubUrl?: string;
  facebookUrl?: string;
  discordUrl?: string;
  repoUrl?: string;
}

export interface SiteConfig {
  _id?: DocId;
  googleFormUrl?: string;
  socialLinks?: SiteSocialLinks;
  /** Base64 data-URL or external URL for the site logo. Empty = use default SVG. */
  logoUrl?: string;
  updatedAt?: string;
}

// ─── Backup payload (full export / import) ────────────────────────────────────

export interface BackupPayload {
  invoices: Invoice[];
  projects: Project[];
  reviews: ClientReview[];
  clients: ClientPortalAccount[];
  config: SiteConfig | null;
  exportedAt: string;
}
