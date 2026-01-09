import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ShoppingCart,
    FolderOpen,
    MessageSquare,
    User,
    LogOut,
    Menu,
    X,
    ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pesanan Saya', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Project Saya', href: '/dashboard/projects', icon: FolderOpen },
    { name: 'Pesan', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Profil', href: '/dashboard/profile', icon: User },
];

export default function CustomerLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { profile, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

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
                    <NavLink to="/" className="flex items-center">
                        <span className="text-2xl font-black font-heading bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                            CUTFLOW
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
                <nav className="p-4 space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            end={item.href === '/dashboard'}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-pink-600/20 to-cyan-600/20 text-white border border-pink-500/30'
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

                        {/* Search placeholder */}
                        <div className="hidden md:block flex-1 max-w-md">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari project..."
                                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4">

                            {/* Modifications start here */}
                            {/* Notification Logic */}
                            <NotificationDropdown />
                            {/* User menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-cyan-600 flex items-center justify-center text-white font-semibold text-sm">
                                        {profile?.full_name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="hidden sm:block text-left">
                                        <p className="text-sm font-medium text-white">
                                            {profile?.full_name || profile?.email || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-400">Customer</p>
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
                                                to="/dashboard/profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-3 text-gray-300 hover:bg-slate-700 hover:text-white"
                                            >
                                                <User size={16} />
                                                Profil Saya
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
