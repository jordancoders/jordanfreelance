"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck, ArrowRight, Phone, MessageSquareQuote, FileCode, Layers, Info, Star, Home, Sparkles } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { SITE_CONFIG } from "@/data/portfolioData";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/process", label: "Process", icon: Sparkles },
    { href: "/projects", label: "Portfolio", icon: FileCode },
    { href: "/services", label: "Services", icon: Layers },
    { href: "/about", label: "About Jordan", icon: Info },
    { href: "/testimonials", label: "Testimonials", icon: Star },
    { href: "/contact", label: "Request Quote", icon: MessageSquareQuote },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  // Lock body scroll when drawer is open & handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const drawerContent = (
    <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Solid Opaque Drawer Sheet */}
      <div role="dialog" aria-modal="true" aria-label="Navigation menu" className="relative w-[85vw] max-w-xs sm:max-w-sm bg-white dark:bg-[#080F1D] h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between z-10 transition-transform duration-200">
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
            <div className="text-slate-900 dark:text-white">
              <Logo
                variant="full"
                iconSize={32}
                text={SITE_CONFIG.tradingName}
                subtext={`by ${SITE_CONFIG.developerName}`}
              />
            </div>

            <button
              id="close-drawer-btn"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close navigation drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Links */}
          <nav aria-label="Mobile navigation" className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-230px)]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  id={`drawer-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? "bg-orange-500 text-white shadow-md"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
                    <span>{link.label}</span>
                  </div>
                  {active && <span className="w-2 h-2 rounded-full bg-white"></span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 space-y-2.5">
          <Link
            id="drawer-nav-quote-btn"
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all text-center"
          >
            Request a Custom Quote →
          </Link>

          <a
            id="drawer-nav-whatsapp-btn"
            href={SITE_CONFIG.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold text-xs text-center"
          >
            <Phone className="w-4 h-4" />
            WhatsApp: {SITE_CONFIG.whatsappFormatted}
          </a>

          <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 pt-1">
            AI-Orchestrated • Human Quality Gate on Every Line
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#070D17]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link id="header-logo-link" href="/" className="group">
          <div className="text-slate-900 dark:text-white group-hover:scale-105 transition-transform">
            <Logo variant="full" iconSize={40} />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
              href={link.href}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA + Theme Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Link
            id="header-cta-quote-btn"
            href="/contact"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-sm hover:shadow transition-all group"
          >
            Request a Quote
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors border border-slate-200 dark:border-slate-800"
            aria-label="Toggle navigation drawer"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Render drawer via portal on document.body to break out of backdrop-filter sticky header containing block */}
      {mounted && mobileMenuOpen && createPortal(drawerContent, document.body)}
    </header>
  );
}

