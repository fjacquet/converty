"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToPdf, type PdfExportOptions, type PdfSection } from "@/lib/utils/pdf-export";

interface PdfExportButtonProps {
  sections: PdfSection[];
  options: PdfExportOptions;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function PdfExportButton({
  sections,
  options,
  variant = "outline",
  size = "sm",
  className,
}: PdfExportButtonProps) {
  const handleExport = () => {
    exportToPdf(sections, options);
  };

  return (
    <Button variant={variant} size={size} onClick={handleExport} className={className}>
      <Download className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  );
}
