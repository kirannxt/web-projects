import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [pageCount, projectCount] = await Promise.all([
    prisma.page.count(),
    prisma.project.count(),
  ]);

  const recentPages = await prisma.page.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentProjects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Overview of your project showcase
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{projectCount}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Total Projects</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <Link href="/admin/projects" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-3 inline-block">
            Manage projects →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{pageCount}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Pages</div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <Link href="/admin/pages" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-3 inline-block">
            Manage pages →
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {recentPages.filter((p) => p.published).length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Published Pages</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <Link href="/admin/pages/new" className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-3 inline-block">
            Add new page →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Pages */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Pages</h2>
            <Link href="/admin/pages/new" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
              + Add Page
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentPages.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No pages yet.{" "}
                <Link href="/admin/pages/new" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Create one
                </Link>
              </div>
            ) : (
              recentPages.map((page) => (
                <div key={page.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {page.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {page.parentMenu} · /pages/{page.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      page.published
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}>
                      {page.published ? "Published" : "Draft"}
                    </span>
                    <Link href={`/admin/pages/${page.id}/edit`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Projects</h2>
            <Link href="/admin/projects/new" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
              + Add Project
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {recentProjects.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No projects yet.{" "}
                <Link href="/admin/projects/new" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Create one
                </Link>
              </div>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {project.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {project.description.slice(0, 60)}...
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {project.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        Featured
                      </span>
                    )}
                    <Link href={`/admin/projects/${project.id}/edit`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
