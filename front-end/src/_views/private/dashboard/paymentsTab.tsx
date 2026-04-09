import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Plus, Pencil, Trash2, Search, RefreshCw, ArrowUpRight, ArrowDownRight, AlertCircle, X } from "lucide-react";
import { Card } from "@/components/utils/Card";
import { CardContent } from "@/components/utils/CardContent";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { usePayments } from "@/_hooks/usePayments";
import type { Payment } from "@/_services/types/Payments";
import type { StatePayment } from "@/components/home/types/State";

export default function PaymentsTab() {
  const { payments, loading, error, fetchPayments, removePayment } = usePayments();
  const [openModal, setOpenModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Filter payments based on search
  const filteredPayments = payments.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeletePayment = async () => {
    if (!confirmDelete) return;

    const result = await removePayment(confirmDelete.id);
    if (!result.success) {
      setDeleteError(result.error || "Erro ao excluir pagamento");
      return;
    }
    setConfirmDelete(null);
    setDeleteError(null);
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingPayment(null);
  };

  const handleFormSuccess = () => {
    fetchPayments();
  };

  // Stats
  const totalPayments = payments.length;
  const approvedPayments = payments.filter((p) => p.situation === "Aprovado").length;
  const pendingPayments = payments.filter((p) => p.situation === "Pendente").length;
  const totalValue = payments.reduce((acc, p) => acc + (p.price || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Pagamentos</h2>
          <p className="text-slate-500 mt-1">Gerencie suas transações</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" />
          Novo pagamento
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="border-slate-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total</p>
                <p className="text-lg font-bold text-white">{totalPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="border-slate-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Aprovados</p>
                <p className="text-lg font-bold text-emerald-400">{approvedPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="border-slate-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <ArrowDownRight className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Pendentes</p>
                <p className="text-lg font-bold text-amber-400">{pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="border-slate-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-purple-400 font-bold">R$</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Valor Total</p>
                <p className="text-lg font-bold text-white">
                  {totalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card hover className="border-slate-800/50">
        <CardContent className="p-0">
          {/* Search and Filters */}
          <div className="p-6 border-b border-slate-800/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome ou descrição..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <button
                onClick={fetchPayments}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                <p className="text-red-400 font-medium">{error}</p>
                <button
                  onClick={fetchPayments}
                  className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && !payments.length && (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Carregando pagamentos...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredPayments.length === 0 && (
            <EmptyState
              title="Nenhum pagamento encontrado"
              description={
                searchQuery
                  ? "Tente buscar com outros termos ou limpe o filtro."
                  : "Quando você criar um pagamento, ele aparecerá aqui."
              }
              icon={<CreditCard className="w-8 h-8 text-slate-500" />}
              action={
                !searchQuery
                  ? {
                      label: "Criar pagamento",
                      onClick: () => setOpenModal(true),
                    }
                  : undefined
              }
            />
          )}

          {/* Payments List */}
          {!loading && !error && filteredPayments.length > 0 && (
            <div className="divide-y divide-slate-800/50">
              {filteredPayments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group p-4 sm:p-6 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Payment Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                          {payment.name || "Sem nome"}
                        </h3>
                        <StatusBadge status={payment.situation} size="sm" />
                      </div>
                      <p className="text-sm text-slate-500 truncate">
                        {payment.description || "Sem descrição"}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-white tabular-nums">
                          {(payment.price || 0).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditPayment(payment)}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/50 transition-all"
                          title="Editar"
                          aria-label={`Editar pagamento ${payment.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete({ id: payment.id, name: payment.name || "este pagamento" })}
                          className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 transition-all"
                          title="Excluir"
                          aria-label={`Excluir pagamento ${payment.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <PaymentForm
        open={openModal}
        onClose={handleCloseModal}
        mode={editingPayment ? "edit" : "create"}
        initialData={editingPayment ? {
          id: editingPayment.id,
          name: editingPayment.name,
          price: editingPayment.price,
          description: editingPayment.description,
          situation: editingPayment.situation as StatePayment,
        } : undefined}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 text-white w-full max-w-md rounded-2xl overflow-hidden border border-slate-700 shadow-2xl"
          >
            {/* Header */}
            <div className="relative p-6 pb-4">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600" />
              <button
                onClick={() => {
                  setConfirmDelete(null);
                  setDeleteError(null);
                }}
                className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-red-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Excluir pagamento?</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    O pagamento <strong className="text-slate-200">"{confirmDelete.name}"</strong> será permanentemente removido.
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {deleteError && (
              <div className="mx-6 mb-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                  {deleteError}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-3 p-6 pt-2">
              <button
                onClick={() => {
                  setConfirmDelete(null);
                  setDeleteError(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePayment}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
