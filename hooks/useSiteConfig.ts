"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchConfig, updateConfig } from "@/app/actions/config";
import { SITE_CONFIG } from "@/data/portfolioData";
import type { SiteConfig } from "@/lib/types";

export interface SocialLinkUrls {
  linkedinUrl: string;
  githubUrl: string;
  facebookUrl: string;
  discordUrl: string;
  repoUrl: string;
}

export function useSiteConfig() {
  const [config, setConfig] = useState(SITE_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig()
      .then((cloud) => {
        if (!cloud) return;
        const social = cloud.socialLinks ?? {};
        setConfig((prev) => ({
          ...prev,
          googleFormUrl: cloud.googleFormUrl || prev.googleFormUrl,
          linkedinUrl: social.linkedinUrl || prev.linkedinUrl,
          githubUrl: social.githubUrl || prev.githubUrl,
          facebookUrl: social.facebookUrl || prev.facebookUrl,
          discordUrl: social.discordUrl || prev.discordUrl,
          repoUrl: social.repoUrl || prev.repoUrl,
        }));
      })
      .catch((err) => {
        if (process.env.NODE_ENV === "development") console.error("[useSiteConfig] fetch failed:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const save = useCallback(async (patch: {
    googleFormUrl?: string;
    socialLinks?: Partial<SocialLinkUrls>;
  }) => {
    const current = await fetchConfig();
    const curSocial = current?.socialLinks ?? {};
    const patchSocial = patch.socialLinks ?? {};
    const merged: SiteConfig = {
      googleFormUrl: patch.googleFormUrl ?? current?.googleFormUrl ?? "",
      socialLinks: {
        linkedinUrl: patchSocial.linkedinUrl ?? curSocial.linkedinUrl ?? "",
        githubUrl: patchSocial.githubUrl ?? curSocial.githubUrl ?? "",
        facebookUrl: patchSocial.facebookUrl ?? curSocial.facebookUrl ?? "",
        discordUrl: patchSocial.discordUrl ?? curSocial.discordUrl ?? "",
        repoUrl: patchSocial.repoUrl ?? curSocial.repoUrl ?? "",
      },
    };
    const saved = await updateConfig(merged);
    const savedSocial = saved.socialLinks ?? {};
    setConfig((prev) => ({
      ...prev,
      googleFormUrl: saved.googleFormUrl || prev.googleFormUrl,
      linkedinUrl: savedSocial.linkedinUrl || prev.linkedinUrl,
      githubUrl: savedSocial.githubUrl || prev.githubUrl,
      facebookUrl: savedSocial.facebookUrl || prev.facebookUrl,
      discordUrl: savedSocial.discordUrl || prev.discordUrl,
      repoUrl: savedSocial.repoUrl || prev.repoUrl,
    }));
    return saved;
  }, []);

  return { config, loading, save };
}
