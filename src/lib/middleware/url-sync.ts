import type { StateCreator } from "zustand";
import { getUrlParams } from "@/lib/utils/url-params";

/**
 * Configuration options for URL sync middleware
 */
export interface UrlSyncOptions<T = object> {
  /** Whether to enable URL sync (default: true) */
  enabled?: boolean;
  /** Debounce time in milliseconds (default: 150) */
  debounceMs?: number;
  /** Only sync these keys to URL (default: all keys) */
  include?: string[];
  /** Exclude these keys from URL sync (default: none) */
  exclude?: string[];
  /** Select which part of state to sync (default: sync entire state) */
  selectState?: (state: T) => object;
}

/**
 * Creates URL sync middleware with isolated debounce timer
 *
 * CRITICAL: This is a factory function. Each invocation creates
 * a NEW middleware instance with its OWN debounce timer via closure.
 * This prevents timer conflicts when multiple stores exist on the same page.
 *
 * @template T - The store state type
 * @param options - Configuration options for URL sync behavior
 * @returns Zustand middleware that syncs state to URL parameters
 *
 * @example
 * ```typescript
 * const useStore = create<State>()(
 *   createUrlSyncMiddleware({ debounceMs: 200 })(
 *     (set) => ({ count: 0, increment: () => set(s => ({ count: s.count + 1 })) })
 *   )
 * );
 * ```
 */
export function createUrlSyncMiddleware<T extends object>(options: UrlSyncOptions<T> = {}) {
  const { enabled = true, debounceMs = 150, include, exclude, selectState } = options;

  // CLOSURE: Timer declared in factory scope (NOT module scope)
  // Each call to createUrlSyncMiddleware creates a NEW closure with NEW timer
  // This is the fix for STATE-04 (global timer causing conflicts)
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

  // Return the middleware function (standard Zustand middleware signature)
  return (config: StateCreator<T, [], []>): StateCreator<T, [], []> => {
    return (set, get, api) => {
      // Load initial state from URL parameters
      if (enabled && typeof window !== "undefined") {
        const urlParams = getUrlParams();
        if (Object.keys(urlParams).length > 0) {
          // URL params will be merged in the store creator
          // This middleware just enables the mechanism
        }
      }

      // Wrap setState to add debounced URL sync
      const originalSet = api.setState;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- biome-ignore lint/suspicious/noExplicitAny: Zustand setState has complex generic signature
      api.setState = ((...args: any[]) => {
        // Call original setState first (update store)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- biome-ignore lint/suspicious/noExplicitAny: Required to match Zustand setState signature
        (originalSet as any)(...args);

        // Then sync to URL (debounced)
        if (!enabled) return;

        // Clear previous timeout (debounce pattern)
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }

        // Schedule URL update after debounce delay
        debounceTimeout = setTimeout(() => {
          const state = get();
          const stateToSync = selectState ? selectState(state) : state;
          syncStateToUrl(stateToSync, { include, exclude });
        }, debounceMs);
      }) as typeof api.setState;

      // Call original config to create initial state
      return config(set, get, api);
    };
  };
}

/**
 * Sync state object to URL parameters
 * @internal
 */
function syncStateToUrl(state: object, options: { include?: string[]; exclude?: string[] }) {
  if (typeof window === "undefined") return;

  const { include, exclude } = options;
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(state)) {
    // Skip if not in include list (when include is specified)
    if (include && !include.includes(key)) continue;
    // Skip if in exclude list
    if (exclude?.includes(key)) continue;
    // Skip functions (methods like setValue, reset, etc.)
    if (typeof value === "function") continue;
    // Skip undefined, null, and empty string values
    if (value === undefined || value === null || value === "") continue;

    searchParams.set(key, String(value));
  }

  const newSearch = searchParams.toString();
  const newUrl = newSearch ? `${url.pathname}?${newSearch}` : url.pathname;

  // Use replaceState (NOT pushState) to avoid flooding browser history
  window.history.replaceState({}, "", newUrl);
}
