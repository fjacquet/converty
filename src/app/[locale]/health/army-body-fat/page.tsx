import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { ArmyBodyFatCalculator } from "./army-body-fat-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.army-body-fat" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: [
      "army body fat",
      "military fitness",
      "body fat percentage",
      "tape test",
      "US Army standards",
    ],
  };
}

export default async function ArmyBodyFatPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.army-body-fat");
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
        <ArmyBodyFatCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
