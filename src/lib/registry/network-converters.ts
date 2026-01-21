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

  // CIDR range calculator
  "cidr-range": {
    id: "cidr-range",
    slug: "cidr-range",
    category: "network",
    subcategory: "ip",
    keywords: ["cidr", "range", "ip", "subnet", "contains", "check", "ipv4", "ipv6"],
    icon: Network,
    featured: false,
  },

  // IP address calculator
  "ip-calculator": {
    id: "ip-calculator",
    slug: "ip-calculator",
    category: "network",
    subcategory: "ip",
    keywords: ["ip", "address", "class", "private", "public", "ipv4", "ipv6", "classification"],
    icon: Network,
    featured: false,
  },
};
