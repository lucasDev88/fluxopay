import { useState } from "react";
import { createClient } from "../../_services/clients";
import Modal from "../utils/Modal";
import Dropdown from "../utils/Dropdown";
import { CheckCircleIcon, Clock10Icon, XIcon } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  showDescription?: boolean; // 👈 torna opcional
}

export default function ClientModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [situation, setSituation] = useState<string>("");
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name || !situation) return;

    if (situation !== "Ativo" && situation !== "Pendente" && situation !== "Desativo")
      return alert(
        'Somente os 3 tipos de estado, "Ativo", "Pendente" ou "Desativo',
      );

    try {
      setLoading(true);

      await createClient({
        name,
        email,
        situation,
      });

      setName("");
      setEmail("")
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
    <Modal
      open={open}
      onClose={onClose}
      title="Novo cliente"
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
          placeholder="Nome do Cliente"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
        />

        <input
          placeholder="Email do Cliente"
          value={email}
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
        />

        <Dropdown
          trigger={
            <button className="bg-slate-800 text-white px-4 py-2 rounded-2xl w-100">
              {situation || "Situação"}
            </button>
          }
          items={[
            {
              label: "Ativo",
              icon: <CheckCircleIcon size={16} />,
              onClick: () => setSituation("Ativo"),
            },
            {
              label: "Pendente",
              icon: <Clock10Icon size={16} />,
              onClick: () => setSituation("Pendente"),
            },
            {
              label: "Desativo",
              icon: <XIcon size={16} />,
              onClick: () => setSituation("Desativo"),
              danger: true,
            },
          ]}
        />
      </div>
    </Modal>
  );
}