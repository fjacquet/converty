import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { DCPFilesizeCalculator } from "./dcp-filesize-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.dcp-filesize" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["dcp", "digital cinema package", "file size", "cinema"],
  };
}

export default async function DCPFilesizePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.dcp-filesize");
  const category = getCategoryBySlug("video")!;

  return (
    <ConverterLayout title={t("name")} description={t("description")} category={category}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <DCPFilesizeCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
