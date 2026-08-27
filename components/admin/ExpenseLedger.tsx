"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Trash2,
  Edit,
  Search,
  Filter,
  Upload,
  X,
  AlertCircle,
  Receipt,
  DollarSign,
} from "lucide-react";
import type { ExpenseEntry, ExpenseCategory } from "@/lib/types";
import { EXPENSE_CATEGORIES } from "@/lib/types";

interface ExpenseLedgerProps {
  expenses: ExpenseEntry[];
  onRefresh: () => void;
}

const symbol = (c: string) => (c === "USD" ? "$" : "R");

export default function ExpenseLedger({ expenses, onRefresh }: ExpenseLedgerProps) {
  const [filterCat, setFilterCat] = useState<ExpenseCategory | "all">("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formDesc, setFormDesc] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState<"ZAR" | "USD">("ZAR");
  const [formCategory, setFormCategory] = useState<ExpenseCategory>("other");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formVendor, setFormVendor] = useState("");
  const [formInvoiceRef, setFormInvoiceRef] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formReceipt, setFormReceipt] = useState<string | null>(null);

  const resetForm = () => {
    setFormDesc("");
    setFormAmount("");
    setFormCurrency("ZAR");
    setFormCategory("other");
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormVendor("");
    setFormInvoiceRef("");
    setFormNote("");
    setFormReceipt(null);
    setEditingId(null);
    setError("");
  };

  const startEdit = (exp: ExpenseEntry) => {
    setEditingId(exp.id);
    setFormDesc(exp.description);
    setFormAmount(String(exp.amount));
    setFormCurrency(exp.currency);
    setFormCategory(exp.category);
    setFormDate(exp.date);
    setFormVendor(exp.vendor || "");
    setFormInvoiceRef(exp.invoiceRef || "");
    setFormNote(exp.note || "");
    setFormReceipt(exp.receiptUrl || null);
    setShowForm(true);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Receipt must be under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setFormReceipt(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    setError("");
    const amount = Number(formAmount);
    if (!formDesc.trim()) { setError("Description is required."); return; }
    if (!amount || amount <= 0) { setError("Enter a valid amount."); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        description: formDesc.trim(),
        amount,
        currency: formCurrency,
        category: formCategory,
        date: formDate,
        vendor: formVendor.trim() || undefined,
        invoiceRef: formInvoiceRef.trim() || undefined,
        note: formNote.trim() || undefined,
        receiptUrl: formReceipt || undefined,
      };
      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/expenses", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Failed to save expense.");
        return;
      }
      resetForm();
      setShowForm(false);
      onRefresh();
    } catch {
      setError("Could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    try {
      await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      onRefresh();
    } catch { /* ignore */ }
  };

  // Derived data
  const months = [...new Set(expenses.map((e) => e.date.slice(0, 7)))].sort().reverse();

  const filtered = expenses.filter((e) => {
    if (filterCat !== "all" && e.category !== filterCat) return false;
    if (filterMonth !== "all" && !e.date.startsWith(filterMonth)) return false;
    if (search && !e.description.toLowerCase().includes(search.toLowerCase()) && !(e.vendor || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalFiltered = filtered.reduce((sum, e) => sum + e.amount, 0);
  const totalByCategory = EXPENSE_CATEGORIES.map((cat) => ({
    ...cat,
    total: filtered.filter((e) => e.category === cat.value).reduce((s, e) => s + e.amount, 0),
  })).filter((c) => c.total > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-500" />
            Expense Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track all business expenses. Total:{" "}
            <strong className="text-slate-900 dark:text-white font-mono">
              {symbol("ZAR")} {totalFiltered.toLocaleString()}
            </strong>{" "}
            ({filtered.length} entries)
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">{editingId ? "Edit Expense" : "New Expense"}</h3>
            <button onClick={() => { resetForm(); setShowForm(false); }} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Description *</label>
              <input value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="e.g. Vercel hosting monthly" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount *</label>
              <input type="number" min={0} step={0.01} value={formAmount} onChange={(e) => setFormAmount(e.target.value)} placeholder="0" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Currency</label>
              <select value={formCurrency} onChange={(e) => setFormCurrency(e.target.value as "ZAR" | "USD")} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm">
                <option value="ZAR">ZAR (R)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as ExpenseCategory)} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm">
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
              <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Vendor / Supplier</label>
              <input value={formVendor} onChange={(e) => setFormVendor(e.target.value)} placeholder="e.g. Vercel, AWS" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Invoice Ref</label>
              <input value={formInvoiceRef} onChange={(e) => setFormInvoiceRef(e.target.value)} placeholder="Link to client invoice" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Note</label>
            <input value={formNote} onChange={(e) => setFormNote(e.target.value)} placeholder="Optional note" className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-orange-500 text-[11px] font-medium text-slate-500 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              {formReceipt ? "Receipt attached ✓" : "Attach receipt"}
              <input type="file" accept="image/*,.pdf" className="sr-only" onChange={handleReceiptUpload} />
            </label>
            {formReceipt && (
              <button onClick={() => setFormReceipt(null)} className="text-[10px] text-red-500 hover:text-red-600 underline">Remove</button>
            )}
          </div>
          {error && (
            <p className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <button onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
            <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all disabled:opacity-60">
              {submitting ? "Saving…" : editingId ? "Update" : "Add Expense"}
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses…" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm" />
        </div>
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value as ExpenseCategory | "all")} className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm">
          <option value="all">All Categories</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
          ))}
        </select>
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm">
          <option value="all">All Months</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Category Breakdown */}
      {totalByCategory.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {totalByCategory.map((c) => (
            <div key={c.value} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-[10px] font-bold text-slate-500 uppercase">{c.emoji} {c.label}</p>
              <p className="text-sm font-extrabold font-mono text-slate-900 dark:text-white">{symbol("ZAR")} {c.total.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Expense List */}
      {filtered.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-400 bg-white dark:bg-[#0D1A2D] rounded-2xl border border-slate-200 dark:border-slate-800">
          {expenses.length === 0 ? "No expenses yet. Click \"Add Expense\" to start tracking." : "No expenses match your filters."}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0D1A2D] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {filtered.map((exp) => {
              const cat = EXPENSE_CATEGORIES.find((c) => c.value === exp.category);
              return (
                <div key={exp.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <span className="text-lg shrink-0">{cat?.emoji || "📦"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{exp.description}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {exp.date} {exp.vendor ? `· ${exp.vendor}` : ""} {exp.invoiceRef ? `· Ref: ${exp.invoiceRef}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold font-mono text-orange-600 dark:text-orange-400">
                      {symbol(exp.currency)} {exp.amount.toLocaleString()}
                    </p>
                    {exp.receiptUrl && (
                      <button onClick={() => window.open(exp.receiptUrl, "_blank")} className="text-[10px] text-blue-500 hover:text-blue-600 underline">Receipt ✓</button>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => startEdit(exp)} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(exp.id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-950 text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
