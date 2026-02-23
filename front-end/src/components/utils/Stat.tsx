interface StatProps {
  title: string;
  value: string | number;
  sub: string;
  danger?: boolean;
}

function Stat({ title, value, sub, danger }: StatProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${danger ? "text-red-400" : ""}`}>
        {value}
      </h2>
      <p className="text-xs text-slate-500 mt-2">{sub}</p>
    </div>
  )
}

export default Stat