import Link from "next/link";
import { ArrowRight, Sparkles, Code2, PlusCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LiveSiteEmbed from "@/components/LiveSiteEmbed";
import { getPublishedProjects } from "@/lib/db";
import type { Project } from "@/lib/types";
import ProjectsFilter from "./ProjectsFilter";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  let projects: Project[] = [];
  try {
    projects = await getPublishedProjects();
  } catch (err) {
    // Never 500 the public portfolio because of a database hiccup — show the
    // honest empty state; it re-syncs on the next request.
    console.error("[projects] Mongo read failed — rendering empty state:", err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#070D17] text-slate-900 dark:text-slate-100 transition-colors">
      <Header />

      <main className="flex-1">

        {/* HERO SECTION */}
        <section className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-[#070D17] dark:via-[#0A1628] dark:to-[#070D17] border-b border-slate-200 dark:border-slate-800 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-bold border border-orange-200 dark:border-orange-800">
              <Code2 className="w-4 h-4" />
              Verified Case Studies
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Projects I&apos;ve Built
            </h1>

            <p className="text-lg sm:text-2xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Real apps for real businesses. AI-orchestrated, human-reviewed, delivered right.
            </p>

          </div>
        </section>

        {/* FEATURED FLAGSHIP PREVIEW */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <LiveSiteEmbed projects={projects} />
        </section>

        {/* FILTER & GRID SECTION */}
        <section className="py-12 bg-white dark:bg-[#080F1D] border-t border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <ProjectsFilter projects={projects} />
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="py-16 bg-[#0A1628] text-white text-center">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl font-bold">Have a unique web app or dashboard in mind?</h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Get a custom quote based on your exact specifications with zero obligation.
            </p>
            <Link
              id="projects-bottom-cta"
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg hover:scale-105 transition-all"
            >
              Request Your Custom Quote →
            </Link>
          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
