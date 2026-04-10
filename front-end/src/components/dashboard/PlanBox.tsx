/* eslint-disable react-hooks/static-components */
import { Card } from "../utils/Card";
import { CardContent } from "../utils/CardContent";
import { Check, Crown, Zap, Shield, Clock } from "lucide-react";

interface PlanBoxProps {
  name: string;
  features?: string[];
}

function PlanBox({ name }: PlanBoxProps) {
  const planFeatures = [
    "Pagamentos ilimitados",
    "API completa com suporte",
    "Dashboard analítico avançado",
    "Suporte prioritário 24/7",
    "Integrações personalizadas",
    "Webhooks em tempo real",
  ];

  const getIcon = () => {
    switch (name.toLowerCase()) {
      case "premium":
        return Crown;
      case "pro":
        return Zap;
      default:
        return Shield;
    }
  };

  const Icon = getIcon();
  const isPremium = name.toLowerCase() === "premium";

  return (
    <Card
      hover
      className={`
        relative overflow-hidden
        ${isPremium ? "border-blue-500/30 bg-linear-to-br from-blue-500/10 to-purple-500/10" : "border-slate-700/50"}
      `}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />

      <CardContent className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`
                p-2.5 rounded-xl
                ${isPremium ? "bg-linear-to-br from-blue-500 to-purple-500" : "bg-slate-800"}
                border ${isPremium ? "border-blue-400/30" : "border-slate-700"}
              `}
            >
              <Icon className={`w-5 h-5 ${isPremium ? "text-white" : "text-slate-400"}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Plano {name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3 h-3 text-slate-500" />
                <span className="text-xs text-slate-500">Renovação em 15 dias</span>
              </div>
            </div>
          </div>

          {isPremium && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25">
              Ativo
            </span>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          {planFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div
                className={`
                  p-1 rounded-md
                  ${isPremium ? "bg-emerald-500/20" : "bg-slate-800"}
                `}
              >
                <Check
                  className={`w-3.5 h-3.5 ${isPremium ? "text-emerald-400" : "text-slate-500"}`}
                />
              </div>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Usage bar */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Uso do plano</span>
            <span className="text-xs font-medium text-slate-400">67%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: "67%" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PlanBox;
