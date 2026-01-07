import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ShoppingCart,
    FolderOpen,
    Clock,
    TrendingUp,
    Package,
    ArrowRight,
    Loader
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { orderService } from '../../services/orderService';
import type { Database } from '../../types/database.types';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

type Order = Database['public']['Tables']['orders']['Row'] & {
    packages: { name: string; slug: string; price: number } | null;
};

export default function CustomerDashboardPage() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Safety: Redirect Admin to Admin Dashboard
    useEffect(() => {
        if (profile?.role === 'admin') {
            navigate('/admin', { replace: true });
        }
    }, [profile, navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data = await orderService.getMyOrders();
                setOrders(data as any || []);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Calculate stats
    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => ['pending', 'processing', 'confirmed'].includes(o.status)).length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    // Just a placeholder for "Dalam Proses", or specific status
    const inProcessOrders = orders.filter(o => o.status === 'processing').length;

    const stats = [
        {
            label: 'Total Pesanan',
            value: totalOrders.toString(),
            icon: ShoppingCart,
            color: 'from-pink-600 to-pink-500',
        },
        {
            label: 'Pesanan Aktif',
            value: activeOrders.toString(),
            icon: FolderOpen,
            color: 'from-cyan-600 to-cyan-500',
        },
        {
            label: 'Sedang Diproses',
            value: inProcessOrders.toString(),
            icon: Clock,
            color: 'from-yellow-600 to-yellow-500',
        },
        {
            label: 'Selesai',
            value: completedOrders.toString(),
            icon: TrendingUp,
            color: 'from-green-600 to-green-500',
        },
    ];

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' }> = {
            pending: { label: 'Menunggu', variant: 'warning' },
            confirmed: { label: 'Dikonfirmasi', variant: 'info' },
            processing: { label: 'Proses', variant: 'info' },
            completed: { label: 'Selesai', variant: 'success' },
            cancelled: { label: 'Dibatalkan', variant: 'danger' },
        };
        const { label, variant } = statusMap[status] || { label: status, variant: 'info' as const };
        return <Badge variant={variant}>{label}</Badge>;
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
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl md:text-3xl font-bold text-white font-heading">
                    Selamat Datang, {profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0] || 'User'}! 👋
                </h1>
                <p className="text-gray-400 mt-2">
                    Kelola project video Anda dengan mudah dari dashboard ini
                </p>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-cyan-500" />
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card className="p-5">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">{stat.label}</p>
                                            <p className="text-2xl md:text-3xl font-bold text-white mt-1">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                                            <stat.icon className="text-white" size={24} />
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Card className="p-6 bg-gradient-to-r from-pink-600/10 to-cyan-600/10 border-pink-500/20">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Package className="text-pink-500" size={24} />
                                        Pesan Paket Baru
                                    </h3>
                                    <p className="text-gray-400 mt-1">
                                        Pilih paket sesuai kebutuhan dan mulai project baru Anda
                                    </p>
                                </div>
                                <Link to="/#pricing">
                                    <Button size="lg">
                                        Lihat Paket
                                        <ArrowRight size={18} />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Recent Orders */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white">Pesanan Terbaru</h2>
                            <Link
                                to="/dashboard/orders"
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
                                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                                                No. Pesanan
                                            </th>
                                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                                                Paket
                                            </th>
                                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                                                Status
                                            </th>
                                            <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">
                                                Tanggal
                                            </th>
                                            <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.slice(0, 5).map((order) => (
                                            <tr
                                                key={order.id}
                                                className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors"
                                            >
                                                <td className="py-4 px-6">
                                                    <span className="text-white font-medium">{order.order_number}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-gray-300">{order.packages?.name || 'Paket Dihapus'}</span>
                                                </td>
                                                <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                                                <td className="py-4 px-6">
                                                    <span className="text-gray-400">{formatDate(order.created_at)}</span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <span className="text-white font-medium">
                                                        {formatCurrency(order.amount)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {orders.length === 0 && (
                                <div className="text-center py-12">
                                    <ShoppingCart className="mx-auto text-gray-600 mb-4" size={48} />
                                    <p className="text-gray-400">Belum ada pesanan</p>
                                    <Link to="/#pricing">
                                        <Button variant="outline" className="mt-4">
                                            Pesan Sekarang
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </Card>
                    </motion.div>
                </>
            )}
        </div>
    );
}
