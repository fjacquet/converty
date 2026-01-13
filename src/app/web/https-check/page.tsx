import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { HTTPSChecker } from "./https-checker";

export const metadata: Metadata = {
  title: "HTTPS Security Checker",
  description: "Check HTTPS security headers and TLS configuration.",
  keywords: ["https", "ssl", "tls", "security headers", "hsts", "web security"],
};

export default function HTTPSCheckPage() {
  const category = getCategoryBySlug("web")!;

  return (
    <ConverterLayout
      title="HTTPS Security Checker"
      description="Analyze security headers and HTTPS configuration."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <HTTPSChecker />
      </Suspense>
    </ConverterLayout>
  );
}
