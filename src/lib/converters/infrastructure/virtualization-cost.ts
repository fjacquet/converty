/**
 * Virtualization Cost Calculator
 *
 * Calculates Total Cost of Ownership (TCO) for virtualization infrastructure
 * including hardware (CAPEX) and operational expenses (OPEX).
 *
 * TCO Formula:
 * - CAPEX: Hardware costs (servers, storage, network)
 * - OPEX: Annual operating costs (power, software, datacenter, labor)
 * - TCO: CAPEX + (OPEX × term years)
 */

/**
 * Default Power Usage Effectiveness (typical data center)
 */
const DEFAULT_PUE = 1.5;

/**
 * Hours in a year (for power cost calculations)
 */
const HOURS_PER_YEAR = 8760;

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
  /** Annual VMware licensing cost ($) */
  vmwareLicenseCost: number;
  /** Annual OS licensing cost ($) */
  osLicenseCost: number;
  /** Annual backup software cost ($) */
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
 * Cost breakdown by category
 */
export interface CostBreakdown {
  /** Total hardware costs (CAPEX) */
  hardware: number;
  /** Total software costs over term */
  software: number;
  /** Total power costs over term */
  power: number;
  /** Total datacenter costs over term */
  datacenter: number;
  /** Total labor costs over term */
  labor: number;
}

/**
 * Percentage breakdown of costs
 */
export interface CostPercentages {
  /** Percentage from hardware */
  hardware: number;
  /** Percentage from software */
  software: number;
  /** Percentage from power */
  power: number;
  /** Percentage from datacenter */
  datacenter: number;
  /** Percentage from labor */
  labor: number;
}

/**
 * Result of virtualization cost calculation
 */
export interface VirtualizationCostResult {
  /** Total capital expenditure (hardware) */
  capex: number;
  /** Total annual operating expenditure */
  opexAnnual: number;
  /** Total OPEX over term */
  opexTotal: number;
  /** Total Cost of Ownership */
  tco: number;
  /** TCO per VM over term */
  costPerVm: number;
  /** Monthly cost per VM */
  costPerVmMonthly: number;
  /** Cost breakdown by category */
  breakdown: CostBreakdown;
  /** Percentage breakdown */
  percentages: CostPercentages;
  /** Step-by-step calculation breakdown */
  steps: string[];
}

/**
 * Calculate virtualization Total Cost of Ownership
 *
 * Implements TCO calculation for virtualization infrastructure including:
 * - CAPEX: Hardware costs (servers, storage, network)
 * - OPEX: Software (VMware, OS, backup), Power (with PUE), Datacenter, Labor
 * - Cost per VM metrics
 *
 * @param input - Virtualization cost calculation parameters
 * @returns Detailed cost breakdown or null if invalid input
 *
 * @example
 * // Calculate TCO for 100 VMs over 3 years
 * const result = calculateVirtualizationCost({
 *   serverCost: 100000,
 *   storageCost: 50000,
 *   networkCost: 20000,
 *   vmwareLicenseCost: 35000,
 *   osLicenseCost: 10000,
 *   backupSoftwareCost: 5000,
 *   powerCostPerKwh: 0.12,
 *   totalPowerKw: 10,
 *   pue: 1.5,
 *   datacenterCostPerRu: 50,
 *   totalRackUnits: 20,
 *   laborCostAnnual: 80000,
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

  steps.push(
    `CAPEX (Hardware): $${input.serverCost.toLocaleString()} (servers) + $${input.storageCost.toLocaleString()} (storage) + $${input.networkCost.toLocaleString()} (network) = $${capex.toLocaleString()}`
  );

  // Step 2: Calculate annual power cost (includes PUE)
  const annualPowerCost = input.totalPowerKw * input.pue * HOURS_PER_YEAR * input.powerCostPerKwh;

  steps.push(
    `Annual power cost: ${input.totalPowerKw} kW × ${input.pue} PUE × ${HOURS_PER_YEAR} hours × $${input.powerCostPerKwh}/kWh = $${annualPowerCost.toLocaleString()}`
  );

  // Step 3: Calculate annual datacenter cost
  const annualDatacenterCost = input.datacenterCostPerRu * input.totalRackUnits * 12;

  steps.push(
    `Annual datacenter cost: $${input.datacenterCostPerRu}/RU/month × ${input.totalRackUnits} RU × 12 months = $${annualDatacenterCost.toLocaleString()}`
  );

  // Step 4: Calculate annual software cost
  const annualSoftwareCost =
    input.vmwareLicenseCost + input.osLicenseCost + input.backupSoftwareCost;

  steps.push(
    `Annual software cost: $${input.vmwareLicenseCost.toLocaleString()} (VMware) + $${input.osLicenseCost.toLocaleString()} (OS) + $${input.backupSoftwareCost.toLocaleString()} (backup) = $${annualSoftwareCost.toLocaleString()}`
  );

  // Step 5: Calculate total annual OPEX
  const opexAnnual =
    annualPowerCost + annualDatacenterCost + annualSoftwareCost + input.laborCostAnnual;

  steps.push(
    `Annual OPEX: $${annualPowerCost.toLocaleString()} (power) + $${annualDatacenterCost.toLocaleString()} (datacenter) + $${annualSoftwareCost.toLocaleString()} (software) + $${input.laborCostAnnual.toLocaleString()} (labor) = $${opexAnnual.toLocaleString()}`
  );

  // Step 6: Calculate total OPEX over term
  const opexTotal = opexAnnual * input.termYears;

  steps.push(
    `Total OPEX (${input.termYears}-year term): $${opexAnnual.toLocaleString()} × ${input.termYears} = $${opexTotal.toLocaleString()}`
  );

  // Step 7: Calculate TCO
  const tco = capex + opexTotal;

  steps.push(
    `Total Cost of Ownership: $${capex.toLocaleString()} (CAPEX) + $${opexTotal.toLocaleString()} (OPEX) = $${tco.toLocaleString()}`
  );

  // Step 8: Calculate cost per VM
  const costPerVm = tco / input.vmCount;

  steps.push(
    `Cost per VM (${input.termYears}-year term): $${tco.toLocaleString()} ÷ ${input.vmCount} VMs = $${costPerVm.toLocaleString()}`
  );

  // Step 9: Calculate monthly cost per VM
  const costPerVmMonthly = tco / input.termYears / 12 / input.vmCount;

  steps.push(
    `Monthly cost per VM: $${tco.toLocaleString()} ÷ ${input.termYears} years ÷ 12 months ÷ ${input.vmCount} VMs = $${costPerVmMonthly.toLocaleString()}`
  );

  // Build breakdown
  const breakdown: CostBreakdown = {
    hardware: capex,
    software: annualSoftwareCost * input.termYears,
    power: annualPowerCost * input.termYears,
    datacenter: annualDatacenterCost * input.termYears,
    labor: input.laborCostAnnual * input.termYears,
  };

  // Build percentages
  const percentages: CostPercentages = {
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
