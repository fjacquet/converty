import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { FuelEfficiencyCalculator } from "./fuel-efficiency-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.fuel-efficiency" });
  return {
    title: t("name"),
    description: t("metaDescription"),
  };
}

export default async function FuelEfficiencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "converters.fuel-efficiency" });
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("automotive")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
      categoryName={tc("automotive.name")}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <FuelEfficiencyCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
