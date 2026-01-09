import { useState } from 'react';

import { Save, Bell, User, Globe, Shield } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../features/auth/AuthContext';

export default function SettingsPage() {
    const { profile } = useAuth();
    const [saving, setSaving] = useState(false);

    // Mock Settings State
    const [settings, setSettings] = useState({
        siteName: 'Cutflow Media',
        maintenanceMode: false,
        emailNotifications: true,
        orderNotifications: true,
        darkMode: true,
        language: 'id',
    });

    const handleChange = (key: string, value: any) => {
        setSettings({ ...settings, [key]: value });
    };

    const handleSave = () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            alert('Pengaturan berhasil disimpan!');
        }, 1500);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Pengaturan Sistem</h1>
                    <p className="text-gray-400">Konfigurasi preferensi aplikasi dan akun admin</p>
                </div>
                <Button
                    onClick={handleSave}
                    loading={saving}
                    icon={<Save size={20} />}
                    className="bg-cyan-500 hover:bg-cyan-600"
                >
                    Simpan Perubahan
                </Button>
            </div>

            {/* Profile Section */}
            <Card className="p-6 border-slate-700 bg-slate-800/50">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
                    <div className="p-3 bg-pink-500/20 text-pink-400 rounded-lg">
                        <User size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Profil Admin</h3>
                        <p className="text-sm text-gray-400">Informasi akun yang sedang login</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Nama Lengkap</label>
                        <input
                            type="text"
                            value={profile?.full_name || ''}
                            disabled
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Admin</label>
                        <input
                            type="text"
                            value={profile?.email || ''}
                            disabled
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                        />
                    </div>
                </div>
            </Card>

            {/* General Settings */}
            <Card className="p-6 border-slate-700 bg-slate-800/50">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
                    <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Umum</h3>
                        <p className="text-sm text-gray-400">Pengaturan dasar aplikasi</p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Nama Aplikasi</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => handleChange('siteName', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                        <div>
                            <h4 className="text-white font-medium">Bahasa Sistem</h4>
                            <p className="text-xs text-gray-400">Bahasa default untuk antarmuka admin</p>
                        </div>
                        <select
                            value={settings.language}
                            onChange={(e) => handleChange('language', e.target.value)}
                            className="bg-slate-800 text-white border border-slate-600 rounded px-3 py-1 outline-none focus:border-cyan-500"
                        >
                            <option value="id">Indonesia</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
            </Card>

            {/* Notifications & Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell size={20} className="text-yellow-400" />
                        <h3 className="text-md font-bold text-white">Notifikasi</h3>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-gray-300 group-hover:text-white transition-colors">Notifikasi Pesanan Baru</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.orderNotifications}
                                    onChange={(e) => handleChange('orderNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                            </div>
                        </label>
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-gray-300 group-hover:text-white transition-colors">Notifikasi Email</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                            </div>
                        </label>
                    </div>
                </Card>

                <Card className="p-6 border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-3 mb-6">
                        <Shield size={20} className="text-red-400" />
                        <h3 className="text-md font-bold text-white">Keamanan & Sistem</h3>
                    </div>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-gray-300 group-hover:text-white transition-colors">Maintenance Mode</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.maintenanceMode}
                                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                            </div>
                        </label>
                        <div className="mt-4 pt-4 border-t border-slate-700">
                            <Button variant="outline" size="sm" className="w-full text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500">
                                Reset Password Admin
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
