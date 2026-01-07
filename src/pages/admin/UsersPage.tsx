import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader, User, Shield, AlertTriangle } from 'lucide-react';
import { userService } from '../../services/userService';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

export default function AdminUsersPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';
        if (!confirm(`Ubah role user ini menjadi ${newRole}? Perubahan ini akan segera berlaku.`)) return;

        try {
            await userService.updateUserRole(userId, newRole);
            await fetchUsers(); // Refresh
        } catch (error) {
            console.error(error);
            alert('Gagal mengubah role');
        }
    };

    const filteredUsers = users.filter(user =>
        (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-white font-heading">Kelola Users</h1>
                <p className="text-gray-400 mt-1">Daftar semua pengguna terdaftar</p>
            </motion.div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                    type="text"
                    placeholder="Cari user (nama/email)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            </div>

            <Card className="overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-10"><Loader className="animate-spin text-cyan-500" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700 bg-slate-800/50">
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium">User Info</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Company/Phone</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Role</th>
                                    <th className="text-left py-4 px-6 text-gray-400 font-medium">Joined</th>
                                    <th className="text-right py-4 px-6 text-gray-400 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt="Avg" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="text-gray-400" size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{user.full_name || 'No Name'}</p>
                                                    <p className="text-gray-500 text-sm">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-gray-300 text-sm">{user.company || '-'}</p>
                                            <p className="text-gray-500 text-xs">{user.phone || '-'}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Badge variant={user.role === 'admin' ? 'danger' : 'success'}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 text-sm">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handleRoleChange(user.id, user.role)}
                                                className="text-xs font-medium text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded hover:bg-cyan-500/10 transition-colors"
                                            >
                                                Switch Role
                                            </button>
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
