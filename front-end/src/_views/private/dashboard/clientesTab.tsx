import { SquarePen } from "lucide-react"
import type { Clients } from "@/_services/types/Clients"
import { useEffect, useState } from "react"
import { getClients } from "@/_services/clients"
import Button from "@/components/utils/Button"
import ClientModal from "@/components/dashboard/ClientsForm"

export default function ClientesTab() {
  const [clients, setClients] = useState<Clients[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false)

  async function loadClients() {
    try {
      setLoading(true)
      setOpenModal(false)
      setError(null)

      const data = await getClients();
      setClients(data);
    } catch (err: unknown) {
      setError("Erro ao carregar clients");
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect( () => {
    loadClients();
  }, [] )

  return (
      <div className="space-y-6 text-white">
        <div>
          <h2 className="text-3xl font-bold">Clientes</h2>
          <p className="text-slate-400">Gerencie seus Clientes</p>
        </div>
  
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          {loading && <p className="font-semibold">Carregando...</p>}
  
          {error && <p className="text-red-400">{error}</p>}
  
          {!loading && !error && clients.length === null && (
            <div className="text-center py-10 text-slate-400">
              <p className="">Nenhum cliente encontrado.</p>
              <p className="text-sm mt-2">
                Quando você criar um novo cliente, ele aparecerá aqui.
              </p>
            </div>
          )}
  
          {!loading &&
            !error &&
            clients.length > 0 &&
            clients.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center border-b border-slate-800 py-4"
              >
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-slate-400 text-sm">{p.email}</p>
                </div>
  
                <div className="text-right">
                  <span
                    className={`text-xs px-3 py-1 rounded-lg mr-4 ${
                      p.situation === "Ativo"
                        ? "bg-green-500/20 text-green-400"
                        : p.situation == "Pendente"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : p.situation === "Desativo"
                            ? "bg-red-500/20 text-red-400"
                            : console.log(
                                "STATE:",
                                p.situation,
                                "| TYPE:",
                                typeof p.situation,
                              )
                    }`}
                  >
                    {p.situation}
                  </span>
                  <button
                    className="bg-blue-600 hover:bg-blue-500 text-white p-2 m-4 align-middle rounded-2xl text-center"
                    onClick={() => console.log("test")}
                  >
                    <span>
                      <SquarePen />
                    </span>
                  </button>
                </div>
              </div>
            ))}
        </div>

        <Button variant="secondary" onClick={() => setOpenModal(!openModal)}>
            Adicionar cliente
        </Button>


        <ClientModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onCreated={() => {
          console.log("Cliente Criado - atualizar lista");
        }}
        />
      </div>
  );
}