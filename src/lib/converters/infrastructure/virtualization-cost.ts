/**
 * Virtualization TCO (Total Cost of Ownership) Calculator
 *
 * Calculates total cost of ownership for virtualization infrastructure
 * including hardware (CAPEX) and operational expenses (OPEX).
 *
 * TCO Components:
 * - CAPEX: Hardware costs (servers, storage, network)
 * - OPEX: Software licensing, power, datacenter space, labor
 */

/**
 * Default values for common datacenter metrics
 */
const DEFAULT_PUE = 1.5; // Typical data center Power Usage Effectiveness
const HOURS_PER_YEAR = 8760; // 365 days × 24 hours

/**
 * Input parameters for virtualization cost calculation
 */
export interface VirtualizationCostInput {
  // Hardware costs (CAPEX)
  /** Total cost of servers ($) */
  serverCost: number;
  /** Total cost of storage ($) */
  storageCost: number;
  /** Total cost of network equipment ($) */
  networkCost: number;

  // Software costs (annual OPEX)
  /** Annual VMware licensing ($) */
  vmwareLicenseCost: number;
  /** Annual OS licensing ($) */
  osLicenseCost: number;
  /** Annual backup software ($) */
  backupSoftwareCost: number;

  // Operational costs
  /** Electricity cost ($/kWh) */
  powerCostPerKwh: number;
  /** Total power consumption (kW) */
  totalPowerKw: number;
  /** Power Usage Effectiveness (typically 1.3-2.0) */
  pue: number;
  /** Datacenter cost per rack unit per month ($) */
  datacenterCostPerRu: number;
  /** Total rack units used */
  totalRackUnits: number;
  /** Annual labor/admin cost ($) */
  laborCostAnnual: number;

  // Configuration
  /** Total VMs in environment */
  vmCount: number;
  /** Analysis term in years */
  termYears: 1 | 3 | 5;
}

/**
 * Detailed cost breakdown and analysis
 */
export interface VirtualizationCostResult {
  /** Total capital expenditure (hardware) */
  capex: number;
  /** Total annual operating expenditure */
  opexAnnual: number;
  /** Total OPEX over term */
  opexTotal: number;
  /** Total Cost of Ownership (CAPEX + OPEX over term) */
  tco: number;
  /** TCO per VM over term */
  costPerVm: number;
  /** Monthly cost per VM */
  costPerVmMonthly: number;

  /** Cost breakdown by category */
  breakdown: {
    /** Total hardware (CAPEX) */
    hardware: number;
    /** Total software over term */
    software: number;
    /** Total power cost over term */
    power: number;
    /** Total datacenter cost over term */
    datacenter: number;
    /** Total labor cost over term */
    labor: number;
  };

  /** Percentage breakdown for visualization */
  percentages: {
    /** % of TCO from hardware */
    hardware: number;
    /** % of TCO from software */
    software: number;
    /** % of TCO from power */
    power: number;
    /** % of TCO from datacenter */
    datacenter: number;
    /** % of TCO from labor */
    labor: number;
  };

  /** Step-by-step calculation breakdown */
  steps: string[];
}

/**
 * Calculate virtualization infrastructure Total Cost of Ownership (TCO)
 *
 * Implements TCO analysis for virtualization infrastructure including:
 * - CAPEX: Hardware acquisition costs
 * - OPEX: Software, power (with PUE), datacenter space, and labor
 *
 * @param input - Virtualization cost calculation parameters
 * @returns Detailed cost breakdown or null if invalid input
 *
 * @example
 * // Calculate TCO for 4 hosts over 3 years
 * const result = calculateVirtualizationCost({
 *   serverCost: 120000,
 *   storageCost: 50000,
 *   networkCost: 30000,
 *   vmwareLicenseCost: 35000,
 *   osLicenseCost: 10000,
 *   backupSoftwareCost: 5000,
 *   powerCostPerKwh: 0.12,
 *   totalPowerKw: 8,
 *   pue: 1.5,
 *   datacenterCostPerRu: 25,
 *   totalRackUnits: 16,
 *   laborCostAnnual: 40000,
 *   vmCount: 100,
 *   termYears: 3
 * });
 */
