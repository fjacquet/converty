import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { getConvertersByCategory } from "@/lib/registry/converters";

export const metadata: Metadata = {
  title: "Health Calculators",
  description: "Free online health calculators including BMI and more.",
};

export default function HealthPage() {
  const category = getCategoryBySlug("health")!;
  const converters = getConvertersByCategory("health");

  return (
    <div className="container py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <category.icon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        </div>
        <p className="text-muted-foreground">{category.description}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {converters.map((converter) => (
          <Link key={converter.id} href={`/health/${converter.slug}`}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle className="text-lg">{converter.name}</CardTitle>
                <CardDescription>{converter.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
