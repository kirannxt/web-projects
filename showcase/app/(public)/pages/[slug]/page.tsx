import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SectionRenderer from "@/components/SectionRenderer";
import MarkdownContent from "@/components/MarkdownContent";
import type { Metadata } from "next";
import type { Section } from "@/types/sections";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug, published: true } });
  if (!page) return { title: "Page Not Found" };
  return { title: `${page.title} | Project Showcase` };
}

export default async function PageView({ params }: Props) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug, published: true } });
  if (!page) notFound();

  let sections: Section[] = [];
  try { sections = JSON.parse(page.sections); } catch { sections = []; }

  const siblings = await prisma.page.findMany({
    where: { parentMenu: page.parentMenu, published: true },
    orderBy: { order: "asc" },
  });

  const hasSections = sections.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden sticky top-24">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {page.parentMenu}
              </span>
            </div>
            <nav className="py-1">
              {siblings.map((sibling) => (
                <a
                  key={sibling.id}
                  href={`/pages/${sibling.slug}`}
                  className={`block px-4 py-2.5 text-sm transition-colors ${
                    sibling.slug === slug
                      ? "font-medium border-l-2 border-accent"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  style={sibling.slug === slug ? {
                    borderColor: "var(--accent)",
                    color: "var(--accent-text)",
                    backgroundColor: "var(--accent-light)",
                  } : {}}
                >
                  {sibling.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="flex-1 min-w-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Breadcrumb */}
            <div className="px-8 pt-6">
              <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <a href="/" className="hover:underline" style={{ color: "var(--accent)" }}>Home</a>
                <span>/</span>
                <span>{page.parentMenu}</span>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">{page.title}</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{page.title}</h1>
            </div>

            {hasSections ? (
              <SectionRenderer sections={sections} />
            ) : page.content ? (
              <div className="px-8 pb-8 prose max-w-none">
                <MarkdownContent content={page.content} />
              </div>
            ) : (
              <div className="px-8 pb-8 text-gray-400 italic text-sm">No content yet.</div>
            )}

            <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400">
              Last updated: {new Date(page.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
