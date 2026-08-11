import type { Metadata } from "next";
import { getProjectBySlug } from "@/lib/db";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getProjectBySlug(slug);
    if (!project) {
      return { title: "Project Case Study" };
    }
    return {
      title: project.title,
      description: project.description || `${project.title} — case study by Jordan Peters Coder Freelancing.`,
    };
  } catch {
    return { title: "Project Case Study" };
  }
}

export default function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
