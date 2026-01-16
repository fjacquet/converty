import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { DownloadCalculator } from "./download-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.download-calculator" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["download", "time", "calculator", "speed", "file size"],
  };
}

export default async function DownloadCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.download-calculator");
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("data")!;

  return (
    <ConverterLayout title={t("name")} description={t("description")} category={category} categoryName={tc("data.name")}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <DownloadCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
