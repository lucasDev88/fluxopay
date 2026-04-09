import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Pencil, Trash2, Search, RefreshCw, UserCheck, UserX, Mail, Clock, AlertCircle, X } from "lucide-react";
import { Card } from "@/components/utils/Card";
import { CardContent } from "@/components/utils/CardContent";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ClientForm } from "@/components/forms/ClientForm";
import { useClients } from "@/_hooks/useClients";
import type { Clients } from "@/_services/types/Clients";
import type { StateClient } from "@/components/home/types/State";

export default function ClientsTab() {
  const { clients, loading, error, fetchClients, removeClient } = useClients();
  const [openModal, setOpenModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Clients | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filter clients based on search
  const filteredClients = clients.filter((c) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClient = async () => {
    if (!confirmDelete) return;

    const result = await removeClient(confirmDelete.id);
    if (!result.success) {
      setDeleteError(result.error || "Erro ao excluir cliente");
      return;
    }
    setConfirmDelete(null);
    setDeleteError(null);
  };

  const handleEditClient = (client: Clients) => {
    setEditingClient(client);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingClient(null);
  };

  const handleFormSuccess = () => {
    fetchClients();
  };

  // Stats
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.situation === "Ativo").length;
  const pendingClients = clients.filter((c) => c.situation === "Pendente").length;
  const inactiveClients = clients.filter((c) => c.situation === "Desativo").length;

  // Helper to get avatar initial safely
  const getAvatarInitial = (name?: string): string => {
    if (!name || name.trim() === "") return "?";
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Clientes</h2>
          <p className="text-slate-500 mt-1">Gerencie seus clientes</p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" />
          Novo cliente
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="border-slate-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total</p>
                <p className="text-lg font-bold text-white">{totalClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="border-slate-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <UserCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Ativos</p>
                <p className="text-lg font-bold text-emerald-400">{activeClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="border-slate-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Pendentes</p>
                <p className="text-lg font-bold text-amber-400">{pendingClients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="border-slate-800/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <UserX className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Inativos</p>
                <p className="text-lg font-bold text-red-400">{inactiveClients}</p>
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
                  placeholder="Buscar por nome ou email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <button
                onClick={fetchClients}
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
                  onClick={fetchClients}
                  className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && !clients.length && (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Carregando clientes...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredClients.length === 0 && (
            <EmptyState
              title="Nenhum cliente encontrado"
              description={
                searchQuery
                  ? "Tente buscar com outros termos ou limpe o filtro."
                  : "Quando você criar um cliente, ele aparecerá aqui."
              }
              icon={<Users className="w-8 h-8 text-slate-500" />}
              action={
                !searchQuery
                  ? {
                      label: "Criar cliente",
                      onClick: () => setOpenModal(true),
                    }
                  : undefined
              }
            />
          )}

          {/* Clients List */}
          {!loading && !error && filteredClients.length > 0 && (
            <div className="divide-y divide-slate-800/50">
              {filteredClients.map((client) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group p-4 sm:p-6 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Client Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {getAvatarInitial(client.name)}
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                          {client.name || "Sem nome"}
                        </h3>
                        <StatusBadge status={client.situation} size="sm" />
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{client.email || "Sem email"}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditClient(client)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/50 transition-all"
                        title="Editar"
                        aria-label={`Editar cliente ${client.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setConfirmDelete({ id: client.id, name: client.name || "este cliente" })}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/50 hover:border-red-500/30 transition-all"
                        title="Excluir"
                        aria-label={`Excluir cliente ${client.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <ClientForm
        open={openModal}
        onClose={handleCloseModal}
        mode={editingClient ? "edit" : "create"}
        initialData={editingClient ? {
          id: editingClient.id,
          name: editingClient.name,
          email: editingClient.email,
          situation: editingClient.situation as StateClient,
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
                  <h3 className="text-xl font-bold text-white">Excluir cliente?</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    O cliente <strong className="text-slate-200">"{confirmDelete.name}"</strong> será permanentemente removido.
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
                onClick={handleDeleteClient}
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
