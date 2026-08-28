"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Calendar, Printer, TrendingUp, TrendingDown, DollarSign, FileText, Download } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";
import Logo from "@/components/Logo";
import { downloadElementAsPdf } from "@/lib/pdfDownload";
import type { Invoice, ExpenseEntry } from "@/lib/types";
import { EXPENSE_CATEGORIES } from "@/lib/types";

interface MonthlyStatementsProps {
  invoices: Invoice[];
  expenses: ExpenseEntry[];
}

function monthKey(d: string) { return d.slice(0, 7); }
function monthLabel(ym: string) {
  const [y, m] = ym.split("-");
  const date = new Date(Number(y), Number(m) - 1, 1);
  return date.toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
}
const symbol = (c: string) => (c === "USD" ? "$" : "R");

export default function MonthlyStatements({ invoices, expenses }: MonthlyStatementsProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [printTarget, setPrintTarget] = useState<"current" | "year" | null>(null);

  // All months with data
  const allMonths = useMemo(() => {
    const months = new Set<string>();
    invoices.forEach((inv) => months.add(monthKey(inv.issueDate)));
    expenses.forEach((exp) => months.add(monthKey(exp.date)));
    return [...months].sort().reverse();
  }, [invoices, expenses]);

  // Current month data
  const monthInvoices = useMemo(
    () => invoices.filter((inv) => monthKey(inv.issueDate) === selectedMonth),
    [invoices, selectedMonth]
  );
  const monthExpenses = useMemo(
    () => expenses.filter((exp) => monthKey(exp.date) === selectedMonth),
    [expenses, selectedMonth]
  );

  const incomeZAR = monthInvoices
    .filter((i) => i.currency === "ZAR")
    .reduce((s, i) => s + (i.items || []).reduce((a, it) => a + (it.quantity || 0) * (it.rate || 0), 0), 0);
  const incomeUSD = monthInvoices
    .filter((i) => i.currency === "USD")
    .reduce((s, i) => s + (i.items || []).reduce((a, it) => a + (it.quantity || 0) * (it.rate || 0), 0), 0);
  const expensesZAR = monthExpenses
    .filter((e) => e.currency === "ZAR")
    .reduce((s, e) => s + e.amount, 0);
  const expensesUSD = monthExpenses
    .filter((e) => e.currency === "USD")
    .reduce((s, e) => s + e.amount, 0);
  const profitZAR = incomeZAR - expensesZAR;
  const profitUSD = incomeUSD - expensesUSD;

  // Year-to-date
  const yearKey = selectedMonth.slice(0, 4);
  const yearInvoices = invoices.filter((inv) => inv.issueDate.startsWith(yearKey));
  const yearExpenses = expenses.filter((exp) => exp.date.startsWith(yearKey));
  const ytdIncomeZAR = yearInvoices.filter((i) => i.currency === "ZAR").reduce((s, i) => s + (i.items || []).reduce((a, it) => a + (it.quantity || 0) * (it.rate || 0), 0), 0);
  const ytdIncomeUSD = yearInvoices.filter((i) => i.currency === "USD").reduce((s, i) => s + (i.items || []).reduce((a, it) => a + (it.quantity || 0) * (it.rate || 0), 0), 0);
  const ytdExpensesZAR = yearExpenses.filter((e) => e.currency === "ZAR").reduce((s, e) => s + e.amount, 0);
  const ytdExpensesUSD = yearExpenses.filter((e) => e.currency === "USD").reduce((s, e) => s + e.amount, 0);

  // Expense breakdown by category
  const catBreakdown = EXPENSE_CATEGORIES.map((cat) => ({
    ...cat,
    total: monthExpenses.filter((e) => e.category === cat.value).reduce((s, e) => s + e.amount, 0),
    count: monthExpenses.filter((e) => e.category === cat.value).length,
  })).filter((c) => c.total > 0);

  const [activePrintTarget, setActivePrintTarget] = useState<"current" | "year" | null>(null);
  const monthlyRef = useRef<HTMLDivElement>(null);
  const ytdRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const doDownload = async (target: "current" | "year") => {
    if (downloading) return;
    setDownloading(true);
    setPrintTarget(target);
    document.body.dataset.printMode = target;
    setActivePrintTarget(target);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const el = target === "current" ? monthlyRef.current : ytdRef.current;
    if (el) {
      await downloadElementAsPdf(el, `statement-${selectedMonth}${target === "year" ? "-ytd" : ""}.pdf`);
    }
    delete document.body.dataset.printMode;
    setActivePrintTarget(null);
    setDownloading(false);
  };

  const doPrint = (target: "current" | "year") => {
    setPrintTarget(target);
    document.body.dataset.printMode = target;
    setActivePrintTarget(target);
  };

  useEffect(() => {
    if (!activePrintTarget) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
        const cleanup = () => {
          delete document.body.dataset.printMode;
          setActivePrintTarget(null);
        };
        window.addEventListener("afterprint", cleanup, { once: true });
        setTimeout(cleanup, 120_000);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [activePrintTarget]);

  const now = new Date().toLocaleDateString("en-ZA", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            Monthly Statements
          </h2>
          <p className="text-xs text-slate-500 mt-1">Income vs expenses, profit/loss, and category breakdown.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold">
            {allMonths.length === 0 && <option value={selectedMonth}>{monthLabel(selectedMonth)}</option>}
            {allMonths.map((m) => (
              <option key={m} value={m}>{monthLabel(m)}</option>
            ))}
          </select>
          <button onClick={() => doPrint("current")} className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> Print Statement
          </button>
          <button onClick={() => doPrint("year")} className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> YTD Summary
          </button>
          <button onClick={() => doDownload("current")} disabled={downloading} className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50">
            <Download className="w-4 h-4" /> {downloading ? "Generating…" : "Download"}
          </button>
          <button onClick={() => doDownload("year")} disabled={downloading} className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50">
            <Download className="w-4 h-4" /> YTD Download
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Income (ZAR)</p>
          <p className="text-lg font-extrabold font-mono text-emerald-700 dark:text-emerald-400">R {incomeZAR.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600/60">{monthInvoices.filter((i) => i.currency === "ZAR").length} invoices</p>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Income (USD)</p>
          <p className="text-lg font-extrabold font-mono text-emerald-700 dark:text-emerald-400">${incomeUSD.toLocaleString()}</p>
          <p className="text-[10px] text-emerald-600/60">{monthInvoices.filter((i) => i.currency === "USD").length} invoices</p>
        </div>
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900">
          <p className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">Expenses</p>
          <p className="text-lg font-extrabold font-mono text-red-700 dark:text-red-400">R {expensesZAR.toLocaleString()}</p>
          <p className="text-[10px] text-red-600/60">{monthExpenses.length} entries</p>
        </div>
        <div className={`p-4 rounded-2xl border ${profitZAR >= 0 ? "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900" : "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900"}`}>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${profitZAR >= 0 ? "text-blue-700 dark:text-blue-400" : "text-amber-700 dark:text-amber-400"}`}>Net Profit</p>
          <p className={`text-lg font-extrabold font-mono ${profitZAR >= 0 ? "text-blue-700 dark:text-blue-400" : "text-amber-700 dark:text-amber-400"}`}>
            {profitZAR >= 0 ? "R" : "-R"} {Math.abs(profitZAR).toLocaleString()}
          </p>
          {incomeUSD > 0 && (
            <p className={`text-[10px] ${profitZAR >= 0 ? "text-blue-600/60" : "text-amber-600/60"}`}>
              ${profitUSD >= 0 ? "" : "-"}{Math.abs(profitUSD).toLocaleString()} USD
            </p>
          )}
        </div>
      </div>

      {/* Expense Category Breakdown */}
      {catBreakdown.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold mb-3">Expense Breakdown</h3>
          <div className="space-y-2">
            {catBreakdown.map((c) => (
              <div key={c.value} className="flex items-center gap-3">
                <span className="text-sm shrink-0">{c.emoji}</span>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex-1">{c.label}</span>
                <span className="text-xs font-mono text-slate-500">{c.count} items</span>
                <div className="w-32 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${Math.min(100, (c.total / expensesZAR) * 100)}%` }} />
                </div>
                <span className="text-xs font-bold font-mono text-slate-900 dark:text-white w-24 text-right">R {c.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month invoices list */}
      {monthInvoices.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold mb-3">Invoices This Month</h3>
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {monthInvoices.map((inv) => {
              const total = (inv.items || []).reduce((s, it) => s + (it.quantity || 0) * (it.rate || 0), 0);
              return (
                <div key={inv.id} className="flex items-center justify-between py-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{inv.invoiceNumber}</span>
                    <span className="text-xs text-slate-500 ml-2">{inv.clientName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{symbol(inv.currency)} {total.toLocaleString()}</span>
                    <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${inv.status === "Paid" ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400" : inv.status === "Overdue" ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>{inv.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PRINT-ONLY: Monthly Statement */}
      <div ref={monthlyRef} style={{ display: activePrintTarget === "current" ? "block" : "none" }} className="bg-white text-slate-900" data-print-mode="monthly-statement">
        <div className="p-10">
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            <Logo variant="full" iconSize={48} text={SITE_CONFIG.tradingName} subtext={`by ${SITE_CONFIG.developerName}`} />
            <div className="text-right">
              <h1 className="text-2xl font-black">Monthly Statement</h1>
              <p className="text-sm text-slate-600 mt-1">{monthLabel(selectedMonth)}</p>
              <p className="text-xs text-slate-400 mt-1">Generated {now}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-4 border-2 border-emerald-300 rounded-xl">
              <h3 className="text-xs font-bold text-emerald-700 uppercase mb-1">Total Income</h3>
              <p className="text-xl font-black text-emerald-700">R {incomeZAR.toLocaleString()}</p>
              {incomeUSD > 0 && <p className="text-sm text-emerald-600">+ ${incomeUSD.toLocaleString()} USD</p>}
              <p className="text-[10px] text-slate-500 mt-1">{monthInvoices.length} invoice(s)</p>
            </div>
            <div className="p-4 border-2 border-red-300 rounded-xl">
              <h3 className="text-xs font-bold text-red-700 uppercase mb-1">Total Expenses</h3>
              <p className="text-xl font-black text-red-700">R {expensesZAR.toLocaleString()}</p>
              {expensesUSD > 0 && <p className="text-sm text-red-600">+ ${expensesUSD.toLocaleString()} USD</p>}
              <p className="text-[10px] text-slate-500 mt-1">{monthExpenses.length} entry/entries</p>
            </div>
            <div className={`p-4 border-2 rounded-xl ${profitZAR >= 0 ? "border-blue-300" : "border-amber-300"}`}>
              <h3 className={`text-xs font-bold uppercase mb-1 ${profitZAR >= 0 ? "text-blue-700" : "text-amber-700"}`}>Net Profit</h3>
              <p className={`text-xl font-black ${profitZAR >= 0 ? "text-blue-700" : "text-amber-700"}`}>{profitZAR >= 0 ? "R" : "-R"} {Math.abs(profitZAR).toLocaleString()}</p>
              {incomeUSD > 0 && <p className={`text-sm ${profitZAR >= 0 ? "text-blue-600" : "text-amber-600"}`}>${Math.abs(profitUSD).toLocaleString()} USD</p>}
            </div>
          </div>

          {/* Income detail */}
          {monthInvoices.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase tracking-wider mb-3 border-b border-slate-300 pb-1">Income</h3>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100 font-bold">
                    <th className="p-2 text-left">Invoice</th>
                    <th className="p-2 text-left">Client</th>
                    <th className="p-2 text-right">Amount</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {monthInvoices.map((inv) => {
                    const total = (inv.items || []).reduce((s, it) => s + (it.quantity || 0) * (it.rate || 0), 0);
                    return (
                      <tr key={inv.id}>
                        <td className="p-2 font-bold">{inv.invoiceNumber}</td>
                        <td className="p-2">{inv.clientName}</td>
                        <td className="p-2 text-right font-mono font-bold">{symbol(inv.currency)} {total.toLocaleString()}</td>
                        <td className="p-2 text-center">{inv.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Expense detail */}
          {monthExpenses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-black uppercase tracking-wider mb-3 border-b border-slate-300 pb-1">Expenses</h3>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 bg-slate-100 font-bold">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {monthExpenses.map((exp) => {
                    const cat = EXPENSE_CATEGORIES.find((c) => c.value === exp.category);
                    return (
                      <tr key={exp.id}>
                        <td className="p-2 font-mono">{exp.date}</td>
                        <td className="p-2">{exp.description}{exp.vendor ? ` (${exp.vendor})` : ""}</td>
                        <td className="p-2">{cat?.emoji} {cat?.label}</td>
                        <td className="p-2 text-right font-mono font-bold text-red-700">{symbol(exp.currency)} {exp.amount.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="text-[10px] text-slate-400 border-t border-slate-300 pt-3 mt-8">
            {SITE_CONFIG.brandLine} — Monthly Statement for {monthLabel(selectedMonth)} • Generated {now}
          </div>
        </div>
      </div>

      {/* PRINT-ONLY: Year-to-Date Summary */}
      <div ref={ytdRef} style={{ display: activePrintTarget === "year" ? "block" : "none" }} className="bg-white text-slate-900" data-print-mode="ytd-summary">
        <div className="p-10">
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
            <Logo variant="full" iconSize={48} text={SITE_CONFIG.tradingName} subtext={`by ${SITE_CONFIG.developerName}`} />
            <div className="text-right">
              <h1 className="text-2xl font-black">Year-to-Date Summary</h1>
              <p className="text-sm text-slate-600 mt-1">{yearKey}</p>
              <p className="text-xs text-slate-400 mt-1">Generated {now}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="p-4 border-2 border-emerald-300 rounded-xl">
              <h3 className="text-xs font-bold text-emerald-700 uppercase mb-1">YTD Income</h3>
              <p className="text-xl font-black text-emerald-700">R {ytdIncomeZAR.toLocaleString()}</p>
              {ytdIncomeUSD > 0 && <p className="text-sm text-emerald-600">+ ${ytdIncomeUSD.toLocaleString()} USD</p>}
            </div>
            <div className="p-4 border-2 border-red-300 rounded-xl">
              <h3 className="text-xs font-bold text-red-700 uppercase mb-1">YTD Expenses</h3>
              <p className="text-xl font-black text-red-700">R {ytdExpensesZAR.toLocaleString()}</p>
              {ytdExpensesUSD > 0 && <p className="text-sm text-red-600">+ ${ytdExpensesUSD.toLocaleString()} USD</p>}
            </div>
            <div className={`p-4 border-2 rounded-xl ${(ytdIncomeZAR - ytdExpensesZAR) >= 0 ? "border-blue-300" : "border-amber-300"}`}>
              <h3 className={`text-xs font-bold uppercase mb-1 ${(ytdIncomeZAR - ytdExpensesZAR) >= 0 ? "text-blue-700" : "text-amber-700"}`}>YTD Profit</h3>
              <p className={`text-xl font-black ${(ytdIncomeZAR - ytdExpensesZAR) >= 0 ? "text-blue-700" : "text-amber-700"}`}>
                {(ytdIncomeZAR - ytdExpensesZAR) >= 0 ? "R" : "-R"} {Math.abs(ytdIncomeZAR - ytdExpensesZAR).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Monthly breakdown table */}
          <h3 className="text-sm font-black uppercase tracking-wider mb-3 border-b border-slate-300 pb-1">Monthly Breakdown</h3>
          <table className="w-full text-xs border-collapse mb-8">
            <thead>
              <tr className="border-b-2 border-slate-900 bg-slate-100 font-bold">
                <th className="p-2 text-left">Month</th>
                <th className="p-2 text-right">Income</th>
                <th className="p-2 text-right">Expenses</th>
                <th className="p-2 text-right">Profit/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {allMonths.filter((m) => m.startsWith(yearKey)).map((m) => {
                const mInv = invoices.filter((inv) => monthKey(inv.issueDate) === m && inv.currency === "ZAR")
                  .reduce((s, i) => s + (i.items || []).reduce((a, it) => a + (it.quantity || 0) * (it.rate || 0), 0), 0);
                const mExp = expenses.filter((e) => monthKey(e.date) === m && e.currency === "ZAR")
                  .reduce((s, e) => s + e.amount, 0);
                return (
                  <tr key={m}>
                    <td className="p-2 font-bold">{monthLabel(m)}</td>
                    <td className="p-2 text-right font-mono text-emerald-700">R {mInv.toLocaleString()}</td>
                    <td className="p-2 text-right font-mono text-red-700">R {mExp.toLocaleString()}</td>
                    <td className={`p-2 text-right font-mono font-bold ${(mInv - mExp) >= 0 ? "text-blue-700" : "text-amber-700"}`}>
                      R {Math.abs(mInv - mExp).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="text-[10px] text-slate-400 border-t border-slate-300 pt-3">
            {SITE_CONFIG.brandLine} — Year-to-Date {yearKey} • Generated {now}
          </div>
        </div>
      </div>
    </div>
  );
}
