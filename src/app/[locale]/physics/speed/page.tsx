import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { SpeedConverter } from "./speed-converter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.speed" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["speed", "velocity", "converter", "mph", "km/h", "m/s", "knots", "mach"],
  };
}

export default async function SpeedPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.speed");
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("physics")!;

  return (
    <ConverterLayout title={t("name")} description={t("description")} category={category} categoryName={tc("physics.name")}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <SpeedConverter />
      </Suspense>
    </ConverterLayout>
  );
}
