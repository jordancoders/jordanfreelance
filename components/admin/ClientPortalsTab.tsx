"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Upload,
  RefreshCw,
  Copy,
  MessageCircle,
  Trash2,
  Plus,
  Check,
  BadgeCheck,
  Wallet,
  MessageSquare,
  Link2,
  History,
  Percent,
  AlertCircle,
  ExternalLink,
  Send,
  X,
  CalendarClock,
} from "lucide-react";
import {
  type ClientPortalAccount,
  type ProgressUpdate,
  type PaymentRecord,
  type SharedAsset,
  type InvoiceLike,
  DEFAULT_MILESTONES,
  generateUsername,
  generatePassword,
  buildDocumentSnapshot,
  parseInviteCard,
  computePercentComplete,
  totalPaymentsReceived,
  appendActivity,
} from "@/lib/clientPortal";
import { buildCPInviteMessage, buildCPWhatsAppUrl } from "@/lib/emailTemplates";

interface ClientPortalsTabProps {
  clients: ClientPortalAccount[];
  invoices: InvoiceLike[];
  onChange: (next: ClientPortalAccount[]) => void;
  onInvoicesChange: (next: InvoiceLike[]) => void;
  showToast: (msg: string) => void;
}

const symbolFor = (acc: ClientPortalAccount) => (acc.document?.currency === "USD" ? "$" : "R");

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

