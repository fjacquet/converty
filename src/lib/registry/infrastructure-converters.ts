import { HardDrive, Server } from "lucide-react";
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
  "k8s-capacity-calculator": {
    id: "k8s-capacity-calculator",
    slug: "k8s-capacity-calculator",
    category: "infrastructure",
    subcategory: "containers",
    keywords: [
      "kubernetes",
      "k8s",
      "capacity",
      "node sizing",
      "cluster",
      "pods",
      "containers",
      "resources",
      "cpu",
      "memory",
      "scheduling",
      "allocatable",
      "utilization",
    ],
    icon: Server,
    featured: true,
  },
  // VMware Server Calculator - Phase 29
  // VMware Licensing Calculator - Phase 29
  // Virtualization Cost Calculator - Phase 30
};
