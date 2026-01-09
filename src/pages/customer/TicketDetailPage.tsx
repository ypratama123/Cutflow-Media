import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, ArrowLeft, User, ShieldCheck, CheckCircle } from 'lucide-react';
import { ticketService, type Ticket, type TicketMessage } from '../../services/ticketService';
import { useAuth } from '../../features/auth/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function TicketDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<TicketMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (id) {
            fetchTicketData();
        }
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchTicketData = async () => {
        try {
            if (!id) return;
            // In a real app we might need a getTicketById method, 
            // but for now we can infer it or just fetch messages if we trust the ID.
            // Let's assume we can fetch tickets list and find it, or add getTicketById later.
            // For now, let's just use getMyTickets and find it to be safe with RLS
            const tickets = await ticketService.getMyTickets();
            const foundTicket = tickets.find(t => t.id === id);

            if (foundTicket) {
                setTicket(foundTicket);
                const msgs = await ticketService.getTicketMessages(id);
                setMessages(msgs);
            } else {
                navigate('/dashboard/messages');
            }
        } catch (error) {
            console.error("Failed to load ticket", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || !id || !user) return;

        setSending(true);
        try {
            const newMessage = await ticketService.sendMessage(id, user.id, reply, false);
            setMessages([...messages, newMessage]);
            setReply('');
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Gagal mengirim pesan");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-gray-400">Loading conversation...</div>;
    }

    if (!ticket) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/messages')}
                        className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-white">{ticket.subject}</h1>
                        <p className="text-gray-400 text-sm">Tiket #{ticket.id.slice(0, 8)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={ticket.status === 'open' ? 'warning' : 'success'}>
                        {ticket.status.toUpperCase()}
                    </Badge>
                </div>
            </div>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden bg-slate-900 border-slate-700">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => {
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`flex gap-3 max-w-[80%] ${msg.is_admin ? 'flex-row' : 'flex-row-reverse'}`}>
                                    {/* Avatar */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.is_admin ? 'bg-cyan-600' : 'bg-slate-700'
                                        }`}>
                                        {msg.is_admin ? (
                                            <ShieldCheck size={20} className="text-white" />
                                        ) : (
                                            <User size={20} className="text-gray-300" />
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div>
                                        <div className={`flex items-baseline gap-2 mb-1 ${msg.is_admin ? 'justify-start' : 'justify-end'
                                            }`}>
                                            <span className="text-sm font-bold text-white">
                                                {msg.is_admin ? 'Admin Support' : 'Saya'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className={`p-4 rounded-2xl ${msg.is_admin
                                                ? 'bg-slate-800 text-gray-200 rounded-tl-sm'
                                                : 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-lg'
                                            }`}>
                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-slate-950 border-t border-slate-800">
                    {ticket.status === 'resolved' || ticket.status === 'closed' ? (
                        <div className="flex items-center justify-center p-4 bg-slate-900 rounded-lg border border-slate-800 text-gray-400 gap-2">
                            <CheckCircle size={20} className="text-green-500" />
                            <span>Tiket ini telah ditutup. Silakan buat tiket baru jika ada masalah lain.</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="flex gap-4">
                            <input
                                type="text"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Ketik balasan Anda..."
                                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-5 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            />
                            <Button
                                type="submit"
                                disabled={sending || !reply.trim()}
                                className="bg-cyan-500 hover:bg-cyan-600 w-12 h-12 rounded-xl flex items-center justify-center p-0"
                            >
                                <Send size={20} className={sending ? 'opacity-50' : ''} />
                            </Button>
                        </form>
                    )}
                </div>
            </Card>
        </div>
    );
}
