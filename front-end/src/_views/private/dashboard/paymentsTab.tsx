import { SquarePen } from "lucide-react";
import { useEffect, useState } from "react";
import PaymentModal from "../../../components/dashboard/ModalPayment";
import { getPayments } from "../../../_services/payments";
import type { Payment } from "../../../_services/types/Payments";

export default function PagamentosTab() {
  const [pagamentos, setPagamentos] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadPayments() {
    try {
      setLoading(true);
      setError(null);

      const data = await getPayments();
      setPagamentos(data);
    } catch (err: unknown) {
      setError("Erro ao carregar pagamentos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPayments();
  }, []);

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="space-y-6 text-white">
      <div>
        <h2 className="text-3xl font-bold">Pagamentos</h2>
        <p className="text-slate-400">Histórico de transações</p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
        {loading && <p className="font-semibold">Carregando...</p>}
        {error && <p>{error}</p>}

        {pagamentos.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center border-b border-slate-800 py-4"
          >
            <div>
              <p className="font-semibold">{p.name}</p>
              <p className="text-slate-400 text-sm">{p.id}</p>
            </div>

            <div className="text-right">
              <p className="font-bold mr-23">{p.price} R$</p>
              <span
                className={`text-xs px-3 py-1 rounded-lg mr-4 ${
                  p.situation === "Aprovado"
                    ? "bg-green-500/20 text-green-400"
                    : p.situation == "Pendente"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : p.situation === "Recusado"
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
                onClick={() => setOpenModal(true)}
              >
                <span>
                  <SquarePen />
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <PaymentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={() => {
          console.log("Pagamento editado - atualizar lista");
        }}
      />
    </div>
  );
}
