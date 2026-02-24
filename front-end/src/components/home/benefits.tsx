import { ShieldCheck, TrendingUp, Brain, Clock, BarChart3, Sparkles } from "lucide-react"

const benefits = [
  {
    icon: <TrendingUp className="w-6 h-6 text-blue-400" />,
    title: "Previsibilidade de Receita",
    description:
      "Visualize projeções futuras e tome decisões estratégicas com base em dados reais.",
  },
  {
    icon: <Brain className="w-6 h-6 text-blue-400" />,
    title: "Inteligência Integrada",
    description:
      "Análises automáticas que identificam riscos, oportunidades e padrões de crescimento.",
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
    title: "Clareza Financeira Total",
    description:
      "Dashboard simples, métricas organizadas e relatórios claros para controle absoluto.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
    title: "Segurança e Confiabilidade",
    description:
      "Arquitetura moderna e estrutura preparada para escalar com estabilidade.",
  },
  {
    icon: <Clock className="w-6 h-6 text-blue-400" />,
    title: "Automação Inteligente",
    description:
      "Lembretes, alertas e projeções automáticas que economizam tempo e evitam erros.",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-blue-400" />,
    title: "Decisões Baseadas em Dados",
    description:
      "Transforme informações financeiras em estratégias práticas de crescimento.",
  },
]

export function Benefits() {
  return (
    <section id="beneficios" className="py-28 bg-linear-to-b from-black via-blue-950 to-indigo-950 text-white">
      
      {/* Header */}
      <div className="text-center mb-20 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Mais que Controle. Inteligência Financeira.
        </h2>
        <p className="text-blue-300/70 max-w-2xl mx-auto">
          O FluxoPay transforma dados financeiros em decisões estratégicas
          para negócios digitais modernos.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-blue-500/40 hover:bg-white/10"
          >
            <div className="mb-5">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                {benefit.icon}
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3">
              {benefit.title}
            </h3>

            <p className="text-blue-200/70 text-sm leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}