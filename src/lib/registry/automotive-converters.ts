import { Disc } from "lucide-react";
import type { ConverterMeta } from "@/types";

export const automotiveConverters: Record<string, ConverterMeta> = {
  "tire-sizing": {
    id: "tire-sizing",
    slug: "tire-sizing",
    category: "automotive",
    subcategory: "tires",
    keywords: [
      "tire",
      "tyre",
      "size",
      "dimension",
      "diameter",
      "speedometer",
      "205/55R16",
      "aspect ratio",
      "rim",
      "wheel",
      "load index",
      "speed rating",
      "comparison",
    ],
    icon: Disc,
    featured: false,
  },
};
