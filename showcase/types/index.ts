export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  parentMenu: string;
  order: number;
  published: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  demoUrl: string | null;
  repoUrl: string | null;
  tags: string; // JSON string
  featured: boolean;
  order: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}