export default function ClientPortalsTab({
  clients,
  invoices,
  onChange,
  onInvoicesChange,
  showToast,
}: ClientPortalsTabProps) {
  // Detail panel + tracker draft
  const [selectedClient, setSelectedClient] = useState<ClientPortalAccount | null>(null);
  const [progressDraft, setProgressDraft] = useState<ProgressUpdate[]>([]);
  const [percentDraft, setPercentDraft] = useState<string>("");
  const [progressError, setProgressError] = useState("");

  // Create-portal form
  const [cpClientName, setCpClientName] = useState("");
  const [cpClientCompany, setCpClientCompany] = useState("");
  const [cpClientEmail, setCpClientEmail] = useState("");
  const [cpClientPhone, setCpClientPhone] = useState("");
  const [cpInvoiceId, setCpInvoiceId] = useState("");
  const [cpProjectTitle, setCpProjectTitle] = useState("");
  const [cpUsername, setCpUsername] = useState("");
  const [cpPassword, setCpPassword] = useState("");

  // Import-a-signed-card box
  const [importCardText, setImportCardText] = useState("");

  // Payment form
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentRecord["method"]>("EFT");
  const [payDate, setPayDate] = useState("");
  const [payNote, setPayNote] = useState("");

  // Message composer
  const [adminMsg, setAdminMsg] = useState("");

  // Asset form
  const [assetLabel, setAssetLabel] = useState("");
  const [assetUrl, setAssetUrl] = useState("");
  const [assetType, setAssetType] = useState<SharedAsset["type"]>("staging");

  const commitClient = (updated: ClientPortalAccount) => {
    onChange(clients.map((c) => (c.id === updated.id ? updated : c)));
    setSelectedClient(updated);
  };

  /** Base record for any instant-save action (payments / messages / links).
   *  Preserves unsaved tracker-draft edits so those actions can never silently
   *  drop milestone changes the admin made but hasn't clicked "Save Progress" on.
   *  Falls back to the saved record only if the draft is invalid (empty label). */
  const baseWithDraft = (patch: Partial<ClientPortalAccount>): ClientPortalAccount | null => {
    if (!selectedClient) return null;
    const draftValid = progressDraft.every((m) => m.label.trim());
    const pct =
      percentDraft.trim() !== "" && !Number.isNaN(Number(percentDraft))
        ? Math.max(0, Math.min(100, Math.round(Number(percentDraft))))
        : undefined;
    const base = draftValid ? { ...selectedClient, progress: progressDraft, percentComplete: pct } : selectedClient;
    return { ...base, ...patch };
  };

  const today = () => new Date().toISOString().slice(0, 10);

  // ─── Create / approve / delete ──────────────────────────────────────────────

  const handleNewClientClick = () => {
    setSelectedClient(null);
    setCpClientName("");
    setCpClientCompany("");
    setCpClientEmail("");
    setCpClientPhone("");
    setCpInvoiceId("");
    setCpProjectTitle("");
    setCpUsername(generateUsername(""));
    setCpPassword(generatePassword());
    setProgressError("");
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpClientName.trim()) {
      showToast("Please enter the client's name.");
      return;
    }
    if (!cpUsername.trim() || !cpPassword.trim()) {
      showToast("Please set a username and password.");
      return;
    }
    const taken = clients.find((c) => c.username.toLowerCase() === cpUsername.trim().toLowerCase());
    if (taken) {
      showToast(`Username "${cpUsername}" is already taken — regenerate it.`);
      return;
    }
    const linkedInvoice = invoices.find((inv) => inv.id === cpInvoiceId) || null;
    const projectTitle = cpProjectTitle.trim() || linkedInvoice?.items?.[0]?.description || "Custom Web App";
    const now = new Date().toISOString();
    let account: ClientPortalAccount = {
      id: `client-${Date.now()}`,
      clientName: cpClientName.trim(),
      clientCompany: cpClientCompany.trim(),
      email: cpClientEmail.trim(),
      phone: cpClientPhone.trim(),
      username: cpUsername.trim(),
      password: cpPassword,
      invoiceId: linkedInvoice?.id,
      document:
        buildDocumentSnapshot(linkedInvoice) ||
        {
          documentType: "Quote",
          invoiceNumber: "QUO-PENDING",
          projectTitle,
          clientName: cpClientName.trim(),
          clientCompany: cpClientCompany.trim(),
          currency: "ZAR",
          issueDate: today(),
          dueDate: "",
          status: "Pending",
          items: [{ description: projectTitle, quantity: 1, rate: 0 }],
          subtotal: 0,
          depositPercent: 50,
          depositAmount: 0,
          balance: 0,
          notes: "",
        },
      status: "pending",
      createdAt: now,
      updatedAt: now,
      progress: DEFAULT_MILESTONES.map((m, i) => ({
        id: `ms-${Date.now()}-${i}`,
        label: m.label,
        status: m.status,
        note: m.note,
        date: today(),
      })),
      payments: [],
      messages: [],
      assets: [],
      activity: [],
    };
    account = appendActivity(account, "admin", "Client portal created", `Project: ${projectTitle}`);
    onChange([account, ...clients]);
    openTrackerEditor(account);
    setCpProjectTitle(projectTitle);
    showToast(`Client portal for ${account.clientName} created — approve it to send the invite.`);
  };

  const handleApproveClient = (account: ClientPortalAccount) => {
    const updated = appendActivity(
      { ...account, status: "approved", approvedAt: new Date().toISOString() },
      "admin",
      "Portal approved — invite ready to send"
    );
    onChange(clients.map((c) => (c.id === account.id ? updated : c)));
    if (selectedClient?.id === account.id) setSelectedClient(updated);
    showToast(`${updated.username} approved — copy the invite message to send it.`);
  };

  const handleDeleteClient = (id: string) => {
    onChange(clients.filter((c) => c.id !== id));
    if (selectedClient?.id === id) setSelectedClient(null);
    showToast("Client portal deleted.");
  };

  const handleCopyCPEmail = async (account: ClientPortalAccount) => {
    const ok = await copyText(buildCPInviteMessage(account, "email"));
    showToast(
      ok
        ? `Client Portal invite copied — paste it into Gmail/WhatsApp for ${account.clientName}.`
        : "Couldn't copy automatically — long-press the invite to copy."
    );
  };

  const handleOpenCPWhatsApp = (account: ClientPortalAccount) => {
    window.open(buildCPWhatsAppUrl(account), "_blank", "noopener,noreferrer");
  };

  /** Merges a returned card into the admin's local record WITHOUT ever rolling
   *  back admin-side data. The admin's record stays authoritative for progress,
   *  payments, assets, status and % complete; only client-originated content
   *  (signed declaration, client replies, client activity) is adopted from the
   *  card — even if the client returned an older card. */
  const mergeImportedCard = (local: ClientPortalAccount, incoming: ClientPortalAccount): ClientPortalAccount => {
    const unionById = <T extends { id: string }>(a: T[], b: T[]): T[] => {
      const map = new Map<string, T>();
      for (const item of [...a, ...b]) map.set(item.id, item);
      return Array.from(map.values());
    };
    const clientMsgs = (incoming.messages || []).filter((m) => m.from === "client");
    const clientActs = (incoming.activity || []).filter((a) => a.actor === "client");
    return {
      ...local,
      declaration: incoming.declaration || local.declaration,
      messages: unionById(local.messages || [], clientMsgs),
      activity: unionById(local.activity || [], clientActs),
    };
  };

  // Import a card (invite card from your own device, or the client's SIGNED card).
  const handleImportClientCard = () => {
    const account = parseInviteCard(importCardText);
    if (!account) {
      showToast("That doesn't look like a valid access card.");
      return;
    }
    const existing = clients.find((c) => c.username.toLowerCase() === account.username.toLowerCase());
    let next: ClientPortalAccount[];
    if (existing) {
      next = clients.map((c) =>
        c.username.toLowerCase() === account.username.toLowerCase() ? mergeImportedCard(c, account) : c
      );
    } else {
      next = [account, ...clients];
    }
    onChange(next);
    setImportCardText("");
    // If the card carries a signed declaration, archive it onto the linked invoice record.
    if (account.declaration && account.invoiceId) {
      const inv = invoices.find((i) => i.id === account.invoiceId);
      if (inv) {
        const invNext = invoices.map((i) => (i.id === inv.id ? { ...i, declaration: account.declaration } : i));
        onInvoicesChange(invNext);
      }
    }
    showToast(
      `Card imported for ${account.username}${account.declaration ? " — signed declaration archived." : "."}`
    );
  };

  // ─── Tracker editor ─────────────────────────────────────────────────────────

  const openTrackerEditor = (account: ClientPortalAccount) => {
    setSelectedClient(account);
    setProgressDraft((account.progress || []).map((p) => ({ ...p })));
    setPercentDraft(String(computePercentComplete(account) ?? ""));
    setProgressError("");
  };

  const addMilestone = () => {
    setProgressDraft([
      ...progressDraft,
      { id: `ms-${Date.now()}`, label: "", status: "queued", date: today() },
    ]);
  };

  const updateMilestone = (id: string, patch: Partial<ProgressUpdate>) => {
    setProgressDraft(progressDraft.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const removeMilestone = (id: string) => {
    setProgressDraft(progressDraft.filter((p) => p.id !== id));
  };

  const handleSaveProgress = () => {
    if (!selectedClient) return;
    if (progressDraft.some((p) => !p.label.trim())) {
      setProgressError("Every milestone needs a label.");
      return;
    }
    const pct =
      percentDraft.trim() !== "" && !Number.isNaN(Number(percentDraft))
        ? Math.max(0, Math.min(100, Math.round(Number(percentDraft))))
        : undefined;
    const updated = appendActivity(
      { ...selectedClient, progress: progressDraft, percentComplete: pct },
      "admin",
      "Progress updated",
      pct !== undefined ? `Overall completion set to ${pct}%` : "Milestones updated"
    );
    commitClient(updated);
    setProgressError("");
    showToast(`Progress saved for ${updated.username} — re-send the updated card so they see it.`);
  };

  // ─── Payments ───────────────────────────────────────────────────────────────

  const handleAddPayment = () => {
    if (!selectedClient) return;
    const amount = Number(payAmount);
    if (!amount || amount <= 0) {
      showToast("Enter a valid payment amount.");
      return;
    }
    const payment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      amount,
      method: payMethod,
      date: payDate || today(),
      note: payNote.trim() || undefined,
    };
    const received = totalPaymentsReceived(selectedClient) + amount;
    const next = baseWithDraft({ payments: [...selectedClient.payments, payment] });
    if (!next) return;
    const updated = appendActivity(
      next,
      "admin",
      `Payment received ${symbolFor(selectedClient)} ${amount.toLocaleString()} (${payMethod})`,
      received > 0 ? `Total received: ${symbolFor(selectedClient)} ${received.toLocaleString()}` : undefined
    );
    commitClient(updated);
    setPayAmount("");
    setPayNote("");
    setPayDate("");
    showToast(`Payment of ${symbolFor(updated)} ${amount.toLocaleString()} recorded.`);
  };

  const handleDeletePayment = (id: string) => {
    if (!selectedClient) return;
    const next = baseWithDraft({ payments: selectedClient.payments.filter((p) => p.id !== id) });
    if (!next) return;
    commitClient(next);
    showToast("Payment record removed.");
  };

  // ─── Messages ───────────────────────────────────────────────────────────────

  const handleSendMessage = () => {
    if (!selectedClient) return;
    const text = adminMsg.trim();
    if (!text) return;
    const next = baseWithDraft({
      messages: [
        ...selectedClient.messages,
        { id: `msg-${Date.now()}`, from: "admin" as const, text, ts: new Date().toISOString() },
      ],
    });
    if (!next) return;
    const updated = appendActivity(
      next,
      "admin",
      "Message sent to client",
      text.length > 60 ? text.slice(0, 60) + "…" : text
    );
    commitClient(updated);
    setAdminMsg("");
    showToast("Message added — re-send the updated card so they see it.");
  };

  // ─── Assets / links ─────────────────────────────────────────────────────────

  const handleAddAsset = () => {
    if (!selectedClient) return;
    const label = assetLabel.trim();
    const url = assetUrl.trim();
    if (!label || !url) {
      showToast("Enter both a label and a URL for the link.");
      return;
    }
    const normalizedUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
    const asset: SharedAsset = {
      id: `asset-${Date.now()}`,
      label,
      url: normalizedUrl,
      type: assetType,
      addedAt: new Date().toISOString(),
    };
    const next = baseWithDraft({ assets: [...selectedClient.assets, asset] });
    if (!next) return;
    const updated = appendActivity(next, "admin", "Link shared with client", label);
    commitClient(updated);
    setAssetLabel("");
    setAssetUrl("");
    showToast("Link added — re-send the updated card so they see it.");
  };

  const handleDeleteAsset = (id: string) => {
    if (!selectedClient) return;
    const next = baseWithDraft({ assets: selectedClient.assets.filter((a) => a.id !== id) });
    if (!next) return;
    commitClient(next);
    showToast("Link removed.");
  };

  const doc = selectedClient?.document;
  const received = selectedClient ? totalPaymentsReceived(selectedClient) : 0;
  const depositDue = doc?.depositAmount || 0;
  const remainingBalance = doc ? Math.max(0, doc.balance - Math.max(0, received - depositDue)) : 0;

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* Header + Create / Import */}
      <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-500" />
            Client Portals
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Each client gets their own private portal (unique username + password): a dated build timeline with
            live % progress, their quote, payment tracking, messages, shared links and declaration signing — no
            admin dashboard needed. Approve a portal, then copy the invite message: it carries the client's{" "}
            <strong>access card</strong>. When you update anything, re-send the updated card.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create form */}
          <form onSubmit={handleCreateClient} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-orange-500" />
              Create a New Client Portal
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Client name *
                </label>
                <input
                  id="cp-client-name"
                  type="text"
                  value={cpClientName}
                  onChange={(e) => {
                    setCpClientName(e.target.value);
                    if (!cpUsername) setCpUsername(generateUsername(e.target.value));
                  }}
                  placeholder="e.g. Sipho Ndlovu"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Company
                </label>
                <input
                  id="cp-client-company"
                  type="text"
                  value={cpClientCompany}
                  onChange={(e) => setCpClientCompany(e.target.value)}
                  placeholder="Optional"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  id="cp-client-email"
                  type="email"
                  value={cpClientEmail}
                  onChange={(e) => setCpClientEmail(e.target.value)}
                  placeholder="client@company.co.za"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  WhatsApp (for invite)
                </label>
                <input
                  id="cp-client-phone"
                  type="tel"
                  value={cpClientPhone}
                  onChange={(e) => setCpClientPhone(e.target.value)}
                  placeholder="+27 82 000 0000"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Link to Quote / Invoice
              </label>
              <select
                id="cp-invoice-select"
                value={cpInvoiceId}
                onChange={(e) => {
                  setCpInvoiceId(e.target.value);
                  const inv = invoices.find((i) => i.id === e.target.value);
                  if (inv) setCpProjectTitle(inv.items?.[0]?.description || "");
                }}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              >
                <option value="">— No document linked (manual) —</option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.documentType} {inv.invoiceNumber} — {inv.clientName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Project title (shown on the portal)
              </label>
              <input
                id="cp-project-title"
                type="text"
                value={cpProjectTitle}
                onChange={(e) => setCpProjectTitle(e.target.value)}
                placeholder="e.g. 9-page Tourism Booking Dashboard"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Username
                </label>
                <div className="flex gap-2">
                  <input
                    id="cp-username"
                    type="text"
                    value={cpUsername}
                    onChange={(e) => setCpUsername(e.target.value)}
                    className="flex-1 min-w-0 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setCpUsername(generateUsername(cpClientName))}
                    className="px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                    title="Regenerate username"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="flex gap-2">
                  <input
                    id="cp-password"
                    type="text"
                    value={cpPassword}
                    onChange={(e) => setCpPassword(e.target.value)}
                    className="flex-1 min-w-0 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setCpPassword(generatePassword())}
                    className="px-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
                    title="Regenerate password"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <button
              id="cp-create-btn"
              type="submit"
              className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create Client Portal
            </button>
          </form>

          {/* Import a card */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-500" />
              Import a Client Card
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Paste an invite card here to restore a portal on this device — or paste the <strong>signed card</strong>{" "}
              a client sends back: their signature is archived onto the linked invoice record automatically. Updated
              cards also bring back the client's replies, payment confirmations and signed declaration.
            </p>
            <textarea
              id="cp-import-card-input"
              value={importCardText}
              onChange={(e) => setImportCardText(e.target.value)}
              rows={4}
              placeholder="Paste the JPCARD1:… block here"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono resize-none"
            />
            <button
              id="cp-import-card-btn"
              onClick={handleImportClientCard}
              className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-blue-500 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Card
            </button>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-[11px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
              <strong>Tip:</strong> the invite message already contains everything — copy it from here after approving
              a portal below.
            </div>
          </div>
        </div>
      </div>

      {/* Client list */}
      <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            Client Portals ({clients.length})
          </h3>
          <button onClick={handleNewClientClick} className="text-xs font-bold text-orange-500 hover:underline">
            + New Portal
          </button>
        </div>

        {clients.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <UserPlus className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No client portals yet</p>
            <p className="text-xs text-slate-400">
              Received a project form? Create the portal above, approve it, and send the invite.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => {
              const pct = computePercentComplete(client);
              const recv = totalPaymentsReceived(client);
              const due = client.document?.depositAmount || 0;
              return (
                <div
                  key={client.id}
                  className={`p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border transition-colors ${
                    selectedClient?.id === client.id
                      ? "border-orange-400 dark:border-orange-600"
                      : "border-slate-200 dark:border-slate-700"
                  } space-y-3`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-[220px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white">{client.clientName}</p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            client.status === "approved"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                          }`}
                        >
                          {client.status === "approved" ? "Approved" : "Pending"}
                        </span>
                        {client.declaration && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            ✍ Signed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-mono">
                        @{client.username} ·{" "}
                        {client.document ? `${client.document.documentType} ${client.document.invoiceNumber}` : "No linked document"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {client.clientCompany || "Private client"} · {pct}% complete
                      </p>

                      {/* Progress bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-emerald-500 transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">{pct}%</span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-mono pt-1">
                        <Wallet className="w-3 h-3 inline mr-1 text-emerald-500" />
                        Received {symbolFor(client)} {recv.toLocaleString()}
                        {due > 0 ? ` · deposit due ${symbolFor(client)} ${due.toLocaleString()}` : ""}
                        {client.messages?.length > 0 && (
                          <span className="ml-2 inline-flex items-center gap-1 text-violet-500">
                            <MessageSquare className="w-3 h-3" />
                            {client.messages.length} msg
                          </span>
                        )}
                        {client.assets?.length > 0 && (
                          <span className="ml-2 inline-flex items-center gap-1 text-blue-500">
                            <Link2 className="w-3 h-3" />
                            {client.assets.length} links
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {client.status !== "approved" && (
                        <button
                          onClick={() => handleApproveClient(client)}
                          className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                        >
                          <BadgeCheck className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleCopyCPEmail(client)}
                        className="px-3 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Invite
                      </button>
                      <button
                        onClick={() => handleOpenCPWhatsApp(client)}
                        className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </button>
                      <button
                        onClick={() => openTrackerEditor(client)}
                        className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-orange-500 hover:text-white text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Manage
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.id)}
                        className="p-2 rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 text-[11px] font-bold hover:bg-red-200 transition-colors"
                        title="Delete portal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail editor */}
      {selectedClient && (
        <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border-2 border-orange-500/30 dark:border-orange-800/50 shadow-xl space-y-8">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-orange-500" />
                Manage Portal — {selectedClient.clientName}
              </h3>
              <p className="text-xs text-slate-500">
                @{selectedClient.username} · update milestones, payments, messages & links, then re-send the invite so
                they see it.
              </p>
            </div>
            <button
              onClick={() => setSelectedClient(null)}
              className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" /> Close
            </button>
          </div>

          {/* ── Tracker editor ── */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-orange-500" />
              Build Timeline & Progress
            </h4>

            <div className="flex flex-wrap items-end gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Percent className="w-3 h-3" /> Overall completion % (auto-filled from milestones)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={percentDraft}
                  onChange={(e) => setPercentDraft(e.target.value)}
                  placeholder="Auto (from milestones)"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <p className="text-[11px] text-slate-400 pb-2">
                Leave empty to auto-calculate from completed milestones. Overdue (past end-date) milestones are
                highlighted red on the client's portal.
              </p>
            </div>

            {progressDraft.length === 0 && (
              <p className="text-xs text-slate-400">No milestones yet — add the first one below.</p>
            )}

            <div className="space-y-3">
              {progressDraft.map((m) => (
                <div key={m.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => updateMilestone(m.id, { label: e.target.value })}
                      placeholder="Milestone label"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <select
                      value={m.status}
                      onChange={(e) => updateMilestone(m.id, { status: e.target.value as ProgressUpdate["status"] })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    >
                      <option value="queued">Queued</option>
                      <option value="in-progress">In progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="date"
                      value={m.startDate || ""}
                      onChange={(e) => updateMilestone(m.id, { startDate: e.target.value || undefined })}
                      title="Start date"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="date"
                      value={m.endDate || ""}
                      onChange={(e) => updateMilestone(m.id, { endDate: e.target.value || undefined })}
                      title="End date"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <button
                      onClick={() => removeMilestone(m.id)}
                      className="p-2 rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 hover:bg-red-200 transition-colors"
                      title="Remove milestone"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="md:col-span-12 -mt-1">
                    <input
                      type="text"
                      value={m.note || ""}
                      onChange={(e) => updateMilestone(m.id, { note: e.target.value })}
                      placeholder="Note (optional) — shown to the client under this milestone"
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>

            {progressError && (
              <p className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 font-medium">
                <AlertCircle className="w-4 h-4" /> {progressError}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={addMilestone}
                className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Milestone
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Save Progress
              </button>
              <button
                onClick={() => handleCopyCPEmail(selectedClient)}
                className="px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" /> Re-send Updated Invite
              </button>
            </div>
          </div>

          {/* ── Payments ── */}
          <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-6">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-500" />
              Payments Received
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-mono text-xs">
              <div>
                <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Received</p>
                <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  {symbolFor(selectedClient)} {received.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Deposit due</p>
                <p className="text-base font-extrabold text-slate-900 dark:text-white">
                  {symbolFor(selectedClient)} {depositDue.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Final balance</p>
                <p className="text-base font-extrabold text-orange-600 dark:text-orange-400">
                  {symbolFor(selectedClient)} {remainingBalance.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="w-28">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount</label>
                <input
                  type="number"
                  min={0}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div className="w-32">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentRecord["method"])}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  <option value="EFT">EFT</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Cash">Cash</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="w-40">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Note</label>
                <input
                  type="text"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  placeholder="e.g. Kick-off deposit"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <button
                onClick={handleAddPayment}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Record Payment
              </button>
            </div>

            {selectedClient.payments.length === 0 ? (
              <p className="text-xs text-slate-400">No payments recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {selectedClient.payments.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase">
                        {p.method}
                      </span>
                      <div>
                        <p className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                          {symbolFor(selectedClient)} {p.amount.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {p.date}
                          {p.note ? ` · ${p.note}` : ""}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePayment(p.id)}
                      className="p-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 hover:bg-red-200 transition-colors"
                      title="Remove payment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Messages ── */}
          <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-6">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-violet-500" />
              Messages ({selectedClient.messages.length})
            </h4>

            {selectedClient.messages.length === 0 ? (
              <p className="text-xs text-slate-400">No messages yet — send the first update below.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {selectedClient.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-2xl text-sm max-w-[85%] ${
                      msg.from === "admin"
                        ? "bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900 ml-auto"
                        : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <p className="text-xs font-bold mb-0.5 text-slate-700 dark:text-slate-200">
                      {msg.from === "admin" ? "You" : selectedClient.clientName}
                    </p>
                    <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{msg.text}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      {new Date(msg.ts).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <textarea
                value={adminMsg}
                onChange={(e) => setAdminMsg(e.target.value)}
                rows={2}
                placeholder="Send an update or announcement — the client sees it on their portal…"
                className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 self-end"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Client replies arrive when they return their signed card — re-send the updated card to share new
              messages with them.
            </p>
          </div>

          {/* ── Links & files ── */}
          <div className="space-y-4 border-t border-slate-200 dark:border-slate-800 pt-6">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Link2 className="w-4 h-4 text-blue-500" />
              Shared Links & Files ({selectedClient.assets.length})
            </h4>

            <div className="flex flex-wrap items-end gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Label</label>
                <input
                  type="text"
                  value={assetLabel}
                  onChange={(e) => setAssetLabel(e.target.value)}
                  placeholder="e.g. Live staging demo"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">URL</label>
                <input
                  type="text"
                  value={assetUrl}
                  onChange={(e) => setAssetUrl(e.target.value)}
                  placeholder="https://staging-demo.example.app"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="w-36">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as SharedAsset["type"])}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="staging">Staging demo</option>
                  <option value="repo">Repository</option>
                  <option value="deliverable">Deliverable</option>
                  <option value="document">Document</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                onClick={handleAddAsset}
                className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Link
              </button>
            </div>

            {selectedClient.assets.length === 0 ? (
              <p className="text-xs text-slate-400">No links shared yet — add the staging URL, repo or deliverables here.</p>
            ) : (
              <div className="space-y-2">
                {selectedClient.assets.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase shrink-0">
                        {a.type}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{a.label}</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{a.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-500 transition-colors"
                        title="Open link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteAsset(a.id)}
                        className="p-1.5 rounded-lg bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 hover:bg-red-200 transition-colors"
                        title="Remove link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Activity log ── */}
          <div className="space-y-3 border-t border-slate-200 dark:border-slate-800 pt-6">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              Activity Log
            </h4>
            {selectedClient.activity.length === 0 ? (
              <p className="text-xs text-slate-400">No activity recorded yet.</p>
            ) : (
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {selectedClient.activity.map((act) => (
                  <div key={act.id} className="flex items-start gap-2.5 text-xs">
                    <span
                      className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                        act.actor === "client"
                          ? "bg-emerald-500"
                          : act.actor === "admin"
                          ? "bg-orange-500"
                          : "bg-slate-400"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-slate-700 dark:text-slate-200">
                        <strong className="capitalize">{act.actor}</strong> · {act.action}
                        {act.detail ? <span className="text-slate-400"> — {act.detail}</span> : null}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {new Date(act.ts).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
