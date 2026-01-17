import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { PregnancyWeightGainCalculator } from "./pregnancy-weight-gain-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.pregnancy-weight-gain" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["pregnancy weight", "weight gain", "pregnancy", "BMI", "healthy pregnancy"],
  };
}

export default async function PregnancyWeightGainPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.pregnancy-weight-gain");
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("health")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
      categoryName={tc("health.name")}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <PregnancyWeightGainCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
