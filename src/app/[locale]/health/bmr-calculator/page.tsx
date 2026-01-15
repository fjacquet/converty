import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { BmrCalculatorComponent } from "./bmr-calculator-component";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.bmr-calculator" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["bmr", "basal metabolic rate", "metabolism", "calories", "calculator"],
  };
}

export default async function BmrCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.bmr-calculator");
  const category = getCategoryBySlug("health")!;

  return (
    <ConverterLayout title={t("name")} description={t("description")} category={category}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <BmrCalculatorComponent />
      </Suspense>
    </ConverterLayout>
  );
}
