import { HardDrive } from "lucide-react";
import type { ConverterMeta } from "@/types";

export const infrastructureConverters: Record<string, ConverterMeta> = {
  "vm-storage-calculator": {
    id: "vm-storage-calculator",
    slug: "vm-storage-calculator",
    category: "infrastructure",
    subcategory: "virtualization",
    keywords: [
      "vm",
      "virtual machine",
      "storage",
      "vmware",
      "vsphere",
      "esx",
      "esxi",
      "capacity",
      "provisioning",
      "thin provisioning",
      "datastore",
      "swap",
      "snapshot",
    ],
    icon: HardDrive,
    featured: true,
  },
  // K8s Capacity Calculator - Phase 28
  // VMware Server Calculator - Phase 29
  // VMware Licensing Calculator - Phase 29
  // Virtualization Cost Calculator - Phase 30
};
