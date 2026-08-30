"use client";

import { useState, useMemo } from "react";
import { Calendar, TrendingUp, TrendingDown, DollarSign, FileText } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";
import type { Invoice, ExpenseEntry } from "@/lib/types";
import { EXPENSE_CATEGORIES } from "@/lib/types";

interface MonthlyStatementsProps {
  invoices: Invoice[];
  expenses: ExpenseEntry[];
}

function monthKey(d: string) { return d.slice(0, 7); }
function monthLabel(m: string) {
  const d = new Date(m + "-01");
  return d.toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
}

export default function MonthlyStatements({ invoices, expenses }: MonthlyStatementsProps) {
  const months = useMemo(() => {
    const set = new Set<string>();
    invoices.forEach((inv) => set.add(monthKey(inv.issueDate)));
    expenses.forEach((exp) => set.add(monthKey(exp.date)));
    return Array.from(set).sort().reverse();
  }, [invoices, expenses]);

  const [selectedMonth, setSelectedMonth] = useState(months[0] || "");


  const monthInvoices = invoices.filter((inv) => monthKey(inv.issueDate) === selectedMonth);
  const monthExpenses = expenses.filter((exp) => monthKey(exp.date) === selectedMonth);

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

  const handleStatementPDF = async () => {
    const { downloadMonthlyStatementPDF } = await import("@/lib/generatePDF");
    downloadMonthlyStatementPDF({
      monthLabel: monthLabel(selectedMonth),
      incomeZAR, incomeUSD, expensesZAR, expensesUSD, profitZAR, profitUSD,
      monthInvoices: monthInvoices.map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        amount: (inv.items || []).reduce((a, it) => a + (it.quantity || 0) * (it.rate || 0), 0),
        currency: inv.currency,
      })),
      monthExpenses: monthExpenses.map((e) => ({
        description: e.description,
        category: e.category,
        amount: e.amount,
        currency: e.currency,
      })),
    });
  };

  const handleYTDPDF = async () => {
    const { downloadYTDSummaryPDF } = await import("@/lib/generatePDF");
    downloadYTDSummaryPDF({
      year: yearKey,
      ytdIncomeZAR, ytdIncomeUSD, ytdExpensesZAR, ytdExpensesUSD,
      ytdProfitZAR: ytdIncomeZAR - ytdExpensesZAR,
      ytdProfitUSD: ytdIncomeUSD - ytdExpensesUSD,
      allInvoices: yearInvoices.map((inv) => ({
        invoiceNumber: inv.invoiceNumber,
        amount: (inv.items || []).reduce((a, it) => a + (it.quantity || 0) * (it.rate || 0), 0),
        currency: inv.currency,
        date: inv.issueDate,
      })),
      allExpenses: yearExpenses.map((e) => ({
        description: e.description,
        category: e.category,
        amount: e.amount,
        currency: e.currency,
        date: e.date,
      })),
    });
  };

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
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0D1A2D] text-sm font-mono"
          >
            {months.map((m) => (
              <option key={m} value={m}>{monthLabel(m)}</option>
            ))}
          </select>
          <button onClick={handleStatementPDF} className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> Download Statement
          </button>
          <button onClick={handleYTDPDF} className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> YTD Summary
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-1">Income (ZAR)</div>
          <div className="text-lg font-black text-emerald-600">R {incomeZAR.toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-1">Expenses (ZAR)</div>
          <div className="text-lg font-black text-red-600">R {expensesZAR.toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-1">Profit (ZAR)</div>
          <div className={`text-lg font-black ${profitZAR >= 0 ? "text-emerald-600" : "text-red-600"}`}>R {profitZAR.toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-500 mb-1">Profit (USD)</div>
          <div className={`text-lg font-black ${profitUSD >= 0 ? "text-emerald-600" : "text-red-600"}`}>$ {profitUSD.toLocaleString()}</div>
        </div>
      </div>

      {/* Expense Breakdown */}
      {catBreakdown.length > 0 && (
        <div className="bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-orange-500" /> Expense Breakdown — {monthLabel(selectedMonth)}
          </h3>
          <div className="space-y-2">
            {catBreakdown.map((cat) => (
              <div key={cat.value} className="flex items-center gap-3">
                <span className="text-xs text-slate-500 w-28">{cat.label}</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{ width: `${Math.min(100, (cat.total / expensesZAR) * 100)}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-700 dark:text-slate-300 w-20 text-right">
                  R {cat.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Statement Print Sections */}
      <div className="bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" /> Monthly Detail — {monthLabel(selectedMonth)}
        </h3>
        {monthInvoices.length === 0 && monthExpenses.length === 0 && (
          <p className="text-xs text-slate-400">No data for this month.</p>
        )}
        {monthInvoices.map((inv) => (
          <div key={inv.id} className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="font-mono text-slate-500">{inv.invoiceNumber}</span>
            <span className="font-bold">{inv.currency === "USD" ? "$" : "R"} {(inv.items || []).reduce((a, it) => a + (it.quantity || 0) * (it.rate || 0), 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}