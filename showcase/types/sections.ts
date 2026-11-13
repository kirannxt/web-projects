export type SectionType =
  | "hero"
  | "text"
  | "image"
  | "video"
  | "two-column"
  | "cta"
  | "divider";

export interface BaseSection {
  id: string;
  type: SectionType;
  order: number;
}

export interface HeroSection extends BaseSection {
  type: "hero";
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  backgroundType: "gradient" | "image" | "color";
  backgroundValue: string; // url or color
}

export interface TextSection extends BaseSection {
  type: "text";
  content: string; // Markdown
  align: "left" | "center" | "right";
}

export interface ImageSection extends BaseSection {
  type: "image";
  url: string;
  alt: string;
  caption: string;
  size: "small" | "medium" | "full";
}

export interface VideoSection extends BaseSection {
  type: "video";
  url: string;  // direct url or YouTube/Vimeo embed url
  title: string;
  autoplay: boolean;
}

export interface TwoColumnSection extends BaseSection {
  type: "two-column";
  leftContent: string;  // Markdown
  rightContent: string; // Markdown
}

export interface CTASection extends BaseSection {
  type: "cta";
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
}

export interface DividerSection extends BaseSection {
  type: "divider";
  style: "line" | "space" | "dots";
}

export type Section =
  | HeroSection
  | TextSection
  | ImageSection
  | VideoSection
  | TwoColumnSection
  | CTASection
  | DividerSection;

export function createSection(type: SectionType, order: number): Section {
  const id = `sec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const base = { id, order };

  switch (type) {
    case "hero":
      return { ...base, type, title: "Section Title", subtitle: "Section subtitle text", buttonText: "Learn More", buttonUrl: "#", backgroundType: "gradient", backgroundValue: "" };
    case "text":
      return { ...base, type, content: "## Heading\n\nWrite your content here.", align: "left" };
    case "image":
      return { ...base, type, url: "", alt: "", caption: "", size: "medium" };
    case "video":
      return { ...base, type, url: "", title: "", autoplay: false };
    case "two-column":
      return { ...base, type, leftContent: "### Left Column\n\nContent here.", rightContent: "### Right Column\n\nContent here." };
    case "cta":
      return { ...base, type, title: "Ready to get started?", subtitle: "Join us today.", buttonText: "Get Started", buttonUrl: "#" };
    case "divider":
      return { ...base, type, style: "line" };
  }
}
