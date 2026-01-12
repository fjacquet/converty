import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "./breadcrumbs";
import { Category } from "@/lib/registry/categories";

interface ConverterLayoutProps {
  title: string;
  description: string;
  category: Category;
  children: React.ReactNode;
  infoContent?: React.ReactNode;
}

export function ConverterLayout({
  title,
  description,
  category,
  children,
  infoContent,
}: ConverterLayoutProps) {
  return (
    <div className="container max-w-4xl py-8">
      <Breadcrumbs category={category} current={title} />

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">{children}</CardContent>
      </Card>

      {infoContent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About {title}</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            {infoContent}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
