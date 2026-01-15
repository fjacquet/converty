"use client";

import { Calculator, Menu } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/registry/categories";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("common");
  const tc = useTranslations("categories");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <Calculator className="h-6 w-6" />
          <span className="font-bold">{t("siteName")}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-1">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {tc(`${category.id}.name`)}
            </Link>
          ))}
          <Link
            href="/all"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            {t("allTools")}
          </Link>
        </nav>

        <div className="flex items-center space-x-2 ml-auto">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={cn("md:hidden border-t", mobileMenuOpen ? "block" : "hidden")}>
        <nav className="container py-4 flex flex-col space-y-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              onClick={() => setMobileMenuOpen(false)}
            >
              <category.icon className="h-4 w-4" />
              {tc(`${category.id}.name`)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
