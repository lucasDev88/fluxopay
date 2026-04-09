import { plans } from "@/components/home/data/Planos"
import { type Plan } from "@/components/home/types/Plan"
import { useParams } from "react-router-dom"
import { Check, ArrowLeft, Sparkles } from "lucide-react"

export default function PlanDetails() {
    const { id } = useParams()
    const plan = plans.find((p: Plan) => p.id === id)

    if (!plan) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-2">Plano não encontrado</h2>
                    <p className="text-slate-400">O plano que você está procurando não existe.</p>
                </div>
            </div>
        )
    }

    const isHighlighted = plan.highlight

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <a
                    href="/plans"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 sm:mb-12"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Voltar para planos</span>
                </a>

                <div className={`relative rounded-3xl p-8 sm:p-12 ${isHighlighted ? 'bg-linear-to-br from-indigo-500/20 via-purple-500/10 to-slate-900 border border-indigo-500/30' : 'bg-slate-900/50 border border-slate-800'}`}>
                    {isHighlighted && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 text-xs font-semibold">
                                <Sparkles className="w-3 h-3" />
                                Mais Popular
                            </span>
                        </div>
                    )}

                    <div className="text-center mb-10 sm:mb-14">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${isHighlighted ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-300'}`}>
                            {plan.name}
                        </span>

                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                                {plan.price}
                            </span>
                            <span className="text-slate-400 text-lg sm:text-xl">/mês</span>
                        </div>

                        <p className="mt-4 text-lg sm:text-xl text-slate-400 max-w-md mx-auto">
                            {plan.desc}
                        </p>
                    </div>

                    <div className="mb-10 sm:mb-12">
                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6 text-center">
                            O que está incluído
                        </h3>
                        <ul className="space-y-4">
                            {plan.features.map((feature, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 text-slate-300"
                                >
                                    <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${isHighlighted ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
                                        <Check className={`w-3 h-3 ${isHighlighted ? 'text-indigo-400' : 'text-emerald-400'}`} />
                                    </span>
                                    <span className="text-sm sm:text-base">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="text-center">
                        <button
                            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                                isHighlighted
                                    ? 'bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40'
                                    : 'bg-white text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {plan.button}
                        </button>
                        <p className="mt-4 text-sm text-slate-500">
                            Cancele a qualquer momento. Sem compromisso.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-slate-500">
                        Tem dúvidas?{' '}
                        <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            Fale com nosso time
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}