export default function AdminUsers() {
  const users = [
    { id: 1, name: "Empresa Alpha", plan: "Premium", status: "ativo" },
    { id: 2, name: "Loja Beta", plan: "Free", status: "limitado" },
    { id: 3, name: "Startup Gama", plan: "Premium+", status: "ativo" },
  ]

  return (
    <div className="space-y-8 text-white">
      <div>
        <h1 className="text-3xl font-bold">Admin • Usuários</h1>
        <p className="text-slate-400">
          Gestão de contas da plataforma
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800 text-slate-300">
            <tr>
              <th className="text-left p-4">Empresa</th>
              <th className="text-left p-4">Plano</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Ações</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-slate-800">
                <td className="p-4">{u.name}</td>
                <td className="p-4">{u.plan}</td>
                <td className="p-4">
                  <span className="text-green-400">{u.status}</span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600">
                    Ver
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500">
                    Bloquear
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
