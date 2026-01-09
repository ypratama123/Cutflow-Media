import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    Image as ImageIcon,
    FileText,
    Layout,
    Plus,
    Trash2,
    CheckCircle
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Mock Data for Content
interface PortfolioItem {
    id: number;
    title: string;
    category: string;
    imageUrl: string;
}

const initialPortfolio: PortfolioItem[] = [
    { id: 1, title: 'Neon Brand Identity', category: 'Branding', imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&auto=format&fit=crop&q=60' },
    { id: 2, title: 'Tech Startup Web', category: 'Web Design', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60' },
    { id: 3, title: 'Modern Mobile App', category: 'UI/UX', imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=60' },
];

export default function ContentPage() {
    const [activeTab, setActiveTab] = useState<'portfolio' | 'blog' | 'hero'>('portfolio');
    const [portfolio, setPortfolio] = useState(initialPortfolio);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus item ini?')) {
            setPortfolio(portfolio.filter(item => item.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Kelola Konten</h1>
                <Button onClick={handleSave} icon={isSaved ? <CheckCircle size={20} /> : <Save size={20} />} className={isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-cyan-500 hover:bg-cyan-600'}>
                    {isSaved ? 'Tersimpan!' : 'Simpan Perubahan'}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-700 pb-2 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'portfolio' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <ImageIcon size={18} />
                    Portfolio Showcase
                </button>
                <button
                    onClick={() => setActiveTab('hero')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'hero' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <Layout size={18} />
                    Homepage Hero
                </button>
                <button
                    onClick={() => setActiveTab('blog')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${activeTab === 'blog' ? 'bg-slate-700 text-white' : 'text-gray-400 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <FileText size={18} />
                    Blog & Artikel
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'portfolio' && (
                        <motion.div
                            key="portfolio"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-white">Daftar Portfolio</h3>
                                <Button size="sm" icon={<Plus size={16} />} variant="outline">Tambah Item</Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {portfolio.map((item) => (
                                    <Card key={item.id} className="p-4 bg-slate-800 border-slate-700 group">
                                        <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-slate-900">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button className="p-2 bg-slate-800/80 rounded-full hover:bg-cyan-500 hover:text-white transition-colors text-gray-300">
                                                    <Layout size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 bg-slate-800/80 rounded-full hover:bg-red-500 hover:text-white transition-colors text-gray-300"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">{item.category}</p>
                                    </Card>
                                ))}
                                <button className="border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-slate-800/30 transition-all h-[280px]">
                                    <div className="p-4 rounded-full bg-slate-800">
                                        <Plus size={32} />
                                    </div>
                                    <span className="font-medium">Upload Portfolio Baru</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'hero' && (
                        <motion.div
                            key="hero"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Card className="p-8 border-slate-700 bg-slate-800/50 max-w-2xl mx-auto text-center">
                                <Layout size={48} className="text-gray-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Editor Homepage Hero</h3>
                                <p className="text-gray-400 mb-6">Ubah teks headline, subheadline, dan gambar latar belakang landing page Anda.</p>
                                <Button variant="outline">Buka Editor Visual</Button>
                            </Card>
                        </motion.div>
                    )}

                    {activeTab === 'blog' && (
                        <motion.div
                            key="blog"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <Card className="p-8 border-slate-700 bg-slate-800/50 max-w-2xl mx-auto text-center">
                                <FileText size={48} className="text-gray-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Manajemen Blog</h3>
                                <p className="text-gray-400 mb-6">Tulis artikel menarik untuk meningkatkan SEO dan engagement pengunjung.</p>
                                <Button variant="outline">Buat Artikel Baru</Button>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
