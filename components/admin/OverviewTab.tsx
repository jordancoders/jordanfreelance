"use client";

import {
  TrendingUp,
  Wallet,
  Users,
  Percent,
  FileText,
  Cpu,
  Activity,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  type ClientPortalAccount,
  type InvoiceLike,
  computePercentComplete,
  totalPaymentsReceived,
} from "@/lib/clientPortal";
import { type ApiPricingModel } from "@/data/apiPricingData";

interface OverviewTabProps {
  invoices: InvoiceLike[];
  clients: ClientPortalAccount[];
  projectsCount: number;
  apiModels: ApiPricingModel[];
  onNavigate: (tab: string) => void;
  onSelectInvoice: (inv: InvoiceLike) => void;
}

const invoiceTotal = (inv: InvoiceLike) =>
  (inv.items || []).reduce((sum, it) => sum + (it.quantity || 0) * (it.rate || 0), 0);

const invoiceBalance = (inv: InvoiceLike) => {
  const total = invoiceTotal(inv);
  const paid = (inv as InvoiceLike & { depositPaid?: number }).depositPaid || 0;
  return Math.max(0, total - paid);
};

export default function OverviewTab({
  invoices,
  clients,
  projectsCount,
  apiModels,
  onNavigate,
  onSelectInvoice,
}: OverviewTabProps) {
  const totalRevenueZAR = invoices
    .filter((i) => i.currency === "ZAR")
    .reduce((sum, i) => sum + invoiceTotal(i), 0);
  const totalRevenueUSD = invoices
    .filter((i) => i.currency === "USD")
    .reduce((sum, i) => sum + invoiceTotal(i), 0);
  const paidRevenueZAR = invoices
    .filter((i) => i.currency === "ZAR" && (i.status === "Paid" || i.status === "Accepted"))
    .reduce((sum, i) => sum + invoiceTotal(i), 0);
  const outstandingZAR = invoices
    .filter((i) => i.currency === "ZAR" && i.status !== "Paid")
    .reduce((sum, i) => sum + invoiceBalance(i), 0);

  const approved = clients.filter((c) => c.status === "approved");
  const pendingCount = clients.length - approved.length;
  const totalReceived = approved.reduce((sum, c) => sum + totalPaymentsReceived(c), 0);
  const avgCompletion =
    approved.length === 0 ? 0 : Math.round(approved.reduce((sum, c) => sum + computePercentComplete(c), 0) / approved.length);
  const signedCount = clients.filter((c) => c.declaration).length;

  const recentActivity = clients
    .flatMap((c) =>
      (c.activity || []).map((act) => ({ ...act, clientName: c.clientName, username: c.username }))
    )
    .sort((a, b) => (a.ts < b.ts ? 1 : -1))
    .slice(0, 8);

  const fmt = (n: number) => n.toLocaleString();

  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-orange-500" /> Invoiced / Quoted (ZAR)
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">R {fmt(totalRevenueZAR)}</div>
          <p className="text-[11px] text-slate-400">{invoices.length} client documents</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-500" /> Invoiced (USD)
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">$ {fmt(totalRevenueUSD)}</div>
          <p className="text-[11px] text-slate-400">International clients</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Collected Revenue (ZAR)
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">R {fmt(paidRevenueZAR)}</div>
          <p className="text-[11px] text-slate-400">Paid & accepted quotes</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-500" /> Deposits Received
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">R {fmt(totalReceived)}</div>
          <p className="text-[11px] text-slate-400">Across {approved.length} approved portals</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-purple-500" /> Client Portals
          </span>
          <div className="text-2xl font-extrabold text-purple-500">{approved.length} Live</div>
          <p className="text-[11px] text-slate-400">
            {pendingCount} pending · {signedCount} signed
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-orange-500" /> Avg Completion
          </span>
          <div className="text-2xl font-extrabold text-orange-500">{avgCompletion}%</div>
          <p className="text-[11px] text-slate-400">
            R {fmt(outstandingZAR)} outstanding · {projectsCount} projects
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent invoices */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Recent Invoices & Quotes
            </h3>
            <button onClick={() => onNavigate("invoices")} className="text-xs font-bold text-orange-500 hover:underline">
              View All ({invoices.length}) →
            </button>
          </div>

          <div className="space-y-3">
            {invoices.slice(0, 4).map((inv) => {
              const total = invoiceTotal(inv);
              const symbol = inv.currency === "ZAR" ? "R" : "$";
              return (
                <div
                  key={inv.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4 hover:border-orange-500/50 transition-all cursor-pointer"
                  onClick={() => onSelectInvoice(inv)}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        {inv.documentType || "Invoice"}
                      </span>
                      <strong className="text-sm text-slate-900 dark:text-white font-mono">{inv.invoiceNumber}</strong>
                      {inv.status === "Paid" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                      {inv.status === "Overdue" && <Clock className="w-3.5 h-3.5 text-red-500" />}
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                      {inv.clientName} {inv.clientCompany ? `(${inv.clientCompany})` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {symbol} {total.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">Due: {inv.dueDate || "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active portals */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Active Client Portals
            </h3>
            <button onClick={() => onNavigate("clients-manager")} className="text-xs font-bold text-orange-500 hover:underline">
              Manage →
            </button>
          </div>

          {approved.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No approved portals yet</p>
              <p className="text-xs text-slate-400">Create and approve a portal to track a live build here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {approved.slice(0, 5).map((c) => {
                const pct = computePercentComplete(c);
                const recv = totalPaymentsReceived(c);
                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:border-purple-500/50 transition-all cursor-pointer"
                    onClick={() => onNavigate("clients-manager")}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">{c.clientName}</p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          {c.document ? `${c.document.documentType} ${c.document.invoiceNumber}` : "No document"}
                          {c.declaration ? " · ✍ signed" : ""}
                        </p>
                      </div>
                      <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400 shrink-0">
                        R {recv.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-orange-400 to-emerald-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Live API quick rates */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-orange-500" />
                API Pricing Quick Look
              </h4>
              <button onClick={() => onNavigate("api-tracker")} className="text-xs font-bold text-orange-500 hover:underline">
                Explore All →
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {apiModels.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <strong className="text-slate-900 dark:text-white block font-bold truncate">{m.name}</strong>
                    <span className="text-[10px] text-slate-500 font-mono">{m.provider}</span>
                  </div>
                  <div className="text-right font-mono shrink-0">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold block">
                      ${m.inputCostPer1M.toFixed(2)}/M in
                    </span>
                    <span className="text-orange-500 font-bold block">${m.outputCostPer1M.toFixed(2)}/M out</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-500" />
            Recent Activity
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">across all portals</span>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-center py-6 space-y-2">
            <Activity className="w-7 h-7 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-400">
              No activity yet — create a portal, approve it, and update progress to start your audit trail.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {recentActivity.map((act) => (
              <div key={act.id} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                <span
                  className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                    act.actor === "client" ? "bg-emerald-500" : act.actor === "admin" ? "bg-orange-500" : "bg-slate-400"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug">
                    <strong className="capitalize">{act.actor}</strong> · {act.action}
                    {act.detail ? <span className="text-slate-400"> — {act.detail}</span> : null}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {act.clientName} ·{" "}
                    {new Date(act.ts).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
