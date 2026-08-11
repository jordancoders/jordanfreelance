"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { fetchProjects, addProject, editProject, removeProject } from "@/app/actions/projects";
import type { Project } from "@/lib/types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loaded = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects();
      setProjects(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
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

  const create = useCallback(async (project: Project) => {
    const created = await addProject(project);
    setProjects((prev) => [created, ...prev]);
    return created;
  }, []);

  const update = useCallback(async (id: string, patch: Partial<Project>) => {
    const updated = await editProject(id, patch);
    if (updated) {
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
    return updated;
  }, []);

  const remove = useCallback(async (id: string) => {
    const ok = await removeProject(id);
    if (ok) setProjects((prev) => prev.filter((p) => p.id !== id));
    return ok;
  }, []);

  return { projects, loading, error, reload: load, create, update, remove };
}
