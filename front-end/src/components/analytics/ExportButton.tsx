import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, FileSpreadsheet, File, ChevronDown } from "lucide-react";
import type { ExportFormat } from "@/_services/types/Analytics";

interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<void>;
  disabled?: boolean;
}

const formatConfig: Record<ExportFormat, { label: string; icon: typeof FileText; color: string }> = {
  pdf: { label: "PDF", icon: FileText, color: "text-red-400" },
  csv: { label: "CSV", icon: File, color: "text-emerald-400" },
  xlsx: { label: "Excel", icon: FileSpreadsheet, color: "text-emerald-600" },
};

export function ExportButton({ onExport, disabled = false }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    try {
      setLoading(format);
      await onExport(format);
    } catch (error) {
      console.error("[ExportButton] Export error:", error);
    } finally {
      setLoading(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        <span className="text-sm font-medium">Exportar</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute right-0 top-full mt-2 z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden w-40"
          >
            {(Object.keys(formatConfig) as ExportFormat[]).map((format) => {
              const config = formatConfig[format];
              const Icon = config.icon;
              const isLoading = loading === format;

              return (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  disabled={loading !== null}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon className={`w-4 h-4 ${config.color}`} />
                  )}
                  <span>Exportar {config.label}</span>
                </button>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
}

export default ExportButton;
