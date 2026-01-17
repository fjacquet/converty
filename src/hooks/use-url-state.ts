"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { parseNumberParam, parseStringParam } from "@/lib/utils/url-params";

export function useUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateUrl = useCallback(
    (values: Record<string, string | number | boolean | undefined | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      const newUrl = `${pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const getFromUrl = useCallback(<
    T extends Record<string, string | number>,
  >(): Partial<T> | null => {
    const result: Record<string, string | number> = {};

    searchParams.forEach((value, key) => {
      // Type-safe parsing: try number first, fallback to string
      const numValue = Number(value);
      if (!Number.isNaN(numValue)) {
        // Valid number - use type-safe number parser
        result[key] = parseNumberParam(value, 0);
      } else {
        // Not a number - use type-safe string parser
        result[key] = parseStringParam(value, "");
      }
    });

    return Object.keys(result).length > 0 ? (result as Partial<T>) : null;
  }, [searchParams]);

  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  return { updateUrl, getFromUrl, getParam };
}
