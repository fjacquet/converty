import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { DiscountCalculator } from "./discount-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.discount" });
  return {
    title: t("name"),
    description: t("metaDescription"),
  };
}

export default async function DiscountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "converters.discount" });
  const tc = await getTranslations({ locale, namespace: "categories" });
  const category = getCategoryBySlug("finance")!;

  return (
    <ConverterLayout title={t("name")} description={t("description")} category={category} categoryName={tc("finance.name")}>
      <DiscountCalculator />
    </ConverterLayout>
  );
}
