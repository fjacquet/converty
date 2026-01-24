// src/app/[locale]/automotive/maintenance-intervals/page.tsx

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { categories } from "@/lib/registry/categories";
import { MaintenanceIntervalsCalculator } from "./maintenance-intervals-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.maintenance-intervals" });
  return {
    title: t("name"),
    description: t("metaDescription"),
  };
}

export default async function MaintenanceIntervalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "converters.maintenance-intervals" });
  const categoryT = await getTranslations({ locale, namespace: "categories.automotive" });

  const automotiveCategory = categories.find((c) => c.slug === "automotive");
  if (!automotiveCategory) {
    throw new Error("Automotive category not found");
  }

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={automotiveCategory}
      categoryName={categoryT("name")}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <MaintenanceIntervalsCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
