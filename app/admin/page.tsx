"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Link from "next/link";
import {
  Lock,
  Unlock,
  ShieldCheck,
  Plus,
  Trash2,
  Printer,
  Mail,
  Send,
  Search,
  FileText,
  TrendingUp,
  Cpu,
  Calculator,
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  RefreshCw,
  Sparkles,
  Edit,
  Globe,
  Download,
  Upload,
  AlertCircle,
  Wrench,
  FolderPlus,
  Star,
  Share2,
  PenLine,
  Link2,
  Users,
  Bell,
  CheckCheck,
  ImageIcon
} from "lucide-react";
import { SITE_CONFIG, Project, ClientReview } from "@/data/portfolioData";
import SignaturePad from "@/components/SignaturePad";
import {
  buildQuoteEmailDraft,
  buildKickoffEmailDraft,
  buildHandoverEmailDraft,
  buildSignRequestEmailDraft,
} from "@/lib/emailTemplates";
import ClientPortalsTab from "@/components/admin/ClientPortalsTab";
import OverviewTab from "@/components/admin/OverviewTab";
import { API_PRICING_MODELS as LIVE_API_MODELS, type ApiPricingModel } from "@/data/apiPricingData";
import { loginAdmin, logoutAdmin, checkAdminAuth } from "@/app/actions/auth";
import { AdminDataProvider, useAdminData } from "@/components/admin/AdminDataProvider";
import type { Invoice, ClientPortalAccount, InvoiceItem } from "@/lib/types";

interface OfficialPricingLink {
  provider: string;
  url: string;
  examplePriceNote?: string;
  note?: string;
}

const OFFICIAL_PRICING_LINKS: OfficialPricingLink[] = [
  { provider: "OpenAI", url: "https://openai.com/api/pricing", examplePriceNote: "GPT-5.6 series (sol $5/$30, terra $2/$12, luna $0.20/$1.20)" },
  { provider: "Anthropic Claude", url: "https://platform.claude.com/docs/en/about-claude/pricing", examplePriceNote: "Fable 5 ($10/$50), Opus 5 ($5/$25), Sonnet 5 ($2/$10 intro)" },
  { provider: "Google Gemini", url: "https://ai.google.dev/gemini-api/docs/pricing", examplePriceNote: "3.1 Pro ($2/$12), 3.6 Flash ($1.50/$7.50), 3.5 Flash-Lite ($0.30/$2.50)" },
  { provider: "DeepSeek", url: "https://platform.deepseek.com/api/pricing", examplePriceNote: "V4-Flash (1/2 RMB), V4-Pro (3/6 RMB)" },
  { provider: "Qwen Cloud (Alibaba)", url: "https://help.aliyun.com/zh/model-studio/qwen-api", examplePriceNote: "Qwen3.8-Max (12/36 RMB), Qwen3.5-Plus (0.8/4.8 RMB)" },
  { provider: "GLM (Zhipu AI)", url: "https://bigmodel.cn/pricing", examplePriceNote: "GLM-5.2 (8/28 RMB)" },
  { provider: "LongCat AI (Meituan)", url: "https://longcat.chat/platform/docs/zh/pricing/long-cat-2.0", examplePriceNote: "LongCat-2.0 discounted at $0.30 / $1.20 per 1M" },
  { provider: "Mistral AI", url: "https://mistral.ai/pricing", examplePriceNote: "Large 3 ($0.50/$1.50), Medium 3.5 ($1.50/$7.50), Small 4 ($0.15/$0.60)" },
  { provider: "Cohere", url: "https://cohere.com/pricing", examplePriceNote: "Command A+ ($2.50/$10.00), Command R7B ($0.15/$0.60)" },
  { provider: "Kimi (Moonshot)", url: "https://platform.moonshot.cn", examplePriceNote: "Kimi K3 ($3/$15), K2.7 Code ($0.95/$4.00)" },
  { provider: "xAI Grok", url: "https://x.ai/api/pricing", examplePriceNote: "Grok 4.5 ($2/$6), Grok 4.3 ($1.25/$2.50)" },
  { provider: "Groq", url: "https://groq.com/pricing", examplePriceNote: "GPT-OSS 120B ($0.15/$0.60), Llama 3.3 70B ($0.59/$0.79)" },
  { provider: "Together AI", url: "https://together.ai/pricing", examplePriceNote: "Qwen3.7 Max ($1.25/$3.75), DeepSeek V4 Pro ($1.74/$3.48)" },
  { provider: "Fireworks AI", url: "https://fireworks.ai/pricing", examplePriceNote: "DeepSeek V4 Pro ($1.74/$3.48), Kimi K3 ($3/$15)" },
  { provider: "Replicate", url: "https://replicate.com/pricing", examplePriceNote: "Llama 4 Maverick (~$0.25/$0.95)" },
  { provider: "Ollama Cloud", url: "https://ollama.com/pricing", examplePriceNote: "Offers Free, Pro ($20/mo), and Max ($100/mo)" }
];

const LIVE_COMPARISON_TOOLS: OfficialPricingLink[] = [
  { provider: "BenchLM AI Comparison", url: "https://benchlm.ai/llm-api-pricing-comparison", examplePriceNote: "Live LLM API Pricing Matrix (August 2026)" },
  { provider: "MorphLLM Directory", url: "https://www.morphllm.com/llm-api-providers", examplePriceNote: "2026 LLM API Providers List" }
];

export default function AdminDashboardPage() {
  return (
    <AdminDataProvider>
      <AdminDashboardInner />
    </AdminDataProvider>
  );
}

