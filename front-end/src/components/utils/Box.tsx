interface BoxProps {
  title: string;
  children: React.ReactNode;
}

function Box({ title, children }: BoxProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  )
}

export default Box