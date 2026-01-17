import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { SunPositionCalculator } from "./sun-position-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "converters.sun-position",
  });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: [
      "sun position calculator",
      "golden hour",
      "blue hour",
      "sunset time",
      "sunrise time",
      "photography planning",
    ],
  };
}

export default async function SunPositionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.sun-position");
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
      categoryName={tc("photo.name")}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <SunPositionCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
