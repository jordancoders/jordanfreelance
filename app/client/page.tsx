"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, KeyRound, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_CONFIG } from "@/data/portfolioData";
import { loginClient } from "@/app/actions/auth";
import { parseInviteCard, CLIENT_SESSION_KEY } from "@/lib/clientPortal";

export default function ClientLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  // "Have an invite card?" box — paste the card to fill in your login
  const [cardOpen, setCardOpen] = useState(false);
  const [cardInput, setCardInput] = useState("");
  const [cardNotice, setCardNotice] = useState("");
  const [cardError, setCardError] = useState("");

  const handleUseCard = () => {
    setCardError("");
    setCardNotice("");
    const account = parseInviteCard(cardInput);
    if (!account) {
      setCardError("That doesn't look like a valid invite card. Copy the whole JPCARD1:… block from your invite message.");
      return;
    }
    setUsername(account.username);
    setPassword(account.password || "");
    try {
      localStorage.setItem(CLIENT_SESSION_KEY, cardInput.trim());
    } catch {
      // private mode — ignore
    }
    if (account.status !== "approved") {
      setCardNotice(`Invite card recognised for ${account.clientName || account.username} — your portal is still awaiting approval, so you can't log in just yet.`);
    } else {
      setCardNotice(`Invite card recognised — username filled in. Click “Open My Dashboard” to log in.`);
    }
    setCardOpen(false);
  };

  // If already logged in (httpOnly session cookie), go straight to the dashboard.
  useEffect(() => {
    fetch("/api/client/auth-check")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) router.replace("/client/dashboard");
      })
      .catch(() => {});
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    try {
      const result = await loginClient(username.trim(), password);
      if (result.success) {
        router.push("/client/dashboard");
      } else {
        setError(result.error || "Invalid username or password.");
        setLoading(false);
      }
    } catch {
      setError("Could not reach the server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: intro */}
            <div className="space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Private Client Portal
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Welcome to your project portal
              </h1>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Track your build live, review your quote, and sign your declaration — all in one
                private place. No admin dashboard needed.
              </p>

              <div className="space-y-3 text-sm">
                {[
                  { icon: Sparkles, title: "Live build tracker", desc: "See exactly where your project is — kick-off, staging demo, revisions, handover." },
                  { icon: KeyRound, title: "Your quote & totals", desc: "Your quotation, deposit split, and final balance — always in sync." },
                  { icon: ShieldCheck, title: "Sign your declaration", desc: "Approve your documents legally, right here, and keep a copy for yourself." },
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800">
                    <f.icon className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{f.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Forgot your details? WhatsApp{" "}
                <a href={SITE_CONFIG.whatsappLink} target="_blank" rel="noopener noreferrer" className="text-emerald-500 font-bold hover:underline">
                  {SITE_CONFIG.whatsappFormatted}
                </a>{" "}
                or email <a href={`mailto:${SITE_CONFIG.email}`} className="text-orange-500 font-bold hover:underline">{SITE_CONFIG.email}</a>.
              </p>
            </div>

            {/* Right: login */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-[#0D1A2D] p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Log in</h2>
                    <p className="text-xs text-slate-500">Use the username & password from your invite message.</p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Username
                    </label>
                    <input
                      id="client-login-username"
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. sipho842"
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                      Password
                    </label>
                    <input
                      id="client-login-password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your password"
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                  </div>

                  {error && (
                    <p className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      {error}
                    </p>
                  )}
                  {notice && (
                    <p className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl p-3">
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                      {notice}
                    </p>
                  )}

                  <button
                    id="client-login-submit"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Logging in…" : "Open My Dashboard"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Have an invite card? */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                  <button
                    id="client-invite-card-toggle"
                    onClick={() => setCardOpen((v) => !v)}
                    className="w-full flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-orange-500 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-orange-500" />
                      Have an invite card?
                    </span>
                    <span className="text-[10px] text-slate-400">{cardOpen ? "Hide" : "Paste it here"}</span>
                  </button>
                  {cardOpen && (
                    <div className="mt-3 space-y-2.5">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Paste the <strong>JPCARD1:…</strong> block from your invite message — it fills in your username
                        and password automatically.
                      </p>
                      <textarea
                        id="client-invite-card-input"
                        value={cardInput}
                        onChange={(e) => setCardInput(e.target.value)}
                        rows={3}
                        placeholder="JPCARD1:…"
                        className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs font-mono resize-none"
                      />
                      <button
                        id="client-invite-card-use-btn"
                        onClick={handleUseCard}
                        disabled={!cardInput.trim()}
                        className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-orange-500 text-white font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Use This Card
                      </button>
                      {cardError && (
                        <p className="flex items-start gap-2 text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl p-3">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          {cardError}
                        </p>
                      )}
                      {cardNotice && (
                        <p className="flex items-start gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl p-3">
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          {cardNotice}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
