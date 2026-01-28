import { Beaker, Droplet, FlaskRound, type LucideIcon } from "lucide-react";

export interface ConverterMeta {
  id: string;
  slug: string;
  category: string;
  subcategory?: string;
  keywords: string[];
  icon: LucideIcon;
  featured?: boolean;
}

export const chemistryConverters: Record<string, ConverterMeta> = {
  "molecular-weight": {
    id: "molecular-weight",
    slug: "molecular-weight",
    category: "chemistry",
    subcategory: "general",
    keywords: ["molecular", "weight", "molar", "mass", "formula", "compound", "chemistry"],
    icon: FlaskRound,
    featured: false,
  },
  molarity: {
    id: "molarity",
    slug: "molarity",
    category: "chemistry",
    subcategory: "solutions",
    keywords: ["molarity", "concentration", "molar", "solution", "moles", "chemistry"],
    icon: Beaker,
    featured: false,
  },
  dilution: {
    id: "dilution",
    slug: "dilution",
    category: "chemistry",
    subcategory: "solutions",
    keywords: ["dilution", "concentration", "solution", "chemistry", "serial", "dilute"],
    icon: Droplet,
    featured: false,
  },
};
