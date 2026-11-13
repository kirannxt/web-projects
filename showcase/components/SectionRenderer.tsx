import type { Section } from "@/types/sections";
import MarkdownContent from "./MarkdownContent";

export default function SectionRenderer({ sections }: { sections: Section[] }) {
  const sorted = [...sections].sort((a, b) => a.order - b.order);
  return (
    <>
      {sorted.map((section) => (
        <SectionBlock key={section.id} section={section} />
      ))}
    </>
  );
}

function SectionBlock({ section }: { section: Section }) {
  switch (section.type) {
    case "hero": {
      const bgStyle =
        section.backgroundType === "image"
          ? { backgroundImage: `url(${section.backgroundValue})`, backgroundSize: "cover", backgroundPosition: "center" }
          : section.backgroundType === "color"
          ? { backgroundColor: section.backgroundValue }
          : {};
      const cls =
        section.backgroundType === "gradient"
          ? "bg-accent-gradient text-white"
          : "text-white";
      return (
        <section className={`${cls} py-20 px-4 relative`} style={bgStyle}>
          {section.backgroundType === "image" && (
            <div className="absolute inset-0 bg-black/40" />
          )}
          <div className="relative max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{section.title}</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">{section.subtitle}</p>
            {section.buttonText && (
              <a
                href={section.buttonUrl || "#"}
                className="inline-flex items-center gap-2 bg-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg text-accent-text"
                style={{ color: "var(--accent-text)" }}
              >
                {section.buttonText}
              </a>
            )}
          </div>
        </section>
      );
    }

    case "text":
      return (
        <section className="max-w-4xl mx-auto px-4 py-10">
          <div className={`prose max-w-none ${section.align === "center" ? "text-center" : section.align === "right" ? "text-right" : ""}`}>
            <MarkdownContent content={section.content} />
          </div>
        </section>
      );

    case "image": {
      const sizeClass =
        section.size === "full" ? "w-full" :
        section.size === "small" ? "max-w-sm mx-auto" :
        "max-w-2xl mx-auto";
      return (
        <section className="px-4 py-8">
          <div className={sizeClass}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={section.url}
              alt={section.alt}
              className="w-full rounded-xl shadow-md"
            />
            {section.caption && (
              <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-2">{section.caption}</p>
            )}
          </div>
        </section>
      );
    }

    case "video": {
      const isEmbed = section.url.includes("youtube.com/embed") || section.url.includes("player.vimeo.com");
      return (
        <section className="max-w-4xl mx-auto px-4 py-8">
          {section.title && (
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{section.title}</h3>
          )}
          <div className="rounded-xl overflow-hidden shadow-md aspect-video bg-black">
            {isEmbed ? (
              <iframe
                src={section.url}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title={section.title}
              />
            ) : (
              <video
                src={section.url}
                controls
                autoPlay={section.autoplay}
                muted={section.autoplay}
                className="w-full h-full"
              />
            )}
          </div>
        </section>
      );
    }

    case "two-column":
      return (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="prose max-w-none">
              <MarkdownContent content={section.leftContent} />
            </div>
            <div className="prose max-w-none">
              <MarkdownContent content={section.rightContent} />
            </div>
          </div>
        </section>
      );

    case "cta":
      return (
        <section className="bg-accent-light dark:bg-gray-800 py-14 px-4 my-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{section.subtitle}</p>
            {section.buttonText && (
              <a
                href={section.buttonUrl || "#"}
                className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity shadow"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {section.buttonText}
              </a>
            )}
          </div>
        </section>
      );

    case "divider":
      return (
        <div className="max-w-4xl mx-auto px-4 py-4">
          {section.style === "line" && <hr className="border-gray-200 dark:border-gray-700" />}
          {section.style === "space" && <div className="h-12" />}
          {section.style === "dots" && (
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              ))}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
