import PlanCard from "./subcomponents/planCard"
import { plans } from "./data/Planos"
import CountUp from "react-countup"
import { Users, Star, Clock, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: <Users className="w-6 h-6 text-blue-400" />,
    value: 15000,
    suffix: "+",
    label: "Clientes Ativos",
    sub: "Crescendo mensalmente",
  },
  {
    icon: <Star className="w-6 h-6 text-blue-400" />,
    value: 98,
    suffix: "%",
    label: "Satisfação",
    sub: "Avaliações positivas",
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-400" />,
    value: "24/7",
    label: "Suporte",
    sub: "Atendimento contínuo",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
    value: 50,
    suffix: "M+",
    label: "Receita Monitorada",
    sub: "Volume analisado",
  },
]

export default function Plans() {
  return (
    <section
      id="planos"
      className="py-28 text-white bg-linear-to-b from-blue-950 via-indigo-950 to-black"
    >
      {/* PLANOS */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-bold tracking-tight mb-4">
          Planos que Crescem com Você
        </h2>
        <p className="text-blue-300/70 max-w-2xl mx-auto">
          Escolha o nível ideal para transformar sua renda em previsibilidade.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto px-6">
        {plans.map((plan) => (
          <div key={plan.name}>
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>

      {/* DIVISOR PREMIUM */}
      <div className="h-px bg-linear-to-r from-transparent via-blue-500 to-transparent my-28" />

      {/* STATUS */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">
          Plataforma em Expansão
        </h2>
        <p className="text-blue-300/60">
          Números que refletem crescimento e impacto real.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto px-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center group transition-all duration-300 hover:scale-105"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                {stat.icon}
              </div>
            </div>

            <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
              {typeof stat.value === "number" ? (
                <CountUp
                  end={stat.value}
                  duration={2}
                  suffix={stat.suffix}
                />
              ) : (
                stat.value
              )}
            </div>

            <p className="text-lg font-medium text-white">
              {stat.label}
            </p>

            <p className="text-sm text-blue-300/60 mt-1">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}