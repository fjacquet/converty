import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { BandwidthDelayProductCalculator } from "./bandwidth-delay-product-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.bandwidth-delay-product" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["bandwidth", "delay", "product", "bdp", "tcp", "buffer", "window size", "network"],
  };
}

export default async function BandwidthDelayProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.bandwidth-delay-product");
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("other")!;

  return (
    <ConverterLayout title={t("name")} description={t("description")} category={category} categoryName={tc("other.name")}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <BandwidthDelayProductCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
