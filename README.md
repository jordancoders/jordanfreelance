# JordaPortfolio — Freelance Developer Portfolio & Admin Studio

A high-performance portfolio, lead-generation engine, and **full-stack admin studio** for **Jordan Peters Coder Freelancing**, a freelance software developer building custom web apps, dashboards, and MVPs for South African SMEs.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, and **MongoDB Atlas**. Deployed on **Vercel**.

---

## ✨ Key Features

### Public Site
- **Portfolio & case studies** — `/projects` with dynamic project pages (`/projects/[slug]`)
- **Services & transparent pricing** — custom web apps, dashboards, MVPs, maintenance retainers
- **Process roadmap** — the "AI Quality Gate Process": from consultation to source-code handover
- **Prompt-First positioning** — copy and workflow built around AI orchestration: prompt-locked scope, a manual security & hallucination audit on every AI-generated change, a public prompt engineering log, and the human-reviewed 48-hour staging demo
- **Testimonials** — client case studies
- **48-Hour Live Staging Guarantee** ("No-Gamble Guarantee") with a 100% deposit refund clause
- **Interactive Tourism Dashboard demo** — a multi-view operational dashboard preview, clearly labeled as a demo with sample data (not a live client system)
- **AI API pricing reference tracker** — 38 researched models across 16 providers (OpenAI GPT-5.6, Claude 5, Gemini 3.x, DeepSeek V4, Qwen 3.x, Kimi K3, Grok 4.x & more) with input/output token rates, refreshed on tab open. Labeled as a **reference snapshot** — rates are always verified against the official pricing pages before quoting a client
- **Quote & discovery-call flow** — `/api/contact` routes leads to email with graceful failure (never blocks the visitor)
- **International clients** — `/international` for worldwide clients: USD/EUR/GBP quotes, PayPal, Wise & Direct EFT payments, GDPR-aligned DPA, and W-8BEN readiness for US clients
- **Honest, verifiable claims** — no fabricated precision stats or fake client products; demos are labeled as sample data, and marketing copy avoids pseudo-legal overclaims (POPIA wording is "aligned", not "certified"; deposits are agreed per quote)
- **Legal pages** — POPIA Act 4 of 2013 compliance, privacy policy, terms & conditions, invoice template

### Admin Studio (`/admin`) — MongoDB-Backed
- **🔒 Server-verified passcode login** — PIN checked against `ADMIN_PIN` in a Server Action; a secure **httpOnly session cookie** is issued on success. The PIN is **never** bundled into client JavaScript.
- **Invoice & Quote Manager** — create, edit, print, and track invoices and quotes (no tax/VAT — total always equals subtotal) with a **per-quote deposit percentage** (default 50%, overridable per document), balances, and PayPal/EFT payment notes
- **Share straight to clients**:
  - 🟣 **Copy Email** — copies a polished, natural-sounding quote email (auto-calculated next-Monday kickoff + Wednesday staging dates)
  - ✍️ **Kickoff** — the build "recipe" email (plan, timeline, deposit, what I need from you)
  - 🏁 **Handover** — the final handover email (source code, export bundle, 7-day erasure, 14-day warranty)
  - 🔵 **Email** — opens Gmail with recipient/subject/body pre-filled
  - 🟢 **WhatsApp** — opens a WhatsApp chat with the document summary pre-filled
  - 🖨️ **Print / Export PDF** — clean, white-paper print output of just the document
