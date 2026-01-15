import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { MacroDoFCalculator } from "./macro-dof-calculator";
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
  const t = await getTranslations({ locale, namespace: "converters.macro-dof" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["macro", "depth of field", "close-up", "photography", "magnification"],
  };
}

export default async function MacroDOFPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.macro-dof");
  const category = getCategoryBySlug("photo")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <MacroDoFCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
