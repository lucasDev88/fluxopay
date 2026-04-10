import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { 
  Bell, 
  Check, 
  CreditCard, 
  Users,  
} from "lucide-react";

export type NotificationType = "payment_created" | "payment_updated" | "customer_added" | "customer_updated";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsProps {
  trigger: React.ReactNode;
}

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
  return date.toLocaleDateString("pt-BR");
};

// Demo notifications for testing
const demoNotifications: Notification[] = [
  {
    id: "1",
    type: "payment_created",
    title: "Novo pagamento",
    message: "Pagamento de R$ 150,00 criado por João Silva",
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "payment_updated",
    title: "Pagamento atualizado",
    message: "Pagamento #1234 teve status alterado para Aprovado",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
  },
  {
    id: "3",
    type: "customer_added",
    title: "Novo cliente",
    message: "Maria Santos foi adicionada como cliente",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
  },
  {
    id: "4",
    type: "customer_updated",
    title: "Cliente atualizado",
    message: "Dados de José Oliveira foram atualizados",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
  },
];

export default function Notifications({ trigger }: NotificationsProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Update position when opening
  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications([]);
  };

  const dropdownContent = open && (
    <div
      ref={containerRef}
      className="fixed z-100 w-80 sm:w-96 rounded-xl shadow-xl bg-slate-800 border border-slate-700 overflow-hidden"
      style={{
        top: position.top,
        right: position.right,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-white">Notificações</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
              {unreadCount}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Limpar tudo
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center mb-3">
              <Bell className="w-6 h-6 text-slate-500" />
            </div>
            <p className="text-sm text-slate-400">Nenhuma notificação</p>
            <p className="text-xs text-slate-500 mt-1">Você está em dia!</p>
          </div>
        ) : (
          <div className="py-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  relative flex gap-3 px-4 py-3 hover:bg-slate-700/30 transition-colors cursor-pointer
                  ${!notification.read ? "bg-blue-500/5" : ""}
                `}
              >
                {/* Unread indicator */}
                {!notification.read && (
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}

                {/* Icon */}
                <div className="shrink-0 w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white truncate">
                      {notification.title}
                    </p>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {formatTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>

                  {/* Actions */}
                  {!notification.read && (
                    <button
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      className="flex items-center gap-1 mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Check className="w-3 h-3" />
                      Marcar como lido
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && unreadCount > 0 && (
        <div className="px-4 py-3 border-t border-slate-700 bg-slate-900/50">
          <button
            onClick={handleMarkAllAsRead}
            className="w-full flex items-center justify-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Check className="w-4 h-4" />
            Marcar todas como lidas
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Dropdown Portal */}
      {open && createPortal(dropdownContent, document.body)}
    </div>
  );
}
