import Link from "next/link";
import { categories } from "@/lib/registry/categories";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with Next.js and Tailwind CSS. Free to use.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="hover:underline underline-offset-4"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
