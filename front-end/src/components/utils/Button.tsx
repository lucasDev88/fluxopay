import "../../style/App.css";
import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  className = "",
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes: Record<"sm" | "md" | "lg", string> = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  };

  const styles: Record<"primary" | "secondary" | "outline" | "ghost" | "danger", string> = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/30",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/50 shadow-lg shadow-black/10",
    outline:
      "border border-slate-600/50 hover:border-slate-500 hover:bg-slate-800/50 text-slate-300 hover:text-white",
    ghost:
      "hover:bg-slate-800/50 text-slate-400 hover:text-white",
    danger:
      "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-600/25",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${styles[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
