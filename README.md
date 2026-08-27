# JordaPortfolio — Freelance Developer Portfolio & Client Studio

A high-performance portfolio, lead-generation engine, and **full-stack client studio** for **Jordan Peters Coder Freelancing**, a freelance software developer building custom web apps, dashboards, and MVPs for South African SMEs.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, and **MongoDB Atlas**. Deployed on **Vercel**.

**Live site:** https://jpfreelance.dpdns.org

---

## ✨ Feature Catalogue (A–Z)

### Public Marketing Site

- **Portfolio & case studies** — `/projects` with dynamic detail pages (`/projects/[slug]`). Projects have draft/published status; only published items are public. The portfolio is honest: until a real project is published, the site shows a "No Published Projects Yet" state and a clearly-labeled **sample Tourism & Booking Dashboard demo** instead of fake work.
- **Services & transparent pricing** — `/services` with an explicit **price anchor** ("most dashboard projects start from R 15,000") plus quote-based custom pricing.
- **Process roadmap** — `/process`: the "AI Quality Gate Process" from consultation to source-code handover, including the 48-hour staging demo step.
- **48-Hour Live Staging Guarantee** — the "No-Gamble Guarantee": if the staging demo isn't delivered on time, 100% of the deposit plus 100% of unused API credits are refunded (qualifying projects — exclusions documented in the policy).
- **Guarantee & Refund Policy** — `/guarantee`: a redesigned policy page that backs every marketing claim (48-hour staging, 14-day bug-fix warranty, 7-day data erasure) with CPA-aligned legal wording and a non-waiver statement.
- **Interactive demo embed** — a live Tourism Operations dashboard preview on the homepage, clearly labeled as a sample build.
- **Live AI API pricing reference** — 38 models across 16 providers (OpenAI, Anthropic, Google, DeepSeek, Qwen, Mistral, Cohere, Kimi, Grok, Groq, Together, Fireworks, Replicate, Ollama). Prices **auto-sync from OpenRouter** on tab open with a static fallback. Official pricing link notes are **dynamically generated** from the live model data so they always reflect current rates.
- **Testimonials** — `/testimonials` and homepage "Recent Verified Client Reviews": real reviews (with **displayed dates**) added by clients after project sign-off; never fabricated.
- **Quote & discovery-call flow** — WhatsApp-powered lead capture, `/api/contact` route for the quote form (Resend email with graceful failure), and a "Book 15-Min Discovery Call" button driven by a single config value.
- **International clients** — `/international`: USD/EUR/GBP quotes, PayPal/Wise/Direct EFT payments, GDPR-aligned Data Processing Agreement, W-8BEN readiness for US clients.
- **SEO & metadata** — dynamic `metadata`, JSON-LD (`ProfessionalService` + `FAQPage`), `sitemap.xml`, `robots.txt`, and `opengraph-image`, all driven from one canonical `SITE_CONFIG.siteUrl`.

### Client Portals (`/client`)

Each client gets a private portal (unique username + password) linked to their quote/invoice:

- **Username + password login** — simple credentials from the invite message. No invite codes or cards — the invite message shows the portal URL, username, and password. Clients log in directly.
- **Auto-approved on creation** — portals start as "approved" so clients can log in immediately. No manual approval step.
- **Live build tracker** — dated milestone timeline with overall % progress, overdue highlighting, and stage badges.
- **Live document snapshot** — the quote/invoice (items, totals, deposit split, status) is kept in sync with the studio: any invoice edit **rebuilds the client's view automatically**.
- **Pay with PayPal button** — prominent PayPal button in the payment section that opens `paypal.me/JordanPetersCapeTown` in a new tab for one-tap payments.
- **Payment proof upload** — clients can attach a receipt screenshot (image or PDF, max 5 MB) when reporting a payment. Proof is stored on the `PaymentRecord` and visible in the payment history with a "View proof" link.
- **Signed Declaration** — clients draw their signature in the portal; it is stamped `signedBy: "client"` server-side, pushed instantly to the linked invoice, and flips the document status to **Accepted** (signing *is* accepting). The admin sees a "✍ Signed" chip and the PDF bundle becomes export-ready.
- **Printable declaration page** — `/client/declaration`: a clean, print/PDF-ready copy of the signed declaration with the document breakdown, signature, and legal references.
- **Payments** — clients see confirmed payments, pending confirmations, running totals, and can **report a payment** (amount/method/date/proof) which the admin confirms or declines.
- **Messages** — two-way threaded updates between client and developer.
- **Links & deliverables** — staging URLs, repos, and documents shared by the studio.
- **Auto-refresh** — the dashboard polls while visible and refreshes the moment the tab regains focus, so studio updates appear without a manual reload.
- **Activity log** — an audit trail on every portal (signed, replied, payment reported/confirmed).

