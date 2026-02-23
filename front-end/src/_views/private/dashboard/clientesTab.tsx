export default function ClientesTab() {
  const clientes = [
    { nome: "João Silva", email: "joao@email.com", status: "Ativo" },
    { nome: "Maria Souza", email: "maria@email.com", status: "Ativo" },
    { nome: "Carlos Lima", email: "carlos@email.com", status: "Inativo" },
  ]

  return (
    <div className="space-y-6 text-white">
      <div>
        <h2 className="text-3xl font-bold">Clientes</h2>
        <p className="text-slate-400">Gerencie sua base de clientes</p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <table className="w-full">
          <thead className="text-slate-400 text-sm">
            <tr>
              <th className="text-left pb-3">Nome</th>
              <th className="text-left pb-3">Email</th>
              <th className="text-left pb-3">Status</th>
            </tr>
          </thead>

          <tbody className="space-y-2">
            {clientes.map((c, i) => (
              <tr key={i} className="border-t border-slate-800">
                <td className="py-3">{c.nome}</td>
                <td>{c.email}</td>
                <td>
                  <span className={`px-3 py-1 rounded-lg text-xs ${
                    c.status === "Ativo"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
