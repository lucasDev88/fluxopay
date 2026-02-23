interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = "", children }: CardProps) {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900 shadow-lg ${className}`}>
      {children}
    </div>
  )
}