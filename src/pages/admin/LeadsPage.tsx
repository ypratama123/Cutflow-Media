import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader, Mail, Phone, Calendar, MessageSquare, ChevronDown, ChevronUp, CheckCircle, Clock, XCircle, DollarSign, Briefcase } from 'lucide-react';
import { contactService } from '../../services/contactService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function AdminLeadsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const data = await contactService.getAllLeads();
            setLeads(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await contactService.updateLeadStatus(id, newStatus as any);
            // Optimistic update
            setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
        } catch (error) {
            console.error(error);
            alert('Gagal update status');
            fetchLeads(); // Revert on error
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Hapus lead dari "${name}"?`)) return;
        try {
            await contactService.deleteLead(id);
            setLeads(leads.filter(lead => lead.id !== id));
        } catch (error) {
            console.error(error);
            alert('Gagal menghapus lead');
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'new': return { label: 'New', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
            case 'contacted': return { label: 'Contacted', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' };
            case 'converted': return { label: 'Converted', color: 'bg-green-500/10 text-green-400 border-green-500/30' };
            case 'closed': return { label: 'Closed', color: 'bg-gray-500/10 text-gray-400 border-gray-500/30' };
            default: return { label: status, color: 'bg-slate-700 text-gray-300' };
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white font-heading">Leads & Contacts</h1>
                    <p className="text-gray-400 mt-1">Kelola pesan masuk dan prospek client</p>
                </div>
                <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                    <span className="text-2xl font-bold text-cyan-400 mr-2">{leads.length}</span>
                    <span className="text-gray-400 text-sm">Total Leads</span>
                </div>
            </motion.div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Cari leads (nama, email, perusahaan)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-12"><Loader className="animate-spin text-cyan-500" /></div>
                ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-slate-800/30 rounded-lg border border-slate-700 border-dashed">
                        Belum ada leads masuk.
                    </div>
                ) : (
                    filteredLeads.map((lead) => {
                        const status = getStatusConfig(lead.status);
                        const isExpanded = expandedId === lead.id;

                        return (
                            <motion.div
                                key={lead.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`bg-slate-800 rounded-lg border transition-all duration-300 ${isExpanded ? 'border-cyan-500/50 shadow-lg shadow-cyan-900/20' : 'border-slate-700 hover:border-slate-600'}`}
                            >
                                <div
                                    className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between cursor-pointer"
                                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold uppercase ${lead.status === 'new' ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-700 text-gray-400'}`}>
                                            {lead.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg">{lead.name}</h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                                <span className="flex items-center gap-1"><Mail size={12} /> {lead.email}</span>
                                                {lead.company && <span className="flex items-center gap-1"><Briefcase size={12} /> {lead.company}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                                            {status.label}
                                        </span>
                                        <span className="text-gray-500 text-sm flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </span>
                                        {isExpanded ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="border-t border-slate-700 bg-slate-900/30"
                                        >
                                            <div className="p-6 grid md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-gray-500 text-xs uppercase font-bold tracking-wider">Message</label>
                                                        <div className="mt-1 bg-slate-800 p-3 rounded text-gray-200 text-sm whitespace-pre-wrap leading-relaxed border border-slate-700">
                                                            {lead.message}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div>
                                                            <label className="text-gray-500 text-xs uppercase font-bold tracking-wider">Project Type</label>
                                                            <p className="text-white font-medium">{lead.project_type || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-gray-500 text-xs uppercase font-bold tracking-wider">Budget</label>
                                                            <p className="text-cyan-400 font-medium">{lead.budget_range || '-'}</p>
                                                        </div>
                                                        <div>
                                                            <label className="text-gray-500 text-xs uppercase font-bold tracking-wider">Phone</label>
                                                            <p className="text-white font-medium">{lead.phone || '-'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 border-l border-slate-700 pl-4 md:pl-6">
                                                    <div>
                                                        <label className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 block">Quick Actions</label>
                                                        <div className="flex flex-wrap gap-2">
                                                            <a href={`mailto:${lead.email}`} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors">
                                                                <Mail size={14} /> Kirim Email
                                                            </a>
                                                            {lead.phone && (
                                                                <a
                                                                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors"
                                                                >
                                                                    <Phone size={14} /> WhatsApp
                                                                </a>
                                                            )}
                                                            <button
                                                                onClick={() => handleDelete(lead.id, lead.name)}
                                                                className="bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-900/50 px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors ml-auto"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-2 block">Update Status</label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {['new', 'contacted', 'converted', 'closed'].map((s) => (
                                                                <button
                                                                    key={s}
                                                                    onClick={() => handleStatusUpdate(lead.id, s)}
                                                                    className={`px-3 py-2 rounded text-sm font-medium border transition-colors ${lead.status === s
                                                                            ? 'bg-cyan-600 border-cyan-500 text-white ring-2 ring-cyan-500/20'
                                                                            : 'bg-slate-800 border-slate-600 text-gray-400 hover:text-white hover:border-slate-500'
                                                                        }`}
                                                                >
                                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
