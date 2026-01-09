import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    FileText,
    CreditCard,
    Upload,
    CheckCircle,
    AlertCircle,
    Clock,
    Loader
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { storageService } from '../../services/storageService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import type { Database } from '../../types/database.types';

type OrderDetail = Database['public']['Tables']['orders']['Row'] & {
    packages: { name: string; price: number; features: any } | null;
};

export default function CustomerOrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!id) return;
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = await orderService.getOrderById(id!) as any;
            setOrder(data);
        } catch (err) {
            console.error(err);
            setError('Gagal memuat detail pesanan');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !order) return;

        const file = e.target.files[0];
        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file maksimal 5MB');
            return;
        }

        try {
            setUploading(true);
            const publicUrl = await storageService.uploadPaymentProof(file, order.id);
            await orderService.submitPaymentProof(order.id, publicUrl);

            // Refresh logic
            await fetchOrder();
            alert('Bukti pembayaran berhasil diupload!');
        } catch (err) {
            console.error(err);
            alert('Gagal mengupload bukti pembayaran. Silakan coba lagi.');
        } finally {
            setUploading(false);
        }
    };

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
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-400">Pesanan tidak ditemukan</p>
                <Button onClick={() => navigate('/dashboard/orders')} className="mt-4">
                    Kembali ke Pesanan
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/dashboard/orders')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={18} /> Kembali
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white font-heading mr-2">
                        Order #{order.order_number}
                    </h1>
                    <div className="flex items-center gap-2 mt-1 text-gray-400 text-sm">
                        <Calendar size={14} />
                        {formatDate(order.created_at)}
                    </div>
                </div>
                <div>
                    {getStatusBadge(order.status)}
                </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Detail Paket */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FileText size={20} className="text-cyan-500" />
                            Detail Pesanan
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between py-2 border-b border-slate-700">
                                <span className="text-gray-400">Paket</span>
                                <span className="text-white font-medium">{order.packages?.name}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-700">
                                <span className="text-gray-400">Catatan</span>
                                <span className="text-white text-right max-w-[60%]">{order.notes || '-'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-700">
                                <span className="text-gray-400">Total Harga</span>
                                <span className="text-cyan-400 font-bold text-lg">{formatCurrency(order.amount)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline / Status Tracker (Simplified) */}
                    <Card className="p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-purple-500" />
                            Status Pengerjaan
                        </h2>
                        <div className="relative pl-4 border-l-2 border-slate-700 space-y-6">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-green-500 ring-4 ring-slate-900" />
                                <h3 className="text-white font-medium">Pesanan Dibuat</h3>
                                <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                            </div>

                            {order.payment_status === 'pending' && (
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-yellow-500 ring-4 ring-slate-900" />
                                    <h3 className="text-white font-medium">Verifikasi Pembayaran</h3>
                                    <p className="text-xs text-gray-500">Admin sedang mengecek bukti pembayaran Anda</p>
                                </div>
                            )}

                            {order.payment_status === 'paid' && (
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-green-500 ring-4 ring-slate-900" />
                                    <h3 className="text-white font-medium">Pembayaran Diterima</h3>
                                    <p className="text-xs text-gray-500">Project akan segera diproses</p>
                                </div>
                            )}

                            {order.status === 'processing' && (
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-cyan-500 animate-pulse ring-4 ring-slate-900" />
                                    <h3 className="text-white font-medium">Sedang Dikerjakan</h3>
                                    <p className="text-xs text-gray-500">Tim editor sedang mengerjakan video Anda</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="md:col-span-1 space-y-6">
                    {/* Payment Section */}
                    {order.payment_status === 'unpaid' && (
                        <Card className="p-6 border-pink-500/30 bg-pink-900/10">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-pink-500" />
                                Pembayaran
                            </h2>
                            <p className="text-gray-300 text-sm mb-4">
                                Silakan transfer sebesar <span className="font-bold text-white">{formatCurrency(order.amount)}</span> ke rekening berikut:
                            </p>

                            <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-6">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-400 text-xs">BANK BCA</span>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" alt="BCA" className="h-4 bg-white px-1 rounded" />
                                </div>
                                <p className="text-xl font-mono text-white font-bold tracking-wider">123 456 7890</p>
                                <p className="text-gray-500 text-xs mt-1">a.n Cutflow Media</p>
                            </div>

                            <p className="text-sm text-gray-400 mb-2">Sudah transfer? Upload bukti di sini:</p>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,application/pdf"
                                onChange={handleFileUpload}
                            />

                            <Button
                                className="w-full"
                                icon={uploading ? <Loader className="animate-spin" size={18} /> : <Upload size={18} />}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? 'Mengupload...' : 'Upload Bukti Bayar'}
                            </Button>
                        </Card>
                    )}

                    {order.payment_status === 'pending' && (
                        <Card className="p-6 border-yellow-500/30 bg-yellow-900/10 text-center">
                            <Clock size={48} className="mx-auto text-yellow-500 mb-4" />
                            <h3 className="text-white font-bold mb-2">Menunggu Konfirmasi</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Bukti pembayaran Anda sedang kami verifikasi. Mohon tunggu 1x24 jam.
                            </p>
                            {order.payment_proof_url && (
                                <a
                                    href={order.payment_proof_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-cyan-400 text-xs hover:underline"
                                >
                                    Lihat Bukti Terupload
                                </a>
                            )}
                        </Card>
                    )}

                    {order.payment_status === 'paid' && (
                        <Card className="p-6 border-green-500/30 bg-green-900/10 text-center">
                            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
                            <h3 className="text-white font-bold mb-2">Lunas</h3>
                            <p className="text-gray-400 text-sm">
                                Terima kasih! Pembayaran Anda telah kami terima.
                            </p>
                        </Card>
                    )}

                    {order.payment_status === 'failed' && (
                        <Card className="p-6 border-red-500/30 bg-red-900/10 text-center">
                            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                            <h3 className="text-white font-bold mb-2">Pembayaran Ditolak</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Bukti pembayaran tidak valid. Silakan upload ulang.
                            </p>
                            <Button
                                className="w-full"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload Ulang
                            </Button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,application/pdf"
                                onChange={handleFileUpload}
                            />
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
