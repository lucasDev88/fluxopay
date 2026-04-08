import { useParams } from "react-router-dom"
import { plans } from "../../../components/home/data/Planos"
import { type Plan } from "../../../components/home/types/Plan"

export default function PlanDetails() {
    const { planId } = useParams()

    const plan = plans.find((p: Plan) => p.planId === planId)

    if (!plan) {
        return <div className="text-white p-10">Plano não encontrado</div>
    }

    return (
        <div className="min-h-screen bg-slate-950 text-center text-white p-10">
            <h1 className="text-6xl font-bold mb-4">{plan.name}</h1>
            <p className="text-slate-400 text-2xl mb-8">{plan.desc}</p>

            <div className="space-y-4">
                {plan.features.map((f, i) => (
                    <div key={i} className="mt-10 text-center px-6 py-3 rounded-xl font-semibold hover:text-cyan-400">
                        <span>✓ </span>
                        <span>{f}</span>
                    </div>
                ))}
            </div>

            <button className="mt-10 bg-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-700">
                Assinar Plano
            </button>
        </div>
    )
}