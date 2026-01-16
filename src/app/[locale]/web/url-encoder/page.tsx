import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { URLEncoderConverter } from "./url-encoder-converter";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.url-encoder" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["url", "encoder", "decoder", "percent encoding", "uri", "web development"],
  };
}

export default async function URLEncoderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.url-encoder");
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("web")!;

  return (
    <ConverterLayout title={t("name")} description={t("description")} category={category} categoryName={tc("web.name")}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <URLEncoderConverter />
      </Suspense>
    </ConverterLayout>
  );
}
