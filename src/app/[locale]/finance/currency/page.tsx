import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { CurrencyConverter } from "./currency-converter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.currency" });
  return {
    title: t("name"),
    description: t("metaDescription"),
  };
}

export default async function CurrencyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "converters.currency" });
  const category = getCategoryBySlug("finance")!;

  return (
    <ConverterLayout title={t("name")} description={t("description")} category={category}>
      <CurrencyConverter />
    </ConverterLayout>
  );
}
