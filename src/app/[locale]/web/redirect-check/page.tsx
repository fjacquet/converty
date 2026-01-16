import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { RedirectChecker } from "./redirect-checker";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.redirect-check" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: ["redirect", "http", "301", "302", "url", "seo"],
  };
}

export default async function RedirectCheckPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.redirect-check");
  const tc = await getTranslations("categories");
  const category = getCategoryBySlug("web")!;

  return (
    <ConverterLayout title={t("name")} description={t("description")} category={category} categoryName={tc("web.name")}>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-lg" />}>
        <RedirectChecker />
      </Suspense>
    </ConverterLayout>
  );
}
