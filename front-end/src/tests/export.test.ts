import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  exportToCSV,
  exportToXLSX,
  exportToPDF,
  exportData,
  exportAndDownload,
  type ExportColumn,
} from "@/_services/export";

// Mock data for testing
interface TestData {
  id: string;
  name: string;
  email: string;
  situation: string;
  price?: number;
}

const mockData: TestData[] = [
  { id: "1", name: "João Silva", email: "joao@email.com", situation: "Ativo", price: 1500 },
  { id: "2", name: "Maria Santos", email: "maria@email.com", situation: "Pendente", price: 2500.5 },
  { id: "3", name: "José Oliveira", email: "", situation: "Desativo" },
];

const testColumns: ExportColumn<TestData>[] = [
  { key: "name", label: "Nome" },
  { key: "email", label: "Email" },
  { key: "situation", label: "Situação" },
  { key: "price", label: "Valor", formatter: (val) => `R$ ${Number(val).toFixed(2)}` },
];

describe("Export Service", () => {
  // Mock document createElement for downloadBlob
  beforeEach(() => {
    vi.stubGlobal("document", {
      createElement: vi.fn(() => ({
        href: "",
        download: "",
        click: vi.fn(),
        remove: vi.fn(),
      })),
      body: {
        appendChild: vi.fn(),
        removeChild: vi.fn(),
      },
    });
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:http://test"),
      revokeObjectURL: vi.fn(),
    });
  });

  describe("exportToCSV", () => {
    it("should export data to CSV format", () => {
      const blob = exportToCSV(mockData, testColumns);
      
      expect(blob.type).toBe("text/csv;charset=utf-8;");
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should include UTF-8 BOM for Excel compatibility", async () => {
      const blob = exportToCSV(mockData, testColumns);
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      
      // Check first 3 bytes for UTF-8 BOM (0xEF 0xBB 0xBF)
      expect(bytes[0]).toBe(0xEF);
      expect(bytes[1]).toBe(0xBB);
      expect(bytes[2]).toBe(0xBF);
    });

    it("should include all columns in correct order", async () => {
      const blob = exportToCSV(mockData, testColumns);
      const text = await blob.text();
      const lines = text.split("\n");
      
      const header = lines[0];
      expect(header).toContain("Nome");
      expect(header).toContain("Email");
      expect(header).toContain("Situação");
      expect(header).toContain("Valor");
    });

    it("should handle empty data", () => {
      const blob = exportToCSV([], testColumns);
      
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should handle includeIndex option", async () => {
      const blob = exportToCSV(mockData, testColumns, { includeIndex: true });
      const text = await blob.text();
      const lines = text.split("\n");
      
      expect(lines[0]).toContain("#");
    });
  });

  describe("exportToXLSX", () => {
    it("should export data to XLSX format", () => {
      const blob = exportToXLSX(mockData, testColumns);
      
      expect(blob.type).toBe("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should handle empty data", () => {
      const blob = exportToXLSX([], testColumns);
      
      expect(blob.size).toBeGreaterThan(0);
    });
  });

  describe("exportToPDF", () => {
    it("should export data to PDF format", () => {
      const blob = exportToPDF(mockData, testColumns);
      
      expect(blob.type).toBe("application/pdf");
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should handle custom title", () => {
      const blob = exportToPDF(mockData, testColumns, { title: "Custom Title" });
      
      expect(blob.type).toBe("application/pdf");
    });

    it("should handle dateRange option", () => {
      const blob = exportToPDF(mockData, testColumns, {
        dateRange: { start: "2024-01-01", end: "2024-12-31" },
      });
      
      expect(blob.type).toBe("application/pdf");
    });
  });

  describe("exportData", () => {
    it("should handle empty data", () => {
      const blob = exportData([], testColumns, "csv");
      
      expect(blob.size).toBeGreaterThan(0);
    });

    it("should throw error for unsupported format", () => {
      expect(() => exportData(mockData, testColumns, "invalid" as "csv")).toThrow("Formato não suportado");
    });
  });

  describe("exportAndDownload", () => {
    it("should trigger download", () => {
      exportAndDownload(mockData, testColumns, "csv", { fileName: "test" });
      
      expect(document.createElement).toHaveBeenCalledWith("a");
    });
  });

  describe("Data Accuracy", () => {
    it("should export all data rows", async () => {
      const blob = exportToCSV(mockData, testColumns);
      const text = await blob.text();
      const lines = text.split("\n").filter(line => line.trim());
      
      // Header + 3 data rows
      expect(lines.length).toBe(4);
    });

    it("should correctly format currency values", async () => {
      const columnsWithCurrency: ExportColumn<TestData>[] = [
        { key: "price", label: "Valor", formatter: (val) => 
          Number(val).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        },
      ];
      
      const blob = exportToCSV(mockData, columnsWithCurrency);
      const text = await blob.text();
      
      // Should contain formatted BRL values
      expect(text).toContain("R$");
    });

    it("should handle null/undefined values", () => {
      const dataWithNulls = [
        { id: "1", name: null as unknown as string, email: undefined as unknown as string, situation: "" },
      ];
      const columns: ExportColumn<typeof dataWithNulls[0]>[] = [
        { key: "name", label: "Nome" },
        { key: "email", label: "Email" },
      ];
      
      const blob = exportToCSV(dataWithNulls, columns);
      
      expect(blob.size).toBeGreaterThan(0);
    });
  });

  describe("Special Characters", () => {
    it("should handle accented characters", async () => {
      const dataWithAccents = [
        { id: "1", name: "João São Paulo", email: "test@ã.com", situation: "Ativo" },
      ];
      
      const blob = exportToCSV(dataWithAccents, testColumns);
      const text = await blob.text();
      
      expect(text).toContain("João");
      expect(text).toContain("São");
      expect(text).toContain("ã");
    });

    it("should escape commas in data", async () => {
      const dataWithComma = [
        { id: "1", name: "Test, Company", email: "test@email.com", situation: "Ativo" },
      ];
      
      const blob = exportToCSV(dataWithComma, testColumns);
      const text = await blob.text();
      
      // Should be wrapped in quotes
      expect(text).toContain('"Test, Company"');
    });
  });
});
