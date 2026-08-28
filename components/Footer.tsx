import Link from "next/link";
import { ShieldCheck, Mail, Phone, Lock, FileText } from "lucide-react";
import { SITE_CONFIG } from "@/data/portfolioData";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

export default function Footer() {
  return (
    <footer className="bg-[#0A1628] text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link id="footer-logo-link" href="/">
              <div className="text-white">
                <Logo
                  variant="full"
                  iconSize={40}
                  text={SITE_CONFIG.tradingName}
                  subtext={`by ${SITE_CONFIG.developerName}`}
                />
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Agency-grade full-stack web apps and dashboards for South African SMEs. AI-orchestrated with a human quality gate, delivered with a 48-hour staging demo, full POPIA compliance, and zero-risk quotes.
            </p>

            <div className="flex items-center gap-3 text-xs text-emerald-400 font-medium bg-emerald-950/50 border border-emerald-800/60 px-3 py-2 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Full POPIA Compliance & 7-Day Data Destruction</span>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link id="footer-link-home" href="/" className="hover:text-orange-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link id="footer-link-process" href="/process" className="hover:text-orange-400 transition-colors">Process</Link>
              </li>
              <li>
                <Link id="footer-link-projects" href="/projects" className="hover:text-orange-400 transition-colors">Portfolio & Work</Link>
              </li>
              <li>
                <Link id="footer-link-services" href="/services" className="hover:text-orange-400 transition-colors">Services & Pricing</Link>
              </li>
              <li>
                <Link id="footer-link-about" href="/about" className="hover:text-orange-400 transition-colors">About Jordan</Link>
              </li>
              <li>
                <Link id="footer-link-testimonials" href="/testimonials" className="hover:text-orange-400 transition-colors">Client Reviews</Link>
              </li>
              <li>
                <Link id="footer-link-international" href="/international" className="hover:text-orange-400 transition-colors">International Clients</Link>
              </li>
              <li>
                <Link id="footer-link-contact" href="/contact" className="hover:text-orange-400 transition-colors">Request a Quote</Link>
              </li>
            </ul>
          </div>

          {/* Legal Documents */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-orange-400" />
              Legal & POPIA
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link id="footer-link-privacy" href="/privacy" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link id="footer-link-terms" href="/terms" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link id="footer-link-popia" href="/popia" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  POPIA Policy
                </Link>
              </li>
              <li>
                <Link id="footer-link-invoice" href="/invoice-template" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Sample Invoice Package
                </Link>
              </li>
              <li>
                <Link id="footer-link-dpa" href="/dpa" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  DPA Template (International)
                </Link>
              </li>
              <li>
                <Link id="footer-link-guarantee" href="/guarantee" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Guarantee & Refund Policy
                </Link>
              </li>

            </ul>
          </div>

          {/* Direct Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <div className="space-y-3 text-sm">
              <a
                id="footer-contact-whatsapp"
                href={SITE_CONFIG.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: {SITE_CONFIG.whatsappFormatted}</span>
              </a>
              <a
                id="footer-contact-email"
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center gap-2 text-slate-300 hover:text-orange-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Email: {SITE_CONFIG.email}</span>
              </a>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                Response Time: <span className="text-slate-300 font-medium">{SITE_CONFIG.responseHours}</span>
              </p>
              <p className="text-xs text-slate-500">
                Location: <span className="text-slate-300 font-medium">{SITE_CONFIG.location}</span>
              </p>
              <div className="pt-1">
                <SocialLinks />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {SITE_CONFIG.brandLine}. All rights reserved.</p>
          <p className="flex flex-wrap items-center justify-center gap-2">
            <span>Built in South Africa 🇿🇦</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Built with: Next.js 15 • Tailwind v4 • TypeScript • Orchestrated via AI with human quality gates.</span>
          </p>

        </div>
      </div>
    </footer>
  );
}
