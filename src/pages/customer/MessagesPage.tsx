import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ticketService, type Ticket } from '../../services/ticketService';
import { useAuth } from '../../features/auth/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function MessagesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    // Form State
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const data = await ticketService.getMyTickets();
            setTickets(data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (!user) return;
            const newTicket = await ticketService.createTicket(subject, message, user.id);
            setCreateModalOpen(false);
            setSubject('');
            setMessage('');
            fetchTickets();
            navigate(`/dashboard/messages/${newTicket.id}`);
        } catch (error) {
            console.error("Failed to create ticket", error);
            alert("Gagal membuat tiket");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open': return <Badge variant="warning" icon={Clock}>Open</Badge>;
            case 'in_progress': return <Badge variant="info" icon={AlertCircle}>Diproses</Badge>;
            case 'resolved': return <Badge variant="success" icon={CheckCircle}>Selesai</Badge>;
            case 'closed': return <Badge variant="danger" icon={XCircle}>Ditutup</Badge>;
            default: return <Badge variant="default">Unknown</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Pesan & Bantuan</h1>
                    <p className="text-gray-400">Hubungi admin jika ada kendala dengan pesanan Anda</p>
                </div>
                <Button onClick={() => setCreateModalOpen(true)} icon={<Plus size={20} />} className="bg-cyan-500 hover:bg-cyan-600">
                    Buat Tiket Baru
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-400">Loading tickets...</div>
            ) : tickets.length === 0 ? (
                <Card className="p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-700 bg-transparent">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Belum ada Percakapan</h3>
                    <p className="text-gray-400 max-w-md mb-6">
                        Anda belum pernah mengirim pesan kepada kami. Klik tombol di atas untuk memulai percakapan baru.
                    </p>
                    <Button onClick={() => setCreateModalOpen(true)} variant="outline">
                        Mulai Percakapan
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {tickets.map((ticket, index) => (
                        <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link to={`/dashboard/messages/${ticket.id}`} className="block">
                                <Card className="p-6 hover:border-cyan-500/50 transition-colors group cursor-pointer relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-lg ${ticket.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-cyan-500/20 text-cyan-400'
                                                }`}>
                                                <MessageSquare size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                                    {ticket.subject}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    ID: #{ticket.id.slice(0, 8)} • Dibuat pada {new Date(ticket.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {getStatusBadge(ticket.status)}
                                            <span className="text-xs text-gray-500">
                                                Update terakhir: {new Date(ticket.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Create Ticket Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setCreateModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
                        >
                            <div className="w-full max-w-lg pointer-events-auto">
                                <Card className="p-6 border-slate-700 shadow-2xl bg-slate-900">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-white">Buat Tiket Baru</h2>
                                        <button
                                            onClick={() => setCreateModalOpen(false)}
                                            className="text-gray-400 hover:text-white transition-colors"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleCreateTicket} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Judul / Subjek
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                placeholder="Contoh: Kendala pembayaran order #123"
                                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Pesan
                                            </label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Jelaskan masalah Anda secara detail..."
                                                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setCreateModalOpen(false)}
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-cyan-500 hover:bg-cyan-600"
                                                disabled={submitting}
                                            >
                                                {submitting ? 'Mengirim...' : 'Kirim Tiket'}
                                            </Button>
                                        </div>
                                    </form>
                                </Card>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
