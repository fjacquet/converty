"use client";

import { create, type StateCreator } from "zustand";
import { createUrlSyncMiddleware } from "@/lib/middleware/url-sync";
import { parseNumberParam, parseStringParam } from "@/lib/utils/url-params";

/**
 * Calculator store state interface
 * @template T - Input values type
 * @template R - Result type
 */
export interface CalculatorState<T extends object, R> {
  /** Current input values */
  values: T;
  /** Calculated result (null if invalid inputs) */
  result: R | null;
  /** Validation errors by field */
  errors: Partial<Record<keyof T, string>>;
  /** Set a single value */
  setValue: <K extends keyof T>(key: K, value: T[K]) => void;
  /** Set all values at once */
  setValues: (values: T) => void;
  /** Reset to initial values */
  reset: () => void;
}

/**
 * Options for creating a calculator store
 * @template T - Input values type
 * @template R - Result type
 */
export interface CreateCalculatorStoreOptions<T extends object, R> {
  /** Unique name for URL sync */
  name: string;
  /** Initial values for the calculator */
  initialValues: T;
  /** Calculation function (returns null for invalid inputs) */
  calculate: (values: T) => R | null;
  /** Optional validation function */
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  /** Whether to sync state to URL (default: true) */
  syncUrl?: boolean;
  /** Debounce time for URL updates in ms (default: 150) */
  debounceMs?: number;
}

// URL sync helpers (moved to middleware)
function getUrlParams(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Factory function for creating calculator stores with Zustand
 *
 * @example
 * ```typescript
 * const useAgeStore = createCalculatorStore({
 *   name: "age-calculator",
 *   initialValues: { birthDate: "" },
 *   calculate: calculateAge,
 * });
 *
 * function AgeCalculator() {
 *   const { values, setValue, result } = useAgeStore();
 *   // ...
 * }
 * ```
 */
export function createCalculatorStore<T extends object, R>({
  initialValues,
  calculate,
  validate,
  syncUrl = true,
  debounceMs = 150,
}: CreateCalculatorStoreOptions<T, R>) {
  const storeCreator: StateCreator<CalculatorState<T, R>> = (set, get) => {
    // Load initial values from URL if syncUrl is enabled
    let mergedInitialValues = initialValues;
    if (syncUrl && typeof window !== "undefined") {
      const urlParams = getUrlParams();
      if (Object.keys(urlParams).length > 0) {
        mergedInitialValues = { ...initialValues };
        for (const [key, value] of Object.entries(urlParams)) {
          if (key in mergedInitialValues) {
            const originalValue = (mergedInitialValues as Record<string, unknown>)[key];
            if (typeof originalValue === "number") {
              (mergedInitialValues as Record<string, unknown>)[key] = parseNumberParam(
                value,
                originalValue
              );
            } else if (typeof originalValue === "string") {
              (mergedInitialValues as Record<string, unknown>)[key] = parseStringParam(
                value,
                originalValue
              );
            } else {
              // For other types, keep the URL value as-is (e.g., boolean, object)
              (mergedInitialValues as Record<string, unknown>)[key] = value;
            }
          }
        }
      }
    }

    return {
      values: mergedInitialValues,
      result: null,
      errors: {},

      setValue: <K extends keyof T>(key: K, value: T[K]) => {
        const currentState = get();
        const newValues = { ...currentState.values, [key]: value };

        // Validate
        const errors = validate?.(newValues) ?? {};

        // Calculate if no errors
        const result = Object.keys(errors).length === 0 ? calculate(newValues) : null;

        set({ values: newValues, errors, result });
      },

      setValues: (values: T) => {
        // Validate
        const errors = validate?.(values) ?? {};

        // Calculate if no errors
        const result = Object.keys(errors).length === 0 ? calculate(values) : null;

        set({ values, errors, result });
      },

      reset: () => {
        set({
          values: initialValues,
          errors: {},
          result: null,
        });
      },
    };
  };

  // Apply URL sync middleware conditionally
  if (syncUrl) {
    return create<CalculatorState<T, R>>()(
      createUrlSyncMiddleware<CalculatorState<T, R>>({
        enabled: true,
        debounceMs,
        selectState: (state) => state.values, // Only sync the 'values' object, not result/errors
      })(storeCreator)
    );
  }

  return create<CalculatorState<T, R>>()(storeCreator);
}

/**
 * Helper type for extracting store type from createCalculatorStore
 */
export type CalculatorStore<T extends object, R> = ReturnType<typeof createCalculatorStore<T, R>>;
