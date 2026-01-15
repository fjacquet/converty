import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { RgbConverter } from "./rgb-converter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "converters.rgb",
  });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: [
      "rgb converter",
      "hex to rgb",
      "color converter",
      "hsl converter",
      "cmyk converter",
    ],
  };
}

export default async function RgbConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.rgb");
  const category = getCategoryBySlug("color")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
    >
      <Suspense
        fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}
      >
        <RgbConverter />
      </Suspense>
    </ConverterLayout>
  );
}
