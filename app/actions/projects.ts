"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  getProjects,
  getProject,
  getPublishedProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/db";
import type { Project } from "@/lib/types";

export async function fetchProjects(): Promise<Project[]> {
  if (!(await requireAdmin())) return [];
  return getProjects();
}

export async function fetchPublishedProjects(): Promise<Project[]> {
  return getPublishedProjects();
}

export async function fetchProject(id: string): Promise<Project | null> {
  if (!(await requireAdmin())) return null;
  return getProject(id);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  return getProjectBySlug(slug);
}

export async function addProject(project: Project): Promise<Project> {
  if (!(await requireAdmin())) throw new Error("Admin session required");
  const created = await createProject(project);
  revalidatePath("/admin");
  revalidatePath("/projects");
  revalidatePath(`/projects/${created.slug}`);
  return created;
}

export async function editProject(id: string, patch: Partial<Project>): Promise<Project | null> {
  if (!(await requireAdmin())) return null;
  const updated = await updateProject(id, patch);
  revalidatePath("/admin");
  revalidatePath("/projects");
  if (updated?.slug) revalidatePath(`/projects/${updated.slug}`);
  revalidatePath("/");
  return updated;
}

export async function removeProject(id: string): Promise<boolean> {
  if (!(await requireAdmin())) return false;
  const ok = await deleteProject(id);
  if (ok) {
    revalidatePath("/admin");
    revalidatePath("/projects");
    revalidatePath("/");
  }
  return ok;
}
