// src/app/[locale]/automotive/tire-sizing/page.tsx

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { TireSizingCalculator } from "./tire-sizing-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.tire-sizing" });
  return {
    title: t("name"),
    description: t("metaDescription"),
  };
}

export default async function TireSizingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "converters.tire-sizing" });
  const categoryT = await getTranslations({ locale, namespace: "categories.automotive" });

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={{
        name: categoryT("name"),
        slug: "automotive",
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <TireSizingCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
