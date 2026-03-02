import { useState } from "react";
import { createPayment } from "../../_services/payments";
import Modal from "../utils/Modal";
import Dropdown from "../utils/Dropdown";
import { CheckCircleIcon, Clock10Icon, XIcon } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  showDescription?: boolean; // 👈 torna opcional
}

export default function PaymentModal({
  open,
  onClose,
  onCreated,
  showDescription = true,
}: Props) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [situation, setSituation] = useState<string>("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

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
        description: showDescription ? description: "",
      });

      setName("");
      setPrice("");
      setSituation("");
      setDescription("");
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
    <Modal
      open={open}
      onClose={onClose}
      title="Novo pagamento"
      footer={
        <>
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
        </>
      }
    >
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
          onChange={(e) =>
            setPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
        />

        {showDescription && (
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
          />
        )}

        <Dropdown
          trigger={
            <button className="bg-slate-800 text-white px-4 py-2 rounded-2xl w-100">
              {situation || "Situação"}
            </button>
          }
          items={[
            {
              label: "Aprovado",
              icon: <CheckCircleIcon size={16} />,
              onClick: () => setSituation("Aprovado"),
            },
            {
              label: "Pendente",
              icon: <Clock10Icon size={16} />,
              onClick: () => setSituation("Pendente"),
            },
            {
              label: "Recusado",
              icon: <XIcon size={16} />,
              onClick: () => setSituation("Recusado"),
              danger: true,
            },
          ]}
        />
      </div>
    </Modal>
  );
}