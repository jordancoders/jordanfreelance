"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, PlusCircle } from "lucide-react";
import type { Project } from "@/lib/types";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "dashboard", label: "Dashboards" },
  { id: "webapp", label: "Web Apps" },
  { id: "mvp", label: "MVPs" },
  { id: "tourism", label: "Tourism" },
  { id: "ecommerce", label: "E-commerce" },
];

interface ProjectsFilterProps {
  projects: Project[];
}

export default function ProjectsFilter({ projects }: ProjectsFilterProps) {
  const [filter, setFilter] = useState<string>("all");

  const filteredProjects = filter === "all"
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <>
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-btn-${cat.id}`}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filter === cat.id
                ? "bg-orange-500 text-white shadow-md"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredProjects.length === 0 ? (
        <div className="col-span-full p-12 text-center rounded-3xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-500 border border-orange-200 dark:border-orange-800 flex items-center justify-center mx-auto">
            <PlusCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            No Published Projects Yet
          </h3>
          <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-sm">
            I keep my portfolio 100% honest — only real, published builds are shown here. In the meantime, test the interactive Tourism Dashboard demo above, or start your own project.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              id="quote-cta-empty-state"
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow transition-all"
            >
              Request a Custom Quote
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl bg-slate-50 dark:bg-[#0D1A2D] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-slate-900/90 text-orange-400 font-bold text-xs rounded-md backdrop-blur border border-slate-700">
                      {project.category.toUpperCase()}
                    </span>
                    {project.pagesCount && (
                      <span className="px-2 py-1 bg-emerald-950/90 text-emerald-300 font-semibold text-xs rounded-md border border-emerald-800">
                        {project.pagesCount} Pages
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-[11px] font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Client: <strong className="text-slate-700 dark:text-slate-300">{project.client}</strong>
                </span>
                <Link
                  id={`project-detail-link-${project.slug}`}
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 group/link"
                >
                  View Case Study
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}

          {/* Placeholder Card */}
          <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 flex flex-col justify-between items-center text-center space-y-4 bg-slate-50/50 dark:bg-slate-900/30 hover:border-orange-500 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-orange-500">Your Next App</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Project Could Be Here</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Need a custom dashboard, web portal, or MVP delivered with a 48-hour staging demo?
              </p>
            </div>
            <Link
              id="placeholder-project-cta"
              href="/contact"
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs"
            >
              Start Yours Today →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
