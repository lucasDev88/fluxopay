import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
}

type SelectionMode = "idle" | "start" | "end";

export function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("idle");
  const [tempStart, setTempStart] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectionMode("idle");
        setTempStart(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = useCallback((date: Date): string => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const getDaysInMonth = useCallback((date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add padding for days before the first day of the month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    // Add padding for days after the last day of the month (fill to 42 cells)
    const endPadding = 42 - days.length;
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  }, []);

  const isSameDay = (d1: Date, d2: Date): boolean => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isInRange = useCallback((date: Date): boolean => {
    if (!tempStart) return false;
    const min = tempStart < startDate ? tempStart : startDate;
    const max = tempStart < startDate ? startDate : tempStart;
    return date > min && date < max;
  }, [tempStart, startDate]);

  const handleDateClick = useCallback((date: Date) => {
    if (selectionMode === "idle" || selectionMode === "start") {
      // First click: set start date
      setTempStart(date);
      setSelectionMode("end");
    } else if (selectionMode === "end") {
      // Second click: set end date
      if (tempStart && date < tempStart) {
        // If clicked date is before tempStart, swap them
        onChange(date, tempStart);
      } else if (tempStart) {
        onChange(tempStart, date);
      } else {
        onChange(date, date);
      }
      setSelectionMode("idle");
      setTempStart(null);
      setIsOpen(false);
    }
  }, [selectionMode, tempStart, onChange]);

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const handleQuickSelect = useCallback((daysBack: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - daysBack);
    onChange(start, end);
    setIsOpen(false);
    setSelectionMode("idle");
    setTempStart(null);
  }, [onChange]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Selecionar período"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600/50 transition-all"
      >
        <Calendar className="w-4 h-4" />
        <span className="text-sm">
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden w-80"
            role="dialog"
            aria-label="Seletor de período"
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                aria-label="Mês anterior"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-white" aria-live="polite">
                {currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
              </span>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                aria-label="Próximo mês"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Selection hint */}
            <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-800">
              <p className="text-xs text-slate-400">
                {selectionMode === "idle" || selectionMode === "start"
                  ? "Clique para selecionar a data inicial"
                  : "Clique para selecionar a data final"}
              </p>
            </div>

            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 p-2 border-b border-slate-800" role="row">
              {weekDays.map((day) => (
                <div
                  key={day}
                  role="columnheader"
                  className="text-center text-xs font-medium text-slate-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 p-2" role="grid">
              {days.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const isStart = isSameDay(date, startDate);
                const isEnd = isSameDay(date, endDate);
                const isTempStart = tempStart ? isSameDay(date, tempStart) : false;
                const isInDateRange = isInRange(date);
                const isToday = isSameDay(date, new Date());

                const isRangeDay = isStart || isEnd || isTempStart;
                const showRangeBg = isRangeDay || isInDateRange;

                return (
                  <button
                    key={index}
                    role="gridcell"
                    tabIndex={isCurrentMonth ? 0 : -1}
                    aria-label={date.toLocaleDateString("pt-BR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                    aria-selected={isStart || isEnd || isTempStart}
                    aria-disabled={!isCurrentMonth}
                    onClick={() => handleDateClick(date)}
                    disabled={!isCurrentMonth}
                    className={`
                      aspect-square flex items-center justify-center text-sm rounded-lg
                      transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${!isCurrentMonth ? "text-slate-700 cursor-default" : ""}
                      ${isCurrentMonth && !showRangeBg ? "text-slate-300 hover:bg-slate-800" : ""}
                      ${showRangeBg ? "bg-blue-500 text-white font-medium" : ""}
                      ${isToday && !showRangeBg ? "ring-1 ring-blue-500/50" : ""}
                      ${isTempStart && !isStart ? "bg-blue-400 text-white" : ""}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Quick select buttons */}
            <div className="flex gap-2 p-3 border-t border-slate-800">
              <button
                onClick={() => handleQuickSelect(7)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                7 dias
              </button>
              <button
                onClick={() => handleQuickSelect(30)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                30 dias
              </button>
              <button
                onClick={() => handleQuickSelect(90)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                90 dias
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DateRangePicker;
