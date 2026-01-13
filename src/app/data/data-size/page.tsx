import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { DataSizeConverter } from "./data-size-converter";

export const metadata: Metadata = {
  title: "Data Size Converter",
  description: "Convert between bytes, KB, MB, GB, TB and binary units (KiB, MiB, GiB).",
  keywords: ["data size", "bytes", "kilobytes", "megabytes", "gigabytes", "converter"],
};

export default function DataSizePage() {
  const category = getCategoryBySlug("data")!;

  return (
    <ConverterLayout
      title="Data Size Calculator"
      description="Convert between decimal (KB, MB, GB) and binary (KiB, MiB, GiB) data units."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <DataSizeConverter />
      </Suspense>
    </ConverterLayout>
  );
}
