import {
  Atom,
  Camera,
  Database,
  DollarSign,
  Globe,
  Heart,
  type LucideIcon,
  Music,
  Palette,
  Video,
} from "lucide-react";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  {
    id: "color",
    slug: "color",
    name: "Color",
    description: "Color conversion and palettes",
    icon: Palette,
  },
  {
    id: "data",
    slug: "data",
    name: "Data",
    description: "Bandwidth and file size calculators",
    icon: Database,
  },
  {
    id: "finance",
    slug: "finance",
    name: "Finance",
    description: "Financial calculators and converters",
    icon: DollarSign,
  },
  {
    id: "health",
    slug: "health",
    name: "Health",
    description: "Health and fitness calculators",
    icon: Heart,
  },
  {
    id: "music",
    slug: "music",
    name: "Music",
    description: "Music theory and audio tools",
    icon: Music,
  },
  {
    id: "photo",
    slug: "photo",
    name: "Photo",
    description: "Photography calculators",
    icon: Camera,
  },
  {
    id: "physics",
    slug: "physics",
    name: "Physics",
    description: "Physics and unit converters",
    icon: Atom,
  },
  {
    id: "video",
    slug: "video",
    name: "Video",
    description: "Video and media calculators",
    icon: Video,
  },
  {
    id: "web",
    slug: "web",
    name: "Web",
    description: "Web development tools",
    icon: Globe,
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
