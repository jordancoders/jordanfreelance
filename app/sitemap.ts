import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/data/portfolioData";
import { getPublishedProjects } from "@/lib/db";

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

  const projects = await getPublishedProjects();
  const projectPages = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages];
}
