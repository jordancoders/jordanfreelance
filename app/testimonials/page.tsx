import Link from "next/link";
import { Star, Quote, CheckCircle2, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_CONFIG } from "@/data/portfolioData";
import { getPublishedReviews } from "@/lib/db";
import type { ClientReview } from "@/lib/types";

export const metadata = {
  title: "Client Reviews & Testimonials",
  description: "Verified client reviews for Jordan Peters Coder Freelancing. Real feedback from SME clients — never fabricated.",
};

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  let reviews: ClientReview[] = [];
  try {
    reviews = await getPublishedReviews();
  } catch (err) {
    // Never 500 the public page because of a database hiccup — the empty state
    // ("100% Genuine Client Review Policy") renders instead.
    console.error("[testimonials] Mongo read failed — rendering empty state:", err);
  }
  const publishedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">

        {/* HERO SECTION */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-[#070D17] dark:via-[#0A1628] dark:to-[#070D17] border-b border-slate-200 dark:border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              100% Genuine Client Policy
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Client Reviews & Testimonials
            </h1>

            <p className="text-lg sm:text-2xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Verified review standards for South African SME web apps, dashboards & MVPs.
            </p>

          </div>
        </section>

        {/* CLIENT REVIEWS CONTENT */}
        <section className="py-16 bg-white dark:bg-[#080F1D] border-t border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

            {publishedReviews.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {publishedReviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-8 rounded-3xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-md space-y-4 flex flex-col justify-between hover:border-orange-500/50 hover:shadow-xl transition-all"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < r.rating ? "fill-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                              />
                            ))}
                          </div>
                          <Quote className="w-6 h-6 text-orange-500/40" />
                        </div>

                        <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
                          &ldquo;{r.content}&rdquo;
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                        {r.avatar ? (
                          <img
                            src={r.avatar}
                            alt={r.clientName}
                            className="w-11 h-11 rounded-full object-cover border-2 border-orange-500/40"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center font-black">
                            {r.clientName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <strong className="block text-sm text-slate-900 dark:text-white">
                            {r.clientName}
                          </strong>
                          <span className="block text-xs text-slate-500 dark:text-slate-400">
                            {r.companyTitle || "Verified Client"}
                            {r.projectTitle ? ` • ${r.projectTitle}` : ""}
                          </span>
                          {r.createdAt && (
                            <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                              Added {new Date(r.createdAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-center text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-500 mr-1" />
                  Every review above is verified — added directly by clients after project sign-off and
                  48-hour staging demo delivery. I never publish fake or placeholder reviews.
                </p>
              </>
            ) : (
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center mx-auto font-bold text-2xl">
                  ★
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    100% Genuine Client Review Policy
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-2xl mx-auto">
                    No verified reviews yet — and I&apos;m upfront about it. I will not publish artificial or filler client reviews. Instead of empty stars, test the real thing: your own working staging demo within 48 hours, before you pay the balance — or open the prompt engineering log on the homepage to see the human quality gate in action. Once your project ships, your verified review will be featured here.
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    id="testimonials-start-project-btn"
                    href="/contact"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all"
                  >
                    Test It Yourself — 48-Hour Staging →
                  </Link>
                </div>
              </div>
            )}

          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 bg-[#0A1628] text-white text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to be next?</h2>
            <p className="text-slate-300 text-base">
              Experience the 48-hour staging demo for your business.
            </p>
            <Link
              id="testimonials-cta-btn"
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg hover:scale-105 transition-all"
            >
              Get Started with a Custom Quote →
            </Link>
          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
