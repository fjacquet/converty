import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { CIDRRangeCalculator } from "./cidr-range-calculator";

/**
 * Generate static params for all locales
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Generate metadata for CIDR range calculator page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.cidr-range" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: [
      "CIDR range",
      "IP range",
      "subnet",
      "IP address",
      "IPv4",
      "IPv6",
      "network",
      "CIDR",
      "IP in range",
      "contains",
    ],
  };
}

/**
 * CIDR range calculator page
 */
export default async function CIDRRangePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.cidr-range");
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("network")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
      categoryName={tc("network.name")}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <CIDRRangeCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
