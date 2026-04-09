import type { ReactNode } from "react";
import { Inbox, Plus } from "lucide-react";
import Button from "@/components/utils/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Decorative background */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl scale-150" />
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center shadow-xl">
          {icon || <Inbox className="w-8 h-8 text-slate-500" />}
        </div>
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 text-center max-w-sm mb-6">
        {description}
      </p>

      {/* Action */}
      {action && (
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
