import { useEffect, useRef, useState } from "react";
import type { DropdownProps } from "./types/DropdownTypes";

export default function Dropdown({
  trigger,
  items,
  align = "left",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className={`absolute w-full mt-2 rounded-2xl shadow-xl bg-slate-600 z-50 ${align === "right" ? "right-0" : "left-0"}`}
        >
          <div className="py-2 w-full">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-left text-white px-4 py-2 text-sm hover:bg-slate-500 transition ${
                  item.danger ? "text-red-500" : "text-gray-700"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}