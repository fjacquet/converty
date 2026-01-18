"use client";

import { create } from "zustand";
import { parseIPInput } from "@/lib/converters/network/ip-parser";
import { calculateSubnet } from "@/lib/converters/network/subnet-calculator";
import type { SubnetResult } from "@/lib/converters/network/types";
import { createUrlSyncMiddleware } from "@/lib/middleware/url-sync";
import { getUrlParams, parseStringParam } from "@/lib/utils/url-params";

/**
 * Subnet calculator state interface
 */
export interface SubnetCalculatorState {
  // Inputs
  ipInput: string;
  subnetMask: string;

  // Results
  result: SubnetResult | null;
  error: string | null;

  // Actions
  setIPInput: (value: string) => void;
  setSubnetMask: (value: string) => void;
  calculate: () => void;
  reset: () => void;
}

/**
 * Initial state for subnet calculator
 */
const initialState = {
  ipInput: "",
  subnetMask: "",
  result: null,
  error: null,
};

/**
 * Zustand store for subnet calculator with URL synchronization
 *
 * Features:
 * - URL state sync for shareability
 * - Auto-calculation on complete input
 * - Support for CIDR notation (192.168.1.0/24) and subnet mask notation
 * - IPv4 and IPv6 support
 */
export const useSubnetCalculatorStore = create<SubnetCalculatorState>()(
  createUrlSyncMiddleware<SubnetCalculatorState>({
    enabled: true,
    debounceMs: 300,
    selectState: (state) => ({
      ipInput: state.ipInput,
      subnetMask: state.subnetMask,
    }),
  })((set, get) => {
    // Load initial values from URL params if present
    let loadedIpInput = initialState.ipInput;
    let loadedSubnetMask = initialState.subnetMask;

    if (typeof window !== "undefined") {
      const urlParams = getUrlParams();
      if (Object.keys(urlParams).length > 0) {
        loadedIpInput = parseStringParam(urlParams.ipInput, initialState.ipInput);
        loadedSubnetMask = parseStringParam(urlParams.subnetMask, initialState.subnetMask);
      }
    }

    return {
      // Initialize with URL params if present
      ipInput: loadedIpInput,
      subnetMask: loadedSubnetMask,
      result: null,
      error: null,

      setIPInput: (value: string) => {
        set({ ipInput: value, error: null });

        // Auto-calculate if input contains "/" (CIDR notation complete)
        if (value.includes("/") && value.split("/")[1]) {
          // Use setTimeout to ensure state is updated before calculation
          setTimeout(() => {
            get().calculate();
          }, 0);
        }
      },

      setSubnetMask: (value: string) => {
        set({ subnetMask: value, error: null });

        // Auto-calculate if both ipInput and subnetMask present
        const currentIpInput = get().ipInput;
        if (currentIpInput && value) {
          // Use setTimeout to ensure state is updated before calculation
          setTimeout(() => {
            get().calculate();
          }, 0);
        }
      },

      calculate: () => {
        const { ipInput, subnetMask } = get();

        // Skip if no input
        if (!ipInput) {
          set({ result: null, error: null });
          return;
        }

        try {
          // Parse input (handles both CIDR and subnet mask notation)
          const parsed = parseIPInput(ipInput, subnetMask || undefined);

          // Calculate subnet
          const result = calculateSubnet(parsed.ipAddress, parsed.cidr);

          // Set result, clear error
          set({ result, error: null });
        } catch (err) {
          // Set error message, clear result
          set({
            result: null,
            error: err instanceof Error ? err.message : "Invalid input",
          });
        }
      },

      reset: () => {
        set(initialState);
      },
    };
  })
);
