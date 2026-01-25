"use client";

import { AlertCircle, DollarSign, HardDrive, Server, Zap } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { InputField, ResultGrid } from "@/components/converter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateVirtualizationCost,
  type VirtualizationCostInput,
  type VirtualizationCostResult,
} from "@/lib/converters/infrastructure/virtualization-cost";
import { createCalculatorStore } from "@/stores/calculator-store";

const useVirtualizationCostStore = createCalculatorStore<
  VirtualizationCostInput,
  VirtualizationCostResult
>({
  name: "virtualization-cost",
  initialValues: {
    serverCost: 100000,
    storageCost: 50000,
    networkCost: 20000,
    vmwareLicenseCost: 50000,
    osLicenseCost: 10000,
    backupSoftwareCost: 5000,
    powerCostPerKwh: 0.15,
    totalPowerKw: 50,
    pue: 1.5,
    datacenterCostPerRu: 150,
    totalRackUnits: 20,
    laborCostAnnual: 80000,
    vmCount: 100,
    termYears: 3,
  },
  calculate: calculateVirtualizationCost,
});

export default function VirtualizationCostCalculator() {
  const t = useTranslations("calculator.virtualizationCost");
  const format = useFormatter();
  const { values, setValue, result } = useVirtualizationCostStore();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left Column - Inputs */}
      <div className="space-y-6">
        {/* Hardware Costs Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              {t("hardware")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
              id="serverCost"
              label={t("serverCost")}
              type="number"
              value={values.serverCost.toString()}
              onChange={(value) => setValue("serverCost", Number(value))}
              min={0}
              step={1000}
              placeholder="100000"
            />
            <InputField
              id="storageCost"
              label={t("storageCost")}
              type="number"
              value={values.storageCost.toString()}
              onChange={(value) => setValue("storageCost", Number(value))}
              min={0}
              step={1000}
            />
            <InputField
              id="networkCost"
              label={t("networkCost")}
              type="number"
              value={values.networkCost.toString()}
              onChange={(value) => setValue("networkCost", Number(value))}
              min={0}
              step={1000}
            />
          </CardContent>
        </Card>

        {/* Software Costs Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              {t("software")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
              id="vmwareLicenseCost"
              label={t("vmwareLicense")}
              type="number"
              value={values.vmwareLicenseCost.toString()}
              onChange={(value) => setValue("vmwareLicenseCost", Number(value))}
              min={0}
              step={1000}
            />
            <InputField
              id="osLicenseCost"
              label={t("osLicense")}
              type="number"
              value={values.osLicenseCost.toString()}
              onChange={(value) => setValue("osLicenseCost", Number(value))}
              min={0}
              step={1000}
            />
            <InputField
              id="backupSoftwareCost"
              label={t("backupSoftware")}
              type="number"
              value={values.backupSoftwareCost.toString()}
              onChange={(value) => setValue("backupSoftwareCost", Number(value))}
              min={0}
              step={1000}
            />
          </CardContent>
        </Card>

        {/* Operational Costs Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {t("operational")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
              id="powerCostPerKwh"
              label={t("powerCostPerKwh")}
              type="number"
              value={values.powerCostPerKwh.toString()}
              onChange={(value) => setValue("powerCostPerKwh", Number(value))}
              min={0}
              step={0.01}
            />
            <InputField
              id="totalPowerKw"
              label={t("totalPowerKw")}
              type="number"
              value={values.totalPowerKw.toString()}
              onChange={(value) => setValue("totalPowerKw", Number(value))}
              min={0}
              step={1}
              unit="kW"
            />
            <div className="space-y-2">
              <InputField
                id="pue"
                label={t("pue")}
                type="number"
                value={values.pue.toString()}
                onChange={(value) => setValue("pue", Number(value))}
                min={1.0}
                max={3.0}
                step={0.1}
              />
              <p className="text-xs text-muted-foreground flex items-start gap-1">
                <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                {t("pueHelp")}
              </p>
            </div>
            <InputField
              id="datacenterCostPerRu"
              label={t("datacenterCostPerRu")}
              type="number"
              value={values.datacenterCostPerRu.toString()}
              onChange={(value) => setValue("datacenterCostPerRu", Number(value))}
              min={0}
              step={10}
            />
            <InputField
              id="totalRackUnits"
              label={t("totalRackUnits")}
              type="number"
              value={values.totalRackUnits.toString()}
              onChange={(value) => setValue("totalRackUnits", Number(value))}
              min={0}
              step={1}
              unit="RU"
            />
            <InputField
              id="laborCostAnnual"
              label={t("laborCostAnnual")}
              type="number"
              value={values.laborCostAnnual.toString()}
              onChange={(value) => setValue("laborCostAnnual", Number(value))}
              min={0}
              step={1000}
            />
          </CardContent>
        </Card>

        {/* Configuration Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {t("configuration")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
              id="vmCount"
              label={t("vmCount")}
              type="number"
              value={values.vmCount.toString()}
              onChange={(value) => setValue("vmCount", Number(value))}
              min={1}
              step={1}
              unit="VMs"
            />
            <div className="space-y-2">
              <Label htmlFor="termYears">{t("termYears")}</Label>
              <Select
                value={values.termYears.toString()}
                onValueChange={(value) => setValue("termYears", Number(value) as 1 | 3 | 5)}
              >
                <SelectTrigger id="termYears">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 year</SelectItem>
                  <SelectItem value="3">3 years</SelectItem>
                  <SelectItem value="5">5 years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Results */}
      <div className="space-y-6">
        {result && (
          <>
            {/* Cost Analysis Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t("results")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Large prominent TCO display */}
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-5xl font-bold text-primary">
                    {format.number(result.tco, {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">{t("tco")}</p>
                </div>

                {/* Key Metrics */}
                <ResultGrid
                  results={[
                    {
                      label: t("capex"),
                      value: format.number(result.capex, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }),
                    },
                    {
                      label: t("opexAnnual"),
                      value: format.number(result.opexAnnual, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }),
                    },
                    {
                      label: t("opexTotal"),
                      value: format.number(result.opexTotal, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }),
                    },
                    {
                      label: t("costPerVm"),
                      value: format.number(result.costPerVm, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                      }),
                    },
                    {
                      label: t("costPerVmMonthly"),
                      value: format.number(result.costPerVmMonthly, {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                      }),
                    },
                  ]}
                />
              </CardContent>
            </Card>

            {/* Cost Breakdown Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t("breakdown")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(result.breakdown).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t(`${key}Cost`)}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {format.number(value, {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            })}
                          </span>
                          <span className="text-muted-foreground">
                            ({result.percentages[key as keyof typeof result.percentages].toFixed(1)}
                            %)
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all"
                          style={{
                            width: `${result.percentages[key as keyof typeof result.percentages]}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
