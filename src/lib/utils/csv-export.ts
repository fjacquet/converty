export interface CsvExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  delimiter?: string;
}

export interface CsvRow {
  [key: string]: string | number | boolean | null;
}

/**
 * Export data to CSV file using native Blob API
 * Zero dependencies, works in all modern browsers
 */
export function exportToCsv(data: CsvRow[], options: CsvExportOptions = {}): void {
  if (data.length === 0) {
    console.warn("exportToCsv: No data to export");
    return;
  }

  const { filename = "export.csv", includeHeaders = true, delimiter = "," } = options;

  // Extract headers from first row
  const headers = Object.keys(data[0]);

  // Build CSV content
  const csvRows: string[] = [];

  // Add headers if requested
  if (includeHeaders) {
    csvRows.push(headers.map((h) => escapeCSV(h, delimiter)).join(delimiter));
  }

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      return escapeCSV(value, delimiter);
    });
    csvRows.push(values.join(delimiter));
  }

  // Create CSV string
  const csvContent = csvRows.join("\n");

  // Create Blob with UTF-8 BOM for Excel compatibility
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  // Trigger download
  downloadBlob(blob, filename);
}

/**
 * Escape CSV values (handle commas, quotes, newlines)
 * Also sanitizes potential CSV injection
 */
function escapeCSV(value: string | number | boolean | null, delimiter = ","): string {
  if (value === null || value === undefined) return "";

  let stringValue = String(value);

  // Sanitize potential CSV injection (prefix dangerous characters)
  const dangerous = ["=", "+", "-", "@"];
  if (dangerous.includes(stringValue.charAt(0))) {
    stringValue = `'${stringValue}`;
  }

  // Escape if contains delimiter, quotes, or newlines
  if (
    stringValue.includes(delimiter) ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    // Wrap in quotes and double any internal quotes
    stringValue = `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Download blob as file
 * Handles cleanup to prevent memory leaks
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();

  // Cleanup (with setTimeout for cross-browser compatibility)
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Helper for simple single-section exports with automatic filename
 */
export function exportSimpleCSV(
  label: string,
  data: CsvRow[],
  options?: Partial<CsvExportOptions>
): void {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const filename = `${label.toLowerCase().replace(/\s+/g, "-")}_${timestamp}.csv`;

  exportToCsv(data, { filename, ...options });
}
