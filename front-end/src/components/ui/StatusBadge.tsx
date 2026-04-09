import type { StatePayment, StateClient } from "@/components/home/types/State";
import { CheckCircle, Clock, XCircle, UserCheck, UserX } from "lucide-react";

type StatusType = StatePayment | StateClient;

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md";
}

const paymentConfig: Record<StatePayment, { label: string; className: string; icon: typeof CheckCircle }> = {
  Aprovado: {
    label: "Aprovado",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle,
  },
  Pendente: {
    label: "Pendente",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: Clock,
  },
  Recusado: {
    label: "Recusado",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
    icon: XCircle,
  },
};

const clientConfig: Record<StateClient, { label: string; className: string; icon: typeof UserCheck }> = {
  Ativo: {
    label: "Ativo",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    icon: UserCheck,
  },
  Pendente: {
    label: "Pendente",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    icon: Clock,
  },
  Desativo: {
    label: "Desativado",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
    icon: UserX,
  },
};

const isPaymentStatus = (status: StatusType): status is StatePayment => {
  return ["Aprovado", "Pendente", "Recusado"].includes(status);
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = isPaymentStatus(status) ? paymentConfig[status] : clientConfig[status as StateClient];
  const Icon = config.icon;

  const sizeClasses = size === "sm"
    ? "px-2 py-0.5 text-[10px] gap-1"
    : "px-3 py-1 text-xs gap-1.5";

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${config.className}
        ${sizeClasses}
      `}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {config.label}
    </span>
  );
}
