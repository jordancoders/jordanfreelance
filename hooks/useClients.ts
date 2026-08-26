"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { fetchClients, addClient, editClient, removeClient } from "@/app/actions/clients";
import { normalizeClientAccount } from "@/lib/clientPortal";
import type { ClientPortalAccount } from "@/lib/types";

export function useClients() {
  const [clients, setClients] = useState<ClientPortalAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loaded = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClients();
      setClients(data.map(normalizeClientAccount));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load clients");
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

  const create = useCallback(async (client: ClientPortalAccount) => {
    const created = await addClient(client);
    setClients((prev) => [created, ...prev]);
    return created;
  }, []);

  const update = useCallback(async (id: string, patch: Partial<ClientPortalAccount>) => {
    const updated = await editClient(id, patch);
    if (updated) {
      setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    const ok = await removeClient(id);
    if (ok) setClients((prev) => prev.filter((c) => c.id !== id));
    return ok;
  }, []);

  return { clients, loading, error, reload: load, create, update, remove };
}
