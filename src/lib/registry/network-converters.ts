import { Network } from "lucide-react";
import type { ConverterMeta } from "@/types";

export const networkConverters: Record<string, ConverterMeta> = {
  // Subnet calculators
  "subnet-calculator": {
    id: "subnet-calculator",
    slug: "subnet-calculator",
    category: "network",
    subcategory: "subnet",
    keywords: ["subnet", "cidr", "ip", "ipv4", "ipv6", "network", "mask", "supernet", "calculator"],
    icon: Network,
    featured: true,
  },
};
