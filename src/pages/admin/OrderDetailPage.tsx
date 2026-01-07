import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Package, Calendar, FileText, CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react';
import { orderService } from '../../services/orderService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function AdminOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const data = await orderService.getOrderById(id!);
            setOrder(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        if (!confirm(`Ubah status menjadi ${newStatus}?`)) return;
        setProcessing(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await orderService.updateStatus(id!, newStatus as any);
            await fetchOrder();
        } catch (error) {
            console.error(error);
            alert('Gagal update status');
        } finally {
            setProcessing(false);
        }
    };

    const handlePaymentAction = async (action: 'approve' | 'reject') => {
        if (!confirm(`Yakin ingin ${action} pembayaran ini?`)) return;
        setProcessing(true);
        try {
            if (action === 'approve') {
                await orderService.updatePaymentStatus(id!, 'paid');
                // Auto update order status to processing if still pending
                if (order.status === 'pending') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await orderService.updateStatus(id!, 'processing' as any);
                }
            } else {
                await orderService.updatePaymentStatus(id!, 'failed');
            }
            await fetchOrder();
        } catch (error) {
            console.error(error);
            alert('Gagal update pembayaran');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader className="animate-spin text-cyan-500" /></div>;
    if (!order) return <div className="text-center text-gray-400 p-10">Order not found</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <button
                onClick={() => navigate('/admin/orders')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={18} /> Kembali
            </button>

            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white font-heading">
                        Order #{order.order_number}
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Created: {new Date(order.created_at).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-slate-800 px-3 py-1 rounded text-sm text-gray-300">
                        Payment: <span className={`font-bold ${order.payment_status === 'paid' ? 'text-green-400' : order.payment_status === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>{order.payment_status?.toUpperCase()}</span>
                    </div>
                    <div className="bg-slate-800 px-3 py-1 rounded text-sm text-gray-300">
                        Status: <span className="font-bold text-cyan-400 uppercase">{order.status}</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><User size={18} /> Customer Info</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Nama</span>
                            <span className="text-white">{order.profiles?.full_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Email</span>
                            <span className="text-white">{order.profiles?.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Company</span>
                            <span className="text-white">{order.profiles?.company || '-'}</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2"><Package size={18} /> Order Info</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Paket</span>
                            <span className="text-white font-medium">{order.packages?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Total</span>
                            <span className="text-cyan-400 font-bold">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.amount)}</span>
                        </div>
                        <div className="border-t border-slate-700 pt-2 mt-2">
                            <p className="text-gray-400 text-sm mb-1">Notes:</p>
                            <p className="text-white text-sm bg-slate-900 p-2 rounded">{order.notes || 'Tidak ada catatan'}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Payment Proof Section */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FileText size={18} /> Bukti Pembayaran</h3>
                {order.payment_proof_url ? (
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1 bg-slate-900 rounded-lg p-2 border border-slate-700">
                            <img src={order.payment_proof_url} alt="Proof" className="max-h-96 mx-auto object-contain rounded" />
                        </div>
                        <div className="w-full md:w-64 space-y-3">
                            {order.payment_status === 'pending' && (
                                <>
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded text-yellow-400 text-sm mb-4">
                                        <AlertCircle size={16} className="inline mr-1" />
                                        Perlu Verifikasi
                                    </div>
                                    <div className="space-y-2">
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-500"
                                            onClick={() => handlePaymentAction('approve')}
                                            loading={processing}
                                            icon={<CheckCircle size={16} />}
                                        >
                                            Terima Pembayaran
                                        </Button>
                                        <Button
                                            className="w-full bg-red-600 hover:bg-red-500 text-white"
                                            variant="outline"
                                            onClick={() => handlePaymentAction('reject')}
                                            loading={processing}
                                            icon={<XCircle size={16} />}
                                        >
                                            Tolak Pembayaran
                                        </Button>
                                    </div>
                                </>
                            )}
                            {order.payment_status === 'paid' && (
                                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded text-green-400 text-sm">
                                    <CheckCircle size={16} className="inline mr-1" />
                                    Pembayaran Valid
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 bg-slate-900/50 rounded-lg border border-slate-800 border-dashed">
                        Belum ada bukti pembayaran diupload user.
                    </div>
                )}
            </Card>

            {/* Manual Status Actions */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                    {['pending', 'confirmed', 'processing', 'completed', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => handleUpdateStatus(status)}
                            disabled={order.status === status || processing}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${order.status === status
                                    ? 'bg-cyan-600 border-cyan-500 text-white cursor-default'
                                    : 'bg-slate-800 border-slate-700 text-gray-400 hover:text-white hover:border-slate-500'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
}
