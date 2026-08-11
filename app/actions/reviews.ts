"use server";

import { revalidatePath } from "next/cache";
import {
  getReviews,
  getReview,
  getPublishedReviews,
  createReview,
  updateReview,
  deleteReview,
} from "@/lib/db";
import type { ClientReview } from "@/lib/types";

export async function fetchReviews(): Promise<ClientReview[]> {
  return getReviews();
}

export async function fetchPublishedReviews(): Promise<ClientReview[]> {
  return getPublishedReviews();
}

export async function fetchReview(id: string): Promise<ClientReview | null> {
  return getReview(id);
}

export async function addReview(review: ClientReview): Promise<ClientReview> {
  const created = await createReview(review);
  revalidatePath("/admin");
  revalidatePath("/testimonials");
  revalidatePath("/");
  return created;
}

export async function editReview(id: string, patch: Partial<ClientReview>): Promise<ClientReview | null> {
  const updated = await updateReview(id, patch);
  revalidatePath("/admin");
  revalidatePath("/testimonials");
  revalidatePath("/");
  return updated;
}

export async function removeReview(id: string): Promise<boolean> {
  const ok = await deleteReview(id);
  if (ok) {
    revalidatePath("/admin");
    revalidatePath("/testimonials");
    revalidatePath("/");
  }
  return ok;
}
