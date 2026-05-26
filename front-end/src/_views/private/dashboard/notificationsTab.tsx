/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/utils/Card";
import { CardContent } from "@/components/utils/CardContent";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  CreditCard, 
  Users, 
  AlertCircle,
  Search,
  Filter,
  X
} from "lucide-react";

export type NotificationType = "payment_created" | "payment_updated" | "customer_added" | "customer_updated" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Demo notifications
const demoNotifications: Notification[] = [
  {
    id: "1",
    type: "payment_created",
    title: "Novo pagamento",
    message: "Pagamento de R$ 150,00 criado por João Silva",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
  },
  {
    id: "2",
    type: "payment_updated",
    title: "Pagamento atualizado",
    message: "Pagamento #1234 teve status alterado para Aprovado",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
  },
  {
    id: "3",
    type: "customer_added",
    title: "Novo cliente",
    message: "Maria Santos foi adicionada como cliente",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: "4",
    type: "customer_updated",
    title: "Cliente atualizado",
    message: "Dados de José Oliveira foram atualizados",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Bem-vindo ao FluxoPay",
    message: "Obrigado por se juntar a nós! Explore os recursos.",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

// Helper to get notification icon based on type
const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "payment_created":
      return <CreditCard className="w-4 h-4 text-blue-400" />;
    case "payment_updated":
      return <CreditCard className="w-4 h-4 text-amber-400" />;
    case "customer_added":
      return <Users className="w-4 h-4 text-emerald-400" />;
    case "customer_updated":
      return <Users className="w-4 h-4 text-purple-400" />;
    case "system":
      return <AlertCircle className="w-4 h-4 text-slate-400" />;
    default:
      return <Bell className="w-4 h-4 text-slate-400" />;
  }
};

// Helper to format time ago
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "agora mesmo";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];
    
    // Apply filter
    if (filter === "unread") {
      filtered = filtered.filter((n) => !n.read);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.message.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [notifications, filter, searchQuery]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  return (
    <div className=" space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Notificações
          </h1>
          <p className="text-slate-500 mt-1">
            {unreadCount > 0 
              ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}` 
              : "Você está em dia!"
            }
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600/50 transition-all duration-200"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="text-sm">Marcar todas como lidas</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Limpar tudo</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar notificações..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
              filter === "all"
                ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Todas</span>
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 ${
              filter === "unread"
                ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="text-sm">Não lidas</span>
            {unreadCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card hover className="border-slate-700/50">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {searchQuery || filter !== "all" 
                  ? "Nenhuma notificação encontrada" 
                  : "Nenhuma notificação"
                }
              </h3>
              <p className="text-slate-500 text-sm max-w-sm">
                {searchQuery || filter !== "all"
                  ? "Tente ajustar os filtros ou buscar de outra forma."
                  : "Você está em dia! Não há notificações pendentes."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card hover className="border-slate-700/50">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-800/50">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    group flex items-start gap-4 p-4 hover:bg-slate-800/30 transition-all duration-200
                    ${!notification.read ? "bg-blue-500/5" : ""}
                  `}
                >
                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-400" />
                  )}

                  {/* Icon */}
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-medium ${!notification.read ? "text-white" : "text-slate-300"}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {formatTimeAgo(notification.timestamp)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Marcar como lido
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Excluir
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}