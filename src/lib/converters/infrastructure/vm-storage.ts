/**
 * VM Storage Calculator for VMware vSphere ESX clusters
 *
 * Calculates total storage capacity requirements including:
 * - Provisioned disk capacity (thick or thin provisioning)
 * - Swap file allocation (equal to VM RAM)
 * - Snapshot storage allocation
 * - Configuration and log file overhead
 * - ESX host installation overhead
 * - Growth headroom allocation
 *
 * Based on VMware best practices and reference implementations.
 */

/**
 * VM configuration profile
 */
export interface VmConfig {
  /** Provisioned disk size in GB */
  diskGb: number;
  /** Configured RAM in GB */
  ramGb: number;
  /** Number of VMs with this configuration */
  count: number;
}

/**
 * Input parameters for VM storage calculation
 */
export interface VmStorageInput {
  /** Array of VM configuration profiles */
  vmConfigs: VmConfig[];
  /** Whether to allocate swap files (equal to RAM) */
  includeSwapFiles: boolean;
  /** Config/log overhead per VM in GB (typical: 0.25) */
  configLogGbPerVm: number;
  /** Snapshot allocation as percentage of provisioned storage (0-100) */
  snapshotPercent: number;
  /** Number of ESX hosts in cluster */
  esxHosts: number;
  /** ESX installation overhead per host in GB (typical: 8) */
  esxStorageGbPerHost: number;
  /** Thin provisioning over-subscription percentage (0-100, 0 = thick provisioning) */
  thinProvisioningPercent: number;
  /** Future growth allocation as percentage (0-100) */
  growthPercent: number;
}

/**
 * Detailed breakdown of storage requirements
 */
export interface VmStorageResult {
  /** Total provisioned disk across all VMs */
  totalProvisionedGb: number;
  /** Actual used disk with thin provisioning */
  usedDiskGb: number;
  /** Over-subscribed capacity (provisioned - used) */
  overSubscribedGb: number;
  /** Snapshot allocation */
  snapshotGb: number;
  /** Swap file allocation (sum of RAM if enabled) */
  swapGb: number;
  /** Config/log files allocation */
  configLogGb: number;
  /** Total VM storage (used + snapshot + swap + configLog) */
  totalVmStorageGb: number;
  /** ESX hosts overhead */
  esxStorageGb: number;
  /** Growth headroom allocation */
  growthAllocationGb: number;
  /** Grand total required storage */
  totalRequiredGb: number;
  /** Total number of VMs */
  totalVmCount: number;
  /** Percentage breakdown of each component */
  percentages: {
    usedDisk: number;
    overSubscribed: number;
    snapshot: number;
    swap: number;
    configLog: number;
    esxOverhead: number;
    growth: number;
  };
  /** Step-by-step calculation breakdown */
  steps: string[];
}

/**
 * Calculate VMware vSphere ESX cluster storage capacity requirements
 *
 * @param input - VM storage calculation parameters
 * @returns Detailed storage breakdown or null if invalid input
 *
 * @example
 * // Calculate storage for 2 VM profiles with thin provisioning
 * const result = calculateVmStorage({
 *   vmConfigs: [
 *     { diskGb: 100, ramGb: 8, count: 10 },
 *     { diskGb: 200, ramGb: 16, count: 5 }
 *   ],
 *   includeSwapFiles: true,
 *   configLogGbPerVm: 0.25,
 *   snapshotPercent: 20,
 *   esxHosts: 3,
 *   esxStorageGbPerHost: 8,
 *   thinProvisioningPercent: 33,
 *   growthPercent: 30
 * });
 */
