import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { VehicleFinancingCalculator } from "./vehicle-financing-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.vehicle-financing" });
  return {
    title: t("name"),
    description: t("metaDescription"),
  };
}

export default async function VehicleFinancingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "converters.vehicle-financing" });
  const categoryT = await getTranslations({ locale, namespace: "categories.automotive" });
  const category = getCategoryBySlug("automotive");

  if (!category) {
    throw new Error("Category not found");
  }

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
      categoryName={categoryT("name")}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <VehicleFinancingCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
