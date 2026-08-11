"use client";

import { useState } from "react";
import { LayoutDashboard, Calendar, Users, ShieldCheck, Eye, X, CheckCircle2, ArrowUpRight, Sparkles } from "lucide-react";

export default function TourismDashboardPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "guides" | "popia">("overview");

  return (
    <>
      {/* Trigger Card */}
      <div className="relative group overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl transition-all hover:border-orange-500/60">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-500/40">
                Interactive Portfolio Demo
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                Sample Build
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              SME Tourism & Booking Dashboard
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Live demo: Tourism Operations Portal (sample build). Click through 9 pages of a working booking, dispatch, and POPIA data vault — this is exactly what your 48-hour staging demo will feel like.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {["Next.js 15", "Tailwind CSS v4", "Node.js", "TypeScript", "POPIA-Aligned Handling"].map((t) => (
                <span key={t} className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md text-xs font-mono border border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-3 w-full lg:w-auto">
            <button
              id="open-tourism-preview-btn"
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg transition-all group/btn"
            >
              <Eye className="w-5 h-5" />
              Launch Live Staging Preview Demo
              <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
            <span className="text-xs text-center text-slate-400">
              Sample build — this is what your 48h demo will feel like
            </span>
          </div>
        </div>
      </div>

      {/* Full Modal Demo */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in-50">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-850 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-mono text-slate-400 ml-2 hidden sm:inline">
                  demo://jordan-peters-tourism-dashboard (sample preview)
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800">
                  Demo Preview
                </span>
              </div>

              <button
                id="close-tourism-preview-btn"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Simulated Staging Bar */}
            <div className="bg-orange-950/80 border-b border-orange-800/60 px-6 py-2 flex items-center justify-between text-xs text-orange-200">
              <span className="font-semibold flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Staging Code Protected: Minified JS build, source maps disabled, POPIA auto-vault active.
              </span>
              <span className="font-mono text-orange-300 hidden md:inline">
                Build: v1.4.2-staging (Jordan Peters)
              </span>
            </div>

            {/* Dashboard Workspace */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#070D17]">
              
              {/* Internal Tab Bar */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
                {[
                  { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
                  { id: "bookings", label: "Tour Bookings (142 Active)", icon: Calendar },
                  { id: "guides", label: "Guide Dispatch", icon: Users },
                  { id: "popia", label: "POPIA Passport Vault", icon: ShieldCheck },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as "overview" | "bookings" | "guides" | "popia")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        activeTab === tab.id
                          ? "bg-orange-500 text-white shadow"
                          : "bg-slate-800/60 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-in fade-in-50">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                      <span className="text-xs text-slate-400">Monthly Revenue</span>
                      <div className="text-2xl font-black text-emerald-400 mt-1">R 248,500</div>
                      <span className="text-[11px] text-emerald-500">+18% vs last month</span>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                      <span className="text-xs text-slate-400">Confirmed Safaris</span>
                      <div className="text-2xl font-black text-white mt-1">94 Tours</div>
                      <span className="text-[11px] text-orange-400">12 pending guide dispatch</span>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                      <span className="text-xs text-slate-400">Client Satisfaction</span>
                      <div className="text-2xl font-black text-amber-400 mt-1">4.9 / 5.0</div>
                      <span className="text-[11px] text-slate-400">128 direct reviews</span>
                    </div>

                    <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
                      <span className="text-xs text-slate-400">POPIA Vault Status</span>
                      <div className="text-2xl font-black text-emerald-400 mt-1">Compliant</div>
                      <span className="text-[11px] text-slate-400">7-day cleanup scheduled</span>
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/60 space-y-3">
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-500" />
                      Recent Tour Operator Bookings (Live Sample Feed)
                    </h4>
                    <div className="space-y-2 text-xs">
                      {[
                        { client: "Kruger Sunset Safari (Group 6)", guide: "Sipho D.", status: "Confirmed", price: "R 18,400", time: "Today 14:00" },
                        { client: "Table Mountain & Cape Point (Private)", guide: "Anika K.", status: "In Transit", price: "R 9,200", time: "Today 09:30" },
                        { client: "Winelands Gourmet Express", guide: "Johan V.", status: "Staging Approved", price: "R 14,800", time: "Tomorrow 10:00" },
                      ].map((b, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                          <div>
                            <span className="font-bold text-white block">{b.client}</span>
                            <span className="text-slate-400">Guide: {b.guide} • {b.time}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-400 block">{b.price}</span>
                            <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">{b.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Bookings */}
              {activeTab === "bookings" && (
                <div className="space-y-4 animate-in fade-in-50">
                  <h4 className="font-bold text-base text-white">Bookings & Dispatch Matrix (Page 2 of 9)</h4>
                  <p className="text-xs text-slate-400">
                    Allows tour agency receptionists to schedule safari vehicles, verify deposits via PayPal/EFT, and send WhatsApp route directions automatically.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 space-y-2">
                    <div className="flex justify-between font-bold text-slate-200 border-b border-slate-700 pb-2">
                      <span>Ref #</span>
                      <span>Tour Name</span>
                      <span>Dep. Received</span>
                      <span>Dispatch Status</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                      <span className="font-mono text-orange-400">TRM-8840</span>
                      <span>Garden Route 3-Day Coastal</span>
                      <span className="text-emerald-400">R 12,000 (70%)</span>
                      <span className="bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded">Ready for Guide</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                      <span className="font-mono text-orange-400">TRM-8841</span>
                      <span>Drakensberg Hiking Expedition</span>
                      <span className="text-emerald-400">R 8,500 (60%)</span>
                      <span className="bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded">Pending 48h Demo</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Guides */}
              {activeTab === "guides" && (
                <div className="space-y-4 animate-in fade-in-50">
                  <h4 className="font-bold text-base text-white">Tour Guide Mobile Allocation (Page 5 of 9)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                      <span className="text-xs font-bold text-orange-400">Guide: Sipho D.</span>
                      <p className="text-xs text-slate-300">Vehicle: Toyota Quantum 14-Seater (CA 884-902)</p>
                      <span className="inline-block text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">Active Duty • Kruger Route</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2">
                      <span className="text-xs font-bold text-orange-400">Guide: Anika K.</span>
                      <p className="text-xs text-slate-300">Vehicle: Mercedes Sprinter VIP (CA 991-304)</p>
                      <span className="inline-block text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">Active Duty • Winelands Route</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: POPIA Vault */}
              {activeTab === "popia" && (
                <div className="space-y-4 animate-in fade-in-50 bg-slate-800/90 p-5 rounded-xl border border-emerald-500/40">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                    <ShieldCheck className="w-5 h-5" />
                    POPIA Automated Passport & ID Vault (Page 9 of 9)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Under South African POPIA law, storing tourist passport numbers indefinitely exposes operators to R10M fines. This custom module automatically redacts and shreds sensitive client identity records 7 days post-tour.
                  </p>
                  <div className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-emerald-300 space-y-1">
                    <div>[POPIA AUDIT LOG] Client #9921 Passport Data Encrypted (AES-256)</div>
                    <div>[SCHEDULED TASK] Auto-Erasure trigger set for 7 calendar days post-payment.</div>
                    <div className="text-orange-400">[CERTIFICATE] Certificate #CDD-20260808-091 ready for download.</div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer CTA */}
            <div className="p-4 bg-slate-850 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
              <span>Like this quality? Jordan Peters can build a similar dashboard for your SME.</span>
              <button
                id="preview-quote-redirect-btn"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = "/contact?project=tourism-dashboard";
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
              >
                Get a Custom Quote for Your Dashboard →
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
