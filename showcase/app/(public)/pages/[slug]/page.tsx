import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MarkdownContent from "@/components/MarkdownContent";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug, published: true } });
  if (!page) return { title: "Page Not Found" };
  return { title: `${page.title} | Project Showcase`, description: page.content.slice(0, 160) };
}

export default async function PageView({ params }: Props) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({
    where: { slug, published: true },
  });

  if (!page) notFound();

  // Fetch sibling pages in the same menu
  const siblings = await prisma.page.findMany({
    where: { parentMenu: page.parentMenu, published: true },
    orderBy: { order: "asc" },
  });

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
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium border-l-2 border-blue-600"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {sibling.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <article className="flex-1 min-w-0">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a>
              <span>/</span>
              <span>{page.parentMenu}</span>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-medium">{page.title}</span>
            </nav>
            <div className="prose dark:prose-invert max-w-none">
              <MarkdownContent content={page.content} />
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
              Last updated: {new Date(page.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
