"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { fetchReviews, addReview, editReview, removeReview } from "@/app/actions/reviews";
import type { ClientReview } from "@/lib/types";

export function useReviews() {
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loaded = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReviews();
      setReviews(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reviews");
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

  const create = useCallback(async (review: ClientReview) => {
    const created = await addReview(review);
    setReviews((prev) => [created, ...prev]);
    return created;
  }, []);

  const update = useCallback(async (id: string, patch: Partial<ClientReview>) => {
    const updated = await editReview(id, patch);
    if (updated) {
      setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    const ok = await removeReview(id);
    if (ok) setReviews((prev) => prev.filter((r) => r.id !== id));
    return ok;
  }, []);

  return { reviews, loading, error, reload: load, create, update, remove };
}
