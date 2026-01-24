import { Scale } from "lucide-react";
import type { ConverterMeta } from "@/types";

export const cookingConverters: Record<string, ConverterMeta> = {
  "cooking-units": {
    id: "cooking-units",
    slug: "cooking-units",
    category: "cooking",
    subcategory: "units",
    keywords: [
      "cooking",
      "units",
      "convert",
      "cups",
      "tablespoon",
      "teaspoon",
      "ml",
      "grams",
      "liters",
      "ounces",
      "volume",
      "weight",
      "metric",
      "imperial",
      "kitchen",
      "baking",
      "density",
      "flour",
      "sugar",
    ],
    icon: Scale,
    featured: true,
  },
};
