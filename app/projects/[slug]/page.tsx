import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Clock, Award, Star, ArrowRight, ExternalLink, Sparkles, FolderX } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getProjectBySlug } from "@/lib/db";
import type { Project } from "@/lib/types";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  let project: Project | null = null;
  try {
    project = await getProjectBySlug(slug);
  } catch (err) {
    // A database hiccup should land on the friendly "not found" state, not a 500.
    console.error(`[projects/${slug}] Mongo read failed:`, err);
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl bg-white dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-500 border border-orange-200 dark:border-orange-800 flex items-center justify-center mx-auto">
              <FolderX className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Project Case Study Not Found</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              This case study hasn&apos;t been published yet, or the link may be outdated.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                id="back-to-projects-btn"
                href="/projects"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow transition-all"
              >
                ← Back to Projects
              </Link>
              <Link
                id="notfound-quote-btn"
                href="/contact"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Request a Custom Quote
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">

        {/* HERO SECTION */}
        <section className="py-12 sm:py-16 bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

            <Link
              id="back-to-projects-link"
              href="/projects"
              className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Projects
            </Link>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs font-bold uppercase rounded-md border border-orange-500/40">
                  {project.category}
                </span>
                {project.deliveryDays && (
                  <span className="px-3 py-1 bg-emerald-950/80 text-emerald-300 text-xs font-semibold rounded-md border border-emerald-800">
                    Delivered in {project.deliveryDays} Days
                  </span>
                )}
                {project.pagesCount && (
                  <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-semibold rounded-md border border-slate-700">
                    {project.pagesCount} Custom Views
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                {project.title}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                {project.description}
              </p>
            </div>

            <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs text-slate-300">
                <span>Client: <strong className="text-white">{project.client}</strong></span>
                <span className="text-emerald-400 font-semibold">✓ 48-Hour Staging Demo Delivered</span>
              </div>
            </div>

          </div>
        </section>

        {/* DETAILS SECTION */}
        <section className="py-16 bg-white dark:bg-[#080F1D] border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

            {project.embedUrl && (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                  <ExternalLink className="w-5 h-5" />
                  Live Site Preview
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  This build is deployed live — click through the real site below, no screenshots, no mockups.
                </p>
                <div className="rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white">
                  <iframe
                    src={project.embedUrl}
                    title={`Live preview of ${project.title}`}
                    className="w-full h-[420px] sm:h-[520px] border-0 bg-white"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
                <a
                  href={project.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in New Tab
                </a>
              </div>
            )}

            {project.id === "tourism-dashboard" && (
              <div className="p-6 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/80 space-y-3">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-base">
                  <Sparkles className="w-5 h-5" />
                  Interactive Staging Demo Available
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  Click below to test and interact with the live 48-hour staging demo built for this project.
                </p>

              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              <div className="lg:col-span-2 space-y-10">

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">1</span>
                    The Client Problem
                  </h3>
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                    {project.problem}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold">2</span>
                    AI-Orchestrated & Human-Reviewed Solution
                  </h3>
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                    {project.solution}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-bold">3</span>
                    Measurable Results & Impact
                  </h3>
                  <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
                    {project.results}
                  </div>
                </div>

                {project.testimonial && (
                  <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3 border border-slate-800 shadow-lg">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-200 italic text-sm sm:text-base leading-relaxed">
                      &ldquo;{project.testimonial.quote}&rdquo;
                    </p>
                    <div className="pt-2 text-xs text-orange-400 font-semibold">
                      — {project.testimonial.author}, {project.testimonial.role}
                    </div>
                  </div>
                )}

              </div>

              <div className="space-y-6">

                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
                    Project Overview
                  </h4>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 block">Client:</span>
                      <strong className="text-slate-900 dark:text-white font-semibold">{project.client}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Category:</span>
                      <strong className="text-slate-900 dark:text-white font-semibold uppercase">{project.category}</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block">Staging Demo:</span>
                      <strong className="text-emerald-500 font-semibold">Delivered in 48 Hours</strong>
                    </div>

                    <div>
                      <span className="text-slate-400 block">POPIA Protection:</span>
                      <strong className="text-slate-900 dark:text-white font-semibold">7-Day Erasure Promise</strong>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-xs text-slate-400 block mb-2 font-semibold">Tech Stack Used:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => (
                        <span key={t} className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md text-xs font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-orange-500 text-white space-y-4 shadow-lg text-center">
                  <h4 className="font-bold text-lg">Need a Similar Application?</h4>
                  <p className="text-xs text-orange-100">
                    Jordan Peters can deliver a tailored staging link in 48 hours for your SME.
                  </p>
                  <Link
                    id="project-detail-cta-quote"
                    href="/contact"
                    className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
                  >
                    Request a Custom Quote →
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
