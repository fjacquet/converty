import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { SleepCalculatorComponent } from "./sleep-calculator-component";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.sleep-calculator" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["sleep calculator", "sleep cycles", "bedtime", "wake time", "sleep quality"],
  };
}

export default async function SleepCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.sleep-calculator");
  const category = getCategoryBySlug("health")!;

  return (
    <ConverterLayout title={t("name")} description={t("description")} category={category}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <SleepCalculatorComponent />
      </Suspense>
    </ConverterLayout>
  );
}
