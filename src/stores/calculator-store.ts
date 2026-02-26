"use client";

import { toast } from "sonner";
import { create, type StateCreator } from "zustand";
import { createUrlSyncMiddleware } from "@/lib/middleware/url-sync";
import { getUrlParams, parseNumberParam, parseStringParam } from "@/lib/utils/url-params";

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
  /**
   * Optional callback invoked when calculate() returns null after a user action.
   * Return a string message to show as a toast.error notification.
   * NOT called on initial mount — only called from setValue/setValues.
   */
  onCalculationError?: (values: T) => string;
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
  onCalculationError,
}: CreateCalculatorStoreOptions<T, R>) {
  const storeCreator: StateCreator<CalculatorState<T, R>> = (set, get) => {
    // Load initial values from URL if syncUrl is enabled
    let mergedInitialValues = initialValues;
    if (syncUrl && typeof window !== "undefined") {
      const urlParams = getUrlParams();
      if (urlParams.size > 0) {
        mergedInitialValues = { ...initialValues };
        for (const [key, value] of urlParams.entries()) {
          if (Object.hasOwn(mergedInitialValues, key)) {
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

        // Fire toast only when user changes a value and calculation fails
        if (result === null && onCalculationError) {
          toast.error(onCalculationError(newValues));
        }

        set({ values: newValues, errors, result });
      },

      setValues: (values: T) => {
        // Validate
        const errors = validate?.(values) ?? {};

        // Calculate if no errors
        const result = Object.keys(errors).length === 0 ? calculate(values) : null;

        // Fire toast only when user changes values and calculation fails
        if (result === null && onCalculationError) {
          toast.error(onCalculationError(values));
        }

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
