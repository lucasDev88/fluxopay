import PlanCard from "./subcomponents/planCard"
import { plans } from "./data/Planos"
import CountUp from "react-countup"
import { Users, Star, Clock, TrendingUp, Sparkles } from "lucide-react"

const stats = [
  {
    icon: <Users className="w-6 h-6" />,
    value: 15000,
    suffix: "+",
    label: "Clientes Ativos",
    sub: "Crescendo mensalmente",
  },
  {
    icon: <Star className="w-6 h-6" />,
    value: 98,
    suffix: "%",
    label: "Satisfação",
    sub: "Avaliações positivas",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    value: "24/7",
    label: "Suporte",
    sub: "Atendimento contínuo",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
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
      className="py-24 lg:py-32 text-white bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6">
            <Sparkles size={16} />
            Nossos Planos
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Planos que Crescem com Você
          </h2>
          
          <p className="text-lg md:text-xl text-blue-200/70 max-w-2xl mx-auto leading-relaxed">
            Escolha o nível ideal para transformar sua renda em previsibilidade. 
            Sem surpresas, sem compromissos desnecessários.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-blue-200/60">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>14 dias de teste</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Divider */}
        <div className="relative mb-20">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <div className="px-4 py-2 bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950">
              <div className="flex items-center gap-2 text-sm text-blue-300/60">
                <div className="w-2 h-2 rounded-full bg-blue-400/60" />
                Números que importam
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Plataforma em Expansão
          </h3>
          <p className="text-blue-200/60 text-lg max-w-xl mx-auto">
            Números que refletem crescimento e impacto real na vida dos nossos clientes.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
              </div>

              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                {typeof stat.value === "number" ? (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    suffix={stat.suffix}
                  />
                ) : (
                  stat.value
                )}
              </div>

              <p className="text-base font-medium text-white/90 mb-1">
                {stat.label}
              </p>

              <p className="text-sm text-blue-200/50">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
