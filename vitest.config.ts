import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    exclude: ["**/node_modules/**", "**/.next/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/lib/converters/**/*.ts"],
      exclude: [
        "src/lib/converters/**/*.d.ts",
        "src/lib/converters/**/types.ts",
        "src/lib/converters/**/index.ts",
      ],
      thresholds: {
        "src/lib/converters/network/bb-credit-calculator.ts": {
          lines: 75,
          functions: 75,
          branches: 75,
          statements: 75,
        },
        "src/lib/converters/network/subnet-calculator.ts": {
          lines: 75,
          functions: 75,
          branches: 75,
          statements: 75,
        },
        "src/lib/converters/health/bmi.ts": {
          lines: 75,
          functions: 75,
          branches: 75,
          statements: 75,
        },
        "src/lib/converters/finance/compound-interest.ts": {
          lines: 75,
          functions: 75,
          branches: 75,
          statements: 75,
        },
        "src/lib/converters/chemistry/molecular-weight.ts": {
          lines: 75,
          functions: 75,
          branches: 75,
          statements: 75,
        },
      },
    },
  },
});
