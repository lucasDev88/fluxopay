import { motion } from "framer-motion";
import type { TimePeriod } from "@/_services/types/Analytics";

interface FilterTabsProps {
  options: { value: TimePeriod; label: string }[];
  selected: TimePeriod;
  onChange: (value: TimePeriod) => void;
}

export function FilterTabs({ options, selected, onChange }: FilterTabsProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
      {options.map((option) => {
        const isSelected = selected === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${isSelected 
                ? "text-white" 
                : "text-slate-400 hover:text-white"
              }
            `}
          >
            {isSelected && (
              <motion.div
                layoutId="filterTab"
                className="absolute inset-0 bg-slate-700/80 rounded-lg"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default FilterTabs;
