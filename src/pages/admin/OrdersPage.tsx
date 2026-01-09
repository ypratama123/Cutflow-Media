import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Filter, Search, Eye, Edit, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { orderService } from '../../services/orderService';
import type { Database } from '../../types/database.types';

type Order = Database['public']['Tables']['orders']['Row'] & {
    packages: { name: string } | null;
    profiles: { full_name: string | null; email: string } | null;
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data = await orderService.getAllOrders();
                setOrders(data as any || []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' }> = {
            pending: { label: 'Pending', variant: 'warning' },
            confirmed: { label: 'Confirmed', variant: 'info' },
            processing: { label: 'Processing', variant: 'info' },
            completed: { label: 'Completed', variant: 'success' },
            cancelled: { label: 'Cancelled', variant: 'danger' },
        };
        const { label, variant } = statusMap[status] || { label: status, variant: 'info' as const };
        return <Badge variant={variant}>{label}</Badge>;
    };

    const getPaymentBadge = (status: string) => {
        const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' }> = {
            paid: { label: 'Lunas', variant: 'success' },
            unpaid: { label: 'Belum Bayar', variant: 'danger' },
            pending: { label: 'Verifikasi', variant: 'warning' },
            failed: { label: 'Gagal', variant: 'danger' },
        };
        const { label, variant } = statusMap[status] || { label: status, variant: 'warning' as const };
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

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.profiles?.full_name && order.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === '' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const processingCount = orders.filter(o => o.status === 'processing').length;

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white font-heading">Kelola Pesanan</h1>
                    <p className="text-gray-400 mt-1">Kelola semua pesanan customer</p>
                </div>
                <div className="flex gap-2">
                    <Badge variant="warning">{pendingCount} Pending</Badge>
                    <Badge variant="info">{processingCount} Processing</Badge>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Cari pesanan, email, atau nama..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                    <option value="">Semua Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <Button variant="secondary" icon={<Filter size={18} />}>
                    Filter
                </Button>
            </motion.div>

            {/* Orders Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader className="w-8 h-8 animate-spin text-cyan-500" />
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-700">
                                            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Pesanan</th>
                                            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Customer</th>
                                            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Paket</th>
                                            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Status</th>
                                            <th className="text-left py-4 px-4 text-gray-400 font-medium text-sm">Pembayaran</th>
                                            <th className="text-right py-4 px-4 text-gray-400 font-medium text-sm">Total</th>
                                            <th className="text-center py-4 px-4 text-gray-400 font-medium text-sm">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <span className="text-white font-medium">{order.order_number}</span>
                                                        <p className="text-gray-500 text-xs mt-0.5">{formatDate(order.created_at)}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div>
                                                        <span className="text-gray-300">{order.profiles?.full_name || 'Unknown'}</span>
                                                        <p className="text-gray-500 text-xs mt-0.5">{order.profiles?.email}</p>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-gray-300">{order.packages?.name || 'Deleted'}</td>
                                                <td className="py-4 px-4">{getStatusBadge(order.status)}</td>
                                                <td className="py-4 px-4">{getPaymentBadge(order.payment_status)}</td>
                                                <td className="py-4 px-4 text-right text-white font-medium">
                                                    {formatCurrency(order.amount)}
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Link to={`/admin/orders/${order.id}`}>
                                                            <button className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors" title="View">
                                                                <Eye size={16} />
                                                            </button>
                                                        </Link>
                                                        <button className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors" title="Edit">
                                                            <Edit size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredOrders.length === 0 && (
                                <div className="text-center py-12">
                                    <ShoppingCart className="mx-auto text-gray-600 mb-4" size={48} />
                                    <p className="text-gray-400">Belum ada pesanan</p>
                                </div>
                            )}
                        </>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
