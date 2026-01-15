import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { VideoFileSizeCalculator } from "./video-file-size-calculator";
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
  const t = await getTranslations({ locale, namespace: "converters.video-file-size" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["video", "file size", "storage", "duration", "bitrate"],
  };
}

export default async function VideoFileSizePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.video-file-size");
  const category = getCategoryBySlug("video")!;

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      category={category}
    >
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <VideoFileSizeCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