### Admin Studio (`/admin`) — MongoDB-Backed

- **🔒 Server-verified passcode login** — PIN checked against `ADMIN_PIN` in a Server Action; a secure **httpOnly session cookie** is issued on success. The PIN is **never** bundled into client JavaScript. Login attempts are **rate-limited** (10/15 min per IP).
- **Invoice & Quote Manager** — create, edit, print, and track invoices/quotes (no tax/VAT — total always equals subtotal) with per-document deposit percentage, balances, PayPal/EFT notes, and a live **Signed Declaration** capture pad (canvas, mouse/touch).
- **Proposal Builder (quotes only)** — winning proposals, not invoice clones. When creating a Quote, a **Proposal Builder** section appears with sales-oriented fields:
  - 🎯 **Client Problem / What They Need** — show you understand their pain
  - 💡 **Proposed Solution** — what you'll build and why
  - 📦 **Deliverables** — one-per-line checklist (renders with ✓ checkmarks on print)
  - ⏱️ **Timeline** — when they'll see staging, final delivery, etc.
  - 🛡️ **Guarantee / Risk Reversal** — pre-filled with 14-day warranty + data erasure
  - ⭐ **Social Proof** — trust signals, stats, ratings
  - 🚀 **Next Steps / CTA** — clear "reply YES" path to close
  - On print, these render as **color-coded cards** (orange=problem, green=solution, blue=timeline, dark=guarantee). Invoices show none of these fields.
  - Proposal specs are included in **email**, **WhatsApp share**, and **printed** outputs — not just the on-screen form.
- **5 PDF Export Modes** — click the Export dropdown on any document:
  - 📄 **Clean Invoice** — line items, totals, payment options, legal terms — no declaration, no admin chrome
  - 🛡️ **Invoice + Declaration** — full invoice with signed declaration block appended
  - ✍️ **Declaration Only** — standalone signature page
  - 📧 **Cover Letter** — professional transmittal letter with branding, client name, project scope, and total value
  - 📦 **Full Package** — cover letter + invoice + declaration combined in one print
