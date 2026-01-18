"use client";

import { AlertCircle } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { InputField, OutputDisplay, ResultGrid } from "@/components/converter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubnetCalculatorStore } from "@/stores/subnet-calculator-store";

/**
 * Subnet calculator component
 *
 * Interactive calculator for IPv4 and IPv6 subnet calculations.
 * Supports both CIDR notation and subnet mask notation (IPv4 only).
 */
export function SubnetCalculator() {
  const t = useTranslations("calculator.network");
  const tSections = useTranslations("calculator.sections");
  const tCommon = useTranslations("common");
  const format = useFormatter();

  const { ipInput, subnetMask, result, error, setIPInput, setSubnetMask, reset } =
    useSubnetCalculatorStore();

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>{tSections("input")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            id="ipInput"
            label={t("ipInput")}
            value={ipInput}
            onChange={setIPInput}
            placeholder="192.168.1.0/24 or 2001:db8::/32"
            type="text"
          />

          <InputField
            id="subnetMask"
            label={t("subnetMask")}
            value={subnetMask}
            onChange={setSubnetMask}
            placeholder="255.255.255.0 (IPv4 only)"
            type="text"
          />

          <p className="text-sm text-muted-foreground">{t("enterIpOrCidr")}</p>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && !error && (
        <Card>
          <CardHeader>
            <CardTitle>{tSections("results")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Primary Results */}
            <div className="grid gap-4 sm:grid-cols-2">
              <OutputDisplay label={t("ipVersion")} value={`IPv${result.ipVersion}`} size="lg" />
              <OutputDisplay label={t("networkAddress")} value={result.networkAddress} size="lg" />
            </div>

            {/* Detailed Results Grid */}
            <ResultGrid
              results={[
                {
                  label: t("broadcastAddress"),
                  value: result.broadcastAddress || "N/A",
                },
                {
                  label: t("firstUsable"),
                  value: result.firstUsable,
                },
                {
                  label: t("lastUsable"),
                  value: result.lastUsable,
                },
                {
                  label: t("subnetMask"),
                  value: result.subnetMask || "N/A",
                },
                {
                  label: "CIDR",
                  value: `/${result.cidr}`,
                },
                {
                  label: t("totalHosts"),
                  value: formatBigInt(result.totalHosts, format),
                },
                {
                  label: t("usableHosts"),
                  value: formatBigInt(result.usableHosts, format),
                },
              ]}
            />

            {/* IPv6 Note */}
            {result.ipVersion === 6 && (
              <div className="rounded-md bg-muted px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> IPv6 has no broadcast address (uses multicast ff02::1) and
                  no subnet mask notation (CIDR only).
                </p>
              </div>
            )}

            {/* Large number warning */}
            {result.totalHosts > BigInt(Number.MAX_SAFE_INTEGER) && (
              <div className="rounded-md bg-muted px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Host counts exceed JavaScript&apos;s safe integer limit and
                  may lose precision in display.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reset Button */}
      {(result || error) && (
        <div className="flex justify-end">
          <Button onClick={reset} variant="outline">
            {tCommon("reset")}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Format BigInt for display with locale-aware number formatting
 *
 * Converts BigInt to Number for formatting, which may lose precision
 * for very large IPv6 subnet sizes.
 */
function formatBigInt(value: bigint, format: ReturnType<typeof useFormatter>): string {
  // For very large numbers, use scientific notation
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    return value.toString();
  }

  // For safe integers, use locale formatting
  return format.number(Number(value));
}
