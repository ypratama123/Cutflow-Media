import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Loader
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { orderService } from '../../services/orderService';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type Order = Database['public']['Tables']['orders']['Row'] & {
    packages: { name: string } | null;
    profiles: { full_name: string | null; email: string } | null;
};

export default function AdminDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        revenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        conversionRate: 0 // Placeholder
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pendingTasks, setPendingTasks] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Orders
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const ordersData = await orderService.getAllOrders() as any[];
                setOrders(ordersData || []);

                // Fetch Users Count
                const { count } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });

                // Calculate Stats
                const totalRevenue = ordersData?.reduce((sum, order) => sum + (order.payment_status === 'paid' ? order.amount : 0), 0) || 0;

                setStats({
                    revenue: totalRevenue,
                    totalOrders: ordersData?.length || 0,
                    totalUsers: count || 0,
                    conversionRate: 0 // Need more data for this
                });

                // Generate Tasks based on pending orders
                const tasks = ordersData
                    ?.filter(o => o.status === 'pending' || o.payment_status === 'pending')
                    .map(o => ({
                        id: o.id,
                        title: `Review order ${o.order_number}`,
                        type: 'order',
                        urgent: true,
                        link: `/admin/orders`
                    })) || [];

                setPendingTasks(tasks);

            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const dashboardStats = [
        {
            label: 'Total Revenue',
            value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(stats.revenue),
            icon: DollarSign,
            color: 'from-green-600 to-green-500',
        },
        {
            label: 'Total Pesanan',
            value: stats.totalOrders.toString(),
            icon: ShoppingCart,
            color: 'from-pink-600 to-pink-500',
        },
        {
            label: 'Total Users',
            value: stats.totalUsers.toString(),
            icon: Users,
            color: 'from-cyan-600 to-cyan-500',
        },
        {
            label: 'Pending Tasks',
            value: pendingTasks.length.toString(),
            icon: Clock,
            color: 'from-yellow-600 to-yellow-500',
        },
    ];

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' }> = {
            pending: { label: 'Pending', variant: 'warning' },
            confirmed: { label: 'Confirmed', variant: 'info' },
            processing: { label: 'Processing', variant: 'info' },
            completed: { label: 'Completed', variant: 'success' },
            cancelled: { label: 'Cancelled', variant: 'danger' },
        };
        const { label, variant } = statusMap[status] || { label: status, variant: 'info' as const };
        return <Badge variant={variant} size="sm">{label}</Badge>;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader className="w-10 h-10 animate-spin text-cyan-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white font-heading">
                    Dashboard Admin
                </h1>
                <p className="text-gray-400 mt-2">
                    Overview performa bisnis dan pesanan terbaru
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardStats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">{stat.label}</p>
                                    <p className="text-xl md:text-2xl font-bold text-white mt-1">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                                    <stat.icon className="text-white" size={20} />
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="lg:col-span-2"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">Pesanan Terbaru</h2>
                        <Link
                            to="/admin/orders"
                            className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1"
                        >
                            Lihat Semua <ArrowRight size={14} />
                        </Link>
                    </div>

                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                                            Pesanan
                                        </th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                                            Customer
                                        </th>
                                        <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">
                                            Status
                                        </th>
                                        <th className="text-right py-3 px-4 text-gray-400 font-medium text-sm">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.slice(0, 5).map((order) => (
                                        <tr
                                            key={order.id}
                                            className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 px-4">
                                                <div>
                                                    <span className="text-white font-medium text-sm">{order.order_number}</span>
                                                    <p className="text-gray-500 text-xs">{formatDate(order.created_at)}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <span className="text-gray-300 text-sm">{order.profiles?.full_name || 'Unknown'}</span>
                                                    <p className="text-gray-500 text-xs">{order.packages?.name || 'Paket Dihapus'}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                                            <td className="py-3 px-4 text-right">
                                                <span className="text-white font-medium text-sm">
                                                    {formatCurrency(order.amount)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-6 text-gray-500">
                                                Belum ada pesanan masuk
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>

                {/* Pending Tasks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Clock size={20} className="text-yellow-500" />
                            Pending Tasks
                        </h2>
                        <Badge variant="warning">{pendingTasks.length}</Badge>
                    </div>

                    <Card className="p-4 space-y-3">
                        {pendingTasks.map((task, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                            >
                                {task.urgent ? (
                                    <AlertCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <CheckCircle size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{task.title}</p>
                                    <p className="text-gray-500 text-xs capitalize">{task.type}</p>
                                </div>
                            </div>
                        ))}

                        {pendingTasks.length === 0 && (
                            <div className="text-center py-8">
                                <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                                <p className="text-gray-400 text-sm">Semua task selesai!</p>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link to="/admin/orders">
                        <Card hover className="p-4 text-center cursor-pointer">
                            <ShoppingCart className="mx-auto text-pink-500 mb-2" size={28} />
                            <p className="text-white font-medium text-sm">Kelola Pesanan</p>
                        </Card>
                    </Link>
                    <Link to="/admin/users">
                        <Card hover className="p-4 text-center cursor-pointer">
                            <Users className="mx-auto text-cyan-500 mb-2" size={28} />
                            <p className="text-white font-medium text-sm">Kelola Users</p>
                        </Card>
                    </Link>
                    <Link to="/admin/analytics">
                        <Card hover className="p-4 text-center cursor-pointer">
                            <TrendingUp className="mx-auto text-purple-500 mb-2" size={28} />
                            <p className="text-white font-medium text-sm">Lihat Analytics</p>
                        </Card>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
