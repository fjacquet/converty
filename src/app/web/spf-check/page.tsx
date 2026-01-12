import { Metadata } from "next";
import { Suspense } from "react";
import { SPFChecker } from "./spf-checker";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "SPF Record Checker",
  description: "Analyze and validate SPF (Sender Policy Framework) records.",
  keywords: ["spf", "email", "dns", "sender policy framework", "security"],
};

export default function SPFCheckPage() {
  const category = getCategoryBySlug("web")!;

  return (
    <ConverterLayout
      title="SPF Record Checker"
      description="Analyze SPF records for email authentication and security."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <SPFChecker />
      </Suspense>
    </ConverterLayout>
  );
}