export function calculateVirtualizationCost(
  input: VirtualizationCostInput
): VirtualizationCostResult | null {
  const steps: string[] = [];

  // Validation: All costs must be non-negative
  if (
    input.serverCost < 0 ||
    input.storageCost < 0 ||
    input.networkCost < 0 ||
    input.vmwareLicenseCost < 0 ||
    input.osLicenseCost < 0 ||
    input.backupSoftwareCost < 0 ||
    input.powerCostPerKwh < 0 ||
    input.totalPowerKw < 0 ||
    input.datacenterCostPerRu < 0 ||
    input.totalRackUnits < 0 ||
    input.laborCostAnnual < 0
  ) {
    return null;
  }

  // Validation: PUE must be >= 1.0 (physical minimum)
  if (input.pue < 1.0) {
    return null;
  }

  // Validation: VM count must be positive
  if (input.vmCount <= 0) {
    return null;
  }

  // Validation: Term years must be 1, 3, or 5
  if (![1, 3, 5].includes(input.termYears)) {
    return null;
  }

  // Step 1: Calculate CAPEX (hardware costs)
  const capex = input.serverCost + input.storageCost + input.networkCost;

  steps.push(`CAPEX (Hardware Costs):`);
  steps.push(`  Servers: $${input.serverCost.toLocaleString()}`);
  steps.push(`  Storage: $${input.storageCost.toLocaleString()}`);
  steps.push(`  Network: $${input.networkCost.toLocaleString()}`);
  steps.push(`  Total CAPEX: $${capex.toLocaleString()}`);
  steps.push("");

  // Step 2: Calculate annual power cost (with PUE)
  const annualPowerCost = input.totalPowerKw * input.pue * HOURS_PER_YEAR * input.powerCostPerKwh;

  steps.push(`Annual Operating Expenses (OPEX):`);
  steps.push(
    `  Power: ${input.totalPowerKw} kW × ${input.pue} PUE × ${HOURS_PER_YEAR} hours × $${input.powerCostPerKwh}/kWh`
  );
  steps.push(
    `  Annual power cost: $${annualPowerCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  );

  // Step 3: Calculate annual datacenter cost
  const annualDatacenterCost = input.datacenterCostPerRu * input.totalRackUnits * 12;

  steps.push(
    `  Datacenter: ${input.totalRackUnits} RU × $${input.datacenterCostPerRu}/RU/month × 12 months`
  );
  steps.push(
    `  Annual datacenter cost: $${annualDatacenterCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  );

  // Step 4: Calculate annual software cost
  const annualSoftwareCost =
    input.vmwareLicenseCost + input.osLicenseCost + input.backupSoftwareCost;

  steps.push(
    `  Software: $${input.vmwareLicenseCost.toLocaleString()} (VMware) + $${input.osLicenseCost.toLocaleString()} (OS) + $${input.backupSoftwareCost.toLocaleString()} (Backup)`
  );
  steps.push(`  Annual software cost: $${annualSoftwareCost.toLocaleString()}`);

  // Step 5: Annual labor cost
  steps.push(`  Labor: $${input.laborCostAnnual.toLocaleString()}`);

  // Step 6: Calculate total annual OPEX
  const opexAnnual =
    annualPowerCost + annualDatacenterCost + annualSoftwareCost + input.laborCostAnnual;

  steps.push(
    `  Total Annual OPEX: $${opexAnnual.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  );
  steps.push("");

  // Step 7: Calculate total OPEX over term
  const opexTotal = opexAnnual * input.termYears;

  steps.push(
    `Total OPEX over ${input.termYears}-year term: $${opexAnnual.toLocaleString(undefined, { maximumFractionDigits: 2 })} × ${input.termYears} = $${opexTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  );
  steps.push("");

  // Step 8: Calculate TCO
  const tco = capex + opexTotal;

  steps.push(
    `Total Cost of Ownership (TCO): $${capex.toLocaleString()} (CAPEX) + $${opexTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })} (OPEX) = $${tco.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  );
  steps.push("");

  // Step 9: Calculate cost per VM
  const costPerVm = tco / input.vmCount;

  steps.push(
    `Cost per VM over ${input.termYears}-year term: $${tco.toLocaleString(undefined, { maximumFractionDigits: 2 })} ÷ ${input.vmCount} VMs = $${costPerVm.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  );

  // Step 10: Calculate monthly cost per VM
  const costPerVmMonthly = tco / input.termYears / 12 / input.vmCount;

  steps.push(
    `Monthly cost per VM: $${costPerVm.toLocaleString(undefined, { maximumFractionDigits: 2 })} ÷ ${input.termYears * 12} months = $${costPerVmMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
  );

  // Build breakdown by category (over full term)
  const breakdown = {
    hardware: capex,
    software: annualSoftwareCost * input.termYears,
    power: annualPowerCost * input.termYears,
    datacenter: annualDatacenterCost * input.termYears,
    labor: input.laborCostAnnual * input.termYears,
  };

  // Calculate percentage breakdown
  const percentages = {
    hardware: (breakdown.hardware / tco) * 100,
    software: (breakdown.software / tco) * 100,
    power: (breakdown.power / tco) * 100,
    datacenter: (breakdown.datacenter / tco) * 100,
    labor: (breakdown.labor / tco) * 100,
  };

  return {
    capex,
    opexAnnual,
    opexTotal,
    tco,
    costPerVm,
    costPerVmMonthly,
    breakdown,
    percentages,
    steps,
  };
}
