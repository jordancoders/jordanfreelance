"use client";

import { Github, Linkedin } from "lucide-react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/**
 * Renders social profile links (GitHub, LinkedIn, Facebook, Discord) from the
 * admin-editable site config. Links left empty in the Admin Studio are hidden.
 */
export default function SocialLinks({ className = "" }: { className?: string }) {
  const config = useSiteConfig();

  const links = [
    { href: config.githubUrl, label: "GitHub", icon: <Github className="w-4 h-4" /> },
    { href: config.linkedinUrl, label: "LinkedIn", icon: <Linkedin className="w-4 h-4" /> },
    { href: config.facebookUrl, label: "Facebook", icon: <FacebookIcon className="w-4 h-4" /> },
    { href: config.discordUrl, label: "Discord", icon: <DiscordIcon className="w-4 h-4" /> },
  ].filter((l) => l.href);

  if (links.length === 0) return null;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {links.map((link) => (
        <a
          key={link.label}
          id={`social-link-${link.label.toLowerCase()}`}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${link.label} profile`}
          className="w-9 h-9 rounded-xl bg-slate-800 dark:bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 dark:hover:bg-slate-700 border border-slate-700/60 flex items-center justify-center transition-all hover:scale-105 hover:border-orange-500/50"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}
