import { Hash } from "lucide-react";
import type { ConverterMeta } from "@/types";

export const cryptoConverters: Record<string, ConverterMeta> = {
  "hash-calculator": {
    id: "hash-calculator",
    slug: "hash",
    category: "crypto",
    subcategory: "hashing",
    keywords: [
      "hash",
      "md5",
      "sha1",
      "sha256",
      "sha512",
      "checksum",
      "digest",
      "crypto",
      "security",
    ],
    icon: Hash,
    featured: true,
  },
};
