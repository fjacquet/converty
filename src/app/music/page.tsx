import Link from "next/link";
import { Metadata } from "next";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategoryBySlug } from "@/lib/registry/categories";
import { getConvertersByCategory } from "@/lib/registry/converters";

export const metadata: Metadata = {
  title: "Music Calculators",
  description: "Free online music calculators for BPM, audio delay, and more.",
};

export default function MusicPage() {
  const category = getCategoryBySlug("music")!;
  const converters = getConvertersByCategory("music");

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
          <Link key={converter.id} href={`/music/${converter.slug}`}>
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
