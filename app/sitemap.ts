import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/data/portfolioData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.siteUrl;

  const staticPages = [
    "",
    "/projects",
    "/process",
    "/services",
    "/about",
    "/testimonials",
    "/contact",
    "/privacy",
    "/terms",
    "/popia",
    "/invoice-template",
    "/international",
    "/dpa",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Attempt to fetch projects from MongoDB; fall back to static-only sitemap if unavailable
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not configured");
    }
    const { getPublishedProjects } = await import("@/lib/db");
    const projects = await getPublishedProjects();
    const projectPages = projects.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
    return [...staticPages, ...projectPages];
  } catch {
    // MongoDB unavailable at build time — return static pages only
    return staticPages;
  }
}
