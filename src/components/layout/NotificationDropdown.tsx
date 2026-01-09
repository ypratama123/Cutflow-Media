import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Info, MessageSquare, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { notificationService, type Notification } from '../../services/notificationService';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        loadNotifications();
        // Poll every 60 seconds
        const interval = setInterval(loadNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await notificationService.getMyNotifications(5);
            setNotifications(data);
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch (error) {
            console.error("Failed to load notifications", error);
        }
    };

    const handleMarkAsRead = async (id: string, link?: string) => {
        try {
            await notificationService.markAsRead(id);
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));

            if (link) {
                setIsOpen(false);
            }
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'order': return <ShoppingCart size={16} className="text-blue-400" />;
            case 'ticket': return <MessageSquare size={16} className="text-pink-400" />;
            default: return <Info size={16} className="text-gray-400" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-slate-700">
                                <h3 className="font-bold text-white text-sm">Notifikasi</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                                    >
                                        <Check size={12} />
                                        Tandai dibaca semua
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500 text-sm">
                                        Tidak ada notifikasi baru
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${!notification.is_read ? 'bg-slate-700/10' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1 flex-shrink-0">
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <Link
                                                        to={notification.link || '#'}
                                                        onClick={() => handleMarkAsRead(notification.id, notification.link)}
                                                        className="block"
                                                    >
                                                        <h4 className={`text-sm mb-1 ${!notification.is_read ? 'text-white font-medium' : 'text-gray-400'}`}>
                                                            {notification.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 leading-relaxed mb-2">
                                                            {notification.message}
                                                        </p>
                                                    </Link>
                                                    <span className="text-[10px] text-gray-600 block">
                                                        {new Date(notification.created_at).toLocaleDateString()} • {new Date(notification.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="mt-1 text-cyan-500 hover:text-cyan-400"
                                                        title="Tandai dibaca"
                                                    >
                                                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
