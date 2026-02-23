import "../../style/App.css";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

export default function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonProps) {
  const base = "w-full rounded-xl font-semibold transition active:scale-95";

  const styles: Record<"primary" | "secondary" | "outline", string> = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white p-3 text-center",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white p-3 text-center",
    outline: "border border-slate-600 hover:bg-slate-800 text-white p-3 text-center",
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props} />
  );
}
