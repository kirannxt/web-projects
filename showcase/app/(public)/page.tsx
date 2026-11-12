import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Our Project
            <span className="block text-blue-200">Showcase</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Explore our portfolio of innovative projects spanning web apps,
            mobile applications, and open-source contributions.
          </p>
          <a
            href="#projects"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            View Projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{projects.length}+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{featuredProjects.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Featured</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Open to explore</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Featured
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Highlighted Projects
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        </section>
      )}

      {/* All Projects */}
      {otherProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              All Projects
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Visit the admin dashboard to add your first project.
          </p>
        </section>
      )}
    </div>
  );
}
