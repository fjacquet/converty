import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { LongDivisionCalculator } from "./long-division-calculator";

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
    namespace: "converters.long-division",
  });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: [
      "long division calculator",
      "division steps",
      "remainder calculator",
      "quotient",
      "fraction to decimal",
    ],
  };
}

export default async function LongDivisionCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.long-division");
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("math")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
      categoryName={tc("math.name")}
    >
      <Suspense
        fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}
      >
        <LongDivisionCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
