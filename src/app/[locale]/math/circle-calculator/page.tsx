import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { CircleCalculator } from "./circle-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.circle-calculator" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["circle", "geometry", "area", "circumference", "radius", "diameter", "calculator"],
  };
}

export default async function CircleCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.circle-calculator");
  const category = getCategoryBySlug("math")!;

  return (
    <ConverterLayout title={t("name")} description={t("description")} category={category}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <CircleCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
