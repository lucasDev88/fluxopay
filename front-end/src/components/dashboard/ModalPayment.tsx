import { useState } from "react";
import { motion } from "framer-motion";
import { createPayment } from "../../_services/payments";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export default function PaymentModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [situation, setSituation] = useState<string>("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleCreate() {
    if (!name || !price || !situation) return;

    if (situation !== "Aprovado" && situation !== "Pendente" && situation !== "Recusado")
      return alert(
        'Somente os 3 tipos de estado, "Aprovado", "Pendente" ou "Recusado',
      );

    try {
      setLoading(true);

      await createPayment({
        name,
        price: Number(price),
        situation,
      });

      setName("");
      setPrice("");
      setSituation("");
      onCreated?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar pagamento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 text-white w-full max-w-md rounded-2xl p-6 border border-slate-700 shadow-2xl"
      >
        <h2 className="text-xl font-bold mb-4">Novo pagamento</h2>

        <div className="space-y-4">
          <input
            placeholder="Nome do produto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="number"
            placeholder="Preço"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
          />

          <input
            type="text"
            placeholder="Pendente, Erro ou Pago"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl"
          >
            Cancelar
          </button>

          <button
            disabled={loading}
            onClick={handleCreate}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold"
          >
            {loading ? "Criando..." : "Criar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
