import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Search, X, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  emptyMessage = "Nenhuma opção encontrada",
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(searchLower)
    );
  }, [options, search]);

  // Get selected option
  const selectedOption = useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  // Get dropdown position
  const [dropdownStyle, setDropdownStyle] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  const handleOpen = () => {
    if (!disabled) {
      setOpen(true);
      setTimeout(() => {
        updatePosition();
        inputRef.current?.focus();
      }, 50);
    }
  };

  const handleSelect = (option: SelectOption, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onChange(option.value);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearch("");
  };

  // Handle wheel scrolling
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const dropdownContent = open && (
    <div
      className="fixed z-[100] rounded-xl shadow-xl bg-slate-600 overflow-hidden"
      style={{
        top: dropdownStyle.top,
        left: dropdownStyle.left,
        width: dropdownStyle.width,
      }}
    >
      {/* Search Input */}
      <div className="p-2 border-b border-slate-500/50 sticky top-0 bg-slate-600">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="w-full pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-500/50 rounded-lg text-white text-sm placeholder-slate-400 outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* Options List */}
      <div
        onWheel={handleWheel}
        className="py-2 max-h-60 overflow-y-auto scrollbar-thin"
      >
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-3 text-sm text-slate-400 text-center">
            {emptyMessage}
          </div>
        ) : (
          filteredOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={(e) => handleSelect(option, e)}
              className={`
                flex items-center gap-2 w-full text-left px-4 py-2 text-sm 
                transition-colors
                ${option.value === value 
                  ? "bg-blue-500/20 text-blue-300" 
                  : "text-white hover:bg-slate-500"
                }
              `}
            >
              {option.icon}
              <span className="truncate">{option.label}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl 
          bg-slate-800/50 border border-slate-700 hover:border-slate-600 
          text-slate-300 transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          {selectedOption?.label || placeholder}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <span
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-slate-700 text-slate-400 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Dropdown Portal */}
      {open && createPortal(dropdownContent, document.body)}
    </div>
  );
}
