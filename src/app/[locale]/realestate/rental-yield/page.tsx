import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { locales } from "@/i18n/config";
import { RentalYieldCalculator } from "./rental-yield-calculator";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.rental-yield" });

  return {
    title: t("name"),
    description: t("metaDescription"),
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({
    locale,
  }));
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <RentalYieldCalculator />;
}
