import { Metadata } from "next";
import { Suspense } from "react";
import { RedirectChecker } from "./redirect-checker";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";

export const metadata: Metadata = {
  title: "Redirect Checker",
  description: "Check HTTP redirect chains and analyze URL redirections.",
  keywords: ["redirect", "http", "301", "302", "url", "seo"],
};

export default function RedirectCheckPage() {
  const category = getCategoryBySlug("web")!;

  return (
    <ConverterLayout
      title="Redirect Checker"
      description="Analyze HTTP redirect chains and identify potential issues."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <RedirectChecker />
      </Suspense>
    </ConverterLayout>
  );
}
