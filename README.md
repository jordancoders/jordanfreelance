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
- **AI API pricing reference tracker** — 38 researched models across 16 providers (OpenAI GPT-5.6, Claude 5, Gemini 3.x, DeepSeek V4, Qwen 3.x, Kimi K3, Grok 4.x and more) with input/output token rates, refreshed on tab open, and clearly labeled as a **reference snapshot** — rates are always verified against official pricing pages before quoting.
- **Testimonials** — `/testimonials` and homepage "Recent Verified Client Reviews": real reviews (with **displayed dates**) added by clients after project sign-off; never fabricated.
- **Quote & discovery-call flow** — WhatsApp-powered lead capture, `/api/contact` route for the quote form (Resend email with graceful failure), and a "Book 15-Min Discovery Call" button driven by a single config value.
- **International clients** — `/international`: USD/EUR/GBP quotes, PayPal/Wise/Direct EFT payments, GDPR-aligned Data Processing Agreement, W-8BEN readiness for US clients.
- **SEO & metadata** — dynamic `metadata`, JSON-LD (`ProfessionalService` + `FAQPage`), `sitemap.xml`, `robots.txt`, and `opengraph-image`, all driven from one canonical `SITE_CONFIG.siteUrl`.

### Client Portals (`/client`)

Each client gets a private portal (unique username + password) linked to their quote/invoice:

- **Invite-card login** — paste the `JPCARD1:…` block from the invite message to auto-fill credentials (matching the invite email's instructions).
- **Live build tracker** — dated milestone timeline with overall % progress, overdue highlighting, and stage badges.
- **Live document snapshot** — the quote/invoice (items, totals, deposit split, status) is kept in sync with the studio: any invoice edit **rebuilds the client's view automatically**.
- **Signed Declaration** — clients draw their signature in the portal; it is stamped `signedBy: "client"` server-side, pushed instantly to the linked invoice, and flips the document status to **Accepted** (signing *is* accepting). The admin sees a "✍ Signed" chip and the PDF bundle becomes export-ready — no card round-trip.
- **Printable declaration page** — `/client/declaration`: a clean, print/PDF-ready copy of the signed declaration with the document breakdown, signature, and legal references.
- **Payments** — clients see confirmed payments, pending confirmations, and can **report a payment** (amount/method/date) which the admin confirms or declines.
- **Messages** — two-way threaded updates between client and developer.
- **Links & deliverables** — staging URLs, repos, and documents shared by the studio.
- **Auto-refresh** — the dashboard polls while visible and refreshes the moment the tab regains focus, so studio updates appear without a manual reload.
- **Activity log** — an audit trail on every portal (signed, replied, payment reported/confirmed).

### Admin Studio (`/admin`) — MongoDB-Backed

- **🔒 Server-verified passcode login** — PIN checked against `ADMIN_PIN` in a Server Action; a secure **httpOnly session cookie** is issued on success. The PIN is **never** bundled into client JavaScript. Login attempts are **rate-limited** (10/15 min per IP).
- **Invoice & Quote Manager** — create, edit, print, and track invoices/quotes (no tax/VAT — total always equals subtotal) with per-document deposit percentage, balances, PayPal/EFT notes, and a live **Signed Declaration** capture pad (canvas, mouse/touch).
- **Share straight to clients**:
  - 🟣 **Copy Email** — polished quote email (auto-calculated next-Monday kickoff + Wednesday staging dates)
  - ✍️ **Kickoff** — the build "recipe" email (plan, timeline, deposit, what's needed from the client)
  - 🏁 **Handover** — final handover email (source code, export bundle, 7-day erasure, 14-day warranty)
  - 🔵 **Email** — opens Gmail with recipient/subject/body pre-filled
  - 🟢 **WhatsApp** — opens a WhatsApp chat with the document summary pre-filled
  - 🖨️ **Print / Export PDF** — clean white-paper output of just the document
- **Signed Declaration + PDF Bundle** — capture a signature in the studio (stamped `signedBy: "admin"` and mirrored to the linked portal) or receive the client's own signature, then export the full legal bundle (signed declaration → invoice/quote → terms → privacy → POPIA → DPA) via `/admin/export`.
- **Client Portals tab** — create a portal, link it to a quote/invoice (the snapshot is pre-built, and if the document was already signed the portal starts pre-signed), approve it, and send the invite message. Manage milestones, payments, messages, and links; **pending client-reported payments get ✓ Confirm / ✗ Decline** controls that apply the money to the linked invoice (status moves Sent → Accepted → Paid).
- **Notification bell** — unread badge fed live from client activity (signed, replied, payment reported); clicking a notification jumps to that client's Manage panel.
- **One-click WhatsApp sharing** — a WhatsApp button next to any composed update and next to every shared link/deliverable, opening a pre-filled `wa.me` draft to the client's number.
- **Project Manager** — draft/published case studies with live demo + GitHub links and image upload; only published projects render publicly.
- **Client Reviews Manager** — add, edit, delete, publish reviews (rating, avatar, linked project); published reviews appear on `/testimonials` and the homepage with dates.
- **API Pricing Reference** — searchable, filterable, sortable model pricing with a last-synced indicator.
- **JSON Backup & Restore** — export the full dataset (invoices, projects, reviews, clients, config) to JSON and import it on any device.
- **Re-sync From MongoDB** — re-fetches every collection from the database (never seeds or destroys data).

### Security & Privacy

- **Content-Security-Policy + security headers** on every response — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` (camera/mic/geo/payment/usb off), and a CSP tuned so project embeds and the Google Form iframe keep working. Dev builds add `unsafe-eval` for hot reload; production stays strict.
- **Signed session cookies** — the client session is an HMAC-signed token (username + signature), not a bare username; verified with a timing-safe compare. Admin session uses a hashed PIN token with the same comparison.
- **Login rate limiting** — in-memory sliding window per IP for both admin and client logins.
- **CSRF protection** — same-origin (Origin/Referer) checks on all state-changing client API routes, on top of SameSite=strict cookies.
- **Cookie consent banner** — an honest, essential-cookies-only banner (no tracking/ads/analytics) with a link to the Privacy Policy's cookie section.
- **Email notifications** — when a client signs, replies, or reports a payment, the studio owner gets an email via **Resend** (fire-and-forget; silently no-ops without `RESEND_API_KEY`).

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
| API | Next.js Server Actions + Route Handlers (`/api/contact`, `/api/client/*`) |
| Auth | Server Actions + httpOnly session cookies (`lib/auth.ts`, `app/actions/auth.ts`) |
| Data | MongoDB Atlas (free M0 tier) — all data persisted server-side |
| Email | Resend API (contact leads + portal notifications) |
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
| `MONGODB_URI` | Yes | MongoDB Atlas connection string — all site data (invoices, projects, reviews, client portals, config) |
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
| `invoices` | Invoices & quotes (including signed declarations) |
| `projects` | Case studies / portfolio items |
| `reviews` | Client testimonials |
| `clients` | Client portal accounts (progress, payments, messages, assets, activity) |
| `config` | Site config (social links, Google Form URL) — single document |

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
  actions/              # Server Actions (auth, invoices, projects, reviews, clients, config, backup)
components/             # Shared UI (Header, Footer, CookieConsent, demos, admin tabs…)
data/portfolioData.ts   # SITE_CONFIG + static content + type re-exports
lib/                    # Database, auth, CSRF, rate limiting, email templates, portal utils, admin notifications
hooks/                  # Client-side data hooks
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

---

© Jordan Peters Coder Freelancing. Built with Next.js 15 · React 19 · Tailwind CSS v4.
