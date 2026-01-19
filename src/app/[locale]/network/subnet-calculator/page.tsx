import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { SubnetCalculator } from "./subnet-calculator";

/**
 * Generate static params for all locales
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Generate metadata for subnet calculator page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.subnet-calculator" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: [
      "subnet calculator",
      "CIDR",
      "IP address",
      "IPv4",
      "IPv6",
      "network",
      "subnet mask",
      "network address",
      "broadcast address",
    ],
  };
}

/**
 * Subnet calculator page
 */
export default async function SubnetCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.subnet-calculator");
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
        <SubnetCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
