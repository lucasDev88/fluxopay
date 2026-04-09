interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className = "", children, hover = false }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border border-slate-800/50 
        bg-gradient-to-br from-slate-900 to-slate-900/80
        shadow-lg shadow-black/20
        backdrop-blur-sm
        transition-all duration-300
        ${hover ? "hover:border-slate-700/50 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
