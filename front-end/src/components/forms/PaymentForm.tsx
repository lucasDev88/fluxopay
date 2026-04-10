import { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";
import Modal from "@/components/utils/Modal";
import Dropdown from "@/components/utils/Dropdown";
import SearchableSelect from "@/components/utils/SearchableSelect";
import { CheckCircle, Clock, XCircle, CreditCard, FileText, DollarSign, User } from "lucide-react";
import type { StatePayment } from "@/components/home/types/State";
import { createPayment, updatePayment } from "@/_services/payments";
import { useClients } from "@/_hooks/useClients";

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id?: string;
    name?: string;
    price?: number;
    description?: string;
    situation?: StatePayment;
    customerId?: string;
  };
  mode?: "create" | "edit";
}

const situationOptions = [
  { value: "Aprovado" as StatePayment, label: "Aprovado", icon: CheckCircle, className: "text-emerald-400" },
  { value: "Pendente" as StatePayment, label: "Pendente", icon: Clock, className: "text-amber-400" },
  { value: "Recusado" as StatePayment, label: "Recusado", icon: XCircle, className: "text-red-400", danger: true },
];

export function PaymentForm({
  open,
  onClose,
  onSuccess,
  initialData,
  mode = "create",
}: PaymentFormProps) {
  const formId = useId();
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [situation, setSituation] = useState<StatePayment | "">("");
  const [customerId, setCustomerId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch clients for customer selection
  const { clients, fetchClients, loading: clientsLoading } = useClients();

  // Load clients when modal opens
  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open, fetchClients]);

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      setName(initialData?.name || "");
      setPrice(initialData?.price ?? "");
      setDescription(initialData?.description || "");
      setSituation(initialData?.situation || "");
      setCustomerId(initialData?.customerId || "");
      setErrors({});
      setApiError(null);
    }
  }, [open, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (price === "" || price < 0) {
      newErrors.price = "Valor é obrigatório";
    }

    if (!situation) {
      newErrors.situation = "Status é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setApiError(null);

      const paymentData = {
        name,
        price: Number(price),
        description,
        situation: situation as StatePayment,
        customerId: customerId || undefined,
      };

      if (mode === "edit" && initialData?.id) {
        await updatePayment(initialData.id, paymentData);
      } else {
        await createPayment(paymentData);
      }

      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      console.error("[PaymentForm] Submit error:", err);
      // Extract error message
      if (err instanceof Error) {
        setApiError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        setApiError(response?.data?.message || "Erro ao salvar pagamento");
      } else {
        setApiError("Erro ao salvar pagamento. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentSituation = situationOptions.find((s) => s.value === situation);
  const nameId = `payment-name-${formId}`;
  const priceId = `payment-price-${formId}`;
  const descId = `payment-desc-${formId}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Novo pagamento" : "Editar pagamento"}
      footer={
        <>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700"
          >
            Cancelar
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvando..." : mode === "create" ? "Criar pagamento" : "Salvar alterações"}
          </button>
        </>
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-5"
      >
        {/* API Error */}
        {apiError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
            {apiError}
          </div>
        )}

        {/* Product Name */}
        <div className="space-y-2">
          <label htmlFor={nameId} className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <CreditCard className="w-4 h-4 text-slate-500" />
            Nome do produto
          </label>
          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Assinatura Premium"
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            aria-invalid={!!errors.name}
            className={`
              w-full bg-slate-800/50 border rounded-xl px-4 py-3 
              text-white placeholder-slate-500 outline-none
              transition-all duration-200
              focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
              ${errors.name ? "border-red-500/50" : "border-slate-700 hover:border-slate-600"}
            `}
          />
          {errors.name && (
            <p id={`${nameId}-error`} className="text-xs text-red-400 mt-1" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label htmlFor={priceId} className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <DollarSign className="w-4 h-4 text-slate-500" />
            Valor (R$)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
              R$
            </span>
            <input
              id={priceId}
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="0,00"
              min="0"
              step="0.01"
              aria-describedby={errors.price ? `${priceId}-error` : undefined}
              aria-invalid={!!errors.price}
              className={`
                w-full bg-slate-800/50 border rounded-xl pl-12 pr-4 py-3 
                text-white placeholder-slate-500 outline-none
                transition-all duration-200
                focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
                ${errors.price ? "border-red-500/50" : "border-slate-700 hover:border-slate-600"}
              `}
            />
          </div>
          {errors.price && (
            <p id={`${priceId}-error`} className="text-xs text-red-400 mt-1" role="alert">
              {errors.price}
            </p>
          )}
        </div>

        {/* Description (Optional) */}
        <div className="space-y-2">
          <label htmlFor={descId} className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <FileText className="w-4 h-4 text-slate-500" />
            Descrição
            <span className="text-xs text-slate-500 font-normal">(opcional)</span>
          </label>
          <input
            id={descId}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve descrição do pagamento"
            className="w-full bg-slate-800/50 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
            {currentSituation ? (
              <currentSituation.icon className={`w-4 h-4 ${currentSituation.className}`} />
            ) : (
              <Clock className="w-4 h-4 text-slate-500" />
            )}
            Status do pagamento
          </span>
          <Dropdown
            trigger={
              <button
                type="button"
                aria-label="Selecionar status do pagamento"
                className={`
                  w-full flex items-center justify-between gap-3 px-4 py-3 
                  rounded-xl bg-slate-800/50 border transition-all duration-200
                  ${errors.situation ? "border-red-500/50" : "border-slate-700 hover:border-slate-600"}
                  ${currentSituation ? currentSituation.className : "text-slate-400"}
                `}
              >
                <span className="flex items-center gap-2">
                  {currentSituation ? (
                    <>
                      <currentSituation.icon className="w-4 h-4" />
                      {currentSituation.label}
                    </>
                  ) : (
                    "Selecione o status"
                  )}
                </span>
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            }
            items={situationOptions.map((option) => ({
              label: option.label,
              icon: <option.icon className={`w-4 h-4 ${option.className}`} />,
              onClick: () => setSituation(option.value),
              danger: option.danger,
            }))}
          />
          {errors.situation && (
            <p className="text-xs text-red-400 mt-1" role="alert">
              {errors.situation}
            </p>
          )}
        </div>

        {/* Customer Selection */}
        <div className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <User className="w-4 h-4 text-slate-500" />
            Cliente vinculado
            <span className="text-xs text-slate-500 font-normal">(opcional)</span>
          </span>
          
          {clientsLoading ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Carregando clientes...
            </div>
          ) : (
            <SearchableSelect
              value={customerId}
              onChange={setCustomerId}
              placeholder="Nenhum cliente vinculado"
              emptyMessage="Nenhum cliente encontrado"
              options={[
                { value: "", label: "Nenhum cliente vinculado", icon: <XCircle className="w-4 h-4 text-slate-400" /> },
                ...clients.map((client) => ({
                  value: String(client.id),
                  label: `${client.name} (${client.email})`,
                  icon: <User className="w-4 h-4 text-blue-400" />,
                })),
              ]}
            />
          )}
          
          {customerId && (
            <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
              <User className="w-3 h-3" />
              Pagamento vinculado ao cliente selecionado
            </p>
          )}
        </div>
      </motion.div>
    </Modal>
  );
}

export default PaymentForm;