function AdminDashboardInner() {
  const data = useAdminData();
  // Passcode security state - verified server-side via an httpOnly session cookie
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"overview" | "invoices" | "api-tracker" | "projects-manager" | "reviews-manager" | "clients-manager" | "cost-calculator" | "upgrades">("overview");

  // ─── Client activity notification bell ──────────────────────────────────────
  // Derived live from client portal activity (signed declaration, replies,
  // payment reports). "Seen" is tracked per-device via localStorage.
  const NOTIF_SEEN_KEY = "jp_admin_notif_seen";
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifSeenTs, setNotifSeenTs] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(NOTIF_SEEN_KEY) || 0);
    } catch {
      return 0;
    }
  });
  const [focusClientId, setFocusClientId] = useState<string | null>(null);

  const notifications = useMemo(() => {
    const items: { id: string; clientName: string; clientId: string; action: string; detail?: string; ts: string }[] = [];
    for (const c of data.clients) {
      for (const act of c.activity || []) {
        if (act.actor !== "client") continue;
        items.push({ id: act.id, clientName: c.clientName, clientId: c.id, action: act.action, detail: act.detail, ts: act.ts });
      }
    }
    return items.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()).slice(0, 20);
  }, [data.clients]);

  const unreadCount = notifications.filter((n) => new Date(n.ts).getTime() > notifSeenTs).length;

  const markNotifsRead = useCallback(() => {
    const now = Date.now();
    setNotifSeenTs(now);
    try {
      localStorage.setItem(NOTIF_SEEN_KEY, String(now));
    } catch {
      // private mode - ignore
    }
    setNotifOpen(false);
  }, []);

  const handleNotifClick = useCallback(
    (clientId: string) => {
      markNotifsRead();
      setFocusClientId(clientId);
      setActiveTab("clients-manager");
    },
    [markNotifsRead]
  );

  // Live sync: while the studio is open, silently re-pull from MongoDB so client
  // activity (signatures, replies, payment reports) lands in the bell and lists
  // without a manual refresh. Visibility-aware - never polls in a hidden tab.
  const reloadAllRef = useRef(data.reloadAll);
  reloadAllRef.current = data.reloadAll;
  useEffect(() => {
    if (!isAuthenticated) return;
    const refresh = () => {
      if (document.visibilityState === "visible") reloadAllRef.current();
    };
    document.addEventListener("visibilitychange", refresh);
    const id = setInterval(refresh, 30000);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [isAuthenticated]);

  // data.invoices & Quotes State
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditingInvoice, setIsEditingInvoice] = useState(false);

  // Signed declaration - captured on-screen, embedded in the printed document
  // and the full legal PDF bundle (/admin/export). Persisted on the invoice
  // record itself so it survives refreshes and travels with backups.
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [signerName, setSignerName] = useState("");
  const [declarationAcknowledged, setDeclarationAcknowledged] = useState(false);

  const persistDeclaration = useCallback(
    (next: Partial<{ signatureDataUrl: string; signerName: string; acknowledged: boolean }>) => {
      if (!selectedInvoice) return;
      const merged = {
        signatureDataUrl: next.signatureDataUrl ?? signatureDataUrl,
        signerName: next.signerName ?? signerName,
        acknowledged: next.acknowledged ?? declarationAcknowledged,
        signedAt: new Date().toISOString(),
        signedBy: "admin" as const,
      };
      data.updateInvoice(selectedInvoice.id, { declaration: merged }).catch((err) => {
        console.error("[admin] declaration save failed:", err);
        showToast("Signature save failed - MongoDB unreachable.");
      });
      // Keep the local selection in sync so a later "Save" never overwrites the
      // freshly captured signature with a stale timestamp / actor.
      setSelectedInvoice({ ...selectedInvoice, declaration: merged });
      // Interlink: mirror the studio-captured signature onto the linked client
      // portal so the client sees it as signed the next time they log in.
      const linkedClient = data.clients.find((c) => c.invoiceId === selectedInvoice.id);
      if (linkedClient?.id) data.updateClient(linkedClient.id, { declaration: merged });
    },
    [selectedInvoice, signatureDataUrl, signerName, declarationAcknowledged, data, showToast]
  );

  // Load the saved declaration whenever a different invoice is opened.
  useEffect(() => {
    const decl = selectedInvoice?.declaration;
    setSignatureDataUrl(decl?.signatureDataUrl || "");
    setSignerName(decl?.signerName || "");
    setDeclarationAcknowledged(decl?.acknowledged || false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInvoice?.id]);

  // Form State for Invoice Creation / Editing
  const [invDocType, setInvDocType] = useState<"Invoice" | "Quote">("Invoice");
  const [invNumber, setInvNumber] = useState("");
  const [invClientName, setInvClientName] = useState("");
  const [invClientCompany, setInvClientCompany] = useState("");
  const [invClientEmail, setInvClientEmail] = useState("");
  const [invClientPhone, setInvClientPhone] = useState("");
  const [invCurrency, setInvCurrency] = useState<"ZAR" | "USD">("ZAR");
  const [invIssueDate, setInvIssueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [invDueDate, setInvDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 10);
  });
  const [invStatus, setInvStatus] = useState<"Draft" | "Sent" | "Paid" | "Overdue" | "Accepted">("Sent");
  const [invItems, setInvItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Custom Web Application Development", quantity: 1, rate: 7500 }
  ]);
  const [invDepositPercent, setInvDepositPercent] = useState(50);
  const [invDepositPaid, setInvDepositPaid] = useState(0);
  const [invNotes, setInvNotes] = useState("Payable via PayPal or Direct EFT (Bank Transfer). Full source code delivered upon final payment.");

  // Quote proposal fields (shown only when documentType === "Quote")
  const [proposalSummary, setProposalSummary] = useState("");
  const [proposalSolution, setProposalSolution] = useState("");
  const [proposalDeliverables, setProposalDeliverables] = useState<string[]>([]);
  const [proposalTimeline, setProposalTimeline] = useState("");
  const [proposalGuarantee, setProposalGuarantee] = useState("14-day bug-fix warranty. 7-day data erasure. You own the source code.");
  const [proposalSocialProof, setProposalSocialProof] = useState("");
  const [proposalNextSteps, setProposalNextSteps] = useState("Reply YES to this quote to get started. I will send your deposit invoice within 24 hours.");

  // API Tracker State
  const [apiModels, setApiModels] = useState<ApiPricingModel[]>(LIVE_API_MODELS);
  const [isSyncingPricing, setIsSyncingPricing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("Just now");
  const [syncSource, setSyncSource] = useState<string>("Static snapshot");
  const [officialLinks, setOfficialLinks] = useState<OfficialPricingLink[]>(OFFICIAL_PRICING_LINKS);
  const [comparisonTools, setComparisonTools] = useState<OfficialPricingLink[]>(LIVE_COMPARISON_TOOLS);
  const [apiSearchQuery, setApiSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"input-low" | "input-high" | "output-low" | "context-high">("input-low");
  const [syncFailed, setSyncFailed] = useState(false);
  const isSyncingPricingRef = useRef(false);
  const prevTabRef = useRef<"overview" | "invoices" | "api-tracker" | "projects-manager" | "reviews-manager" | "clients-manager" | "cost-calculator" | "upgrades">("overview");

  const formatSyncTime = (d: Date) =>
    d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleSyncLivePricing = async () => {
    // Guard against overlapping syncs (manual button + auto-sync on tab open).
    if (isSyncingPricingRef.current) return;
    isSyncingPricingRef.current = true;
    setIsSyncingPricing(true);
    try {
      const res = await fetch("/api/pricing/live");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && data.models) {
        setApiModels(data.models);
        setLastSyncedTime(formatSyncTime(new Date()));
        setSyncSource(data.source || "OpenRouter live");
        if (data.officialPricingPages) setOfficialLinks(data.officialPricingPages);
        if (data.comparisonTools) setComparisonTools(data.comparisonTools);
        setSyncFailed(false);
        const liveN = data.liveModelsUpdated ?? 0;
        showToast(liveN > 0
          ? `Live pricing synced - ${liveN} models updated from OpenRouter. ${data.models.length} total.`
          : `Reference pricing loaded - ${data.models.length} models. Verify rates before quoting.`);
      } else {
        setSyncFailed(true);
        showToast("Reference pricing snapshot refreshed.");
      }
    } catch (err) {
      setSyncFailed(true);
      showToast("Could not load reference pricing - using snapshot.");
      if (process.env.NODE_ENV === "development") console.error("[API Tracker] sync failed:", err);
    } finally {
      isSyncingPricingRef.current = false;
      setIsSyncingPricing(false);
    }
  };

  // Auto-sync the Live API Pricing tab each time it is opened.
  useEffect(() => {
    if (prevTabRef.current !== "api-tracker" && activeTab === "api-tracker") {
      handleSyncLivePricing();
    }
    prevTabRef.current = activeTab;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Cost Estimator State
  const [calcInputTokensM, setCalcInputTokensM] = useState<number>(5.0); // Millions
  const [calcOutputTokensM, setCalcOutputTokensM] = useState<number>(1.5); // Millions

  // Projects Manager State
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditingProject, setIsEditingProject] = useState(false);

  // Project Form State
  const [projTitle, setProjTitle] = useState("");
  const [projCategory, setProjCategory] = useState<'dashboard' | 'webapp' | 'mvp' | 'tourism' | 'ecommerce' | 'other'>("webapp");
  const [projClient, setProjClient] = useState("");
  const [projDescription, setProjDescription] = useState("");
  const [projProblem, setProjProblem] = useState("");
  const [projSolution, setProjSolution] = useState("");
  const [projResults, setProjResults] = useState("");
  const [projImage, setProjImage] = useState("");
  const [projTech, setProjTech] = useState("");
  const [projDeliveryDays, setProjDeliveryDays] = useState(5);
  const [projPagesCount, setProjPagesCount] = useState(6);
  const [projLiveDemo, setProjLiveDemo] = useState("");
  const [projGithub, setProjGithub] = useState("");
  const [projEmbedUrl, setProjEmbedUrl] = useState("");
  const [projStatus, setProjStatus] = useState<"draft" | "published">("published");
  const [projFeatured, setProjFeatured] = useState(true);

  // Client Reviews (Testimonials) Manager State
  const [selectedReview, setSelectedReview] = useState<ClientReview | null>(null);
  const [isEditingReview, setIsEditingReview] = useState(false);

  // Review Form State
  const [revClientName, setRevClientName] = useState("");
  const [revCompanyTitle, setRevCompanyTitle] = useState("");
  const [revAvatar, setRevAvatar] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revContent, setRevContent] = useState("");
  const [revProjectId, setRevProjectId] = useState("");
  const [revStatus, setRevStatus] = useState<"draft" | "published">("published");


  // Local form state for settings (saved to MongoDB on button click)
  const [adminGoogleFormUrl, setAdminGoogleFormUrl] = useState(data.googleFormUrl);
  const [socialLinks, setSocialLinks] = useState({
    githubUrl: data.socialLinks.githubUrl,
    linkedinUrl: data.socialLinks.linkedinUrl,
    facebookUrl: data.socialLinks.facebookUrl,
    discordUrl: data.socialLinks.discordUrl,
    repoUrl: data.socialLinks.repoUrl,
  });

  // Sync local form state when cloud config loads/changes
  const [configSynced, setConfigSynced] = useState(false);
  useEffect(() => {
    if (!configSynced) {
      setAdminGoogleFormUrl(data.googleFormUrl);
      setSocialLinks({
        githubUrl: data.socialLinks.githubUrl,
        linkedinUrl: data.socialLinks.linkedinUrl,
        facebookUrl: data.socialLinks.facebookUrl,
        discordUrl: data.socialLinks.discordUrl,
        repoUrl: data.socialLinks.repoUrl,
      });
      setConfigSynced(true);
    }
  }, [data.googleFormUrl, data.socialLinks, configSynced]);

  // UI Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: unknown) {
    const text = typeof msg === "string" ? msg : String(msg || "");
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 3000);
  }

  // Restore an authenticated session on mount if a valid httpOnly cookie exists.
  useEffect(() => {
    let cancelled = false;
    checkAdminAuth().then((valid) => {
      if (cancelled) return;
      if (valid) {
        setIsAuthenticated(true);
        // The hooks inside AdminDataProvider fire on mount before the session
        // cookie is restored. Re-pull everything so the dashboard is populated.
        reloadAllRef.current();
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auth Handlers
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setPinError("Please enter the admin passcode.");
      return;
    }
    setIsLoggingIn(true);
    setPinError("");
    try {
      const result = await loginAdmin(pinInput);
      if (result.success) {
        setIsAuthenticated(true);
        setPinInput("");
        // Hooks fire on mount before the session cookie is set, so the
        // initial fetches returned empty data. Now that we're authenticated,
        // re-pull everything so the dashboard is populated.
        data.reloadAll();
        showToast("Access Granted • Welcome Jordan Peters");
      } else {
        setPinError(result.error || "Invalid passcode.");
      }
    } catch {
      setPinError("Could not reach the server. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    showToast("Admin portal locked");
    await logoutAdmin();
    setIsAuthenticated(false);
  };

  // INVOICE / QUOTE HANDLERS
  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invClientName.trim()) {
      showToast("Please enter the client name.");
      return;
    }

    const updatedInvoice: Invoice = {
      id: selectedInvoice && isEditingInvoice ? selectedInvoice.id : `inv-${Date.now()}`,
      documentType: invDocType,
      invoiceNumber: invNumber || `${invDocType === "Quote" ? "QUO" : "INV"}-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: invClientName,
      clientCompany: invClientCompany,
      clientEmail: invClientEmail,
      clientPhone: invClientPhone,
      currency: invCurrency,
      issueDate: invIssueDate,
      dueDate: invDueDate,
      status: invStatus,
      items: invItems,
      depositPercent: Number(invDepositPercent) || 50,
      depositPaid: Number(invDepositPaid),
      notes: invNotes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      declaration:
        signatureDataUrl || signerName || declarationAcknowledged
          ? {
              signatureDataUrl,
              signerName,
              acknowledged: declarationAcknowledged,
              signedAt: selectedInvoice?.declaration?.signedAt || new Date().toISOString(),
              signedBy: selectedInvoice?.declaration?.signedBy,
            }
          : selectedInvoice?.declaration,
      // Proposal fields (quotes only)
      ...(invDocType === "Quote" && {
        proposalSummary: proposalSummary.trim() || undefined,
        proposalSolution: proposalSolution.trim() || undefined,
        proposalDeliverables: proposalDeliverables.length > 0 ? proposalDeliverables : undefined,
        proposalTimeline: proposalTimeline.trim() || undefined,
        proposalGuarantee: proposalGuarantee.trim() || undefined,
        proposalSocialProof: proposalSocialProof.trim() || undefined,
        proposalNextSteps: proposalNextSteps.trim() || undefined,
      }),
    };

    try {
      if (selectedInvoice && isEditingInvoice) {
        await data.updateInvoice(selectedInvoice.id, updatedInvoice);
        // Interlink: if this document has a signature, mirror it onto the linked
        // client portal so the client sees the signed state on their dashboard.
        if (updatedInvoice.declaration?.signatureDataUrl) {
          const linkedClient = data.clients.find((c) => c.invoiceId === updatedInvoice.id);
          if (linkedClient?.id) data.updateClient(linkedClient.id, { declaration: updatedInvoice.declaration });
        }
      } else {
        await data.createInvoice(updatedInvoice);
      }
    } catch (err) {
      console.error("[admin] invoice save failed:", err);
      showToast("Save failed - MongoDB unreachable. Your changes were not saved.");
      return;
    }
    setSelectedInvoice(updatedInvoice);
    setIsEditingInvoice(false);
    showToast(`${updatedInvoice.documentType} ${updatedInvoice.invoiceNumber} saved!`);
  };

  const handleNewInvoiceClick = (docType: "Invoice" | "Quote" = "Invoice") => {
    setSelectedInvoice(null);
    setIsEditingInvoice(true);
    setInvDocType(docType);
    setInvNumber(`${docType === "Quote" ? "QUO" : "INV"}-2026-${Math.floor(100 + Math.random() * 900)}`);
    setInvClientName("");
    setInvClientCompany("");
    setInvClientEmail("");
    setInvClientPhone("");
    setInvCurrency("ZAR");
    setInvIssueDate(new Date().toISOString().slice(0, 10));
    setInvDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    setInvStatus("Sent");
    setInvItems([{ id: "1", description: "Custom Web Application / Dashboard Development", quantity: 1, rate: 8500 }]);
    setInvDepositPercent(50);
    setInvDepositPaid(0);
    setInvNotes("Payable via PayPal or Direct EFT (Bank Transfer). 48-Hour Staging Guarantee applied.");
    // Reset proposal fields for new quotes
    setProposalSummary("");
    setProposalSolution("");
    setProposalDeliverables([]);
    setProposalTimeline("");
    setProposalGuarantee("14-day bug-fix warranty. 7-day data erasure. You own the source code.");
    setProposalSocialProof("");
    setProposalNextSteps("Reply \"YES\" to this quote to get started - I'll send your deposit invoice within 24 hours.");
  };

  const handleEditInvoiceClick = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsEditingInvoice(true);
    setInvDocType(inv.documentType || "Invoice");
    setInvNumber(inv.invoiceNumber);
    setInvClientName(inv.clientName);
    setInvClientCompany(inv.clientCompany);
    setInvClientEmail(inv.clientEmail);
    setInvClientPhone(inv.clientPhone);
    setInvCurrency(inv.currency);
    setInvIssueDate(inv.issueDate);
    setInvDueDate(inv.dueDate);
    setInvStatus(inv.status);
    setInvItems(inv.items || [{ id: "1", description: "", quantity: 1, rate: 0 }]);
    setInvDepositPercent(inv.depositPercent ?? 50);
    setInvDepositPaid(inv.depositPaid);
    setInvNotes(inv.notes);
    setProposalSummary(inv.proposalSummary || "");
    setProposalSolution(inv.proposalSolution || "");
    setProposalDeliverables(inv.proposalDeliverables || []);
    setProposalTimeline(inv.proposalTimeline || "");
    setProposalGuarantee(inv.proposalGuarantee || "");
    setProposalSocialProof(inv.proposalSocialProof || "");
    setProposalNextSteps(inv.proposalNextSteps || "");
  };

  const handleDeleteInvoice = async (id: string) => {
    await data.deleteInvoice(id);
    if (selectedInvoice?.id === id) {
      setSelectedInvoice(null);
    }
    showToast("Document deleted successfully");
  };

  /** Clone an existing invoice/quote with a new number and Draft status. */
  const handleDuplicateInvoice = async (inv: Invoice) => {
    const newId = `inv-${Date.now()}`;
    const newNumber = `${inv.documentType === "Quote" ? "QUO" : "INV"}-2026-${Math.floor(100 + Math.random() * 900)}`;
    const clone: Invoice = {
      ...inv,
      id: newId,
      invoiceNumber: newNumber,
      status: "Draft",
      depositPaid: 0,
      declaration: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await data.createInvoice(clone);
    handleEditInvoiceClick(clone);
    showToast(`Duplicated as ${newNumber} — edit and save.`);
  };

  const addInvoiceItem = () => {
    setInvItems([...invItems, { id: `${Date.now()}`, description: "", quantity: 1, rate: 1000 }]);
  };

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvItems(
      invItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeInvoiceItem = (id: string) => {
    if (invItems.length === 1) return;
    setInvItems(invItems.filter((i) => i.id !== id));
  };

  const calculateInvoiceSubtotal = (inv: Invoice) => {
    return (inv.items || []).reduce((sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0);
  };

  // No tax (VAT/GST) is ever applied - the total always equals the subtotal.
  const calculateInvoiceTotal = (inv: Invoice) => {
    return calculateInvoiceSubtotal(inv);
  };

  // Contractual kick-off deposit for THIS document: Total × Deposit % / 100.
  const calculateDepositAmount = (inv: Invoice) => {
    return Math.round(calculateInvoiceTotal(inv) * ((inv.depositPercent ?? 50) / 100));
  };

  // The final balance a client owes per the document (Total − Deposit %).
  const calculateClientBalance = (inv: Invoice) => {
    return Math.max(0, calculateInvoiceTotal(inv) - calculateDepositAmount(inv));
  };

  const calculateInvoiceBalance = (inv: Invoice) => {
    const total = calculateInvoiceTotal(inv);
    return Math.max(0, total - inv.depositPaid);
  };

  // PROJECT MANAGER HANDLERS
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim()) {
      showToast("Please enter project title");
      return;
    }

    const techArray = projTech.split(",").map((t) => t.trim()).filter(Boolean);
    const slugStr = projTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const updatedProject: Project = {
      id: selectedProject && isEditingProject ? selectedProject.id : `proj-${Date.now()}`,
      slug: slugStr || `project-${Date.now()}`,
      title: projTitle,
      description: projDescription,
      category: projCategory,
      image: projImage || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      tech: techArray.length ? techArray : ["Next.js 15", "Tailwind CSS", "TypeScript"],
      client: projClient || "SME Client",
      problem: projProblem || "Need custom scalable web system.",
      solution: projSolution || "Built bespoke Next.js dashboard with zero clutter.",
      results: projResults || "Delivered live production staging link in 48 hours.",
      deliveryDays: Number(projDeliveryDays),
      pagesCount: Number(projPagesCount),
      liveDemo: projLiveDemo || "#interactive-preview",
      embedUrl: projEmbedUrl.trim() || undefined,
      githubUrl: projGithub || undefined,
      status: projStatus,
      featured: projFeatured,
      createdAt: selectedProject?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (selectedProject && isEditingProject) {
        await data.updateProject(selectedProject.id, updatedProject);
      } else {
        await data.createProject(updatedProject);
      }
    } catch (err) {
      console.error("[admin] project save failed:", err);
      showToast("Save failed - MongoDB unreachable. Your changes were not saved.");
      return;
    }
    setSelectedProject(updatedProject);
    setIsEditingProject(false);
    showToast(
      updatedProject.status === "published"
        ? `Project "${updatedProject.title}" saved & published to the site!`
        : `Project "${updatedProject.title}" saved as a draft (hidden from the public site).`
    );
  };

  const handleNewProjectClick = () => {
    setSelectedProject(null);
    setIsEditingProject(true);
    setProjTitle("");
    setProjCategory("webapp");
    setProjClient("");
    setProjDescription("");
    setProjProblem("");
    setProjSolution("");
    setProjResults("");
    setProjImage("https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80");
    setProjTech("Next.js 15, Tailwind CSS, TypeScript, Node.js");
    setProjDeliveryDays(5);
    setProjPagesCount(6);
    setProjLiveDemo("#interactive-preview");
    setProjGithub("");
    setProjEmbedUrl("");
    setProjStatus("published");
    setProjFeatured(true);
  };

  const handleEditProjectClick = (p: Project) => {
    setSelectedProject(p);
    setIsEditingProject(true);
    setProjTitle(p.title);
    setProjCategory(p.category);
    setProjClient(p.client);
    setProjDescription(p.description);
    setProjProblem(p.problem);
    setProjSolution(p.solution);
    setProjResults(p.results);
    setProjImage(p.image);
    setProjTech(p.tech.join(", "));
    setProjDeliveryDays(p.deliveryDays || 5);
    setProjPagesCount(p.pagesCount || 6);
    setProjLiveDemo(p.liveDemo || "#interactive-preview");
    setProjGithub(p.githubUrl || "");
    setProjEmbedUrl(p.embedUrl || "");
    setProjStatus(p.status ?? "published");
    setProjFeatured(p.featured ?? true);
  };

  const handleDeleteProject = async (id: string) => {
    await data.deleteProject(id);
    if (selectedProject?.id === id) setSelectedProject(null);
    showToast("Project deleted successfully");
  };

  // Reads an image file into a data URL for local-first storage (browser only).
  const handleImageFileUpload = (file: File | undefined, setter: (v: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please choose an image file.");
      return;
    }
    if (file.size > 1024 * 1024) {
      showToast("Image too large - keep it under 1 MB (local browser storage).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setter(String(reader.result));
    reader.readAsDataURL(file);
  };

  // CLIENT REVIEWS (TESTIMONIALS) MANAGER HANDLERS
  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revClientName.trim() || !revContent.trim()) {
      showToast("Please add the client name and review content.");
      return;
    }

    const linkedProject = data.projects.find((p) => p.id === revProjectId);
    const updatedReview: ClientReview = {
      id: selectedReview && isEditingReview ? selectedReview.id : `rev-${Date.now()}`,
      clientName: revClientName,
      companyTitle: revCompanyTitle,
      avatar: revAvatar,
      rating: Math.min(5, Math.max(1, Number(revRating) || 5)),
      content: revContent,
      projectId: linkedProject?.id || undefined,
      projectTitle: linkedProject?.title || undefined,
      status: revStatus,
      createdAt: selectedReview?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (selectedReview && isEditingReview) {
        await data.updateReview(selectedReview.id, updatedReview);
      } else {
        await data.createReview(updatedReview);
      }
    } catch (err) {
      console.error("[admin] review save failed:", err);
      showToast("Save failed - MongoDB unreachable. Your changes were not saved.");
      return;
    }
    setSelectedReview(updatedReview);
    setIsEditingReview(false);
    showToast(
      updatedReview.status === "published"
        ? `Review from ${updatedReview.clientName} published!`
        : `Review from ${updatedReview.clientName} saved as draft.`
    );
  };

  const handleNewReviewClick = () => {
    setSelectedReview(null);
    setIsEditingReview(true);
    setRevClientName("");
    setRevCompanyTitle("");
    setRevAvatar("");
    setRevRating(5);
    setRevContent("");
    setRevProjectId("");
    setRevStatus("published");
  };

  const handleEditReviewClick = (r: ClientReview) => {
    setSelectedReview(r);
    setIsEditingReview(true);
    setRevClientName(r.clientName);
    setRevCompanyTitle(r.companyTitle);
    setRevAvatar(r.avatar || "");
    setRevRating(r.rating);
    setRevContent(r.content);
    setRevProjectId(r.projectId || "");
    setRevStatus(r.status ?? "draft");
  };

  const handleDeleteReview = async (id: string) => {
    await data.deleteReview(id);
    if (selectedReview?.id === id) setSelectedReview(null);
    showToast("Review deleted successfully");
  };

  // CLIENT PORTALS HANDLERS

  // SYSTEM UPGRADE & BACKUP TOOLS
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = async () => {
    const backup = await data.exportBackup();
    const jsonStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jordan-peters-coder-freelancing-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast("JSON Admin Backup Exported!");
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so the same file can be re-selected on a later attempt.
    e.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const backup = {
          invoices: Array.isArray(parsed.invoices) ? parsed.invoices : Array.isArray(parsed.data?.invoices) ? parsed.data.invoices : undefined,
          projects: Array.isArray(parsed.projects) ? parsed.projects : Array.isArray(parsed.data?.projects) ? parsed.data.projects : undefined,
          reviews: Array.isArray(parsed.reviews) ? parsed.reviews : Array.isArray(parsed.data?.reviews) ? parsed.data.reviews : undefined,
          clients: Array.isArray(parsed.clients) ? parsed.clients : Array.isArray(parsed.data?.clients) ? parsed.data.clients : undefined,
          config: parsed.config || parsed.data?.config || undefined,
        };

        if (!backup.invoices && !backup.projects && !backup.reviews && !backup.clients) {
          showToast("Invalid backup - expected { invoices: [], projects: [], reviews: [], clients: [] }.");
          return;
        }

        await data.importBackup({ ...backup, exportedAt: new Date().toISOString() });
        setSelectedInvoice(null);
        setSelectedProject(null);
        setSelectedReview(null);
        showToast("JSON backup imported & restored!");
      } catch {
        showToast("Could not read that file - please choose a valid JSON backup.");
      }
    };
    reader.onerror = () => {
      showToast("Could not read that file - please choose a valid JSON backup.");
    };
    reader.readAsText(file);
  };

  const handleClearCache = async () => {
    // Source of truth is MongoDB - "resetting the cache" means re-fetching
    // everything from the database, never seeding or overwriting live data.
    await data.reloadAll();
    setSelectedInvoice(null);
    setSelectedProject(null);
    setSelectedReview(null);
    showToast("Admin store reset to clean slate!");
  };

  const handleSaveGoogleFormUrl = async () => {
    await data.saveGoogleFormUrl(adminGoogleFormUrl);
    showToast("Google Form URL saved globally!");
  };

  const handleSaveSocialLinks = async () => {
    await data.saveSocialLinks(socialLinks);
    showToast("Social profile links saved globally!");
  };

  // Filter & Sort API Models
  const filteredApiModels = apiModels.filter((m) => {
    const matchesProvider = selectedProvider === "All" || m.provider === selectedProvider;
    const matchesQuery =
      m.name.toLowerCase().includes(apiSearchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(apiSearchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(apiSearchQuery.toLowerCase());
    return matchesProvider && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === "input-low") return a.inputCostPer1M - b.inputCostPer1M;
    if (sortBy === "input-high") return b.inputCostPer1M - a.inputCostPer1M;
    if (sortBy === "output-low") return a.outputCostPer1M - b.outputCostPer1M;
    return 0;
  });

  const getWhatsAppShareUrl = (inv: Invoice) => {
    const symbol = inv.currency === "ZAR" ? "R" : "$";
    const total = calculateInvoiceTotal(inv);
    const deposit = calculateDepositAmount(inv);
    const balance = calculateClientBalance(inv);
    const pct = inv.depositPercent ?? 50;
    const docTitle = inv.documentType === "Quote" ? "Official Quotation" : "Invoice";

    let text = `Hi ${inv.clientName},\n\nHere is your ${docTitle} ${inv.invoiceNumber} from ${SITE_CONFIG.brandLine}:\n\nProject: ${inv.items[0]?.description || "Custom Web App"}\nTotal Amount: ${symbol} ${total.toLocaleString()}\nKick-off Deposit (${pct}%): ${symbol} ${deposit.toLocaleString()}\nFinal Balance Due: ${symbol} ${balance.toLocaleString()}`;

    // Append proposal sections for quotes
    if (inv.documentType === "Quote") {
      if (inv.proposalSummary) text += `\n\n🎯 *Your Project:*\n${inv.proposalSummary}`;
      if (inv.proposalSolution) text += `\n\n💡 *Proposed Solution:*\n${inv.proposalSolution}`;
      if (inv.proposalDeliverables && inv.proposalDeliverables.length > 0) {
        text += `\n\n📦 *What You Get:*`;
        inv.proposalDeliverables.forEach((d) => { text += `\n✓ ${d}`; });
      }
      if (inv.proposalTimeline) text += `\n\n⏱️ *Timeline:*\n${inv.proposalTimeline}`;
      if (inv.proposalGuarantee) text += `\n\n🛡️ *Guarantee:*\n${inv.proposalGuarantee}`;
      if (inv.proposalSocialProof) text += `\n\n⭐ *Why Us:*\n${inv.proposalSocialProof}`;
      if (inv.proposalNextSteps) text += `\n\n🚀 *Next Steps:*\n${inv.proposalNextSteps}`;
    }

    text += `\n\nPayable via PayPal or Direct EFT (Bank Transfer).`;
    text += `\nPayPal.me: ${SITE_CONFIG.paypalMeUrl}`;
    text += `\nThank you!`;
    return `https://wa.me/${inv.clientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
  };

  /** Copies text to the clipboard with a graceful fallback for insecure contexts. */
  const copyTextToClipboard = async (text: string, okLabel: string, failLabel?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(okLabel);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      if (ok) showToast(okLabel);
      else showToast(failLabel || "Could not copy automatically - long-press to select & copy.");
    }
  };

  const handleCopyEmailDraft = async (inv: Invoice) => {
    await copyTextToClipboard(
      buildQuoteEmailDraft(inv),
      `Quote email copied - paste it into Gmail to send to ${inv.clientName}.`
    );
  };

  const handleCopyKickoffEmail = async (inv: Invoice) => {
    await copyTextToClipboard(
      buildKickoffEmailDraft(inv),
      `Kick-off email copied - paste it into Gmail to send to ${inv.clientName}.`
    );
  };

  const handleCopyHandoverEmail = async (inv: Invoice) => {
    await copyTextToClipboard(
      buildHandoverEmailDraft(inv),
      `Final handover email copied - paste it into Gmail to send to ${inv.clientName}.`
    );
  };

  const handleCopySignRequestEmail = async (inv: Invoice) => {
    await copyTextToClipboard(
      buildSignRequestEmailDraft(inv),
      `Sign-request email copied - attach the PDF and send it to ${inv.clientName}.`
    );
  };

  const getMailtoShareUrl = (inv: Invoice) => {
    // Keep the mailto body concise - the full draft (buildEmailDraft) percent-encodes to
    // ~3x its size and can exceed mail clients' mailto: URL length limits, truncating it.
    // Use the "Copy Email" button for the complete draft.
    const symbol = inv.currency === "ZAR" ? "R" : "$";
    const total = calculateInvoiceTotal(inv);
    const balance = calculateClientBalance(inv);
    const docTitle = inv.documentType === "Quote" ? "Quotation" : "Invoice";
    const subject = `${docTitle} ${inv.invoiceNumber} - ${SITE_CONFIG.tradingName}`;
    const pct = inv.depositPercent ?? 50;
    const deposit = calculateDepositAmount(inv);
    const body = [
      `Hi ${inv.clientName},`,
      `Please find your ${docTitle.toLowerCase()} ${inv.invoiceNumber}:`,
      `Total: ${symbol} ${total.toLocaleString()}`, 
      `Kick-off Deposit (${pct}%): ${symbol} ${deposit.toLocaleString()}`, 
      `Final Balance Due: ${symbol} ${balance.toLocaleString()}`, 
      ``, 
      `Payable via PayPal (${SITE_CONFIG.paypalEmail}) or Direct EFT (Bank Transfer).`,
      `PayPal.me: ${SITE_CONFIG.paypalMeUrl}`,
      ``, 
      `Kind regards,`, 
      `${SITE_CONFIG.developerName}`, 
      `${SITE_CONFIG.tradingName}`, 
    ].join("\n");
    return `mailto:${inv.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };


  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors print:bg-white print:text-slate-900">
      <Header />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl border border-orange-500/50 flex items-center gap-3 animate-in slide-in-from-top-2 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 py-8 sm:py-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* PASSCODE LOCK SCREEN */}
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto py-12 sm:py-16 text-center space-y-6 bg-white dark:bg-[#0D1A2D] p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 mx-auto flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Private Studio Admin
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Enter your Jordan Peters Studio passcode to access your custom invoicing, live API pricing, & project manager.
                </p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-4">
                <div>
                  <input
                    id="admin-passcode-input"
                    type="password"
                    maxLength={32}
                    placeholder="Enter Admin PIN"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full text-center tracking-widest text-lg font-bold p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {pinError && <p className="text-xs text-red-500 font-medium mt-1.5">{pinError}</p>}
                </div>

                <button
                  id="admin-unlock-btn"
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Unlock className="w-4 h-4" />
                  {isLoggingIn ? "Verifying…" : "Unlock Admin Portal"}
                </button>
              </form>

              <p className="text-[11px] text-slate-400 font-mono">
                🔒 Server-verified session (httpOnly cookie)
              </p>
            </div>
          ) : (
            /* AUTHENTICATED DASHBOARD CONTENT */
            <div className="space-y-8">

              {/* TOP BRAND HEADER */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Studio Admin Active
                    </span>
                    <span className="text-xs font-mono text-slate-400">{SITE_CONFIG.brandLine}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Invoicing, Live API & Projects Studio
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    id="admin-create-new-invoice-header-btn"
                    onClick={() => {
                      setActiveTab("invoices");
                      handleNewInvoiceClick("Invoice");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow hover:shadow-md transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Invoice
                  </button>

                  <button
                    type="button"
                    id="admin-create-new-quote-header-btn"
                    onClick={() => {
                      setActiveTab("invoices");
                      handleNewInvoiceClick("Quote");
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shadow transition-all flex items-center gap-2 border border-slate-700"
                  >
                    <FileText className="w-4 h-4 text-orange-400" />
                    New Quote
                  </button>

                  <div className="relative">
                    <button
                      type="button"
                      id="admin-notifications-btn"
                      onClick={() => (notifOpen ? markNotifsRead() : setNotifOpen(true))}
                      className="relative px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <Bell className="w-4 h-4 text-slate-400" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                    {notifOpen && (
                      <div className="absolute right-0 top-full mt-2 w-80 max-w-[85vw] bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                          <p className="text-xs font-extrabold text-slate-900 dark:text-white">Client Activity</p>
                          <button
                            onClick={markNotifsRead}
                            className="text-[10px] font-bold text-orange-500 hover:underline flex items-center gap-1"
                          >
                            <CheckCheck className="w-3 h-3" /> Mark all read
                          </button>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <p className="text-xs text-slate-400 p-4 text-center">No client activity yet.</p>
                          ) : (
                            notifications.map((n) => (
                              <button
                                key={n.id}
                                onClick={() => handleNotifClick(n.clientId)}
                                className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 last:border-0 flex items-start gap-2.5"
                              >
                                <span
                                  className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                                    new Date(n.ts).getTime() > notifSeenTs ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-600"
                                  }`}
                                />
                                <span className="min-w-0">
                                  <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {n.clientName} - {n.action}
                                  </span>
                                  {n.detail && <span className="block text-[10px] text-slate-500 truncate">{n.detail}</span>}
                                  <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                                    {new Date(n.ts).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    id="admin-lock-portal-btn"
                    onClick={handleLogout}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Lock Studio
                  </button>
                </div>
              </div>

              {/* DASHBOARD TAB NAVIGATION */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
                <button
                  id="tab-overview-btn"
                  onClick={() => {
                    setActiveTab("overview");
                    setIsEditingInvoice(false);
                    setIsEditingProject(false);
                    setIsEditingReview(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "overview"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Overview
                </button>

                <button
                  id="tab-data.invoices-btn"
                  onClick={() => setActiveTab("invoices")}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "invoices"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  data.invoices & Quotes ({data.invoices.length})
                </button>

                <button
                  id="tab-api-tracker-btn"
                  onClick={() => {
                    setActiveTab("api-tracker");
                    setIsEditingInvoice(false);
                    setIsEditingProject(false);
                    setIsEditingReview(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "api-tracker"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Cpu className="w-4 h-4" />
                  API Pricing Reference ({LIVE_API_MODELS.length})
                </button>

                <button
                  id="tab-projects-manager-btn"
                  onClick={() => {
                    setActiveTab("projects-manager");
                    setIsEditingInvoice(false);
                    setIsEditingReview(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "projects-manager"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <FolderPlus className="w-4 h-4" />
                  Manage Projects ({data.projects.length})
                </button>

                <button
                  id="tab-reviews-manager-btn"
                  onClick={() => {
                    setActiveTab("reviews-manager");
                    setIsEditingInvoice(false);
                    setIsEditingProject(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "reviews-manager"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Manage Reviews ({data.reviews.length})
                </button>

                <button
                  id="tab-clients-manager-btn"
                  onClick={() => {
                    setActiveTab("clients-manager");
                    setIsEditingInvoice(false);
                    setIsEditingProject(false);
                    setIsEditingReview(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "clients-manager"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Client Portals ({data.clients.length})
                </button>

                <button
                  id="tab-cost-calculator-btn"
                  onClick={() => {
                    setActiveTab("cost-calculator");
                    setIsEditingInvoice(false);
                    setIsEditingProject(false);
                    setIsEditingReview(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "cost-calculator"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  API Cost Estimator
                </button>

                <button
                  id="tab-upgrades-btn"
                  onClick={() => {
                    setActiveTab("upgrades");
                    setIsEditingInvoice(false);
                    setIsEditingProject(false);
                    setIsEditingReview(false);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "upgrades"
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Wrench className="w-4 h-4" />
                  Upgrades & Tools
                </button>
              </div>

              {/* TAB 1: STUDIO OVERVIEW */}
                            {activeTab === "overview" && (
                <OverviewTab
                  invoices={data.invoices}
                  clients={data.clients}
                  projectsCount={data.projects.length}
                  apiModels={apiModels}
                  onNavigate={(tab) =>
                    setActiveTab(
                      tab as "overview" | "invoices" | "api-tracker" | "projects-manager" | "reviews-manager" | "clients-manager" | "cost-calculator" | "upgrades"
                    )
                  }
                  onSelectInvoice={(inv) => {
                    setSelectedInvoice(inv as Invoice);
                    setActiveTab("invoices");
                  }}
                />
              )}
              {/* TAB 2: data.invoices & QUOTES MANAGEMENT */}
              {activeTab === "invoices" && (
                <div className="space-y-8 animate-in fade-in-50">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                        data.invoices & Quotations Studio
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Create, customize, print, or directly share client data.invoices & quotes via WhatsApp & Email.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id="create-new-invoice-tab-btn"
                        onClick={() => handleNewInvoiceClick("Invoice")}
                        className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Create Invoice
                      </button>

                      <button
                        id="create-new-quote-tab-btn"
                        onClick={() => handleNewInvoiceClick("Quote")}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 border border-slate-700"
                      >
                        <FileText className="w-4 h-4 text-orange-400" />
                        Create Quote
                      </button>
                    </div>
                  </div>

                  {/* EDIT / CREATE FORM */}
                  {isEditingInvoice ? (
                    <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <FileText className="w-5 h-5 text-orange-500" />
                          {selectedInvoice ? `Edit ${invDocType}: ${selectedInvoice.invoiceNumber}` : `Create New ${invDocType}`}
                        </h3>
                        <button
                          onClick={() => setIsEditingInvoice(false)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveInvoice} className="space-y-6">
                        {/* Document Type & Currency */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Document Type
                            </label>
                            <select
                              value={invDocType}
                              onChange={(e) => setInvDocType(e.target.value as "Invoice" | "Quote")}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                            >
                              <option value="Invoice">Invoice</option>
                              <option value="Quote">Official Quotation / Proposal</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Doc Number
                            </label>
                            <input
                              type="text"
                              required
                              value={invNumber}
                              onChange={(e) => setInvNumber(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Currency
                            </label>
                            <select
                              value={invCurrency}
                              onChange={(e) => setInvCurrency(e.target.value as "ZAR" | "USD")}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                            >
                              <option value="ZAR">ZAR (R)</option>
                              <option value="USD">USD ($)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Status
                            </label>
                            <select
                              value={invStatus}
                              onChange={(e) => setInvStatus(e.target.value as "Draft" | "Sent" | "Paid" | "Overdue" | "Accepted")}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                            >
                              <option value="Draft">Draft</option>
                              <option value="Sent">Sent to Client</option>
                              <option value="Accepted">Accepted / Deposit Paid</option>
                              <option value="Paid">Paid in Full</option>
                              <option value="Overdue">Overdue</option>
                            </select>
                          </div>
                        </div>

                        {/* Client Metadata */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Client Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sipho Ndlovu"
                              value={invClientName}
                              onChange={(e) => setInvClientName(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Client Company / Business
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Cape Logistics Ltd"
                              value={invClientCompany}
                              onChange={(e) => setInvClientCompany(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Client Email
                            </label>
                            <input
                              type="email"
                              placeholder="client@company.co.za"
                              value={invClientEmail}
                              onChange={(e) => setInvClientEmail(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Client Phone / WhatsApp
                            </label>
                            <input
                              type="tel"
                              placeholder="e.g. +27 82 123 4567"
                              value={invClientPhone}
                              onChange={(e) => setInvClientPhone(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Issue Date
                            </label>
                            <input
                              type="date"
                              required
                              value={invIssueDate}
                              onChange={(e) => setInvIssueDate(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Due / Valid Date
                            </label>
                            <input
                              type="date"
                              required
                              value={invDueDate}
                              onChange={(e) => setInvDueDate(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        {/* Items Section */}
                        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                              Line Items & Deliverables
                            </h4>
                            <button
                              type="button"
                              onClick={addInvoiceItem}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-orange-500 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add Row
                            </button>
                          </div>

                          <div className="space-y-2">
                            {invItems.map((item) => (
                              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-6 sm:col-span-7">
                                  <input
                                    type="text"
                                    placeholder="Deliverable description (e.g. Next.js 15 Web App)"
                                    value={item.description}
                                    onChange={(e) => updateInvoiceItem(item.id, "description", e.target.value)}
                                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => updateInvoiceItem(item.id, "quantity", Number(e.target.value))}
                                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-center font-bold text-slate-900 dark:text-white"
                                  />
                                </div>
                                <div className="col-span-3 sm:col-span-2">
                                  <input
                                    type="number"
                                    min={0}
                                    step={100}
                                    value={item.rate}
                                    onChange={(e) => updateInvoiceItem(item.id, "rate", Number(e.target.value))}
                                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-right font-mono font-bold text-slate-900 dark:text-white"
                                  />
                                </div>
                                <div className="col-span-1 text-center">
                                  <button
                                    type="button"
                                    onClick={() => removeInvoiceItem(item.id)}
                                    className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Deposit & Payment - per-document deposit % */}
                        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Deposit Percentage (%) - unique to this {invDocType.toLowerCase()}
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={100}
                                value={invDepositPercent}
                                onChange={(e) => setInvDepositPercent(Number(e.target.value))}
                                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white"
                              />
                            </div>

                            {(() => {
                              const sub = (invItems || []).reduce((sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0);
                              const pct = Number(invDepositPercent) || 50;
                              const dep = Math.round((sub * pct) / 100);
                              const bal = Math.max(0, sub - dep);
                              const sym = invCurrency === "ZAR" ? "R" : "$";
                              return (
                                <>
                                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                                    <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                                      Deposit Amount (computed)
                                    </span>
                                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                      {sym} {dep.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="p-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800">
                                    <span className="block text-[11px] font-bold text-orange-600 dark:text-orange-400 mb-1">
                                      Final Balance ({100 - pct}%)
                                    </span>
                                    <span className="text-lg font-black text-orange-600 dark:text-orange-400 font-mono">
                                      {sym} {bal.toLocaleString()}
                                    </span>
                                  </div>
                                </>
                              );
                            })()}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Deposit Received ({invCurrency === "ZAR" ? "R" : "$"}) - tracking only
                              </label>
                              <input
                                type="number"
                                value={invDepositPaid}
                                onChange={(e) => setInvDepositPaid(Number(e.target.value))}
                                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono font-bold text-slate-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                Payment Notes & Banking Details
                              </label>
                              <input
                                type="text"
                                value={invNotes}
                                onChange={(e) => setInvNotes(e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* ── PROPOSAL FIELDS (quotes only) ── */}
                        {invDocType === "Quote" && (
                          <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-5 h-5 text-orange-500" />
                              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Proposal Builder - Win the Client</h3>
                              <span className="text-[10px] text-slate-400 font-mono ml-auto">These sections appear on the printed quote to make it compelling, not just a price list.</span>
                            </div>

                            {/* Project Understanding */}
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                🎯 Client Problem / What They Need
                              </label>
                              <textarea
                                value={proposalSummary}
                                onChange={(e) => setProposalSummary(e.target.value)}
                                rows={3}
                                placeholder={"e.g. We need a dispatch dashboard to replace spreadsheets - it's costing us 10+ hours a week."}
                                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none"
                              />
                            </div>

                            {/* Solution */}
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                💡 Your Proposed Solution
                              </label>
                              <textarea
                                value={proposalSolution}
                                onChange={(e) => setProposalSolution(e.target.value)}
                                rows={3}
                                placeholder={"e.g. A custom web dashboard with real-time GPS tracking and notifications."}
                                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none"
                              />
                            </div>

                            {/* Deliverables */}
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                📦 What You Deliver (one per line)
                              </label>
                              <textarea
                                value={proposalDeliverables.join("\n")}
                                onChange={(e) => setProposalDeliverables(e.target.value.split("\n").filter((l) => l.trim()))}
                                rows={4}
                                placeholder="Custom web dashboard (6 pages)&#10;WhatsApp driver notification engine&#10;Staging demo link (live, clickable)&#10;Full source code ownership&#10;14-day bug-fix warranty"
                                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none font-mono"
                              />
                            </div>

                            {/* Timeline */}
                            <div>
                              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                ⏱️ Timeline - When They'll See Results
                              </label>
                              <textarea
                                value={proposalTimeline}
                                onChange={(e) => setProposalTimeline(e.target.value)}
                                rows={2}
                                placeholder={"e.g. Kick-off Monday. Staging demo by Wednesday. Final delivery within 10 business days."}
                                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none"
                              />
                            </div>

                            {/* Guarantee + Social Proof + Next Steps */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                  🛡️ Guarantee / Risk Reversal
                                </label>
                                <textarea
                                  value={proposalGuarantee}
                                  onChange={(e) => setProposalGuarantee(e.target.value)}
                                  rows={3}
                                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                  ⭐ Social Proof / Trust Signals
                                </label>
                                <textarea
                                  value={proposalSocialProof}
                                  onChange={(e) => setProposalSocialProof(e.target.value)}
                                  rows={3}
                                  placeholder={"e.g. Built 12 dashboards for SA SMEs. 4.9 star rating. POPIA-aligned."}
                                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                                  🚀 Next Steps / CTA
                                </label>
                                <textarea
                                  value={proposalNextSteps}
                                  onChange={(e) => setProposalNextSteps(e.target.value)}
                                  rows={3}
                                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white resize-none"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setIsEditingInvoice(false)}
                            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md"
                          >
                            Save {invDocType}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* LIST OF data.invoices & QUOTES */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left 5 cols: Document Selection List */}
                      <div className="lg:col-span-5 bg-white dark:bg-[#0D1A2D] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            All Documents ({data.invoices.length})
                          </h3>
                        </div>

                        {/* Quick Status Filters */}
                        <div className="flex flex-wrap gap-1.5">
                          {["All", "Draft", "Sent", "Accepted", "Paid", "Overdue"].map((filter) => {
                            const count = filter === "All"
                              ? data.invoices.length
                              : data.invoices.filter((i) => i.status === filter).length;
                            return (
                              <button
                                key={filter}
                                onClick={() => {
                                  // Filter is applied by re-rendering the list below
                                  // For now, scroll to the first matching document
                                  const first = data.invoices.find((i) => filter === "All" || i.status === filter);
                                  if (first) setSelectedInvoice(first);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                  filter === "All"
                                    ? "bg-orange-500 text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                              >
                                {filter} ({count})
                              </button>
                            );
                          })}
                        </div>

                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                          {data.invoices.map((inv) => {
                            const total = calculateInvoiceTotal(inv);
                            const symbol = inv.currency === "ZAR" ? "R" : "$";
                            const isSelected = selectedInvoice?.id === inv.id;

                            return (
                              <div
                                key={inv.id}
                                onClick={() => setSelectedInvoice(inv)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-orange-500/10 border-orange-500 shadow-sm"
                                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                                    {inv.documentType || "Invoice"}
                                    {inv.declaration?.signatureDataUrl && (
                                      <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 text-[9px] font-extrabold">
                                        ✍ Signed
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                                    {inv.invoiceNumber}
                                  </span>
                                </div>
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {inv.clientName}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate mb-2">
                                  {inv.clientCompany || "Private Client"}
                                </p>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                                  <span className="font-extrabold text-orange-500">
                                    {symbol} {total.toLocaleString()}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      inv.status === "Paid" || inv.status === "Accepted"
                                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                        : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                                    }`}
                                  >
                                    {inv.status}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right 7 cols: Document Detailed Preview Card */}
                      <div className="lg:col-span-7">
                        {selectedInvoice ? (
                          <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                            {/* Document Actions Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                              <div>
                                <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 text-xs font-bold">
                                  {selectedInvoice.documentType || "Invoice"}
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-mono mt-1">
                                  {selectedInvoice.invoiceNumber}
                                </h3>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditInvoiceClick(selectedInvoice)}
                                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  Edit
                                </button>

                                <button
                                  onClick={() => window.print()}
                                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  Print
                                </button>

                                <button
                                  onClick={() => handleCopyEmailDraft(selectedInvoice)}
                                  className="p-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  Copy Email
                                </button>

                                <button
                                  onClick={() => handleCopyKickoffEmail(selectedInvoice)}
                                  className="p-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                                  title="Copy the kick-off / recipe email"
                                >
                                  <PenLine className="w-3.5 h-3.5" />
                                  Kickoff
                                </button>

                                <button
                                  onClick={() => handleCopyHandoverEmail(selectedInvoice)}
                                  className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
                                  title="Copy the final handover email"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Handover
                                </button>

                                <button
                                  onClick={() => handleCopySignRequestEmail(selectedInvoice)}
                                  className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                                  title="Copy the sign-request email - attach the PDF and ask the client to sign it"
                                >
                                  <PenLine className="w-3.5 h-3.5" />
                                  Sign Req
                                </button>

                                <a
                                  href={`/admin/export?doc=${encodeURIComponent(selectedInvoice.invoiceNumber)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
                                >
                                  <FileText className="w-3.5 h-3.5" />
                                  PDF Bundle
                                </a>

                                <a
                                  href={getMailtoShareUrl(selectedInvoice)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  Email
                                </a>

                                <a
                                  href={getWhatsAppShareUrl(selectedInvoice)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center gap-1"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  WhatsApp
                                </a>

                                <button
                                  onClick={() => handleDuplicateInvoice(selectedInvoice)}
                                  title="Duplicate this document"
                                  className="p-2 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 text-xs font-bold hover:bg-blue-200 transition-colors"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteInvoice(selectedInvoice.id)}
                                  className="p-2 rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 text-xs font-bold hover:bg-red-200 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Client & Date Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="text-slate-400 font-medium block">Billed To:</span>
                                <strong className="text-slate-900 dark:text-white block font-bold">
                                  {selectedInvoice.clientName}
                                </strong>
                                <span className="text-slate-500 block">{selectedInvoice.clientCompany}</span>
                                <span className="text-slate-500 block">{selectedInvoice.clientPhone}</span>
                              </div>

                              <div>
                                <span className="text-slate-400 font-medium block">Dates:</span>
                                <span className="text-slate-700 dark:text-slate-300 block">Issue: {selectedInvoice.issueDate}</span>
                                <span className="text-slate-700 dark:text-slate-300 block font-bold text-orange-500">Due: {selectedInvoice.dueDate}</span>
                              </div>

                              <div>
                                <span className="text-slate-400 font-medium block">Issued By:</span>
                                <strong className="text-slate-900 dark:text-white block">{SITE_CONFIG.brandLine}</strong>
                                <span className="text-slate-500 block">{SITE_CONFIG.email}</span>
                              </div>
                            </div>

                            {/* Line items preview table */}
                            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                                  <tr>
                                    <th className="p-3">Deliverable</th>
                                    <th className="p-3 text-center">Qty</th>
                                    <th className="p-3 text-right">Rate</th>
                                    <th className="p-3 text-right">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono">
                                  {selectedInvoice.items.map((item) => (
                                    <tr key={item.id}>
                                      <td className="p-3 font-sans font-semibold text-slate-900 dark:text-white">
                                        {item.description}
                                      </td>
                                      <td className="p-3 text-center text-slate-500">{item.quantity}</td>
                                      <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                                        {selectedInvoice.currency === "ZAR" ? "R" : "$"} {item.rate.toLocaleString()}
                                      </td>
                                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                                        {selectedInvoice.currency === "ZAR" ? "R" : "$"} {(item.quantity * item.rate).toLocaleString()}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Totals Summary - no tax, deposit % split */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl space-y-2 text-xs font-mono">
                              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Subtotal (Total):</span>
                                <span>
                                  {selectedInvoice.currency === "ZAR" ? "R" : "$"} {calculateInvoiceSubtotal(selectedInvoice).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Kick-off Deposit ({selectedInvoice.depositPercent ?? 50}%):</span>
                                <span className="text-emerald-500 font-bold">
                                  {selectedInvoice.currency === "ZAR" ? "R" : "$"} {calculateDepositAmount(selectedInvoice).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                                <span>Final Balance ({100 - (selectedInvoice.depositPercent ?? 50)}%):</span>
                                <span className="text-orange-500">
                                  {selectedInvoice.currency === "ZAR" ? "R" : "$"} {calculateClientBalance(selectedInvoice).toLocaleString()}
                                </span>
                              </div>

                              <div className="flex justify-between text-slate-400 pt-1">
                                <span>Deposit received so far:</span>
                                <span>
                                  - {selectedInvoice.currency === "ZAR" ? "R" : "$"} {selectedInvoice.depositPaid.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* SIGNED DECLARATION - captured here, printed on the document */}
                            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-600 space-y-4">
                              <div className="flex items-center gap-2">
                                <PenLine className="w-4 h-4 text-orange-500" />
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                  Signed Declaration (attached to this document & the PDF bundle)
                                </h4>
                              </div>
                            {selectedInvoice.declaration?.signedBy === "client" ? (
                              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>
                                  Signed by <strong>{selectedInvoice.declaration.signerName}</strong> via their client portal —
                                  this signature is already on the record and the PDF bundle is export-ready. Editing here will overwrite it.
                                </span>
                              </div>
                            ) : (
                              data.clients.find((c) => c.invoiceId === selectedInvoice.id) && (
                                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed flex items-start gap-2">
                                  <Link2 className="w-4 h-4 shrink-0 mt-0.5" />
                                  <span>
                                    Linked portal: <strong>@{data.clients.find((c) => c.invoiceId === selectedInvoice.id)?.username}</strong> —
                                    this client can also sign this document themselves from their portal.
                                  </span>
                                </div>
                              )
                            )}
                            <SignaturePad
                              value={signatureDataUrl}
                              onChange={(dataUrl) => {
                                setSignatureDataUrl(dataUrl);
                                persistDeclaration({ signatureDataUrl: dataUrl });
                              }}
                              label="Client signature"
                            />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <label className="block text-slate-500 mb-1 font-semibold">Signer Full Name</label>
                                  <input
                                    type="text"
                                    value={signerName}
                                    onChange={(e) => {
                                      setSignerName(e.target.value);
                                      persistDeclaration({ signerName: e.target.value });
                                    }}
                                    placeholder="e.g. Thabo Nkosi"
                                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-slate-500 mb-1 font-semibold">Date Signed</label>
                                  <div className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                                    {new Date().toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" })}
                                  </div>
                                </div>
                              </div>
                              <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={declarationAcknowledged}
                                  onChange={(e) => {
                                    setDeclarationAcknowledged(e.target.checked);
                                    persistDeclaration({ acknowledged: e.target.checked });
                                  }}
                                  className="mt-0.5 w-4 h-4 accent-orange-500"
                                />
                                <span>
                                  I confirm that the details in this {selectedInvoice.documentType || "document"} are correct and
                                  I accept the Terms of Service, Privacy Policy, POPIA Compliance Policy, and the No-Gamble Guarantee.
                                  By signing, this document becomes legally binding.
                                </span>
                              </label>
                              {!declarationAcknowledged && (
                                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                                  Tick the acknowledgement and capture a signature before printing the signed document.
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 text-slate-400">
                            Select a document from the left list or create a new invoice to manage.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: LIVE AI API PRICING TRACKER ("Look it up!") */}
              {activeTab === "api-tracker" && (
                <div className="space-y-8 animate-in fade-in-50">
                  <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 text-xs font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Live Market Tracker
                          </span>
                          <span
                            className={`text-xs font-mono rounded-full px-2.5 py-1 flex items-center gap-1.5 ${
                              isSyncingPricing
                                ? "bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400"
                                : syncFailed
                                ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                                : "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSyncingPricing
                                  ? "bg-orange-500 animate-pulse"
                                  : syncFailed
                                  ? "bg-red-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                            {isSyncingPricing
                              ? "Syncing…"
                              : syncFailed
                              ? "Sync failed - showing last rates"
                              : `${syncSource} · ${lastSyncedTime}`}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                          <Cpu className="w-6 h-6 text-orange-500" />
                          AI API Pricing Reference (&quot;Look it up!&quot;)
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Auto-syncs with official pricing endpoints every time you open this tab.
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                          Tracks live token rates & official docs for Gemini, Claude, Qwen, DeepSeek, GLM, LongCat, Ollama, OpenAI, Mistral, Cohere, Groq, Together, Fireworks, Replicate, & Kimi.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          id="sync-live-pricing-btn"
                          onClick={handleSyncLivePricing}
                          disabled={isSyncingPricing}
                          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                          <RefreshCw className={`w-4 h-4 ${isSyncingPricing ? "animate-spin" : ""}`} />
                          {isSyncingPricing ? "Syncing API Endpoints..." : "Sync Live API Rates"}
                        </button>
                      </div>
                    </div>

                    {/* OFFICIAL DOCUMENTATION LINKS DIRECTORY */}
                    <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-orange-500" />
                          Official AI Model Pricing Documentation Pages
                        </h3>
                        <span className="text-[11px] text-slate-400 font-mono">{officialLinks.length} Official Endpoints + {comparisonTools.length} Live Comparison Portals</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
                        {officialLinks.map((link) => (
                          <a
                            key={link.provider}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-orange-500 text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-orange-500 transition-all group shadow-2xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate font-semibold">{link.provider}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-orange-500 shrink-0 ml-1" />
                            </div>
                            {link.note && (
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug font-mono line-clamp-2">
                                {link.note}
                              </p>
                            )}
                          </a>
                        ))}
                      </div>

                      {/* Comparison matrix links */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700/50 text-xs">
                        <span className="font-bold text-slate-500">Live Comparison Tools:</span>
                        {comparisonTools.map((tool) => (
                          <a
                            key={tool.provider}
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold hover:underline"
                          >
                            <span>{tool.provider}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Search & Provider Filter Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Search Query */}
                      <div className="md:col-span-4 relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search model, feature, or provider..."
                          value={apiSearchQuery}
                          onChange={(e) => setApiSearchQuery(e.target.value)}
                          aria-label="Search AI models by name, feature, or provider"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Provider Filter Tabs */}
                      <div role="tablist" aria-label="Filter models by provider" className="md:col-span-6 flex items-center gap-1 overflow-x-auto pb-1">
                        {[
                          "All",
                          "OpenAI",
                          "Anthropic",
                          "Google Gemini",
                          "DeepSeek",
                          "Qwen Cloud",
                          "GLM / Zhipu",
                          "LongCat AI",
                          "Mistral",
                          "Cohere",
                          "Kimi (Moonshot)",
                          "xAI Grok",
                          "Groq",
                          "Together AI",
                          "Fireworks AI",
                          "Replicate",
                          "Ollama Cloud"
                        ].map((prov) => (
                          <button
                            key={prov}
                            role="tab"
                            aria-selected={selectedProvider === prov}
                            onClick={() => setSelectedProvider(prov)}
                            className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                              selectedProvider === prov
                                ? "bg-orange-500 text-white shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            {prov}
                          </button>
                        ))}
                      </div>

                      {/* Sort dropdown */}
                      <div className="md:col-span-2">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as "input-low" | "input-high" | "output-low" | "context-high")}
                          aria-label="Sort AI models by pricing"
                          className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                        >
                          <option value="input-low">Cheapest Input</option>
                          <option value="input-high">Highest Input</option>
                          <option value="output-low">Cheapest Output</option>
                        </select>
                      </div>
                    </div>

                    {/* API Model Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredApiModels.map((m) => (
                        <div
                          key={m.id}
                          className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-orange-500/50 transition-all"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-extrabold uppercase">
                                {m.provider}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 font-bold">
                                {m.category}
                              </span>
                            </div>

                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                                {m.name}
                              </h3>
                              <a
                                href={m.officialDocUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View Official Pricing Page"
                                className="p-1 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-500 hover:text-orange-500 transition-colors shrink-0"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                              {m.description}
                            </p>

                            {/* Features tags */}
                            <div className="flex flex-wrap gap-1 pt-1">
                              {m.features.slice(0, 3).map((f) => (
                                <span
                                  key={f}
                                  className="px-2 py-0.5 rounded bg-slate-200/50 dark:bg-slate-700/40 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700/60 font-mono">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Input Cost / 1M:</span>
                              <div className="text-right">
                                <strong className="text-emerald-600 dark:text-emerald-400 font-bold block">
                                  ${m.inputCostPer1M.toFixed(2)}
                                </strong>
                                {m.nativeCostIn && (
                                  <span className="text-[10px] text-slate-400 block font-normal">
                                    ~{m.nativeCostIn}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Output Cost / 1M:</span>
                              <div className="text-right">
                                <strong className="text-orange-500 font-bold block">
                                  ${m.outputCostPer1M.toFixed(2)}
                                </strong>
                                {m.nativeCostOut && (
                                  <span className="text-[10px] text-slate-400 block font-normal">
                                    ~{m.nativeCostOut}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                              <span>Context Window:</span>
                              <span className="font-bold text-slate-700 dark:text-slate-300">{m.contextWindow}</span>
                            </div>

                            <button
                              onClick={() => {
                                setActiveTab("cost-calculator");
                              }}
                              className="w-full mt-2 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-orange-500 hover:text-white text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all flex items-center justify-center gap-1 font-sans"
                            >
                              <Calculator className="w-3.5 h-3.5" />
                              Estimate Tokens Cost
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MY PROJECTS MANAGER ("my current projects listed with their etc, allow me to edit, create, submit etc") */}
              {activeTab === "projects-manager" && (
                <div className="space-y-8 animate-in fade-in-50">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                        My Current Projects Studio
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        View, edit, create, submit, and publish portfolio projects live across your web app.
                      </p>
                    </div>

                    <button
                      id="create-new-project-btn"
                      onClick={handleNewProjectClick}
                      className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Project
                    </button>
                  </div>

                  {/* PROJECT EDIT / CREATE FORM */}
                  {isEditingProject ? (
                    <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <FolderPlus className="w-5 h-5 text-orange-500" />
                          {selectedProject ? `Edit Project: ${selectedProject.title}` : "Create New Portfolio Project"}
                        </h3>
                        <button
                          onClick={() => setIsEditingProject(false)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveProject} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Project Title *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. SME Tourism & Booking Dashboard"
                              value={projTitle}
                              onChange={(e) => setProjTitle(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Category
                            </label>
                            <select
                              value={projCategory}
                              onChange={(e) => setProjCategory(e.target.value as 'dashboard' | 'webapp' | 'mvp' | 'tourism' | 'ecommerce' | 'other')}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                            >
                              <option value="tourism">Tourism & Hospitality</option>
                              <option value="webapp">Web App / Dispatch Portal</option>
                              <option value="dashboard">Operations Dashboard</option>
                              <option value="ecommerce">E-Commerce Engine</option>
                              <option value="mvp">SaaS MVP</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Client Name / Sector
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Tour Operators Ltd"
                              value={projClient}
                              onChange={(e) => setProjClient(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Short Description
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Brief project summary for showcase card..."
                            value={projDescription}
                            onChange={(e) => setProjDescription(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Problem Statement
                            </label>
                            <textarea
                              rows={3}
                              placeholder="What pain point did the client face?"
                              value={projProblem}
                              onChange={(e) => setProjProblem(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Solution Delivered
                            </label>
                            <textarea
                              rows={3}
                              placeholder="How did your custom code solve it?"
                              value={projSolution}
                              onChange={(e) => setProjSolution(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Key Results / Impact
                            </label>
                            <textarea
                              rows={3}
                              placeholder="e.g. Delivered staging in 48 hours, 0 double-bookings"
                              value={projResults}
                              onChange={(e) => setProjResults(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Featured Image / Thumbnail (URL or upload)
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="https://... or upload below"
                                value={projImage}
                                onChange={(e) => setProjImage(e.target.value)}
                                className="flex-1 w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                              />
                              <label className="shrink-0 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-orange-500 font-bold text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1">
                                <Upload className="w-3.5 h-3.5" />
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e.target.files?.[0], setProjImage)}
                                />
                              </label>
                            </div>
                            {projImage && (
                              <img
                                src={projImage}
                                alt="Project thumbnail preview"
                                className="mt-2 h-20 w-32 object-cover rounded-lg border border-slate-300 dark:border-slate-700"
                              />
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Tech Stack (Comma-separated)
                            </label>
                            <input
                              type="text"
                              placeholder="Next.js 15, Tailwind, TypeScript, Node.js"
                              value={projTech}
                              onChange={(e) => setProjTech(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Live Demo URL
                            </label>
                            <input
                              type="text"
                              placeholder="https://your-staging-demo.com"
                              value={projLiveDemo}
                              onChange={(e) => setProjLiveDemo(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              GitHub Repository URL (optional)
                            </label>
                            <input
                              type="text"
                              placeholder="https://github.com/..."
                              value={projGithub}
                              onChange={(e) => setProjGithub(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Delivery Speed (Days)
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={projDeliveryDays}
                              onChange={(e) => setProjDeliveryDays(Number(e.target.value))}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Status
                            </label>
                            <select
                              value={projStatus}
                              onChange={(e) => setProjStatus(e.target.value as "draft" | "published")}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                            >
                              <option value="published">Published - live on the site</option>
                              <option value="draft">Draft - hidden from public site</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Embed Live Site URL (Showcase Room)
                          </label>
                            <input
                              type="text"
                              placeholder="https://your-deployed-site.vercel.app"
                              value={projEmbedUrl}
                              onChange={(e) => setProjEmbedUrl(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                            />
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                              Paste a deployed site URL to embed it <strong>live</strong> in the homepage showcase room (replaces the sample Tourism demo).
                              Works best with Vercel / Netlify deployments. Sites that block iframes (Google, GitHub, Facebook) will show a blank frame - use the &ldquo;Open in New Tab&rdquo; button for those. Leave empty to keep the current demo.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={projFeatured}
                              onChange={(e) => setProjFeatured(e.target.checked)}
                              className="w-4 h-4 text-orange-500 accent-orange-500 rounded"
                            />
                            Feature on Home Page Showcase
                          </label>
                          {projStatus === "draft" && (
                            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Draft projects are hidden from /projects until published.
                            </span>
                          )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setIsEditingProject(false)}
                            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md"
                          >
                            {projStatus === "published" ? "Save & Publish Project" : "Save as Draft"}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* PROJECTS CARDS LIST */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {data.projects.map((p) => (
                        <div
                          key={p.id}
                          className="p-6 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-4 flex flex-col justify-between hover:border-orange-500/50 transition-all"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 text-[10px] font-extrabold uppercase">
                                  {p.category}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                    p.status === "draft"
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                  }`}
                                >
                                  {p.status === "draft" ? "Draft" : "Published"}
                                </span>
                              </div>
                              <span className="text-xs font-mono text-emerald-500 font-bold">
                                Delivered: {p.deliveryDays || 5} Days
                              </span>
                            </div>

                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                              {p.title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                              {p.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {p.tech.map((t, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-600 dark:text-slate-300"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                            <Link
                              href={`/projects#${p.slug}`}
                              className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              View Showcase
                            </Link>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditProjectClick(p)}
                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProject(p.id)}
                                className="p-2 rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 text-xs font-bold hover:bg-red-200"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4b: CLIENT REVIEWS (TESTIMONIALS) MANAGER */}
              {activeTab === "reviews-manager" && (
                <div className="space-y-8 animate-in fade-in-50">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                        Manage Client Reviews
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Add, edit, delete & publish verified client reviews. Published reviews appear on the /testimonials page and the homepage.
                      </p>
                    </div>

                    <button
                      id="create-new-review-btn"
                      onClick={handleNewReviewClick}
                      className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Review
                    </button>
                  </div>

                  {/* REVIEW EDIT / CREATE FORM */}
                  {isEditingReview ? (
                    <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Star className="w-5 h-5 text-orange-500" />
                          {selectedReview ? `Edit Review: ${selectedReview.clientName}` : "Create New Client Review"}
                        </h3>
                        <button
                          onClick={() => setIsEditingReview(false)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveReview} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Client Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Sipho Ndlovu"
                              value={revClientName}
                              onChange={(e) => setRevClientName(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Company / Title (optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Owner, Cape Logistics Ltd"
                              value={revCompanyTitle}
                              onChange={(e) => setRevCompanyTitle(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Star Rating
                            </label>
                            <select
                              value={revRating}
                              onChange={(e) => setRevRating(Number(e.target.value))}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                            >
                              {[5, 4, 3, 2, 1].map((n) => (
                                <option key={n} value={n}>{n} Star{n !== 1 ? "s" : ""}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Status
                            </label>
                            <select
                              value={revStatus}
                              onChange={(e) => setRevStatus(e.target.value as "draft" | "published")}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                            >
                              <option value="published">Published - live on the site</option>
                              <option value="draft">Draft - hidden from public site</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Avatar / Profile Image (optional)
                            </label>
                            <div className="flex items-center gap-3">
                              {revAvatar ? (
                                <img
                                  src={revAvatar}
                                  alt="Reviewer avatar"
                                  className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-black">
                                  {revClientName.trim() ? revClientName.trim().charAt(0).toUpperCase() : "?"}
                                </div>
                              )}
                              <label className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-orange-500 font-bold text-xs cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1">
                                <Upload className="w-3.5 h-3.5" />
                                Upload Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e.target.files?.[0], setRevAvatar)}
                                />
                              </label>
                              {revAvatar && (
                                <button
                                  type="button"
                                  onClick={() => setRevAvatar("")}
                                  className="text-[11px] text-red-500 font-bold hover:underline"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">Stored in your browser (local-first) - keep under 1 MB.</p>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                              Associated Project (optional)
                            </label>
                            <select
                              value={revProjectId}
                              onChange={(e) => setRevProjectId(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                            >
                              <option value="">— No linked project —</option>
                              {data.projects.map((p) => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Review Content *
                          </label>
                          <textarea
                            rows={4}
                            required
                            placeholder="What did the client say about the 48-hour staging demo, code quality, or results?"
                            value={revContent}
                            onChange={(e) => setRevContent(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setIsEditingReview(false)}
                            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md"
                          >
                            {revStatus === "published" ? "Save & Publish Review" : "Save as Draft"}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    /* REVIEWS CARDS LIST */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {data.reviews.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3 p-12 text-center rounded-3xl bg-white dark:bg-[#0D1A2D] border border-dashed border-slate-300 dark:border-slate-700 text-slate-400">
                          No reviews yet. Create your first verified client review above - published reviews show on /testimonials and the homepage.
                        </div>
                      )}
                      {data.reviews.map((r) => (
                        <div
                          key={r.id}
                          className="p-6 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-4 flex flex-col justify-between hover:border-orange-500/50 transition-all"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-amber-400" : "text-slate-300 dark:text-slate-600"}`} />
                                ))}
                              </div>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  r.status === "draft"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                }`}
                              >
                                {r.status === "draft" ? "Draft" : "Published"}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-400 italic leading-relaxed line-clamp-4">
                              &ldquo;{r.content}&rdquo;
                            </p>

                            <div className="flex items-center gap-3 pt-1">
                              {r.avatar ? (
                                <img src={r.avatar} alt={r.clientName} className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-black">
                                  {r.clientName.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <strong className="block text-xs text-slate-900 dark:text-white">{r.clientName}</strong>
                                <span className="block text-[10px] text-slate-500">{r.companyTitle || "Verified Client"}</span>
                              </div>
                            </div>

                            {r.projectTitle && (
                              <span className="inline-block text-[10px] font-semibold text-blue-500 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                                Project: {r.projectTitle}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button
                              onClick={() => handleEditReviewClick(r)}
                              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="p-2 rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 text-xs font-bold hover:bg-red-200"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4.5: CLIENT PORTALS (local-first, invite cards) */}
                            {activeTab === "clients-manager" && (
                <ClientPortalsTab
                  clients={data.clients}
                  invoices={data.invoices}
                  focusClientId={focusClientId}
                  onFocusConsumed={() => setFocusClientId(null)}
                  onChange={async (next) => {
                    for (const client of next) {
                      const existing = data.clients.find((c) => c.id === client.id);
                      if (existing) {
                        await data.updateClient(client.id, client);
                      } else {
                        await data.createClient(client);
                      }
                    }
                  }}
                  onInvoicesChange={async (next) => {
                    for (const inv of next) {
                      if (!inv.id) continue;
                      const invoice = inv as Invoice;
                      const existing = data.invoices.find((i) => i.id === inv.id);
                      if (existing) {
                        await data.updateInvoice(inv.id, invoice);
                      } else {
                        await data.createInvoice(invoice);
                      }
                    }
                  }}
                  showToast={showToast}
                />
              )}
              {/* TAB 5: API COST ESTIMATOR */}
              {activeTab === "cost-calculator" && (
                <div className="space-y-8 animate-in fade-in-50">
                  <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                    <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calculator className="w-6 h-6 text-orange-500" />
                        Interactive AI Token Bill Estimator
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        Simulate your project prompt token usage to calculate exact monthly API overheads across providers before submitting quotes to clients.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                          <span>Monthly Input Tokens (Prompts)</span>
                          <span className="text-orange-500 font-mono">{calcInputTokensM} Million Tokens</span>
                        </div>
                        <input
                          type="range"
                          min={0.1}
                          max={50}
                          step={0.1}
                          value={calcInputTokensM}
                          onChange={(e) => setCalcInputTokensM(Number(e.target.value))}
                          className="w-full accent-orange-500 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                          <span>Monthly Output Tokens (Completions)</span>
                          <span className="text-emerald-500 font-mono">{calcOutputTokensM} Million Tokens</span>
                        </div>
                        <input
                          type="range"
                          min={0.1}
                          max={20}
                          step={0.1}
                          value={calcOutputTokensM}
                          onChange={(e) => setCalcOutputTokensM(Number(e.target.value))}
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="border-b-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800/80">
                            <th className="p-3">Model</th>
                            <th className="p-3">Provider</th>
                            <th className="p-3 text-right">Input Bill</th>
                            <th className="p-3 text-right">Output Bill</th>
                            <th className="p-3 text-right">Total Est. Bill</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-mono">
                          {LIVE_API_MODELS.map((m) => {
                            const inputBill = calcInputTokensM * m.inputCostPer1M;
                            const outputBill = calcOutputTokensM * m.outputCostPer1M;
                            const totalBill = inputBill + outputBill;

                            return (
                              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="p-3 font-bold text-slate-900 dark:text-white font-sans">{m.name}</td>
                                <td className="p-3 text-slate-500">{m.provider}</td>
                                <td className="p-3 text-right text-slate-600 dark:text-slate-400">${inputBill.toFixed(2)}</td>
                                <td className="p-3 text-right text-slate-600 dark:text-slate-400">${outputBill.toFixed(2)}</td>
                                <td className="p-3 text-right font-extrabold text-orange-600 dark:text-orange-400">${totalBill.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: UPGRADES & SYSTEM TOOLS ("upgrade the etc...") */}
              {activeTab === "upgrades" && (
                <div className="space-y-8 animate-in fade-in-50">
                  <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                    <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <Wrench className="w-6 h-6 text-orange-500" />
                        Studio Upgrades & System Tools
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                        System upgrades, backup exports, local storage reset, and staging link status checks.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tool 1: JSON Export Backup */}
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                            <Download className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Export Studio JSON Backup</h3>
                            <p className="text-xs text-slate-500">Download all custom data.invoices, quotes, & projects to JSON.</p>
                          </div>
                        </div>
                        <button
                          onClick={handleExportBackup}
                          className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download JSON Backup File
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Import JSON Backup File
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".json,application/json"
                          className="hidden"
                          onChange={handleImportBackup}
                        />
                      </div>

                      {/* Tool 2: System Cache Reset */}
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
                            <RefreshCw className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Re-sync From MongoDB</h3>
                            <p className="text-xs text-slate-500">Re-fetch every collection from MongoDB, discarding any unsaved local UI state. Never overwrites or seeds data.</p>
                          </div>
                        </div>
                        <button
                          onClick={handleClearCache}
                          className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-red-500 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Reset Admin Cache
                        </button>
                      </div>

                      {/* Tool 3: Google Form Link Config */}
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 md:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                            <Send className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google Form URL Integration</h3>
                            <p className="text-xs text-slate-500">Update the target URL for the Discovery Call & Quote request buttons across the app.</p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <input
                            type="url"
                            value={adminGoogleFormUrl}
                            onChange={(e) => setAdminGoogleFormUrl(e.target.value)}
                            placeholder="https://docs.google.com/forms/..."
                            className="flex-1 p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                          />
                          <button
                            onClick={handleSaveGoogleFormUrl}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow transition-colors shrink-0"
                          >
                            Save URL
                          </button>
                        </div>
                      </div>

                      {/* Tool 3.5: Logo Upload */}
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 md:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Site Logo</h3>
                            <p className="text-xs text-slate-500">Upload your logo image - appears in the header, footer, and printed invoices. Leave blank to use the default SVG mark.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pt-2">
                          {data.logoUrl ? (
                            <img src={data.logoUrl} alt="Site logo" className="h-12 w-12 rounded-xl object-contain border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                          ) : (
                            <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                              Default
                            </div>
                          )}
                          <div className="flex-1 flex gap-2">
                            <label className="flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  if (file.size > 2 * 1024 * 1024) {
                                    showToast("Logo must be under 2MB.");
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    const dataUrl = reader.result as string;
                                    void data.saveLogoUrl(dataUrl);
                                    try { localStorage.setItem("jp-site-logo", dataUrl); } catch { /* ignore */ }
                                    showToast("Logo saved!");
                                  };
                                  reader.readAsDataURL(file);
                                }}
                              />
                              <span className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow transition-colors flex items-center justify-center gap-2 cursor-pointer">
                                <Upload className="w-3.5 h-3.5" /> Upload Logo
                              </span>
                            </label>
                            {data.logoUrl && (
                              <button
                                onClick={() => { void data.saveLogoUrl(""); try { localStorage.removeItem("jp-site-logo"); } catch { /* ignore */ } showToast("Logo reset to default."); }}
                                className="px-4 py-2.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 font-bold text-xs hover:bg-red-200 transition-colors"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Tool 4: Social Profile Links Config */}
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3 md:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                            <Share2 className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Social Profile Links</h3>
                            <p className="text-xs text-slate-500">Paste your profile URLs below - each icon appears site-wide (Footer, About) the moment it is saved. Leave blank to hide an icon.</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          {[
                            { key: "githubUrl" as const, label: "GitHub", placeholder: "https://github.com/yourname" },
                            { key: "linkedinUrl" as const, label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname" },
                            { key: "facebookUrl" as const, label: "Facebook", placeholder: "https://facebook.com/yourname" },
                            { key: "discordUrl" as const, label: "Discord", placeholder: "https://discord.gg/yourinvite or profile" },
                            { key: "repoUrl" as const, label: "Portfolio Repo (GitHub)", placeholder: "https://github.com/yourname/portfolio - shown in About + Footer" }
                          ].map((field) => (
                            <label key={field.key} className="block">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{field.label}</span>
                              <input
                                type="url"
                                value={socialLinks[field.key]}
                                onChange={(e) => setSocialLinks((prev) => ({ ...prev, [field.key]: e.target.value }))}
                                placeholder={field.placeholder}
                                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                              />
                            </label>
                          ))}
                        </div>
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={handleSaveSocialLinks}
                            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow transition-colors"
                          >
                            Save Social Links
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* PRINT-ONLY INVOICE / QUOTE DOCUMENT - shown on paper only, so printing
          from the admin never dumps the entire dashboard onto the page. */}
      {selectedInvoice && (
        <div className="hidden print:block print-exact bg-white text-slate-900">
          <div className="p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b-2 border-slate-900 pb-6">
              <div>
                <div className="text-2xl font-black">
                  {SITE_CONFIG.tradingName} <span className="text-orange-600 font-normal">by {SITE_CONFIG.developerName}</span>
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1 space-y-0.5">
                  <div>Email: {SITE_CONFIG.email}</div>
                  <div>WhatsApp: {SITE_CONFIG.whatsappFormatted}</div>
                  <div>PayPal: <a href={SITE_CONFIG.paypalMeUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 underline">{SITE_CONFIG.paypalEmail}</a></div>
                  <div>Location: South Africa</div>
                </div>
              </div>

              <div className="text-right font-mono text-xs bg-slate-50 border border-slate-300 p-4 rounded-xl">
                <div className="text-sm font-bold text-orange-600 uppercase tracking-widest font-sans">
                  {selectedInvoice.documentType === "Quote" ? "Proposal / Quotation" : selectedInvoice.documentType || "Invoice"}
                </div>
                <div className="font-bold text-slate-900 text-sm mt-1"># {selectedInvoice.invoiceNumber}</div>
                <div>Issue: {selectedInvoice.issueDate}</div>
                <div>Due: {selectedInvoice.dueDate}</div>
                <div className="mt-1">Status: <strong className="text-slate-900">{selectedInvoice.status}</strong></div>
              </div>
            </div>

            <div className="py-6">
              <div className="text-xs uppercase font-bold text-slate-500 mb-1">Billed To:</div>
              <div className="text-base font-bold">{selectedInvoice.clientName}</div>
              <div className="text-sm text-slate-600">{selectedInvoice.clientCompany}</div>
              <div className="text-sm text-slate-600">{selectedInvoice.clientEmail}</div>
              <div className="text-sm text-slate-600">{selectedInvoice.clientPhone}</div>
            </div>

            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-900 font-bold">
                  <th className="p-3">Deliverable</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Rate</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedInvoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3 font-semibold">{item.description}</td>
                    <td className="p-3 text-center">{item.quantity}</td>
                    <td className="p-3 text-right">
                      {selectedInvoice.currency === "ZAR" ? "R" : "$"} {item.rate.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-bold">
                      {selectedInvoice.currency === "ZAR" ? "R" : "$"} {(item.quantity * item.rate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-6 break-inside-avoid">
              <div className="w-64 space-y-2 font-mono text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal (Total):</span>
                  <span>{selectedInvoice.currency === "ZAR" ? "R" : "$"} {calculateInvoiceSubtotal(selectedInvoice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Kick-off Deposit ({selectedInvoice.depositPercent ?? 50}%):</span>
                  <span className="text-emerald-700 font-bold">
                    {selectedInvoice.currency === "ZAR" ? "R" : "$"} {calculateDepositAmount(selectedInvoice).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-black text-slate-900 text-base border-t-2 border-slate-900 pt-2">
                  <span>Final Balance ({100 - (selectedInvoice.depositPercent ?? 50)}%):</span>
                  <span className="text-orange-600">
                    {selectedInvoice.currency === "ZAR" ? "R" : "$"} {calculateClientBalance(selectedInvoice).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-6 bg-slate-900 text-white break-inside-avoid">
              <h3 className="font-bold text-sm text-orange-400 uppercase tracking-wider mb-3">
                Payment Options
              </h3>
              <p className="text-xs text-slate-300 mb-3">Payable via PayPal or Direct EFT (Bank Transfer).</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                  <strong className="block font-bold">Option 1: PayPal</strong>
                  <div>
                    PayPal Email: <strong className="text-emerald-400 font-mono">{SITE_CONFIG.paypalEmail}</strong>
                  </div>
                  <div>
                    <a href={SITE_CONFIG.paypalMeUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">paypal.me/JordanPetersCapeTown</a>
                  </div>
                  <div className="text-slate-400">Instant, secure transfer</div>
                </div>
                <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 space-y-1">
                  <strong className="block font-bold">Option 2: Direct EFT (Bank Transfer)</strong>
                  <div>
                    Send proof of payment via WhatsApp: <strong className="text-emerald-400 font-mono">{SITE_CONFIG.whatsappNumber}</strong>
                  </div>
                  <div className="text-slate-400">Bank details provided upon quote confirmation</div>
                </div>
              </div>
            </div>

            {/* ── PROPOSAL SECTIONS (quotes only) ── */}
            {selectedInvoice.documentType === "Quote" && (
              <div className="mt-8 space-y-6 break-inside-avoid">
                {selectedInvoice.proposalSummary && (
                  <div className="p-5 rounded-xl border-2 border-orange-200 bg-orange-50">
                    <h4 className="font-black text-orange-700 text-xs uppercase tracking-widest mb-2">
                      🎯 Your Project
                    </h4>
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedInvoice.proposalSummary}</p>
                  </div>
                )}
                {selectedInvoice.proposalSolution && (
                  <div className="p-5 rounded-xl border-2 border-emerald-200 bg-emerald-50">
                    <h4 className="font-black text-emerald-700 text-xs uppercase tracking-widest mb-2">
                      💡 Proposed Solution
                    </h4>
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedInvoice.proposalSolution}</p>
                  </div>
                )}
                {selectedInvoice.proposalDeliverables && selectedInvoice.proposalDeliverables.length > 0 && (
                  <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                    <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2">
                      📦 What You Get
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedInvoice.proposalDeliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-800">
                          <span className="text-emerald-600 mt-0.5">✓</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedInvoice.proposalTimeline && (
                  <div className="p-5 rounded-xl border border-blue-200 bg-blue-50">
                    <h4 className="font-black text-blue-700 text-xs uppercase tracking-widest mb-2">
                      ⏱️ Timeline
                    </h4>
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedInvoice.proposalTimeline}</p>
                  </div>
                )}
                {(selectedInvoice.proposalGuarantee || selectedInvoice.proposalSocialProof || selectedInvoice.proposalNextSteps) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {selectedInvoice.proposalGuarantee && (
                      <div className="p-4 rounded-xl bg-slate-900 text-white">
                        <h4 className="font-bold text-xs text-orange-400 uppercase mb-2">🛡️ Guarantee</h4>
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedInvoice.proposalGuarantee}</p>
                      </div>
                    )}
                    {selectedInvoice.proposalSocialProof && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <h4 className="font-bold text-xs text-slate-900 uppercase mb-2">⭐ Trust Signals</h4>
                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedInvoice.proposalSocialProof}</p>
                      </div>
                    )}
                    {selectedInvoice.proposalNextSteps && (
                      <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-300">
                        <h4 className="font-bold text-xs text-orange-700 uppercase mb-2">🚀 Next Steps</h4>
                        <p className="text-xs text-orange-900 leading-relaxed font-semibold whitespace-pre-wrap">{selectedInvoice.proposalNextSteps}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {selectedInvoice.notes && (
              <div className="mt-6 text-xs text-slate-600 border-t border-slate-300 pt-3 break-inside-avoid">
                <strong className="text-slate-900 block mb-1">Notes:</strong>
                {selectedInvoice.notes}
              </div>
            )}

            <div className="mt-8 text-[11px] text-slate-600 leading-relaxed border-t border-slate-300 pt-3 break-inside-avoid">
              Payment of this {selectedInvoice.documentType.toLowerCase()} constitutes acceptance of the Master Services
              Agreement, Privacy Policy, POPIA Compliance Policy, and the No-Gamble Guarantee. Source code is released only
              upon final payment. All confidential client datasets are permanently destroyed within 7 calendar days of
              handover - a voluntary commitment that exceeds the statutory duty under Section 14 of POPIA.
            </div>

            {/* SIGNED DECLARATION - print block */}
            {(signatureDataUrl || signerName) && (
              <div className="mt-8 border-2 border-slate-900 p-6 break-inside-avoid">
                <h4 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-3">
                  Signed Declaration
                </h4>
                <p className="text-[11px] text-slate-700 leading-relaxed mb-4">
                  I, <strong className="text-slate-900">{signerName || "_______________________________"}</strong>, confirm
                  that the details in this {selectedInvoice.documentType.toLowerCase()} are correct, that I have read and
                  accept the Terms of Service, Privacy Policy, POPIA Compliance Policy, and the No-Gamble Guarantee, and that
                  by signing below this document is legally binding.
                </p>
                <div className="flex flex-wrap items-end justify-between gap-6">
                  <div className="min-w-[200px] flex-1">
                    {signatureDataUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={signatureDataUrl} alt="Client signature" className="h-24 w-auto object-contain" />
                    ) : (
                      <div className="h-24 border-b-2 border-slate-500" />
                    )}
                    <p className="text-[10px] text-slate-500 mt-1">Signature</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-700">
                    <div className="h-8 border-b-2 border-slate-500 min-w-[140px]"></div>
                    <p className="text-[10px] text-slate-500 mt-1">Date</p>
                    <div className="h-8 border-b-2 border-slate-500 min-w-[140px] mt-3"></div>
                    <p className="text-[10px] text-slate-500 mt-1">Witness (optional)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
