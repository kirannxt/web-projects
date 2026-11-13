"use client";

import { useState } from "react";
import type { Section, SectionType } from "@/types/sections";
import { createSection } from "@/types/sections";
import MediaPicker from "./MediaPicker";

interface Props {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

const SECTION_TYPES: { type: SectionType; label: string; icon: string; desc: string }[] = [
  { type: "hero",       label: "Hero",        icon: "🎯", desc: "Full-width banner with title and CTA" },
  { type: "text",       label: "Text",        icon: "📝", desc: "Rich text / Markdown content" },
  { type: "image",      label: "Image",       icon: "🖼️", desc: "Single image with optional caption" },
  { type: "video",      label: "Video",       icon: "🎥", desc: "Video player or embed" },
  { type: "two-column", label: "Two Columns", icon: "⬛", desc: "Side-by-side text columns" },
  { type: "cta",        label: "Call to Action", icon: "🚀", desc: "Highlighted action block" },
  { type: "divider",    label: "Divider",     icon: "➖", desc: "Visual separator between sections" },
];

export default function SectionEditor({ sections, onChange }: Props) {
  const [addingSection, setAddingSection] = useState(false);
  const [mediaPickerFor, setMediaPickerFor] = useState<{ sectionId: string; field: string } | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function addSection(type: SectionType) {
    const newSection = createSection(type, sections.length);
    onChange([...sections, newSection]);
    setAddingSection(false);
  }

  function removeSection(id: string) {
    onChange(sections.filter((s) => s.id !== id));
  }

  function moveSection(id: string, dir: "up" | "down") {
    const idx = sections.findIndex((s) => s.id === id);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === sections.length - 1) return;
    const next = [...sections];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next.map((s, i) => ({ ...s, order: i })));
  }

  function updateSection(id: string, patch: Partial<Section>) {
    onChange(sections.map((s) => s.id === id ? { ...s, ...patch } as Section : s));
  }

  function toggleCollapse(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-3">
      {/* Section list */}
      {sections.map((section, idx) => (
        <div
          key={section.id}
          className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 overflow-hidden"
        >
          {/* Section header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50">
            <span className="text-lg">{SECTION_TYPES.find((t) => t.type === section.type)?.icon}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1">
              {SECTION_TYPES.find((t) => t.type === section.type)?.label}
              {section.type === "text" && (section as { content?: string }).content?.slice(0, 40) && (
                <span className="text-gray-400 font-normal ml-2 text-xs">
                  — {(section as { content?: string }).content?.slice(0, 40)}...
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveSection(section.id, "up")}
                disabled={idx === 0}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => moveSection(section.id, "down")}
                disabled={idx === sections.length - 1}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => toggleCollapse(section.id)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className={`w-4 h-4 transition-transform ${collapsed[section.id] ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => removeSection(section.id)}
                className="p-1 text-red-400 hover:text-red-600 ml-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Section fields */}
          {!collapsed[section.id] && (
            <div className="p-4 space-y-3">
              <SectionFields
                section={section}
                onChange={(patch) => updateSection(section.id, patch)}
                onOpenMedia={(field) => setMediaPickerFor({ sectionId: section.id, field })}
              />
            </div>
          )}
        </div>
      ))}

      {/* Add section */}
      {addingSection ? (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Choose a section type:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SECTION_TYPES.map((t) => (
              <button
                key={t.type}
                type="button"
                onClick={() => addSection(t.type)}
                className="flex items-start gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-accent hover:bg-gray-50 dark:hover:bg-gray-700/50 text-left transition-colors"
              >
                <span className="text-xl">{t.icon}</span>
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAddingSection(false)}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAddingSection(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-accent hover:text-accent transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Section
        </button>
      )}

      {/* Media picker modal */}
      {mediaPickerFor && (
        <MediaPicker
          accept="all"
          onSelect={(url) => {
            const { sectionId, field } = mediaPickerFor;
            updateSection(sectionId, { [field]: url } as Partial<Section>);
            setMediaPickerFor(null);
          }}
          onClose={() => setMediaPickerFor(null)}
        />
      )}
    </div>
  );
}

// ─── Per-type field editors ───────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{children}</label>;
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent"
    />
  );
}

function TextArea({ value, onChange, rows = 4, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent resize-y"
    />
  );
}

function MediaButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {label}
    </button>
  );
}