export function calculateVmStorage(input: VmStorageInput): VmStorageResult | null {
  const steps: string[] = [];

  // Validation: Check for empty VM configs
  if (input.vmConfigs.length === 0) {
    return null;
  }

  // Validation: Check for negative values in VM configs
  for (const config of input.vmConfigs) {
    if (config.diskGb < 0 || config.ramGb < 0 || config.count < 0) {
      return null;
    }
  }

  // Validation: Check percentage ranges
  if (
    input.snapshotPercent < 0 ||
    input.snapshotPercent > 100 ||
    input.thinProvisioningPercent < 0 ||
    input.thinProvisioningPercent > 100 ||
    input.growthPercent < 0 ||
    input.growthPercent > 100
  ) {
    return null;
  }

  // Validation: Check ESX hosts minimum
  if (input.esxHosts < 1) {
    return null;
  }

  // Step 1: Calculate total provisioned disk and VM count
  const totalProvisionedGb = input.vmConfigs.reduce(
    (sum, config) => sum + config.diskGb * config.count,
    0
  );
  const totalVmCount = input.vmConfigs.reduce((sum, config) => sum + config.count, 0);
  steps.push(
    `Total provisioned disk: ${totalProvisionedGb.toFixed(2)} GB across ${totalVmCount} VMs`
  );

  // Step 2: Calculate used disk (with thin provisioning)
  const usedDiskGb = totalProvisionedGb * (1 - input.thinProvisioningPercent / 100);
  const overSubscribedGb = totalProvisionedGb - usedDiskGb;
  if (input.thinProvisioningPercent > 0) {
    steps.push(
      `Thin provisioning (${input.thinProvisioningPercent}%): Used ${usedDiskGb.toFixed(2)} GB, over-subscribed ${overSubscribedGb.toFixed(2)} GB`
    );
  } else {
    steps.push(`Thick provisioning: ${usedDiskGb.toFixed(2)} GB (no over-subscription)`);
  }

  // Step 3: Calculate snapshot allocation
  const snapshotGb = totalProvisionedGb * (input.snapshotPercent / 100);
  steps.push(`Snapshot allocation (${input.snapshotPercent}%): ${snapshotGb.toFixed(2)} GB`);

  // Step 4: Calculate swap file allocation
  const swapGb = input.includeSwapFiles
    ? input.vmConfigs.reduce((sum, config) => sum + config.ramGb * config.count, 0)
    : 0;
  if (input.includeSwapFiles) {
    steps.push(`Swap files (equal to RAM): ${swapGb.toFixed(2)} GB`);
  } else {
    steps.push("Swap files: Not included (0 GB)");
  }

  // Step 5: Calculate config/log allocation
  const configLogGb = totalVmCount * input.configLogGbPerVm;
  steps.push(
    `Config/log files (${input.configLogGbPerVm} GB × ${totalVmCount} VMs): ${configLogGb.toFixed(2)} GB`
  );

  // Step 6: Calculate total VM storage
  const totalVmStorageGb = usedDiskGb + snapshotGb + swapGb + configLogGb;
  steps.push(`Total VM storage: ${totalVmStorageGb.toFixed(2)} GB`);

  // Step 7: Calculate ESX overhead
  const esxStorageGb = input.esxHosts * input.esxStorageGbPerHost;
  steps.push(
    `ESX overhead (${input.esxStorageGbPerHost} GB × ${input.esxHosts} hosts): ${esxStorageGb.toFixed(2)} GB`
  );

  // Step 8: Calculate subtotal before growth
  const subtotal = totalVmStorageGb + esxStorageGb;
  steps.push(`Subtotal (VM + ESX): ${subtotal.toFixed(2)} GB`);

  // Step 9: Calculate growth allocation
  const growthAllocationGb = subtotal * (input.growthPercent / 100);
  steps.push(`Growth allocation (${input.growthPercent}%): ${growthAllocationGb.toFixed(2)} GB`);

  // Step 10: Calculate total required storage
  const totalRequiredGb = subtotal + growthAllocationGb;
  steps.push(`Total required storage: ${totalRequiredGb.toFixed(2)} GB`);

  // Calculate percentage breakdown
  const percentages = {
    usedDisk: (usedDiskGb / totalRequiredGb) * 100,
    overSubscribed: (overSubscribedGb / totalRequiredGb) * 100,
    snapshot: (snapshotGb / totalRequiredGb) * 100,
    swap: (swapGb / totalRequiredGb) * 100,
    configLog: (configLogGb / totalRequiredGb) * 100,
    esxOverhead: (esxStorageGb / totalRequiredGb) * 100,
    growth: (growthAllocationGb / totalRequiredGb) * 100,
  };

  return {
    totalProvisionedGb,
    usedDiskGb,
    overSubscribedGb,
    snapshotGb,
    swapGb,
    configLogGb,
    totalVmStorageGb,
    esxStorageGb,
    growthAllocationGb,
    totalRequiredGb,
    totalVmCount,
    percentages,
    steps,
  };
}
