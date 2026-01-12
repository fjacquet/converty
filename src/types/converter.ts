import { LucideIcon } from "lucide-react";

export interface ConverterMeta {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
  icon: LucideIcon;
  featured?: boolean;
}

export interface CalculationStep {
  label: string;
  value: string | number;
}
