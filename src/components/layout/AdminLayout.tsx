import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    FileText,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Package,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Pesanan', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Paket', href: '/admin/packages', icon: Package },
    { name: 'Kontak', href: '/admin/leads', icon: MessageSquare },
    { name: 'Konten', href: '/admin/content', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    // Double check security: Jangan render admin layout jika bukan admin
    if (profile?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                    <LogOut className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Akses Ditolak</h1>
                <p className="text-gray-400 mb-8 max-w-md">
                    Maaf, akun Anda ({profile?.email}) tidak memiliki izin administrator.
                    Halaman ini khusus untuk admin Cutflow Media.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                    >
                        Ke Dashboard Customer
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900">
            {/* Mobile sidebar backdrop */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700">
                    <NavLink to="/admin" className="flex items-center gap-2">
                        <span className="text-2xl font-black font-heading bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                            CUTFLOW
                        </span>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-pink-600/20 text-pink-400 rounded border border-pink-500/30">
                            ADMIN
                        </span>
                    </NavLink>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            end={item.href === '/admin'}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-pink-600/20 to-cyan-600/20 text-white border border-cyan-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                                }`
                            }
                        >
                            <item.icon size={20} />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
                    <NavLink
                        to="/"
                        className="flex items-center gap-3 w-full px-4 py-2 mb-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-200 text-sm"
                    >
                        ← Lihat Landing Page
                    </NavLink>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                    >
                        <LogOut size={20} />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top header */}
                <header className="sticky top-0 z-30 h-16 bg-slate-800/80 backdrop-blur-xl border-b border-slate-700">
                    <div className="flex items-center justify-between h-full px-4 lg:px-8">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-400 hover:text-white"
                        >
                            <Menu size={24} />
                        </button>

                        {/* Breadcrumb placeholder */}
                        <div className="hidden md:flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Admin</span>
                            <span className="text-gray-600">/</span>
                            <span className="text-white font-medium">Dashboard</span>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <NotificationDropdown />

                            {/* User menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {profile?.full_name?.charAt(0) || 'A'}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-white">
                                            {profile?.full_name || profile?.email || 'Admin'}
                                        </p>
                                        <p className="text-xs text-cyan-400 capitalize">{profile?.role}</p>
                                    </div>
                                    <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden"
                                        >
                                            <NavLink
                                                to="/admin/settings"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white"
                                            >
                                                <Settings size={16} />
                                                Pengaturan
                                            </NavLink>
                                            <button
                                                onClick={handleSignOut}
                                                className="flex items-center gap-2 w-full px-4 py-3 text-gray-300 hover:bg-red-500/10 hover:text-red-400"
                                            >
                                                <LogOut size={16} />
                                                Keluar
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
