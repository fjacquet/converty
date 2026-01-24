import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { ConverterLayout } from "@/components/converter/converter-layout";
import { locales } from "@/i18n/config";
import { ExchangeRateCalculator } from "./exchange-rate-calculator";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "converters.exchange-rate" });

  return {
    title: t("name"),
    description: t("metaDescription"),
    keywords: [
      "crypto",
      "exchange",
      "rate",
      "bitcoin",
      "ethereum",
      "litecoin",
      "ripple",
      "dogecoin",
      "cardano",
      "chf",
      "eur",
      "usd",
      "convert",
      "price",
      "cryptocurrency",
      "btc",
      "eth",
      "ltc",
      "xrp",
      "doge",
      "ada",
    ],
  };
}

export default async function ExchangeRatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("converters.exchange-rate");
  const tCommon = await getTranslations("common");

  return (
    <ConverterLayout
      title={t("name")}
      description={t("description")}
      backLink={`/${locale}/crypto`}
      backLabel={tCommon("backToCategory")}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ExchangeRateCalculator />
      </Suspense>
    </ConverterLayout>
  );
}
