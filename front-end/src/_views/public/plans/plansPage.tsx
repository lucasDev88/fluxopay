import { plans } from "@/components/home/data/Planos"
import { type Plan } from "@/components/home/types/Plan"
import { useParams } from "react-router-dom"

export default function PlanDetails() {
    const { id } = useParams()

    const plan = plans.find((p: Plan) => p.id === id)
    
    if (!plan) {
        return <div className="p-8 text-red-600">Plano não encontrado</div>
    }

    return (
        <div className="min-h-screen text-center bg-slate-950 text-white p-10">
            <h1 className="text-6xl font-bold ">{plan.name}</h1>
            <p className="text-4xl font-semibold text-slate-500 py-4">{plan.desc}</p>

            <div className="p-10 text-2xl">
                {plan.features.map((f, i) => (
                    <div className="p-3" key={i}>
                        <span>✓ </span>
                        <span>{f}</span>
                    </div>
                ))}
            </div>

            <button className="bg-blue-500 text-4xl rounded-2xl m-2 p-3 cursor-pointer hover:bg-blue-400 transition-all">
                Assinar Plano
            </button>
        </div>
    )
}