import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { TimeCalculator } from "./time-calculator";
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
  const t = await getTranslations({ locale, namespace: "converters.time" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["time", "calculator", "add", "subtract", "hours", "minutes", "seconds"],
  };
}

export default async function TimePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.time");
  const category = getCategoryBySlug("datetime")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <TimeCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
