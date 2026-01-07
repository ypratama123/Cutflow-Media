import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, AlertCircle, Loader } from 'lucide-react';
import { packageService } from '../../services/packageService';
import { orderService } from '../../services/orderService';
import Button from '../../components/ui/Button';
import type { Database } from '../../types/database.types';

type Package = Database['public']['Tables']['packages']['Row'];

export default function CheckoutPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const packageSlug = searchParams.get('pkg');

    const [pkg, setPkg] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!packageSlug) {
            navigate('/dashboard');
            return;
        }

        const fetchPackage = async () => {
            try {
                const data = await packageService.getPackageBySlug(packageSlug);
                if (!data) {
                    setError('Paket tidak ditemukan');
                } else {
                    setPkg(data);
                }
            } catch (err) {
                console.error(err);
                setError('Gagal memuat detail paket');
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [packageSlug, navigate]);

    const handleCheckout = async () => {
        if (!pkg) return;

        setSubmitting(true);
        try {
            await orderService.createOrder({
                package_id: pkg.id,
                amount: pkg.price,
                notes: notes
            });

            // Redirect to orders page on success
            navigate('/dashboard/orders', { state: { successOrder: true } });
        } catch (err) {
            console.error(err);
            setError('Gagal memproses pesanan. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader className="w-8 h-8 animate-spin text-cyan-500" />
            </div>
        );
    }

    if (error || !pkg) {
        return (
            <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Terjadi Kesalahan</h3>
                <p className="text-gray-400 mb-6">{error || 'Paket tidak valid'}</p>
                <Button onClick={() => navigate('/dashboard')}>Kembali ke Dashboard</Button>
            </div>
        );
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Parse features JSON safely
    const features = Array.isArray(pkg.features) ? pkg.features as string[] : [];

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} />
                Kembali
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-3 gap-8"
            >
                {/* Order Summary Form */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Detail Pesanan</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Paket yang dipilih
                                </label>
                                <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 flex justify-between items-center">
                                    <div>
                                        <p className="text-lg font-bold text-white">{pkg.name}</p>
                                        <p className="text-sm text-cyan-400">{pkg.clips_per_month ? `${pkg.clips_per_month} clips/bulan` : 'Custom Clips'}</p>
                                    </div>
                                    <p className="text-xl font-bold text-white">{formatPrice(pkg.price)}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Catatan Tambahan (Opsional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Tulis referensi gaya editing, special request, atau link folder aset jika sudah ada..."
                                    className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Modul Pembayaran</h2>
                        <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                            <p className="text-cyan-400 text-sm">
                                ℹ️ Sistem pembayaran otomatis (Midtrans) sedang dalam proses verifikasi.
                                Instruksi pembayaran manual akan ditampilkan setelah Anda membuat pesanan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Summary */}
                <div className="md:col-span-1">
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-white mb-4">Ringkasan</h3>

                        <div className="space-y-3 mb-6">
                            {features.slice(0, 5).map((feature, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                    <Check size={16} className="text-green-500 mt-0.5" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-700 pt-4 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white">{formatPrice(pkg.price)}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span className="text-white">Total</span>
                                <span className="text-cyan-400">{formatPrice(pkg.price)}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleCheckout}
                            loading={submitting}
                            className="w-full"
                            size="lg"
                        >
                            Buat Pesanan
                        </Button>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            Dengan membuat pesanan, Anda menyetujui syarat & ketentuan layanan kami.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
