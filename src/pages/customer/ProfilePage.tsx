import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, Camera, Save, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { profileService } from '../../services/profileService';
import { storageService } from '../../services/storageService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function CustomerProfilePage() {
    const { user, profile: authProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        company: '',
        avatar_url: ''
    });

    useEffect(() => {
        if (authProfile) {
            setFormData({
                full_name: authProfile.full_name || '',
                phone: authProfile.phone || '',
                company: authProfile.company || '',
                avatar_url: authProfile.avatar_url || ''
            });
        }
    }, [authProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !user) return;

        const file = e.target.files[0];
        // Validasi ukuran (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Ukuran file maksimal 2MB' });
            return;
        }

        try {
            setSaving(true);
            const publicUrl = await storageService.uploadAvatar(file, user.id);
            setFormData(prev => ({ ...prev, avatar_url: publicUrl }));

            // Auto save file url to profile
            await profileService.updateProfile(user.id, { avatar_url: publicUrl });
            setMessage({ type: 'success', text: 'Foto profil diperbarui!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Gagal mengupload foto. Pastikan format sesuai.' });
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setSaving(true);

        try {
            if (!user) return;
            await profileService.updateProfile(user.id, {
                full_name: formData.full_name,
                phone: formData.phone,
                company: formData.company
            });
            setMessage({ type: 'success', text: 'Profil berhasil disimpan!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Gagal menyimpan profil.' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-white font-heading">Profil Saya</h1>
                <p className="text-gray-400 mt-1">Kelola informasi akun Anda</p>
            </motion.div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                >
                    <AlertCircle size={20} />
                    {message.text}
                </motion.div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="text-center p-6">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700 bg-slate-800 mx-auto">
                                {formData.avatar_url ? (
                                    <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-600">
                                        {formData.full_name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 transition-colors shadow-lg"
                                title="Ganti Foto"
                            >
                                <Camera size={18} />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        <h2 className="text-xl font-bold text-white">{formData.full_name || 'User'}</h2>
                        <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
                        <p className="text-cyan-400 text-xs mt-2 uppercase font-medium">{authProfile?.role}</p>
                    </Card>
                </motion.div>

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-2"
                >
                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Nama Lengkap"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    icon={<User size={18} />}
                                    placeholder="Nama Anda"
                                />
                                <Input
                                    label="Nomor Telepon / WhatsApp"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    icon={<Phone size={18} />}
                                    placeholder="0812..."
                                />
                            </div>

                            <Input
                                label="Nama Perusahaan (Opsional)"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                icon={<Building size={18} />}
                                placeholder="PT Maju Mundur"
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <div className="relative opacity-50 cursor-not-allowed">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="block w-full pl-10 pr-3 py-2 border border-slate-600 rounded-lg leading-5 bg-slate-800 text-gray-400 sm:text-sm"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah.</p>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button type="submit" loading={saving} icon={<Save size={18} />}>
                                    Simpan Perubahan
                                </Button>
                            </div>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
