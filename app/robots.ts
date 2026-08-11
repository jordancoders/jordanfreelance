import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/data/portfolioData";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/client/"],
    },
    sitemap: `${SITE_CONFIG.siteUrl}/sitemap.xml`,
  };
}