function SectionFields({
  section,
  onChange,
  onOpenMedia,
}: {
  section: Section;
  onChange: (patch: Partial<Section>) => void;
  onOpenMedia: (field: string) => void;
}) {
  switch (section.type) {
    case "hero":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><FieldLabel>Title</FieldLabel><TextInput value={section.title} onChange={(v) => onChange({ title: v })} /></div>
          <div><FieldLabel>Subtitle</FieldLabel><TextInput value={section.subtitle} onChange={(v) => onChange({ subtitle: v })} /></div>
          <div><FieldLabel>Button Text</FieldLabel><TextInput value={section.buttonText} onChange={(v) => onChange({ buttonText: v })} /></div>
          <div><FieldLabel>Button URL</FieldLabel><TextInput value={section.buttonUrl} onChange={(v) => onChange({ buttonUrl: v })} placeholder="#" /></div>
          <div>
            <FieldLabel>Background</FieldLabel>
            <select
              value={section.backgroundType}
              onChange={(e) => onChange({ backgroundType: e.target.value as "gradient" | "image" | "color" })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none"
            >
              <option value="gradient">Accent Gradient</option>
              <option value="image">Background Image</option>
              <option value="color">Solid Color</option>
            </select>
          </div>
          {section.backgroundType === "image" && (
            <div>
              <FieldLabel>Background Image</FieldLabel>
              <div className="flex gap-2">
                <TextInput value={section.backgroundValue} onChange={(v) => onChange({ backgroundValue: v })} placeholder="Image URL" />
                <MediaButton label="Pick" onClick={() => onOpenMedia("backgroundValue")} />
              </div>
            </div>
          )}
          {section.backgroundType === "color" && (
            <div>
              <FieldLabel>Color</FieldLabel>
              <input type="color" value={section.backgroundValue || "#3b82f6"} onChange={(e) => onChange({ backgroundValue: e.target.value })}
                className="w-full h-9 rounded-lg border border-gray-300 cursor-pointer" />
            </div>
          )}
        </div>
      );

    case "text":
      return (
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <FieldLabel>Content (Markdown)</FieldLabel>
              <select
                value={section.align}
                onChange={(e) => onChange({ align: e.target.value as "left" | "center" | "right" })}
                className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <TextArea value={section.content} onChange={(v) => onChange({ content: v })} rows={8} placeholder="## Heading&#10;&#10;Write your content..." />
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-3">
          <div>
            <FieldLabel>Image</FieldLabel>
            <div className="flex gap-2">
              <TextInput value={section.url} onChange={(v) => onChange({ url: v })} placeholder="Image URL" />
              <MediaButton label="Pick" onClick={() => onOpenMedia("url")} />
            </div>
            {section.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={section.url} alt="preview" className="mt-2 h-24 rounded-lg object-cover border border-gray-200 dark:border-gray-700" />
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><FieldLabel>Alt Text</FieldLabel><TextInput value={section.alt} onChange={(v) => onChange({ alt: v })} placeholder="Describe the image" /></div>
            <div>
              <FieldLabel>Size</FieldLabel>
              <select value={section.size} onChange={(e) => onChange({ size: e.target.value as "small" | "medium" | "full" })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none">
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="full">Full Width</option>
              </select>
            </div>
          </div>
          <div><FieldLabel>Caption</FieldLabel><TextInput value={section.caption} onChange={(v) => onChange({ caption: v })} placeholder="Optional caption" /></div>
        </div>
      );

    case "video":
      return (
        <div className="space-y-3">
          <div>
            <FieldLabel>Video URL</FieldLabel>
            <div className="flex gap-2">
              <TextInput value={section.url} onChange={(v) => onChange({ url: v })} placeholder="YouTube, Vimeo, or direct video URL" />
              <MediaButton label="Pick" onClick={() => onOpenMedia("url")} />
            </div>
            <p className="text-xs text-gray-400 mt-1">YouTube: use embed URL (youtube.com/embed/...) or Vimeo (player.vimeo.com/video/...)</p>
          </div>
          <div><FieldLabel>Title</FieldLabel><TextInput value={section.title} onChange={(v) => onChange({ title: v })} placeholder="Video title" /></div>
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" checked={section.autoplay} onChange={(e) => onChange({ autoplay: e.target.checked })}
              className="rounded" />
            Autoplay (muted)
          </label>
        </div>
      );

    case "two-column":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FieldLabel>Left Column (Markdown)</FieldLabel>
            <TextArea value={section.leftContent} onChange={(v) => onChange({ leftContent: v })} rows={8} />
          </div>
          <div>
            <FieldLabel>Right Column (Markdown)</FieldLabel>
            <TextArea value={section.rightContent} onChange={(v) => onChange({ rightContent: v })} rows={8} />
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><FieldLabel>Title</FieldLabel><TextInput value={section.title} onChange={(v) => onChange({ title: v })} /></div>
          <div><FieldLabel>Subtitle</FieldLabel><TextInput value={section.subtitle} onChange={(v) => onChange({ subtitle: v })} /></div>
          <div><FieldLabel>Button Text</FieldLabel><TextInput value={section.buttonText} onChange={(v) => onChange({ buttonText: v })} /></div>
          <div><FieldLabel>Button URL</FieldLabel><TextInput value={section.buttonUrl} onChange={(v) => onChange({ buttonUrl: v })} /></div>
        </div>
      );

    case "divider":
      return (
        <div>
          <FieldLabel>Style</FieldLabel>
          <select value={section.style} onChange={(e) => onChange({ style: e.target.value as "line" | "space" | "dots" })}
            className="w-full max-w-xs px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none">
            <option value="line">Horizontal Line</option>
            <option value="space">Whitespace</option>
            <option value="dots">Dots</option>
          </select>
        </div>
      );

    default:
      return null;
  }
}
