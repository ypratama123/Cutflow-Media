import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Filter, Search, MoreVertical, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext'; // Add useAuth import
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService'; // Add Import
import type { Database } from '../../types/database.types';

type Order = Database['public']['Tables']['orders']['Row'] & {
    packages: { name: string } | null;
};

export default function CustomerOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data = await orderService.getMyOrders();
                setOrders(data as any || []);

                // [NEW] Smart Sync: Check pending orders against Midtrans
                const pendingOrders = data.filter((o: any) => o.payment_status === 'pending' || o.payment_status === 'unpaid');
                if (pendingOrders.length > 0) {
                    console.log(`Syncing ${pendingOrders.length} pending orders...`);

                    for (const order of pendingOrders) {
                        try {
                            await paymentService.syncOrderStatus(order.id);
                        } catch (e) {
                            console.error("Sync failed for", order.id, e);
                        }
                    }

                    // Refresh data after sync to show updated status
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const syncedData = await orderService.getMyOrders();
                    setOrders(syncedData as any || []);
                }

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
            pending: { label: 'Menunggu', variant: 'warning' },
            confirmed: { label: 'Dikonfirmasi', variant: 'info' },
            processing: { label: 'Proses', variant: 'info' },
            completed: { label: 'Selesai', variant: 'success' },
            cancelled: { label: 'Dibatalkan', variant: 'danger' },
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
            month: 'long',
            year: 'numeric'
        });
    };

    // Need auth profile for payment details
    const { profile, user } = useAuth(); // Import useAuth at module top level if not exists

    const handleRetryPayment = async (order: Order) => {
        try {
            // 1. Request token (Server will generate unique ID)
            const transaction = await paymentService.createTransaction({
                orderId: order.id,
                amount: order.amount,
                customerDetails: {
                    firstName: user?.user_metadata?.full_name || 'Customer',
                    email: user?.email || '',
                    phone: user?.phone || '08123456789'
                }
            });

            // 2. IMPORTANT: Save the SERVER-GENERATED midtrans_id to Supabase
            // This guarantees we are tracking the exact ID that Midtrans knows about
            if (transaction.order_id) {
                await paymentService.updateMidtransId(order.id, transaction.order_id);
            }

            if (window.snap) {
                window.snap.pay(transaction.token, {
                    onSuccess: async function (result: any) {
                        console.log('Payment success', result);

                        // [Safety Net] Ensure DB has the correct Midtrans ID from the result
                        // PRIORITY: Use TRANSACTION_ID if available (e.g. DANA Simulator often uses this as primary ref)
                        // Fallback to ORDER_ID
                        const bestId = result.transaction_id || result.order_id;

                        if (bestId) {
                            console.log("Saving Best Midtrans ID:", bestId);
                            try {
                                await paymentService.updateMidtransId(order.id, bestId);
                            } catch (e) {
                                console.error("Post-payment ID sync failed", e);
                            }
                        }

                        // Update status using the ORIGINAL Order ID (Database ID)
                        await paymentService.handleSuccess(order.id);
                        window.location.reload();
                    },
                    onPending: function (result: any) {
                        console.log('Payment pending', result);
                        window.location.reload();
                    },
                    onError: function (result: any) {
                        console.error('Payment error', result);
                        alert('Pembayaran gagal');
                    }
                });
            }
        } catch (error: any) {
            console.error(error);
            alert('Gagal memuat pembayaran: ' + error.message);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.packages?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-white font-heading">Pesanan Saya</h1>
                <p className="text-gray-400 mt-1">Lihat dan kelola semua pesanan Anda</p>
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
                        placeholder="Cari pesanan (No. Order)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
                <Button variant="secondary" icon={<Filter size={18} />}>
                    Filter
                </Button>
            </motion.div>

            {/* Orders List */}
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
                                            <th className="text-left py-4 px-6 text-gray-400 font-medium">No. Pesanan</th>
                                            <th className="text-left py-4 px-6 text-gray-400 font-medium">Paket</th>
                                            <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                                            <th className="text-left py-4 px-6 text-gray-400 font-medium">Pembayaran</th>
                                            <th className="text-left py-4 px-6 text-gray-400 font-medium">Tanggal</th>
                                            <th className="text-right py-4 px-6 text-gray-400 font-medium">Total</th>
                                            <th className="py-4 px-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                                                <td className="py-4 px-6">
                                                    <span className="text-white font-medium">{order.order_number}</span>
                                                </td>
                                                <td className="py-4 px-6 text-gray-300">{order.packages?.name || 'Paket Dihapus'}</td>
                                                <td className="py-4 px-6">{getStatusBadge(order.status)}</td>
                                                <td className="py-4 px-6">{getPaymentBadge(order.payment_status)}</td>
                                                <td className="py-4 px-6 text-gray-400">{formatDate(order.created_at)}</td>
                                                <td className="py-4 px-6 text-right text-white font-medium">
                                                    {formatCurrency(order.amount)}
                                                </td>
                                                <td className="py-4 px-6 flex items-center gap-2">
                                                    {(order.payment_status === 'unpaid' || order.payment_status === 'pending') && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1 h-8"
                                                            onClick={() => handleRetryPayment(order)}
                                                        >
                                                            Bayar
                                                        </Button>
                                                    )}
                                                    <Link to={`/dashboard/orders/${order.id}`}>
                                                        <button className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors" title="Lihat Detail">
                                                            <MoreVertical size={18} />
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredOrders.length === 0 && (
                                <div className="text-center py-12">
                                    <ShoppingCart className="mx-auto text-gray-600 mb-4" size={48} />
                                    <p className="text-gray-400">Belum ada pesanan yang sesuai</p>
                                </div>
                            )}
                        </>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}
