import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Category } from "@/lib/registry/categories";

interface BreadcrumbsProps {
  category: Category;
  current: string;
}

export function Breadcrumbs({ category, current }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Link href="/" className="hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link
        href={`/${category.slug}`}
        className="hover:text-foreground transition-colors"
      >
        {category.name}
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground font-medium">{current}</span>
    </nav>
  );
}
