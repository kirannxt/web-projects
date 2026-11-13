import { prisma } from "@/lib/prisma";
import ProjectCard from "@/components/ProjectCard";

export const dynamic = "force-dynamic";

async function getHomepageSettings() {
  try {
    const settings = await prisma.siteSettings.findMany({
      where: {
        key: {
          in: [
            "hero_title", "hero_subtitle", "hero_button_text", "hero_button_url",
            "stat1_value", "stat1_label", "stat2_value", "stat2_label", "stat3_value", "stat3_label",
            "featured_heading", "all_heading",
          ],
        },
      },
    });
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const [projects, settings] = await Promise.all([
    prisma.project.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] }),
    getHomepageSettings(),
  ]);

  const s = {
    hero_title:      settings.hero_title      || "Our Project Showcase",
    hero_subtitle:   settings.hero_subtitle   || "Explore our portfolio of innovative projects spanning web apps, mobile applications, and open-source contributions.",
    hero_button_text: settings.hero_button_text || "View Projects",
    hero_button_url:  settings.hero_button_url  || "#projects",
    stat1_value:  settings.stat1_value  || `${projects.length}+`,
    stat1_label:  settings.stat1_label  || "Projects",
    stat2_value:  settings.stat2_value  || `${projects.filter((p) => p.featured).length}`,
    stat2_label:  settings.stat2_label  || "Featured",
    stat3_value:  settings.stat3_value  || "100%",
    stat3_label:  settings.stat3_label  || "Open to explore",
    featured_heading: settings.featured_heading || "Highlighted Projects",
    all_heading:      settings.all_heading      || "All Projects",
  };

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <div>
      {/* Hero */}
      <section className="bg-accent-gradient text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {s.hero_title}
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            {s.hero_subtitle}
          </p>
          <a
            href={s.hero_button_url}
            className="inline-flex items-center gap-2 bg-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            style={{ color: "var(--accent-text)" }}
          >
            {s.hero_button_text}
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
            {[
              { value: s.stat1_value, label: s.stat1_label },
              { value: s.stat2_value, label: s.stat2_label },
              { value: s.stat3_value, label: s.stat3_label },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-accent" style={{ color: "var(--accent)" }}>{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3 bg-accent-light text-accent-text"
              style={{ backgroundColor: "var(--accent-light)", color: "var(--accent-text)" }}>
              Featured
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{s.featured_heading}</h2>
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{s.all_heading}</h2>
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
          <div className="text-gray-300 dark:text-gray-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No projects yet</h3>
          <p className="text-gray-500">Visit the admin dashboard to add your first project.</p>
        </section>
      )}
    </div>
  );
}
