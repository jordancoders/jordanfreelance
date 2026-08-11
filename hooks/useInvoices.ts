"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { fetchInvoices, addInvoice, editInvoice, removeInvoice } from "@/app/actions/invoices";
import type { Invoice } from "@/lib/types";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loaded = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInvoices();
      setInvoices(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      void load();
    }
  }, [load]);

  const create = useCallback(async (invoice: Invoice) => {
    const created = await addInvoice(invoice);
    setInvoices((prev) => [created, ...prev]);
    return created;
  }, []);

  const update = useCallback(async (id: string, patch: Partial<Invoice>) => {
    const updated = await editInvoice(id, patch);
    if (updated) {
      setInvoices((prev) => prev.map((inv) => (inv.id === id ? updated : inv)));
    }
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    const ok = await removeInvoice(id);
    if (ok) setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    return ok;
  }, []);

  return { invoices, loading, error, reload: load, create, update, remove };
}
