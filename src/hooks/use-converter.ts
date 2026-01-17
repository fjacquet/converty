"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "./use-debounce";
import { useUrlState } from "./use-url-state";

export interface ConverterResult<R = unknown> {
  value: R;
  formatted?: string;
}

export interface UseConverterOptions<T extends object, R = unknown> {
  initialValues: T;
  calculate: (values: T) => ConverterResult<R> | null;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  syncUrl?: boolean;
  debounceMs?: number;
}

export function useConverter<T extends object, R = unknown>({
  initialValues,
  calculate,
  validate,
  syncUrl = false,
  debounceMs = 150,
}: UseConverterOptions<T, R>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const { updateUrl, getFromUrl } = useUrlState();

  const debouncedValues = useDebounce(values, debounceMs);

  // Load values from URL on mount
  useEffect(() => {
    if (syncUrl) {
      const urlValues = getFromUrl<Record<string, string | number>>();
      if (urlValues) {
        setValues((prev) => ({ ...prev, ...urlValues }) as T);
      }
    }
  }, [getFromUrl, syncUrl]);

  // Update URL when values change
  useEffect(() => {
    if (syncUrl) {
      const urlParams: Record<string, string | number> = {};
      Object.entries(debouncedValues as object).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          urlParams[key] = value as string | number;
        }
      });
      updateUrl(urlParams);
    }
  }, [debouncedValues, syncUrl, updateUrl]);

  // Calculate result
  const result = useMemo(() => {
    if (validate) {
      const validationErrors = validate(debouncedValues);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
        return null;
      }
    }
    return calculate(debouncedValues);
  }, [debouncedValues, calculate, validate]);

  const setValue = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    setValue,
    setValues,
    result,
    errors,
    reset,
  };
}
