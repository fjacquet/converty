import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { NDFilterCalculator } from "./nd-filter-calculator";
import { locales } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.nd-filter" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["nd filter", "neutral density", "exposure", "photography", "long exposure"],
  };
}

export default async function NDFilterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.nd-filter");
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <NDFilterCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
