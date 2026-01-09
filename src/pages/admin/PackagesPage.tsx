import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Edit, Trash2, Check, X, Loader } from 'lucide-react';
import { packageService } from '../../services/packageService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function AdminPackagesPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        description: '',
        features: [] as string[],
        is_active: true,
        is_popular: false
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const data = await packageService.getPackages();
            setPackages(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (pkg: any) => {
        setEditingId(pkg.id);
        setFormData({
            name: pkg.name,
            price: pkg.price,
            description: pkg.description || '',
            features: pkg.features || [],
            is_active: pkg.is_active,
            is_popular: pkg.is_popular
        });
        setIsAdding(false);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setFormData({
            name: '',
            price: 0,
            description: '',
            features: ['Fitur 1', 'Fitur 2'],
            is_active: true,
            is_popular: false
        });
        setIsAdding(true);
    };

    const handleSave = async () => {
        try {
            // Slug gen
            const slug = formData.name.toLowerCase().replace(/\s+/g, '-');
            const payload = {
                ...formData,
                slug
            };

            if (isAdding) {
                await packageService.createPackage(payload);
            } else if (editingId) {
                await packageService.updatePackage(editingId, payload);
            }

            setIsAdding(false);
            setEditingId(null);
            fetchPackages();
        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan paket');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus paket ini?')) return;
        try {
            await packageService.deletePackage(id);
            fetchPackages();
        } catch (error) {
            console.error(error);
            alert('Gagal menghapus paket. Mungkin sedang dipakai oleh order.');
        }
    };

    const handleFeatureChange = (idx: number, val: string) => {
        const newFeatures = [...formData.features];
        newFeatures[idx] = val;
        setFormData({ ...formData, features: newFeatures });
    };

    const addFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const removeFeature = (idx: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== idx);
        setFormData({ ...formData, features: newFeatures });
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white font-heading">Kelola Paket</h1>
                    <p className="text-gray-400 mt-1">Atur harga dan fitur paket</p>
                </div>
                <Button onClick={handleAddNew} icon={<Plus size={18} />}>Tambah Paket</Button>
            </motion.div>

            {/* Editor Form */}
            {(isAdding || editingId) && (
                <Card className="p-6 border-cyan-500/30">
                    <h3 className="text-lg font-bold text-white mb-4">{isAdding ? 'Tambah Paket Baru' : 'Edit Paket'}</h3>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <Input
                            label="Nama Paket"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <Input
                            label="Harga (IDR)"
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-400 text-sm mb-1 block">Deskripsi</label>
                        <textarea
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-400 text-sm mb-2 block">Fitur List</label>
                        {formData.features.map((feat, idx) => (
                            <div key={idx} className="flex gap-2 mb-2">
                                <input
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-sm"
                                    value={feat}
                                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                                />
                                <button onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-300">
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                        <button onClick={addFeature} className="text-cyan-400 text-sm hover:underline">+ Tambah Fitur</button>
                    </div>

                    <div className="flex gap-4 mb-6">
                        <label className="flex items-center gap-2 text-white">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                            Active
                        </label>
                        <label className="flex items-center gap-2 text-white">
                            <input
                                type="checkbox"
                                checked={formData.is_popular}
                                onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                            />
                            Popular Badge
                        </label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => { setIsAdding(false); setEditingId(null); }}>Batal</Button>
                        <Button onClick={handleSave}>Simpan Paket</Button>
                    </div>
                </Card>
            )}

            {/* List */}
            <Card className="overflow-hidden">
                {loading ? <div className="p-10 text-center"><Loader className="animate-spin inline text-cyan-500" /></div> : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700 bg-slate-800/50">
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Paket</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Harga</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                                    <th className="text-right py-4 px-6 text-gray-400 font-medium">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {packages.map((pkg) => (
                                    <tr key={pkg.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="text-white font-bold">{pkg.name}</p>
                                            <p className="text-gray-500 text-xs">{pkg.features?.length} fitur</p>
                                            {pkg.is_popular && <span className="text-xs bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded border border-pink-500/30 mt-1 inline-block">Popular</span>}
                                        </td>
                                        <td className="py-4 px-6 text-cyan-400 font-mono">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(pkg.price)}
                                        </td>
                                        <td className="py-4 px-6">
                                            {pkg.is_active ? <span className="text-green-400 text-sm">Active</span> : <span className="text-red-400 text-sm">Inactive</span>}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(pkg)} className="p-2 text-gray-400 hover:text-white bg-slate-800 rounded">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(pkg.id)} className="p-2 text-gray-400 hover:text-red-400 bg-slate-800 rounded">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
