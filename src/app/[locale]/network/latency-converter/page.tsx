import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { LatencyConverter } from "./latency-converter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.latency-converter" });

  return {
    title: t("name"),
    description: t("metaDescription"),
  };
}

export default async function LatencyConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.latency-converter");
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("network")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
      categoryName={tc("network.name")}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <LatencyConverter />
      </Suspense>
    </ConverterLayout>
  );
}
