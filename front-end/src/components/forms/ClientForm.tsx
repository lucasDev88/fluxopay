import { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";
import Modal from "@/components/utils/Modal";
import Dropdown from "@/components/utils/Dropdown";
import { UserCheck, Clock, UserX, User, Mail, UserCog } from "lucide-react";
import type { StateClient } from "@/components/home/types/State";
import { createClient, updateClient } from "@/_services/clients";

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id?: string;
    name?: string;
    email?: string;
    situation?: StateClient;
  };
  mode?: "create" | "edit";
}

const situationOptions = [
  { value: "Ativo" as StateClient, label: "Ativo", icon: UserCheck, className: "text-emerald-400" },
  { value: "Pendente" as StateClient, label: "Pendente", icon: Clock, className: "text-amber-400" },
  { value: "Desativo" as StateClient, label: "Desativado", icon: UserX, className: "text-red-400", danger: true },
];

export function ClientForm({
  open,
  onClose,
  onSuccess,
  initialData,
  mode = "create",
}: ClientFormProps) {
  const formId = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [situation, setSituation] = useState<StateClient | "">("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      setName(initialData?.name || "");
      setEmail(initialData?.email || "");
      setSituation(initialData?.situation || "");
      setErrors({});
      setApiError(null);
    }
  }, [open, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
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

      if (mode === "edit" && initialData?.id) {
        await updateClient(initialData.id, {
          name,
          email,
          situation: situation as StateClient,
        });
      } else {
        await createClient({
          name,
          email,
          situation: situation as StateClient,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      console.error("[ClientForm] Submit error:", err);
      // Extract error message
      if (err instanceof Error) {
        setApiError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as { response?: { data?: { message?: string } } }).response;
        setApiError(response?.data?.message || "Erro ao salvar cliente");
      } else {
        setApiError("Erro ao salvar cliente. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentSituation = situationOptions.find((s) => s.value === situation);
  const nameId = `client-name-${formId}`;
  const emailId = `client-email-${formId}`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Novo cliente" : "Editar cliente"}
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
            {loading ? "Salvando..." : mode === "create" ? "Criar cliente" : "Salvar alterações"}
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

        {/* Client Name */}
        <div className="space-y-2">
          <label htmlFor={nameId} className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <User className="w-4 h-4 text-slate-500" />
            Nome completo
          </label>
          <input
            id={nameId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: João Silva"
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

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor={emailId} className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Mail className="w-4 h-4 text-slate-500" />
            Endereço de email
          </label>
          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ex: joao@empresa.com"
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            aria-invalid={!!errors.email}
            className={`
              w-full bg-slate-800/50 border rounded-xl px-4 py-3 
              text-white placeholder-slate-500 outline-none
              transition-all duration-200
              focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50
              ${errors.email ? "border-red-500/50" : "border-slate-700 hover:border-slate-600"}
            `}
          />
          {errors.email && (
            <p id={`${emailId}-error`} className="text-xs text-red-400 mt-1" role="alert">
              {errors.email}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
            {currentSituation ? (
              <currentSituation.icon className={`w-4 h-4 ${currentSituation.className}`} />
            ) : (
              <UserCog className="w-4 h-4 text-slate-500" />
            )}
            Status do cliente
          </span>
          <Dropdown
            trigger={
              <button
                type="button"
                aria-label="Selecionar status do cliente"
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
      </motion.div>
    </Modal>
  );
}

export default ClientForm;