- **Share straight to clients**:
  - 🟣 **Copy Email** — polished quote email (auto-calculated next-Monday kickoff + Wednesday staging dates)
  - ✍️ **Kickoff** — the build "recipe" email (plan, timeline, deposit, what's needed from the client)
  - 🏁 **Handover** — final handover email (source code, export bundle, 7-day erasure, 14-day warranty)
  - 🔵 **Email** — opens Gmail with recipient/subject/body pre-filled
  - 🟢 **WhatsApp** — opens a WhatsApp chat with the document summary pre-filled (including proposal specs for quotes)
- **Signed Declaration + PDF Bundle** — capture a signature in the studio (stamped `signedBy: "admin"` and mirrored to the linked portal) or receive the client's own signature, then export the full legal bundle (signed declaration → invoice/quote → terms → privacy → POPIA → DPA) via `/admin/export`.
- **Client Portals tab** — create a portal, link it to a quote/invoice (the snapshot is pre-built), and it's **auto-approved** so you can send the invite immediately. WhatsApp opens automatically with the invite pre-filled. Manage milestones, payments, messages, and links; **pending client-reported payments get ✓ Confirm / ✗ Decline** controls that apply the money to the linked invoice (status moves Sent → Accepted → Paid).
- **Notification bell** — unread badge fed live from client activity (signed, replied, payment reported); clicking a notification jumps to that client's Manage panel.
- **One-click WhatsApp sharing** — a WhatsApp button next to any composed update and next to every shared link/deliverable, opening a pre-filled `wa.me` draft to the client's number.
- **Project Manager** — draft/published case studies with live demo + GitHub links and image upload; only published projects render publicly.
- **Client Reviews Manager** — add, edit, delete, publish reviews (rating, avatar, linked project); published reviews appear on `/testimonials` and the homepage with dates.
- **Self-editable site logo** — upload a custom logo image (max 2MB) from the Settings section. It saves to MongoDB + localStorage and appears instantly across the site: header, footer, mobile drawer, invoice template, and document exports. Remove button resets to the default SVG mark.
- **API Pricing Reference** — searchable, filterable, sortable model pricing with live-sync from OpenRouter and a last-synced indicator showing the data source.
- **Duplicate Invoice/Quote** — one-click clone that copies all fields, generates a new document number, and sets Draft status.
- **Quick Status Filters** — above the document list: All, Draft, Sent, Accepted, Paid, Overdue — each shows the count. Click to jump to the first matching document.
- **JSON Backup & Restore** — export the full dataset (invoices, projects, reviews, clients, expenses, config) to JSON and import it on any device.
- **Re-sync From MongoDB** — re-fetches every collection from the database (never seeds or destroys data).

### Expense Ledger (new tab)

- **Track all business expenses** with 16 categories: Hosting, Domains, API Costs, Software, Hardware, Marketing, Travel, Legal, Accounting, Subscriptions, Office, Training, Insurance, Taxes, Contractors, Other.
- **Add/edit/delete expenses** with description, amount, currency (ZAR/USD), category, date, vendor, invoice reference, note, and receipt upload.
- **Receipt upload** — attach images or PDFs (max 5 MB) stored as base64 data-URLs.
- **Search & filter** — by text, category, and month.
- **Category breakdown** — visual bars showing spend per category.
- **MongoDB-backed** — expenses persist across sessions and are included in JSON backup/restore.

### Monthly Statements (new tab)

- **Month selector** with income vs expenses breakdown.
- **Quick stats** — total income (ZAR + USD), total expenses, net profit/loss.
- **Expense category visualization** — visual bars with item counts.
- **Invoices this month** — list of invoices with status badges.
- **Print Statement** — printable monthly summary with income table + expense table + totals.
- **Year-to-Date Summary** — printable YTD breakdown by month with cumulative profit/loss.
- All data auto-generated from invoices and expenses — no manual entry needed.

### Accessibility

- **Accessibility settings panel** — floating orange button in the bottom-right opens a panel with:
  - **Text Size** — A-/A+ buttons scaling from 80% to 150% (CSS variable on `<html>`)
  - **High Contrast** — boosts text contrast, underlines all links
  - **Dyslexia Font** — swaps to Lexend/OpenDyslexic with wider letter-spacing and line-height
  - **Reduced Motion** — kills all animations and transitions
  - Settings persist to `localStorage` and restore before paint via inline script (zero flash)
- **Skip-to-content link** — visually hidden until keyboard-focused, jumps to main content
- **Focus-visible rings** — orange outline for keyboard users, none for mouse clicks
- **44×44px minimum tap targets** on all interactive elements
- **`prefers-reduced-motion`** — respects OS-level motion preference
- **`forced-colors`** — high-contrast mode support
- **ARIA labels & roles** — on search inputs, filter tabs, theme toggle, navigation, mobile drawer

### Dark Mode

- **Class-based dark mode** — Tailwind v4 configured with `@custom-variant dark (&:is(.dark *))` so `dark:` utilities respond to the `.dark` class on `<html>`.
- **Flash-free** — inline `<script>` in `<head>` reads `localStorage('theme')` and `prefers-color-scheme` before paint, applying the correct class immediately.
- **Theme toggle** — `role="switch"` with `aria-checked`, screen-reader announcements, and smooth transitions.

### Security & Privacy

- **Content-Security-Policy + security headers** on every response — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` (camera/mic/geo/payment/usb off), and a CSP that allows Google Fonts (Lexend dyslexia font), project embeds, and the Google Form iframe. Dev builds add `unsafe-eval` for hot reload; production stays strict.
- **`server-only` import guards** — `lib/auth.ts`, `lib/db.ts`, `lib/rateLimit.ts`, `lib/notifyAdmin.ts` all import `server-only` so Next.js build fails if any of these are accidentally imported into a client component (prevents ADMIN_PIN, MONGODB_URI, RESEND_API_KEY, SESSION_SECRET from leaking into browser JS).
- **Signed session cookies** — the client session is an HMAC-signed token (username + signature), not a bare username; verified with a timing-safe compare. Admin session uses a hashed PIN token with the same comparison.
- **Login rate limiting** — in-memory sliding window per IP for both admin and client logins.
- **CSRF protection** — same-origin (Origin/Referer) checks on all state-changing client API routes, on top of SameSite=strict cookies.
- **Cookie consent banner** — an honest, essential-cookies-only banner (no tracking/ads/analytics) with a link to the Privacy Policy's cookie section.
- **Email notifications** — when a client signs, replies, or reports a payment, the studio owner gets an email via **Resend** (fire-and-forget; silently no-ops without `RESEND_API_KEY`).
- **Receipt/proof validation** — all base64 uploads (payment proofs, expense receipts, site logo) are size-checked at the API level (max 5–6 MB) to prevent database bloat.

### Legal & Compliance

- **Terms of Service** — `/terms` (redesigned): 30-day quotes, 50% deposit, 14-day acceptance window, full IP on final payment, CPA non-waiver, cross-linked to the Guarantee & Refund Policy.
- **Guarantee & Refund Policy** — `/guarantee` (redesigned): 48-hour staging refund, 14-day bug-fix warranty, 7-day data erasure, CPA Section 16 cooling-off, exclusions.
- **Privacy Policy** — `/privacy` including the cookie policy (Section 8).
- **POPIA Policy** — `/popia`: all 8 lawful-processing conditions, Information Officer, 7-day data destruction commitment.
- **DPA Template** — `/dpa` for EU/UK clients (GDPR Article 28).
- **Invoice template** — `/invoice-template` with standardized contact details and Terms-of-Service references.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Styling | Tailwind CSS v4, Lucide icons |
| CI | GitHub Actions (ESLint + strict TypeScript on push/PR) |
| API | Next.js Server Actions + Route Handlers (`/api/contact`, `/api/client/*`, `/api/pricing/live`, `/api/expenses`) |
| Auth | Server Actions + httpOnly session cookies (`lib/auth.ts`, `app/actions/auth.ts`) |
| Data | MongoDB Atlas (free M0 tier) — all data persisted server-side |
| Email | Resend API (contact leads + portal notifications) |
| Live Pricing | OpenRouter API (token rates for 12+ providers, merged with static data) |
| Fonts | Google Fonts (Lexend for dyslexia-friendly mode) |
| Language | TypeScript (strict) |

---

## 📧 Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
# Resend API key — enables live email for contact-form leads AND client-portal
# notifications (signatures, replies, payment reports). If missing, both fall
# back gracefully (leads are logged server-side; the in-app bell still works).
RESEND_API_KEY=

# Passcode for the /admin studio. Verified server-side; a secure httpOnly
# session cookie (7-day, SameSite=Strict) is issued on success.
# The PIN is never shipped to the browser.
ADMIN_PIN=change-me

# Optional signing secret for client-portal session cookies (HMAC). If unset,
# the signing key falls back to the ADMIN_PIN value. Set a long random string
# in production for defense in depth.
SESSION_SECRET=

# MongoDB Atlas (REQUIRED). All site data lives here.
# Create a free M0 cluster at https://www.mongodb.com/cloud/atlas (no credit card),
# add a database user, set Network Access to "Allow access from anywhere" (0.0.0.0/0)
# for Vercel, then copy the mongodb+srv:// connection string from Connect → Drivers.
# NEVER commit the real value — keep it only in .env.local / Vercel env vars.
MONGODB_URI=
```

| Variable | Required | Purpose |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB Atlas connection string — all site data (invoices, projects, reviews, client portals, expenses, config) |
| `ADMIN_PIN` | Yes | Passcode for the `/admin` studio (set a strong value in production) |
| `RESEND_API_KEY` | No* | Live email delivery for contact leads + portal notifications (*optional; falls back to in-app/logging) |
| `SESSION_SECRET` | No* | HMAC key for client session cookies (*optional; falls back to `ADMIN_PIN`) |

---

## 🚀 Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in MONGODB_URI (and ADMIN_PIN)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note (Windows / Vercel dev):** this shell inherits a `PORT` value from the Freebuff environment. If `next dev` picks an unexpected port, force it with `npm run dev -- -p 3000`.
>
> **Note:** `npm run build` and `npm run dev` share the `.next` folder — don't run them at the same time in the same checkout; stop the dev server first.

### Build for production

```bash
npm run build
npm start
```

---

## ☁️ Deployment (Vercel)

This project deploys to **Vercel**. From the CLI:

```bash
vercel link            # link the project once
vercel --prod --yes    # build, typecheck, and deploy to production
```

Set `ADMIN_PIN`, `MONGODB_URI`, and optionally `RESEND_API_KEY` / `SESSION_SECRET` as environment variables in the Vercel project settings for **Production**, **Preview**, and **Development**.

> **Canonical domain:** the site URL used in metadata, sitemap, `robots.txt`, and JSON-LD is a single value — `SITE_CONFIG.siteUrl` in `data/portfolioData.ts` — currently set to `https://jpfreelance.dpdns.org`. Change **only that one value** when the domain changes, then redeploy.

---

## 🗄️ MongoDB Atlas Setup (required)

All site data is stored in MongoDB Atlas (free M0 tier) using the **official MongoDB driver** (declared in `package.json` — installed automatically by Vercel and GitHub Actions, nothing to run locally).

### Collections

| Collection | Stores |
|---|---|
| `invoices` | Invoices & quotes (including signed declarations, proposal fields for quotes) |
| `projects` | Case studies / portfolio items |
| `reviews` | Client testimonials |
| `clients` | Client portal accounts (progress, payments with proof uploads, messages, assets, activity) |
| `expenses` | Business expenses (category, vendor, receipt uploads, invoice references) |
| `config` | Site config (social links, Google Form URL, **site logo**) — single document |

### Create the cluster & copy the connection string

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → **Sign Up** (free, no credit card).
2. **Create a Cluster** → **M0 Free** tier → a region close to your users (for South Africa, **AWS eu-west-1 (Ireland)** is the closest free region).
3. **Database Access → Add New Database User** → set a username and strong password (**letters & numbers only** — special characters can break the connection string).
4. **Network Access → Add IP Address → "Allow access from anywhere"** (`0.0.0.0/0`) — required because Vercel's serverless functions connect from dynamic IPs; the strong password is what protects the cluster.
5. **Connect → Drivers → Node.js** → copy the `mongodb+srv://<user>:<password>@cluster0….mongodb.net` string — this is your `MONGODB_URI`.

### Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `MONGODB_URI` not set | Add it in Vercel → Settings → Environment Variables, then redeploy. |
| Connection errors | Wrong `MONGODB_URI`, Atlas **Network Access** doesn't allow `0.0.0.0/0`, or the database-user password in the URI is wrong. |
| Data not appearing locally | The local `.env.local` cluster and the production (Vercel) cluster are separate — check which `MONGODB_URI` you're pointed at. |

**Security notes:** `MONGODB_URI` contains your database password — never commit it to git; keep it only in `.env.local` and the Vercel dashboard as a **hidden** env var. If the connection string ever leaks, rotate the database-user password in Atlas and update `MONGODB_URI`.

---

## 📁 Project Structure

```
app/
  page.tsx              # Landing page (async server component)
  about/                # Developer background & process
  services/             # Service packages & pricing
  process/              # Client roadmap
  projects/             # Case studies list + [slug] detail pages
  testimonials/         # Client testimonials (with dates)
  contact/              # Contact & quote request
  admin/                # 🔒 Admin Studio (MongoDB-backed)
  admin/export/         # Signed declaration + full legal PDF bundle export
  client/               # Client portal: login, dashboard, printable declaration
  invoice-template/     # Public invoice/quote template
  guarantee/  terms/  privacy/  popia/  dpa/   # Legal & compliance pages
  api/contact/          # Lead dispatch route (Resend + server logging)
  api/client/           # Portal auth, account, and payment-report endpoints
  api/expenses/         # Expense CRUD (admin-only, authenticated)
  api/pricing/live/     # Live AI pricing endpoint (OpenRouter fetch + static fallback)
  actions/              # Server Actions (auth, invoices, projects, reviews, clients, config, backup)
components/
  Header.tsx            # Site header with logo, nav, mobile drawer
  Footer.tsx            # Site footer
  Logo.tsx              # Dynamic logo (custom image from MongoDB or default SVG mark)
  AccessibilityPanel.tsx # Floating accessibility settings panel
  ThemeToggle.tsx       # Dark/light mode toggle
  CookieConsent.tsx     # Essential-cookies-only consent banner
  WhatsAppButton.tsx    # Floating WhatsApp contact button
  admin/
    AdminDataProvider.tsx  # Central data provider (invoices, projects, reviews, clients, expenses)
    OverviewTab.tsx        # Dashboard quick stats
    ExpenseLedger.tsx      # Expense tracking with categories, filters, receipt upload
    MonthlyStatements.tsx  # Income/expense statements, profit/loss, printable summaries
    ClientPortalsTab.tsx   # Client portal management
data/portfolioData.ts   # SITE_CONFIG + static content + type re-exports
lib/
  types.ts              # All TypeScript interfaces (Invoice, ExpenseEntry, SiteConfig, etc.)
  db.ts                 # MongoDB connection + CRUD for all collections
  auth.ts               # Admin + client session management (server-only)
  emailTemplates.ts     # Email drafts (quote, kickoff, handover, sign-request)
  clientPortal.ts       # Portal utilities (progress computation, payment totals)
  fetchLivePricing.ts   # OpenRouter API fetcher for live model pricing
  rateLimit.ts          # In-memory sliding window rate limiter (server-only)
  notifyAdmin.ts        # Resend email notifications (server-only)
  csrf.ts               # Same-origin CSRF checks
hooks/
  useSiteConfig.ts      # Client-side hook for site config (MongoDB + localStorage)
  useInvoices.ts        # Client-side hook for invoice CRUD
  useProjects.ts        # Client-side hook for project CRUD
  useReviews.ts         # Client-side hook for review CRUD
  useClients.ts         # Client-side hook for client portal CRUD
```

---

## 🏗️ How It's Built

This project is developed with an **AI-orchestrated workflow and a human quality gate on every change** — the same process applied to client projects:

- AI-assisted scaffolding and iteration, with **manual review of every change** for security issues, hardcoded secrets, and scope drift before it ships.
- **Strict TypeScript, ESLint, and a production build** run before every deploy; GitHub Actions runs lint + typecheck on every push and PR.
- The 48-hour staging demo guarantee applies to client builds — this site follows the same standard.

---

## 📄 Legal & Compliance

- **Terms of Service** — `/terms` (30-day quotes, 50% deposit, 14-day acceptance, full IP on final payment)
- **Guarantee & Refund Policy** — `/guarantee` (48-hour staging refund, 14-day bug-fix warranty, 7-day erasure, CPA cooling-off)
- **Privacy Policy** — `/privacy` (including cookie policy)
- **POPIA Policy** — `/popia` (Act 4 of 2013)
- **DPA Template** — `/dpa` (GDPR Article 28 for EU/UK clients)
- **Invoice template** — `/invoice-template`
