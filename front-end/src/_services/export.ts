import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import jspdfAutoTable from "jspdf-autotable";

// Extend jsPDF with autoTable method
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof jspdfAutoTable;
  }
}

// Apply autoTable plugin
jsPDF.prototype.autoTable = jspdfAutoTable;

/**
 * Column definition for export
 */
export interface ExportColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  label: string;
  formatter?: (value: unknown, row: T) => string;
  width?: number;
}

/**
 * Export options
 */
export interface ExportOptions {
  fileName?: string;
  sheetName?: string;
  title?: string;
  dateRange?: { start: string; end: string };
  includeIndex?: boolean;
}

/**
 * Export format type
 */
export type ExportFormat = "csv" | "xlsx" | "pdf";

/**
 * Generate a timestamped filename
 */
function generateFileName(baseName: string, format: ExportFormat): string {
  const timestamp = new Date().toISOString().split("T")[0];
  return `${baseName}-${timestamp}.${format}`;
}

/**
 * Format a cell value based on column definition
 */
function formatCellValue<T>(
  value: unknown,
  row: T,
  column: ExportColumn<T>
): string {
  if (column.formatter) {
    return column.formatter(value, row);
  }
  if (value === null || value === undefined || value === "") {
    return "-";
  }
  if (typeof value === "number") {
    // Format as Brazilian currency if value looks like money
    if (value > 100 || value < 0) {
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    }
    return value.toLocaleString("pt-BR");
  }
  if (value instanceof Date) {
    return value.toLocaleDateString("pt-BR");
  }
  return String(value);
}

/**
 * Extract value from nested keys using dot notation
 */
function getNestedValue<T>(obj: T, key: string): unknown {
  return key.split(".").reduce((acc: unknown, part) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

/**
 * Export data to CSV format
 * Handles UTF-8 encoding with BOM for proper character display in Excel
 */
export function exportToCSV<T>(
  data: T[],
  columns: ExportColumn<T>[],
  options: ExportOptions = {}
): Blob {
  const { includeIndex = false } = options;

  // Build header row
  const headers = includeIndex
    ? ["#", ...columns.map((col) => col.label)]
    : columns.map((col) => col.label);

  // Build data rows
  const rows = data.map((row, index) => {
    const values = columns.map((col) => {
      const value = getNestedValue(row, col.key as string);
      return formatCellValue(value, row, col);
    });
    return includeIndex ? [index + 1, ...values] : values;
  });

  // Combine headers and data
  const allRows = [headers, ...rows];

  // Convert to CSV with proper escaping
  const csvContent = allRows
    .map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          const cellStr = String(cell);
          if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        })
        .join(",")
    )
    .join("\n");

  // Add UTF-8 BOM for proper character encoding in Excel
  const BOM = "\uFEFF";
  const blobContent = BOM + csvContent;
  return new Blob([blobContent], { type: "text/csv;charset=utf-8;" });
}

/**
 * Export data to Excel (XLSX) format
 */
export function exportToXLSX<T>(
  data: T[],
  columns: ExportColumn<T>[],
  options: ExportOptions = {}
): Blob {
  const { sheetName = "Dados", includeIndex = false } = options;

  // Build worksheet data
  const headers = includeIndex
    ? ["#", ...columns.map((col) => col.label)]
    : columns.map((col) => col.label);

  const rows = data.map((row) => {
    const values = columns.map((col) => {
      const value = getNestedValue(row, col.key as string);
      const formatted = formatCellValue(value, row, col);
      // Parse currency values back to numbers for Excel
      if (
        typeof value === "number" &&
        (value > 100 || value < 0)
      ) {
        return value;
      }
      return formatted;
    });
    return includeIndex ? [1, ...values] : values;
  });

  const wsData = [headers, ...rows];

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = columns.map((col) => ({
    wch: col.width || Math.max(col.label.length, 15),
  }));
  if (includeIndex) {
    colWidths.unshift({ wch: 8 });
  }
  ws["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generate blob
  const xlsxBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  return new Blob([xlsxBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

/**
 * Export data to PDF format
 */
export function exportToPDF<T>(
  data: T[],
  columns: ExportColumn<T>[],
  options: ExportOptions = {}
): Blob {
  const { title = "Relatório", dateRange, includeIndex = false } = options;

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 22);

  // Add date range if provided
  if (dateRange) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Período: ${dateRange.start} - ${dateRange.end}`, 14, 30);
  }

  // Add generation timestamp
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Gerado em: ${new Date().toLocaleString("pt-BR")}`,
    14,
    dateRange ? 36 : 28
  );

  // Prepare table data
  const headers = includeIndex
    ? ["#", ...columns.map((col) => col.label)]
    : columns.map((col) => col.label);

  const body = data.map((row) => {
    const values = columns.map((col) => {
      const value = getNestedValue(row, col.key as string);
      return formatCellValue(value, row, col);
    });
    return includeIndex ? [1, ...values] : values;
  });

  // Generate table
  jspdfAutoTable(doc, {
    head: [headers],
    body,
    startY: dateRange ? 42 : 34,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Blue-500
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Slate-50
    },
    margin: { top: 14, right: 14, bottom: 14, left: 14 },
  });

  return doc.output("blob");
}

/**
 * Main export function - dispatches to the appropriate format handler
 */
export function exportData<T>(
  data: T[],
  columns: ExportColumn<T>[],
  format: ExportFormat,
  options: ExportOptions = {}
): Blob {
  // Handle empty data
  if (!data || data.length === 0) {
    const emptyMessage = "Não há dados para exportar";
    return new Blob([emptyMessage], { type: "text/plain;charset=utf-8;" });
  }

  let blob: Blob;

  switch (format) {
    case "csv":
      blob = exportToCSV(data, columns, options);
      break;
    case "xlsx":
      blob = exportToXLSX(data, columns, options);
      break;
    case "pdf":
      blob = exportToPDF(data, columns, options);
      break;
    default:
      throw new Error(`Formato não suportado: ${format}`);
  }

  return blob;
}

/**
 * Trigger file download in the browser
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Complete export and download workflow
 */
export function exportAndDownload<T>(
  data: T[],
  columns: ExportColumn<T>[],
  format: ExportFormat,
  options: ExportOptions = {}
): void {
  const blob = exportData(data, columns, format, options);
  const fileName = generateFileName(options.fileName || "dados", format);
  downloadBlob(blob, fileName);
}
