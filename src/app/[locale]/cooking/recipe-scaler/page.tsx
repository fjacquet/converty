import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { RecipeScalerCalculator } from "./recipe-scaler-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.recipe-scaler" });
  return {
    title: t("name"),
    description: t("metaDescription"),
  };
}

export default async function RecipeScalerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "converters.recipe-scaler" });
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("cooking")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
      categoryName={tc("cooking.name")}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <RecipeScalerCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
