import type { Plan } from "../types/Plan"

type Props = {
  plan: Plan
}

export default function PlanCard({ plan }: Props) {
  return (
    <div
      className={`rounded-2xl border p-8 h-full flex flex-col shadow-sm transition hover:shadow-xl
      ${plan.highlight
        ? "border-blue-950 bg-blue-900 text-white"
        : "border-gray-200 bg-white text-black"}
      `}
    >
      {plan.highlight && (
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide">
          Mais popular
        </div>
      )}

      <h3 className="text-2xl font-bold mb-2">
        {plan.name}
      </h3>

      <div className="text-4xl font-extrabold mb-1">
        {plan.price}
        <span className={`text-sm ml-1 ${plan.highlight ? "text-gray-300" : "text-gray-500"}`}>
          /mês
        </span>
      </div>

      <p className={`mb-6 ${plan.highlight ? "text-gray-300" : "text-gray-600"}`}>
        {plan.desc}
      </p>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex gap-2">
            <span>✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 rounded-xl font-semibold transition
        ${plan.highlight
          ? "bg-blue-500 text-white hover:bg-blue-400"
          : "bg-black text-white hover:bg-gray-800"}
        `}
      >
        {plan.button}
      </button>
    </div>
  )
}
