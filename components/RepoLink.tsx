"use client";

import { Github } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

/**
 * Renders the portfolio repository (GitHub) link from the admin-editable site
 * config. Falls back to the GitHub profile link when no repo is set, and hides
 * entirely when neither is configured.
 *
 * - variant="button" (default): pill button used on the About page.
 * - variant="link": plain inline text link used in the footer.
 */
export default function RepoLink({
  variant = "button",
}: {
  variant?: "button" | "link";
}) {
  const { config } = useSiteConfig();
  const href = config.repoUrl || config.githubUrl;

  if (!href) return null;

  if (variant === "link") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-400 hover:text-orange-400 transition-colors"
      >
        See the commit history on GitHub ↗
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-orange-500 transition-colors"
    >
      <Github className="w-3.5 h-3.5" />
      See the Full Commit History on GitHub ↗
    </a>
  );
}
