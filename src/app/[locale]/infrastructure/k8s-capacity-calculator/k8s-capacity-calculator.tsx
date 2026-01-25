"use client";

import { AlertTriangle, Cpu, HardDrive, Server, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import { InputField } from "@/components/converter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useK8sCapacityStore } from "@/stores/k8s-capacity-store";

export function K8sCapacityCalculator() {
  const t = useTranslations("calculator.k8sCapacity");

  const {
    podCpuRequest,
    podMemoryRequest,
    podReplicas,
    nodeCpuCores,
    nodeMemoryMb,
    systemReservedCpu,
    systemReservedMemory,
    daemonSetCpuPerNode,
    daemonSetMemoryPerNode,
    targetCpuUtilization,
    targetMemoryUtilization,
    result,
    error,
    setPodCpuRequest,
    setPodMemoryRequest,
    setPodReplicas,
    setNodeCpuCores,
    setNodeMemoryMb,
    setSystemReservedCpu,
    setSystemReservedMemory,
    setDaemonSetCpuPerNode,
    setDaemonSetMemoryPerNode,
    setTargetCpuUtilization,
    setTargetMemoryUtilization,
    reset,
  } = useK8sCapacityStore();

  return (
    <div className="space-y-6">
      {/* Pod Workload Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            {t("podWorkload")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            id="podCpuRequest"
            label={t("podCpuRequest")}
            value={podCpuRequest.toString()}
            onChange={(v) => setPodCpuRequest(parseFloat(v) || 0)}
            type="number"
            min={0}
            step={100}
            unit="m"
          />
          <InputField
            id="podMemoryRequest"
            label={t("podMemoryRequest")}
            value={podMemoryRequest.toString()}
            onChange={(v) => setPodMemoryRequest(parseFloat(v) || 0)}
            type="number"
            min={0}
            step={64}
            unit="MiB"
          />
          <InputField
            id="podReplicas"
            label={t("podReplicas")}
            value={podReplicas.toString()}
            onChange={(v) => setPodReplicas(parseFloat(v) || 0)}
            type="number"
            min={1}
            step={1}
          />
        </CardContent>
      </Card>

      {/* Node Specifications Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            {t("nodeSpecs")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            id="nodeCpuCores"
            label={t("nodeCpuCores")}
            value={nodeCpuCores.toString()}
            onChange={(v) => setNodeCpuCores(parseFloat(v) || 0)}
            type="number"
            min={1}
            step={1}
            unit={t("cores")}
          />
          <InputField
            id="nodeMemoryMb"
            label={t("nodeMemoryMb")}
            value={nodeMemoryMb.toString()}
            onChange={(v) => setNodeMemoryMb(parseFloat(v) || 0)}
            type="number"
            min={512}
            step={1024}
            unit="MB"
          />
        </CardContent>
      </Card>

      {/* System Overhead Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t("systemOverhead")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            id="systemReservedCpu"
            label={t("systemReservedCpu")}
            value={systemReservedCpu.toString()}
            onChange={(v) => setSystemReservedCpu(parseFloat(v) || 0)}
            type="number"
            min={0}
            step={100}
            unit="m"
            helperText={t("systemReservedHelp")}
          />
          <InputField
            id="systemReservedMemory"
            label={t("systemReservedMemory")}
            value={systemReservedMemory.toString()}
            onChange={(v) => setSystemReservedMemory(parseFloat(v) || 0)}
            type="number"
            min={0}
            step={128}
            unit="MiB"
            helperText={t("systemReservedHelp")}
          />
          <InputField
            id="daemonSetCpuPerNode"
            label={t("daemonSetCpuPerNode")}
            value={daemonSetCpuPerNode.toString()}
            onChange={(v) => setDaemonSetCpuPerNode(parseFloat(v) || 0)}
            type="number"
            min={0}
            step={50}
            unit="m"
            helperText={t("daemonSetHelp")}
          />
          <InputField
            id="daemonSetMemoryPerNode"
            label={t("daemonSetMemoryPerNode")}
            value={daemonSetMemoryPerNode.toString()}
            onChange={(v) => setDaemonSetMemoryPerNode(parseFloat(v) || 0)}
            type="number"
            min={0}
            step={64}
            unit="MiB"
            helperText={t("daemonSetHelp")}
          />
        </CardContent>
      </Card>

      {/* Target Utilization Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            {t("targetUtilization")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            id="targetCpuUtilization"
            label={t("targetCpuUtilization")}
            value={targetCpuUtilization.toString()}
            onChange={(v) => setTargetCpuUtilization(parseFloat(v) || 0)}
            type="number"
            min={1}
            max={100}
            step={5}
            unit="%"
            helperText={t("targetUtilizationHelp")}
          />
          <InputField
            id="targetMemoryUtilization"
            label={t("targetMemoryUtilization")}
            value={targetMemoryUtilization.toString()}
            onChange={(v) => setTargetMemoryUtilization(parseFloat(v) || 0)}
            type="number"
            min={1}
            max={100}
            step={5}
            unit="%"
            helperText={t("targetUtilizationHelp")}
          />
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && !error && (
        <div className="space-y-6">
          {/* Primary Result */}
          <Card>
            <CardHeader>
              <CardTitle>{t("nodesNeeded")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{result.nodesNeededTotal}</div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t("limitingFactor")}:</span>
                {result.limitingFactor === "cpu" ? (
                  <Badge variant="default" className="gap-1">
                    <Cpu className="h-3 w-3" />
                    {t("cpuConstrained")}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1">
                    <HardDrive className="h-3 w-3" />
                    {t("memoryConstrained")}
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t("limitingFactorHelp")}</p>
            </CardContent>
          </Card>

          {/* Over-utilization Warning */}
          {result.overUtilized && (
            <Card className="border-amber-500/50 bg-amber-500/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    {t("overUtilizationWarning")}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Detailed Results Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* CPU Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Cpu className="h-4 w-4" />
                  {t("cpuResults")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("allocatableCpuPerNode")}
                  </span>
                  <span className="font-medium">{result.allocatableCpuPerNode.toFixed(0)}m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("nodesNeededByCpu")}</span>
                  <span className="font-medium">{result.nodesNeededByCpu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("finalCpuUtilization")}</span>
                  <span
                    className={`font-medium ${
                      result.finalCpuUtilization > 80 ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {result.finalCpuUtilization.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Memory Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <HardDrive className="h-4 w-4" />
                  {t("memoryResults")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("allocatableMemoryPerNode")}
                  </span>
                  <span className="font-medium">
                    {result.allocatableMemoryPerNode.toFixed(0)} MiB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">{t("nodesNeededByMemory")}</span>
                  <span className="font-medium">{result.nodesNeededByMemory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("finalMemoryUtilization")}
                  </span>
                  <span
                    className={`font-medium ${
                      result.finalMemoryUtilization > 80 ? "text-destructive" : "text-primary"
                    }`}
                  >
                    {result.finalMemoryUtilization.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calculation Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("calculationSteps")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">{t("step1")}:</p>
                  <p className="text-muted-foreground">
                    CPU: {nodeCpuCores} × 1000m - {systemReservedCpu}m - {daemonSetCpuPerNode}m ={" "}
                    {result.allocatableCpuPerNode.toFixed(0)}m
                  </p>
                  <p className="text-muted-foreground">
                    Memory: {nodeMemoryMb} MiB - {systemReservedMemory} MiB -{" "}
                    {daemonSetMemoryPerNode} MiB = {result.allocatableMemoryPerNode.toFixed(0)} MiB
                  </p>
                </div>
                <div>
                  <p className="font-medium">{t("step2")}:</p>
                  <p className="text-muted-foreground">
                    CPU: {podCpuRequest}m × {podReplicas} pods ={" "}
                    {(podCpuRequest * podReplicas).toFixed(0)}m
                  </p>
                  <p className="text-muted-foreground">
                    Memory: {podMemoryRequest} MiB × {podReplicas} pods ={" "}
                    {podMemoryRequest * podReplicas} MiB
                  </p>
                </div>
                <div>
                  <p className="font-medium">{t("step3")}:</p>
                  <p className="text-muted-foreground">
                    CPU: {result.allocatableCpuPerNode.toFixed(0)}m × {targetCpuUtilization}% ={" "}
                    {(result.allocatableCpuPerNode * (targetCpuUtilization / 100)).toFixed(0)}m per
                    node
                  </p>
                  <p className="text-muted-foreground">
                    Memory: {result.allocatableMemoryPerNode.toFixed(0)} MiB ×{" "}
                    {targetMemoryUtilization}% ={" "}
                    {(result.allocatableMemoryPerNode * (targetMemoryUtilization / 100)).toFixed(0)}{" "}
                    MiB per node
                  </p>
                </div>
                <div>
                  <p className="font-medium">{t("step4")}:</p>
                  <p className="text-muted-foreground">Nodes by CPU: {result.nodesNeededByCpu}</p>
                  <p className="text-muted-foreground">
                    Nodes by Memory: {result.nodesNeededByMemory}
                  </p>
                </div>
                <div>
                  <p className="font-medium">{t("step5")}:</p>
                  <p className="text-muted-foreground">
                    Total nodes needed: {result.nodesNeededTotal} ({t("limitingFactor")}:{" "}
                    {result.limitingFactor === "cpu" ? "CPU" : "Memory"})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button onClick={reset} variant="outline" className="w-full md:w-auto">
              {t("reset")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
