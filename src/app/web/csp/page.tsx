import type { Metadata } from "next";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { CSPGenerator } from "./csp-generator";

export const metadata: Metadata = {
  title: "Content Security Policy Generator",
  description: "Generate Content Security Policy headers for web security.",
  keywords: ["csp", "content security policy", "web security", "headers", "xss"],
};

export default function CSPPage() {
  const category = getCategoryBySlug("web")!;

  return (
    <ConverterLayout
      title="Content Security Policy Generator"
      description="Generate CSP headers to protect your website from XSS and other attacks."
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <CSPGenerator />
      </Suspense>
    </ConverterLayout>
  );
}
