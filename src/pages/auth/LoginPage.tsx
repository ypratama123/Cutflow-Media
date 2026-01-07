import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error, role } = await signIn(email, password);

        if (error) {
            console.error("Login Error:", error);
            setError(error.message || 'Gagal login. Silakan coba lagi.');
            setLoading(false);
            return;
        }

        // Intelligent Redirect
        // Jika ada 'from' state (user redirected dari protected page), gunakan itu.
        // KECUALI jika 'from' adalah default (/dashboard) dan user adalah admin, maka ke /admin.
        
        let destination = from;
        
        if (from === '/dashboard' || from === '/') {
             if (role === 'admin') {
                 destination = '/admin';
             } else {
                 destination = '/dashboard';
             }
        }
        
        // Safety check: Don't send admin to dashboard if they belong in admin
        if (destination === '/dashboard' && role === 'admin') {
            destination = '/admin';
        }

        navigate(destination, { replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Logo */}
                    <Link to="/" className="inline-block mb-8">
                        <h1 className="text-3xl font-black font-heading">
                            <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                                CUTFLOW
                            </span>
                        </h1>
                    </Link>

                    <h2 className="text-3xl font-bold text-white mb-2 font-heading">
                        Selamat Datang Kembali
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Masuk ke akun Anda untuk melanjutkan
                    </p>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="email"
                            label="Email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Mail size={18} />}
                            required
                        />

                        <div className="relative">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                label="Password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock size={18} />}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-gray-400">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0 mr-2"
                                />
                                Ingat saya
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Lupa password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full"
                            size="lg"
                        >
                            Masuk
                            <ArrowRight size={18} />
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-gray-400">
                        Belum punya akun?{' '}
                        <Link
                            to="/register"
                            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                        >
                            Daftar sekarang
                        </Link>
                    </p>

                    <div className="mt-8 pt-8 border-t border-slate-700">
                        <Link
                            to="/"
                            className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            ← Kembali ke halaman utama
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-pink-600/20 to-cyan-600/20 items-center justify-center p-12 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(236,72,153,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(6,182,212,0.15),transparent_50%)]" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 text-center"
                >
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-pink-600 to-cyan-600 flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 font-heading">
                        Video Editing Made Easy
                    </h3>
                    <p className="text-gray-300 max-w-sm">
                        Kelola project video Anda dengan mudah melalui dashboard yang intuitif
                    </p>
                </motion.div>

                {/* Floating elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute top-20 right-20 w-20 h-20 rounded-xl bg-pink-600/20 border border-pink-500/30"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute bottom-32 left-20 w-16 h-16 rounded-full bg-cyan-600/20 border border-cyan-500/30"
                />
            </div>
        </div>
    );
}
