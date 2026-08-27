"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  LogOut,
  RefreshCw,
  CheckCircle2,
  Loader,
  FileText,
  PenLine,
  AlertCircle,
  Sparkles,
  Wallet,
  Link2,
  MessageSquare,
  Send,
  CalendarClock,
  ExternalLink,
  Hourglass,
  ClipboardCopy,
  Plus,
  Printer,
  HandCoins,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SignaturePad from "@/components/SignaturePad";
import { SITE_CONFIG } from "@/data/portfolioData";
import type { ClientPortalAccount, ProgressUpdate, PaymentRecord } from "@/lib/types";
import { computePercentComplete, totalPaymentsReceived, appendActivity } from "@/lib/clientPortal";

const STATUS_META: Record<ProgressUpdate["status"], { label: string; dot: string }> = {
  queued: { label: "Queued", dot: "bg-slate-300 dark:bg-slate-600" },
  "in-progress": { label: "In progress", dot: "bg-orange-500 animate-pulse" },
  completed: { label: "Completed", dot: "bg-emerald-500" },
};

function deriveStage(progress: ProgressUpdate[]) {
  const done = (keyword: string) =>
    progress.some((p) => p.label.toLowerCase().includes(keyword) && p.status === "completed");
  if (done("handover")) return { label: "Delivered ✓", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" };
  if (done("staging")) return { label: "Staging demo live — revisions phase", cls: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800" };
  return { label: "Build in progress", cls: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 border-orange-200 dark:border-orange-800" };
}

const isOverdue = (p: ProgressUpdate) =>
  p.status !== "completed" && !!p.endDate && p.endDate < new Date().toISOString().slice(0, 10);

export default function ClientDashboardPage() {
  const router = useRouter();
  const [account, setAccount] = useState<ClientPortalAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // Declaration state
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [signerName, setSignerName] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [declError, setDeclError] = useState("");
  const [declSaved, setDeclSaved] = useState(false);

  // Client reply composer
  const [replyText, setReplyText] = useState("");
  const [notice, setNotice] = useState("");

  // Report-a-payment form
  const [repAmount, setRepAmount] = useState("");
  const [repMethod, setRepMethod] = useState<PaymentRecord["method"]>("EFT");
  const [repDate, setRepDate] = useState("");
  const [repNote, setRepNote] = useState("");
  const [repError, setRepError] = useState("");
  const [repSubmitting, setRepSubmitting] = useState(false);
  const [repProof, setRepProof] = useState<string | null>(null);
  const [repProofName, setRepProofName] = useState("");

  // True once the user starts drawing/typing their signature — auto-refresh
  // must never clobber an in-progress signature with stale server state.
  const dirtySignature = useRef(false);

  const loadAccount = useCallback(async (silent = false) => {
    try {
      const res = await fetch("/api/client/account");
      if (res.status === 401) {
        router.replace("/client");
        return;
      }
      if (!res.ok) return;
      const json = await res.json();
      setAccount(json.account);
      if (json.account?.declaration) {
        if (!dirtySignature.current) {
          setSignatureDataUrl(json.account.declaration.signatureDataUrl || "");
          setSignerName(json.account.declaration.signerName || "");
          setAcknowledged(json.account.declaration.acknowledged || false);
          setDeclSaved(true);
        }
      } else if (!dirtySignature.current && json.account?.clientName) {
        // Pre-fill the signer's name so they only have to draw their signature.
        setSignerName(json.account.clientName);
      }
    } catch {
      // ignore — next poll retries
    } finally {
      if (!silent) setLoading(false);
    }
  }, [router]);

  const loaded = useRef(false);
  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      void loadAccount();
    }
  }, [loadAccount]);

  // Auto-refresh: poll while the tab is visible, and refresh the moment it
  // becomes visible again (e.g. the client opens the portal after the admin
  // posted an update). Stops polling entirely while the tab is hidden.
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") void loadAccount(true);
    };
    document.addEventListener("visibilitychange", refresh);
    const id = setInterval(refresh, 25000);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [loadAccount]);

  const handleReportPayment = async () => {
    setRepError("");
    const amount = Number(repAmount);
    if (!amount || amount <= 0) {
      setRepError("Enter a valid payment amount.");
      return;
    }
    setRepSubmitting(true);
    try {
      const res = await fetch("/api/client/payment/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          method: repMethod,
          date: repDate || undefined,
          note: repNote.trim() || undefined,
          proofUrl: repProof || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRepError(json.error === "invalid-amount" ? "Enter a valid payment amount." : "Could not report the payment — try again.");
        return;
      }
      setAccount(json.account);
      setRepAmount("");
      setRepNote("");
      setRepDate("");
      setRepProof(null);
      setRepProofName("");
      setNotice("Payment reported — your developer will confirm it shortly.");
    } catch {
      setRepError("Could not reach the server — please try again.");
    } finally {
      setRepSubmitting(false);
    }
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setRepError("Proof image must be under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setRepProof(reader.result as string);
      setRepProofName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    await fetch("/api/client/logout", { method: "POST" });
    router.replace("/client");
  };

  const handleSignDeclaration = async () => {
    setDeclError("");
    if (!account) return;
    if (!signatureDataUrl || !signerName.trim()) {
      setDeclError("Please draw your signature and type your full name.");
      return;
    }
    if (!acknowledged) {
      setDeclError("Please tick the acknowledgement box to confirm acceptance.");
      return;
    }
    const declaration = {
      signatureDataUrl,
      signerName: signerName.trim(),
      acknowledged: true,
      signedAt: new Date().toISOString(),
    };
    const updated = appendActivity(
      { ...account, declaration },
      "client",
      "Declaration signed",
      `Signed by ${signerName.trim()}`
    );
    try {
      const res = await fetch("/api/client/account/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ declaration, activity: updated.activity }),
      });
      const json = await res.json().catch(() => ({}));
      // Prefer the server's copy — it carries the refreshed document snapshot
      // (status flips to Accepted the moment you sign).
      setAccount(json.account || updated);
      setDeclSaved(true);
      setNotice("Declaration signed and saved — your developer sees it instantly.");
    } catch {
      setDeclError("Could not save — please try again.");
    }
  };

  const handleSendReply = async () => {
    const text = replyText.trim();
    if (!account || !text) return;
    const updated = appendActivity(
      {
        ...account,
        messages: [...(account.messages || []), { id: `msg-${Date.now()}`, from: "client" as const, text, ts: new Date().toISOString() }],
      },
      "client",
      "Replied in the portal",
      text.length > 60 ? text.slice(0, 60) + "…" : text
    );
    try {
      await fetch("/api/client/account/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated.messages, activity: updated.activity }),
      });
      setAccount(updated);
      setReplyText("");
      setNotice("Reply saved.");
    } catch {
      setNotice("Could not send reply — try again.");
    }
  };

  const handleCopySignedCard = async () => {
    if (!account?.declaration) return;
    const cardText = `SIGNED_DECLARATION:${account.username}:${account.declaration.signerName}:${account.declaration.signedAt}`;
    try {
      await navigator.clipboard.writeText(cardText);
      setNotice("Signed declaration reference copied — your developer already sees your signature on their dashboard.");
    } catch {
      setNotice("Couldn't copy automatically — long-press to copy.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070D17]">
        <Loader className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  const doc = account?.document;
  const symbol = doc?.currency === "USD" ? "$" : "R";
  const stage = deriveStage(account?.progress || []);
  const pct = account ? computePercentComplete(account) : 0;
  const completedCount = (account?.progress || []).filter((p) => p.status === "completed").length;
  const totalMilestones = account?.progress.length || 0;
  const overdueCount = (account?.progress || []).filter(isOverdue).length;
  // Money received is the greater of confirmed portal payments and the deposit
  // actually recorded against the linked invoice — both directions stay in sync.
  const received = account ? Math.max(totalPaymentsReceived(account), doc?.depositPaid || 0) : 0;
  const depositDue = doc?.depositAmount || 0;
  const balanceDue = doc ? Math.max(0, doc.balance - Math.max(0, received - depositDue)) : 0;
  const messages = account?.messages || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {!account ? (
            <div className="max-w-md mx-auto py-14 text-center space-y-5 bg-white dark:bg-[#0D1A2D] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-500 mx-auto flex items-center justify-center">
                <Loader className="w-7 h-7 animate-spin" />
              </div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Loading your portal…
              </h1>
              <p className="text-sm text-slate-500">
                If this takes too long, try signing in again.
              </p>
              <button
                onClick={() => router.push("/client")}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Your Private Portal
                    </span>
                    <span className="text-xs font-mono text-slate-400">@{account.username}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${stage.cls}`}>
                      {stage.label}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Hi {account.clientName.split(" ")[0] || "there"} 👋
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {doc?.projectTitle || "Your project"} · {doc ? `${doc.documentType} ${doc.invoiceNumber}` : "No linked document yet"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    id="client-refresh-btn"
                    onClick={() => void loadAccount()}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors hover:border-orange-400 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Refresh
                  </button>
                  <button
                    id="client-logout-btn"
                    onClick={handleLogout}
                    className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors hover:border-red-400 hover:text-red-500 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </div>
              </div>

              {/* Overall progress KPI strip */}
              <div className="bg-white dark:bg-[#0D1A2D] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CalendarClock className="w-4 h-4 text-orange-500" />
                        Overall Build Progress
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">{pct}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-emerald-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      {completedCount} of {totalMilestones} milestones complete
                      {overdueCount > 0 && (
                        <span className="text-red-500 font-semibold ml-2 inline-flex items-center gap-1">
                          <Hourglass className="w-3 h-3" /> {overdueCount} overdue
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 sm:w-auto shrink-0">
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-center min-w-[100px]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Paid</p>
                      <p className="text-base font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                        {symbol} {received.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center min-w-[100px]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Deposit due</p>
                      <p className="text-base font-extrabold font-mono text-slate-900 dark:text-white">
                        {symbol} {depositDue.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/80 text-center min-w-[100px]">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Balance</p>
                      <p className="text-base font-extrabold font-mono text-orange-600 dark:text-orange-400">
                        {symbol} {balanceDue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {notice && (
                <div className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl p-3 print:hidden">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  {notice}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: tracker + documents + payments + links */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Live progress tracker */}
                  <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md print:hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-5">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <Loader className="w-5 h-5 text-orange-500" />
                        Live Build Timeline
                      </h2>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${stage.cls}`}>
                        {stage.label}
                      </span>
                    </div>

                    <ol className="space-y-0">
                      {(account.progress || []).map((p, i) => {
                        const meta = STATUS_META[p.status] || STATUS_META.queued;
                        const isLast = i === (account.progress || []).length - 1;
                        const overdue = isOverdue(p);
                        return (
                          <li key={p.id} className="relative flex gap-4 pb-6 last:pb-0">
                            {!isLast && (
                              <span className="absolute left-[11px] top-7 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                            )}
                            <span className={`relative z-10 mt-0.5 w-[23px] h-[23px] rounded-full border-2 border-white dark:border-[#0D1A2D] shadow ${overdue ? "bg-red-500" : meta.dot}`}>
                              {p.status === "completed" && (
                                <CheckCircle2 className="w-4 h-4 text-white absolute inset-0.5" />
                              )}
                            </span>
                            <div className="flex-1 pt-0.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  {p.label}
                                  {overdue && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-[9px] font-extrabold uppercase tracking-wide">
                                      Overdue
                                    </span>
                                  )}
                                </p>
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${overdue ? "text-red-500" : "text-slate-400"}`}>
                                  {meta.label}
                                </span>
                              </div>
                              {p.note && <p className="text-xs text-slate-500 mt-0.5">{p.note}</p>}
                              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                                {p.startDate ? `Starts ${p.startDate}` : ""}
                                {p.startDate && p.endDate ? " → " : ""}
                                {p.endDate ? `${p.status === "completed" ? "Completed" : "Due"} ${p.endDate}` : p.date}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ol>

                    <p className="text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3 mt-5">
                      {completedCount} of {totalMilestones} milestones complete · Updated by your developer.
                    </p>
                  </div>

                  {/* Document summary */}
                  {doc && (
                    <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                          <FileText className="w-5 h-5 text-orange-500" />
                          {doc.documentType} {doc.invoiceNumber}
                        </h2>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                            {doc.status}
                          </span>
                          <button
                            onClick={() => window.print()}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
                            title="Print / Export document"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {(doc.items || []).map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-dashed border-slate-200 dark:border-slate-700 last:border-0">
                            <span className="text-slate-700 dark:text-slate-200">{it.description}</span>
                            <span className="font-mono text-slate-500 text-xs shrink-0">
                              {it.quantity} × {symbol} {it.rate.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 space-y-2 font-mono text-sm bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Total</span>
                          <span className="font-bold text-slate-900 dark:text-white">{symbol} {doc.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Kick-off deposit ({doc.depositPercent}%)</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{symbol} {doc.depositAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-black text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-2">
                          <span>Final balance ({100 - doc.depositPercent}%)</span>
                          <span className="text-orange-600 dark:text-orange-400">{symbol} {doc.balance.toLocaleString()}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mt-4">
                        Payable via PayPal or Direct EFT (Bank Transfer). Full source code is yours on final payment.
                      </p>
                      <a
                        href={SITE_CONFIG.paypalMeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/></svg>
                        Pay with PayPal
                      </a>
                      <p className="text-[10px] text-slate-400 mt-1">Opens paypal.me in a new tab — send any amount</p>
                    </div>
                  )}

              {/* Payments */}
              <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 print:hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-emerald-500" />
                        Payments
                      </h2>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {symbol} {received.toLocaleString()} received
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Received</p>
                        <p className="text-base font-extrabold font-mono text-emerald-700 dark:text-emerald-400">{symbol} {received.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Deposit due</p>
                        <p className="text-base font-extrabold font-mono text-slate-900 dark:text-white">{symbol} {depositDue.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/80">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Still due</p>
                        <p className="text-base font-extrabold font-mono text-orange-600 dark:text-orange-400">{symbol} {balanceDue.toLocaleString()}</p>
                      </div>
                    </div>

                    {(account.payments || []).length === 0 ? (
                      <p className="text-xs text-slate-400">
                        No payments recorded yet. Made a payment? Report it below and your developer will confirm it.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {/* Running total */}
                        {(() => {
                          let running = 0;
                          return (account.payments || []).map((p) => {
                            const pending = p.status === "pending";
                            if (!pending) running += p.amount;
                            return (
                              <div key={p.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${pending ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"}`}>
                                    {p.method}
                                  </span>
                                  <div>
                                    <p className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">
                                      {symbol} {p.amount.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-mono">
                                      {p.date}
                                      {p.note ? ` · ${p.note}` : ""}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {!pending && (
                                    <span className="text-[10px] font-mono text-slate-400">
                                      Total: {symbol} {running.toLocaleString()}
                                    </span>
                                  )}
                                  {p.proofUrl && (
                                    <button
                                      onClick={() => window.open(p.proofUrl, "_blank")}
                                      className="text-[10px] text-blue-500 hover:text-blue-600 underline"
                                    >
                                      View proof
                                    </button>
                                  )}
                                  {pending ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                      <Hourglass className="w-3.5 h-3.5" />
                                      Pending
                                    </span>
                                  ) : (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  )}
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}

                    {/* Report a payment */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-600 space-y-3">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <HandCoins className="w-4 h-4 text-emerald-500" />
                        Made a payment? Report it
                      </p>
                      <div className="flex flex-wrap items-end gap-2">
                        <div className="w-28">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount</label>
                          <input
                            type="number"
                            min={0}
                            value={repAmount}
                            onChange={(e) => setRepAmount(e.target.value)}
                            placeholder="0"
                            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Method</label>
                          <select
                            value={repMethod}
                            onChange={(e) => setRepMethod(e.target.value as PaymentRecord["method"])}
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
                            value={repDate}
                            onChange={(e) => setRepDate(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-[140px]">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reference / note</label>
                          <input
                            type="text"
                            value={repNote}
                            onChange={(e) => setRepNote(e.target.value)}
                            placeholder="e.g. EFT ref, kick-off deposit"
                            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                          />
                        </div>
                        <button
                          onClick={handleReportPayment}
                          disabled={repSubmitting}
                          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                          {repSubmitting ? "Reporting…" : "Report Payment"}
                        </button>
                      </div>
                      {/* Proof of payment upload */}
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 text-[11px] font-medium text-slate-500 dark:text-slate-400 transition-colors">
                          <FileText className="w-3.5 h-3.5" />
                          {repProofName || "Attach receipt / proof"}
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="sr-only"
                            onChange={handleProofUpload}
                          />
                        </label>
                        {repProof && (
                          <button
                            onClick={() => { setRepProof(null); setRepProofName(""); }}
                            className="text-[10px] text-red-500 hover:text-red-600 underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      {repProof && (
                        <div className="mt-2">
                          {repProof.startsWith("data:image") ? (
                            <img src={repProof} alt="Proof of payment" className="h-16 rounded-xl border border-slate-200 dark:border-slate-700 object-cover" />
                          ) : (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">✓ PDF attached</span>
                          )}
                        </div>
                      )}
                      {repError && (
                        <p className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl p-3">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          {repError}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400">
                        Your report shows as <em>pending confirmation</em> — the deposit and balance update as soon as your developer confirms it.
                      </p>
                    </div>
                  </div>

                  {/* Shared links */}
                  <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 print:hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-blue-500" />
                        Your Links & Deliverables
                      </h2>
                      <span className="text-[11px] text-slate-400 font-mono">{(account.assets || []).length} shared</span>
                    </div>

                    {(account.assets || []).length === 0 ? (
                      <p className="text-xs text-slate-400">
                        Your staging demo, repository and deliverables will appear here as they're ready.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {(account.assets || []).map((a) => (
                          <div key={a.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase shrink-0">
                                {a.type}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{a.label}</p>
                                <p className="text-[10px] text-slate-400 font-mono truncate">{a.url}</p>
                              </div>
                            </div>
                            <a
                              href={a.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-bold transition-all flex items-center gap-1.5 shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Open
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: declaration + messages */}
                <div className="lg:col-span-5 space-y-6 print:hidden">
                  <div className="bg-white dark:bg-[#0D1A2D] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-5 sticky top-24">
                    <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                      <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                        <PenLine className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold">Signed Declaration</h2>
                        <p className="text-xs text-slate-500">Approve your documents here.</p>
                      </div>
                      {doc && (
                        <Link
                          href="/client/declaration"
                          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold transition-colors shrink-0"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Print / Save PDF
                        </Link>
                      )}
                    </div>

                    {declSaved && account?.declaration ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 space-y-3">
                          <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            Signed on {new Date(account.declaration.signedAt).toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" })}
                          </p>
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-500">
                            This signature is instantly shared with your developer — no need to send anything back.
                          </p>
                          {account.declaration.signatureDataUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={account.declaration.signatureDataUrl} alt="Your signature" className="h-20 w-auto object-contain bg-white rounded-xl border border-emerald-200 dark:border-emerald-900" />
                          )}
                          <p className="text-xs text-emerald-700 dark:text-emerald-400">
                            Signed by <strong>{account.declaration.signerName}</strong>
                          </p>
                        </div>

                        <button
                          id="client-copy-signed-card-btn"
                          onClick={handleCopySignedCard}
                          className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
                        >
                          <ClipboardCopy className="w-4 h-4 text-orange-400" />
                          Copy Declaration Ref
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <SignaturePad
                          value={signatureDataUrl}
                          onChange={(v) => {
                            dirtySignature.current = true;
                            setSignatureDataUrl(v);
                          }}
                          height={110}
                          label="Sign here"
                        />
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            Full name
                          </label>
                          <input
                            id="client-signer-name"
                            type="text"
                            value={signerName}
                            onChange={(e) => {
                              dirtySignature.current = true;
                              setSignerName(e.target.value);
                            }}
                            placeholder="Your full name"
                            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                          />
                        </div>
                        <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                          <input
                            id="client-declaration-ack"
                            type="checkbox"
                            checked={acknowledged}
                            onChange={(e) => {
                              dirtySignature.current = true;
                              setAcknowledged(e.target.checked);
                            }}
                            className="mt-0.5 accent-orange-500 w-4 h-4"
                          />
                          <span className="leading-relaxed">
                            I confirm the details in this {doc?.documentType.toLowerCase() || "document"} are correct, that I
                            accept the{" "}
                            <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline text-orange-500 font-semibold hover:text-orange-600">Terms of Service</a>,{" "}
                            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-orange-500 font-semibold hover:text-orange-600">Privacy Policy</a>,{" "}
                            <a href="/popia" target="_blank" rel="noopener noreferrer" className="underline text-orange-500 font-semibold hover:text-orange-600">POPIA Compliance Policy</a>,{" "}
                            the{" "}
                            <a href="/guarantee" target="_blank" rel="noopener noreferrer" className="underline text-orange-500 font-semibold hover:text-orange-600">No-Gamble Guarantee</a>,
                            and — where applicable — the{" "}
                            <a href="/dpa" target="_blank" rel="noopener noreferrer" className="underline text-orange-500 font-semibold hover:text-orange-600">Data Processing Agreement</a>,
                            and that this signature is legally binding.
                          </span>
                        </label>
                        {declError && (
                          <p className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl p-3">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            {declError}
                          </p>
                        )}
                        <button
                          id="client-sign-declaration-btn"
                          onClick={handleSignDeclaration}
                          className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all"
                        >
                          Sign & Save Declaration
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="bg-white dark:bg-[#0D1A2D] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-4 print:hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                      <h2 className="text-base font-bold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-violet-500" />
                        Messages
                      </h2>
                      <span className="text-[11px] text-slate-400 font-mono">{messages.length}</span>
                    </div>

                    {messages.length === 0 ? (
                      <p className="text-xs text-slate-400">
                        No messages yet — updates from your developer will appear here.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`p-3 rounded-2xl text-sm max-w-[90%] ${
                              msg.from === "admin"
                                ? "bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900"
                                : "bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 ml-auto"
                            }`}
                          >
                            <p className="text-xs font-bold mb-0.5 text-slate-700 dark:text-slate-200">
                              {msg.from === "admin" ? "Your developer" : "You"}
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
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={2}
                        placeholder="Reply to your developer…"
                        className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none"
                      />
                      <button
                        onClick={handleSendReply}
                        className="px-4 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 self-end"
                      >
                        <Send className="w-4 h-4" /> Send
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Replies are saved to your account and visible to your developer.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