- **Signed Declaration + PDF Bundle** — capture a client's signature (canvas, mouse/touch), persist it on the invoice record, and export the full legal bundle (signed declaration → invoice/quote → terms → privacy → POPIA → DPA) as a printable PDF via `/admin/export`
- **Project Manager** — manage case studies with **draft/published status**, live demo + GitHub links, and image upload; only published projects render on `/projects`
- **Client Reviews Manager** — add, edit, delete, and publish **verified client reviews** (rating, avatar, linked project, draft/published); published reviews appear on `/testimonials` and the homepage
- **Social Profile Links** — set GitHub / LinkedIn / Facebook / Discord URLs from the Upgrades tab; the icons appear site-wide (Footer, About) instantly and hide when left blank
- **AI API Pricing Reference** — 38 researched models across 16 providers; refreshes on tab open with a last-synced indicator; search, provider filter, and sort by cost. Clearly labeled as a reference snapshot (verify on official pages before quoting)
- **Client Portals** — create a private portal per client (unique username + password), link it to a quote/invoice, then send the invite message. The client logs in (server-verified) and sees their live tracker, quote summary, and declaration signing. All data persists in MongoDB.
- **JSON Backup & Restore** — export the full data set (invoices, projects, reviews, clients, config) to JSON and import it on any device.
- **MongoDB-backed architecture** — all data lives in MongoDB Atlas (free M0 tier). Public pages are async server components that fetch directly from the database for optimal SEO and performance. Admin/client pages use server actions for mutations.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Styling | Tailwind CSS v4, Lucide icons |
| CI | GitHub Actions (ESLint + strict TypeScript on every push) |
| API | Next.js Server Actions + Route Handlers (`/api/contact`, `/api/pricing/live`, `/api/client/*`) |
| Auth | Server Actions + httpOnly session cookies (`app/actions/auth.ts`, `lib/auth.ts`) |
| Data | MongoDB Atlas (free M0 tier) — all data persisted server-side |
| Language | TypeScript (strict) |

---

## 📧 Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
# Resend API key — enables live inbox delivery of contact-form leads.
# If missing, leads are logged server-side and the visitor submission still succeeds.
RESEND_API_KEY=

# Passcode for the /admin studio. Verified server-side; a secure httpOnly
# session cookie (7-day, SameSite=Strict) is issued on success.
# The PIN is never shipped to the browser.
ADMIN_PIN=change-me

# MongoDB Atlas (REQUIRED).
# All data is stored in MongoDB. The site will not function without this.
# Create a free M0 cluster at https://www.mongodb.com/cloud/atlas (no credit card),
# add a database user, set Network Access to "Allow access from anywhere" (0.0.0.0/0)
# for Vercel, then copy the mongodb+srv:// connection string from Connect → Drivers.
# NEVER commit the real value — keep it only in .env.local / Vercel env vars.
MONGODB_URI=
```

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | No* | Live email delivery for `/api/contact` leads (*optional; falls back to server logging) |
| `ADMIN_PIN` | Yes | Passcode for the `/admin` dashboard (set a strong value in production) |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string — stores all site data (invoices, projects, reviews, client portals, config) |

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

### 3. Run the dev server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

---

## ☁️ Deployment (Vercel)

This project is deployed to **Vercel**. From the CLI:

```bash
vercel link            # link the project once
vercel --prod --yes    # build, typecheck, and deploy to production
```

Set `ADMIN_PIN`, `MONGODB_URI`, and optionally `RESEND_API_KEY` as environment variables in the Vercel project settings for **Production**, **Preview**, and **Development**.

> **Canonical domain:** the site URL used in metadata, sitemap, `robots.txt`, and JSON-LD is a single value — `SITE_CONFIG.siteUrl` in `data/portfolioData.ts` — currently set to `https://jpfreelance.dpdns.org`. When you change domains, change **only that one value** and redeploy.

---

## 🗄️ MongoDB Atlas Setup (required)

All site data is stored in MongoDB Atlas (free M0 tier). The app uses the **official MongoDB driver** (declared in `package.json` — installed automatically by Vercel and GitHub Actions, nothing to run locally).

### Database Schema

| Collection | Stores |
|---|---|
| `invoices` | Invoices & quotes |
| `projects` | Case studies / portfolio items |
| `reviews` | Client testimonials |
| `clients` | Client portal accounts |
| `config` | Site config (social links, Google Form URL) — single document |

