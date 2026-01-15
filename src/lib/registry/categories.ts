import {
  Atom,
  Calculator,
  Calendar,
  Camera,
  Database,
  DollarSign,
  Globe,
  Heart,
  type LucideIcon,
  Music,
  Palette,
  Video,
  Wrench,
} from "lucide-react";

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  subcategories?: Subcategory[];
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
    id: "datetime",
    slug: "datetime",
    name: "Date & Time",
    description: "Date, time, and duration calculators",
    icon: Calendar,
    subcategories: [
      { id: "date-time", name: "Date & Time", description: "Date and time calculations" },
    ],
  },
  {
    id: "finance",
    slug: "finance",
    name: "Finance",
    description: "Financial calculators and converters",
    icon: DollarSign,
    subcategories: [
      { id: "loans", name: "Loans & Mortgages", description: "Mortgage, auto, personal loans" },
      { id: "interest", name: "Interest & APR", description: "Interest rate calculations" },
      { id: "payments", name: "Payments & Debt", description: "Payment and debt management" },
      { id: "investments", name: "Retirement & Investments", description: "Investment planning" },
      { id: "taxes", name: "Income & Taxes", description: "Tax calculators" },
      { id: "real-estate", name: "Real Estate", description: "Property and rental calculators" },
      { id: "savings", name: "Savings & Currency", description: "Savings and currency tools" },
    ],
  },
  {
    id: "health",
    slug: "health",
    name: "Health",
    description: "Health and fitness calculators",
    icon: Heart,
    subcategories: [
      { id: "body", name: "Body Composition", description: "BMI, body fat, ideal weight" },
      { id: "nutrition", name: "Nutrition", description: "Calories, macros, diet" },
      { id: "fitness", name: "Fitness", description: "Exercise and workout calculators" },
      { id: "pregnancy", name: "Pregnancy & Fertility", description: "Pregnancy tracking" },
      { id: "medical", name: "Medical", description: "Medical calculators" },
    ],
  },
  {
    id: "math",
    slug: "math",
    name: "Math",
    description: "Mathematical calculators",
    icon: Calculator,
    subcategories: [
      { id: "basic", name: "Basic Math", description: "Basic arithmetic operations" },
      { id: "algebra", name: "Algebra", description: "Algebraic calculations" },
      { id: "geometry", name: "Geometry", description: "Shapes and measurements" },
      { id: "statistics", name: "Statistics", description: "Statistical analysis" },
      { id: "numbers", name: "Number Systems", description: "Binary, hex, and more" },
      { id: "advanced", name: "Advanced", description: "Advanced mathematics" },
    ],
  },
  {
    id: "music",
    slug: "music",
    name: "Music",
    description: "Music theory and audio tools",
    icon: Music,
  },
  {
    id: "other",
    slug: "other",
    name: "Other",
    description: "Miscellaneous calculators and tools",
    icon: Wrench,
    subcategories: [
      { id: "education", name: "Education", description: "GPA, grade calculators" },
      { id: "construction", name: "Construction & Home", description: "Building materials" },
      { id: "tech", name: "Tech & Network", description: "IP, bandwidth tools" },
      { id: "weather", name: "Weather", description: "Weather calculations" },
      { id: "automotive", name: "Automotive", description: "Vehicle calculators" },
      { id: "engineering", name: "Engineering & Electrical", description: "Electrical calculations" },
      { id: "science", name: "Science", description: "Scientific calculators" },
      { id: "games", name: "Games & Fun", description: "Fun calculators" },
    ],
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

export function getSubcategoryById(categoryId: string, subcategoryId: string): Subcategory | undefined {
  const category = getCategoryById(categoryId);
  return category?.subcategories?.find((s) => s.id === subcategoryId);
}

export function getSubcategoriesByCategoryId(categoryId: string): Subcategory[] {
  const category = getCategoryById(categoryId);
  return category?.subcategories ?? [];
}
