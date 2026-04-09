import type { Plan } from "../types/Plan"
import { useNavigate } from "react-router-dom"
import { Check, Zap, ArrowRight } from "lucide-react"

type Props = {
  plan: Plan
}

export default function PlanCard({ plan }: Props) {
  const navigate = useNavigate()
  const isPopular = plan.highlight
  const isFree = plan.id === "free"

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl p-8 h-full transition-all duration-300 hover:-translate-y-1
        ${isPopular 
          ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-500/25 ring-2 ring-white/20 scale-[1.02]" 
          : "bg-white text-gray-900 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:shadow-gray-300/30"
        }
      `}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/30">
            <Zap size={12} fill="currentColor" />
            Mais Popular
          </div>
        </div>
      )}

      {/* Plan Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h3 className={`text-xl font-bold ${isPopular ? "text-white" : "text-gray-900"}`}>
            {plan.name}
          </h3>
          {isFree && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-green-100 text-green-700 rounded-full">
              Grátis
            </span>
          )}
        </div>
        
        <p className={`text-sm mb-4 ${isPopular ? "text-blue-100" : "text-gray-500"}`}>
          {plan.desc}
        </p>

        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-black ${isPopular ? "text-white" : "text-gray-900"}`}>
            {plan.price}
          </span>
          <span className={`text-sm ${isPopular ? "text-blue-200" : "text-gray-400"}`}>
            /mês
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className={`h-px mb-6 ${isPopular ? "bg-white/20" : "bg-gray-100"}`} />

      {/* Features */}
      <ul className="space-y-3.5 mb-8 flex-1">
        {plan.features.slice(0, 6).map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className={`
              flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5
              ${isPopular ? "bg-white/20" : "bg-blue-50"}
            `}>
              <Check size={12} className={isPopular ? "text-white" : "text-blue-600"} />
            </div>
            <span className={`text-sm leading-relaxed ${isPopular ? "text-blue-100" : "text-gray-600"}`}>
              {feature}
            </span>
          </li>
        ))}
        {plan.features.length > 6 && (
          <li className="flex items-center gap-2">
            <div className={`
              w-5 h-5 rounded-full flex items-center justify-center
              ${isPopular ? "bg-white/10" : "bg-gray-100"}
            `}>
              <span className={`text-[10px] font-bold ${isPopular ? "text-white/70" : "text-gray-400"}`}>
                +{plan.features.length - 6}
              </span>
            </div>
            <span className={`text-sm ${isPopular ? "text-blue-200" : "text-gray-400"}`}>
              Mais {plan.features.length - 6} funcionalidades
            </span>
          </li>
        )}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => navigate(`/planos/${plan.id}`)}
        className={`
          group w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-200
          ${isPopular
            ? "bg-white text-indigo-600 hover:bg-blue-50 shadow-lg hover:shadow-xl"
            : isFree
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
              : "bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg"
          }
        `}
      >
        {plan.button}
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