### Step 1 — Create the free cluster & copy the connection string

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → **Sign Up** (free, **no credit card** required).
2. **Create a Cluster** → choose the **M0 Free** tier (free forever) → pick a region close to your users (for South Africa, **AWS eu-west-1 (Ireland)** is the closest available free region) → **Create**.
3. **Database Access → Add New Database User** → choose **Password** → set a username and a strong password (**letters & numbers only** — special characters can break the connection string). Grant **"Read and write to any database"** (the default for new users).
4. **Network Access → Add IP Address → "Allow access from anywhere"** (`0.0.0.0/0`). This is **required**: Vercel's serverless functions connect from dynamic IPs that can't be allow-listed individually — your strong password is what protects the cluster.
5. **Connect → Drivers → Node.js** → copy the `mongodb+srv://<user>:<password>@cluster0….mongodb.net` **connection string** — this is your `MONGODB_URI`.

### Step 2 — Where to put the credentials

**Local development** — in `.env.local` (never commit it):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net
```

**Production (Vercel):**

1. Vercel dashboard → your project → **Settings → Environment Variables**.
2. Add `MONGODB_URI` with the full connection string (mark it **hidden**). Apply to **Production**, **Preview**, and **Development**.
3. **Redeploy** (or push to `main` — CI deploys automatically).

### Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `MONGODB_URI` not set | Add it in Vercel → Settings → Environment Variables, then redeploy. |
| Connection errors | Wrong `MONGODB_URI`, or Atlas **Network Access** doesn't allow `0.0.0.0/0`, or the database-user password in the URI is wrong. Check the Vercel function logs. |

**Security notes:** `MONGODB_URI` contains your database password — never commit it to git; keep it only in `.env.local` and the Vercel dashboard as a **hidden** env var. If the connection string ever leaks, rotate the database-user password in Atlas (**Database Access → Edit user → Update password**) and update `MONGODB_URI`.

---

## 📁 Project Structure

```
app/
  page.tsx              # Landing page (async server component)
  about/                # Developer background & guarantee
  services/             # Service packages & pricing
  process/              # Client roadmap
  projects/             # Case studies list + [slug] detail pages (async)
  testimonials/         # Client testimonials (async)
  contact/              # Contact & quote request
  admin/                # 🔒 Admin Studio (MongoDB-backed)
  admin/export/         # Signed declaration + full legal PDF bundle export
  client/               # 🧑 Client portal (server auth + MongoDB dashboard)
  invoice-template/     # Public invoice/quote template
  popia/  privacy/  terms/  dpa/   # Legal & compliance (POPIA, PAIA, GDPR DPA)
  api/contact/          # Lead dispatch route (Resend + server logging)
  api/pricing/live/     # AI pricing reference snapshot
  api/client/           # Client auth & account endpoints
  actions/              # Server Actions (auth, invoices, projects, reviews, clients, config, backup)
components/             # Shared UI (Header, Footer, buttons, demos…)
data/portfolioData.ts   # SITE_CONFIG + static content + type re-exports
lib/                    # Database, auth, email templates, client portal utils
hooks/                  # Client-side data hooks
```

---

## 🤖 How This Site Was Built

Full transparency: this portfolio was generated with **DeepSeek V4 Flash** inside **Freebuff**, with **human code review** on every change.

After each build, the site and its code were re-read multiple times using **DeepSeek Chat** and **Qwen Studio** to catch errors the human or the AI agent might have missed — the same multi-pass review applied to client projects before delivery.

> This note also appears on the live site: the "Full Transparency: This Website Was Built With AI" card on the `/about` page and a credit line in the footer.

---

## 📄 Legal & Compliance

- **POPIA Act 4 of 2013** — `/popia` documents all 8 lawful-processing conditions, a designated Information Officer, and a **7-day confidential-data destruction guarantee**
- **Privacy Policy** — `/privacy`
- **Terms** — `/terms` (kick-off deposit agreed per project and stated in the quote, source-code handover on final payment, pass-through API pricing at 0% markup)
- **Invoice template** — `/invoice-template`

---

© Jordan Peters Coder Freelancing. Built with Next.js 15 · React 19 · Tailwind CSS v4.
