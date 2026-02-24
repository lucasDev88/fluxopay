import { plans } from "@/components/home/data/Planos";

export default function AdminPlans() {
  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold">Admin • Planos</h1>
        <p className="text-slate-400">Configuração de planos e recursos</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.name}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
          >
            <div>
              <h3 className="text-xl font-bold">{p.name}</h3>
              <p className="text-blue-400 font-semibold">{p.price}</p>
            </div>

            <ul className="text-sm text-slate-300 space-y-1">
              {p.features.map((f, i) => (
                <li key={i}>• {f}</li>
              ))}
            </ul>

            <button className="w-full p-2 rounded-xl bg-slate-700 hover:bg-slate-600">
              Editar plano
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
