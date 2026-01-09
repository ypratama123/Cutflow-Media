import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { signUp } = useAuth();
    const navigate = useNavigate();

    const passwordRequirements = [
        { label: 'Minimal 8 karakter', met: password.length >= 8 },
        { label: 'Huruf besar dan kecil', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
        { label: 'Minimal 1 angka', met: /\d/.test(password) },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Password tidak cocok');
            return;
        }

        if (password.length < 8) {
            setError('Password minimal 8 karakter');
            return;
        }

        setLoading(true);

        const { error } = await signUp(email, password, fullName);

        if (error) {
            setError(error.message || 'Gagal membuat akun. Silakan coba lagi.');
            setLoading(false);
            return;
        }

        setSuccess(true);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center">
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4 font-heading">
                        Pendaftaran Berhasil!
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Silakan cek email Anda untuk verifikasi akun. Setelah verifikasi, Anda bisa langsung login.
                    </p>
                    <Button onClick={() => navigate('/login')} size="lg">
                        Ke Halaman Login
                        <ArrowRight size={18} />
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-cyan-600/20 to-pink-600/20 items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.15),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(236,72,153,0.15),transparent_50%)]" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center"
                >
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-r from-cyan-600 to-pink-600 flex items-center justify-center">
                        <User className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 font-heading">
                        Bergabung dengan Cutflow
                    </h3>
                    <p className="text-gray-300 max-w-sm">
                        Nikmati layanan video editing profesional dengan dashboard tracking yang intuitif
                    </p>

                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700">
                            <p className="text-2xl font-bold gradient-text">100+</p>
                            <p className="text-gray-400 text-sm">Clients</p>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700">
                            <p className="text-2xl font-bold gradient-text">1000+</p>
                            <p className="text-gray-400 text-sm">Projects</p>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-slate-700">
                            <p className="text-2xl font-bold gradient-text">5★</p>
                            <p className="text-gray-400 text-sm">Rating</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-32 left-20 w-16 h-16 rounded-xl bg-cyan-600/20 border border-cyan-500/30"
                />
                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-20 right-32 w-20 h-20 rounded-full bg-pink-600/20 border border-pink-500/30"
                />
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Link to="/" className="inline-block mb-8">
                        <h1 className="text-3xl font-black font-heading">
                            <span className="bg-gradient-to-r from-pink-500 to-cyan-500 bg-clip-text text-transparent">
                                CUTFLOW
                            </span>
                        </h1>
                    </Link>

                    <h2 className="text-3xl font-bold text-white mb-2 font-heading">
                        Buat Akun Baru
                    </h2>
                    <p className="text-gray-400 mb-8">
                        Daftar untuk mulai menggunakan layanan kami
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
                            type="text"
                            label="Nama Lengkap"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            icon={<User size={18} />}
                            required
                        />

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
                                placeholder="Minimal 8 karakter"
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

                        {/* Password Requirements */}
                        {password && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-2"
                            >
                                {passwordRequirements.map((req, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-500' : 'bg-slate-600'
                                            }`}>
                                            {req.met && <Check size={10} className="text-white" />}
                                        </div>
                                        <span className={req.met ? 'text-green-400' : 'text-gray-500'}>
                                            {req.label}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        <Input
                            type="password"
                            label="Konfirmasi Password"
                            placeholder="Ulangi password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={<Lock size={18} />}
                            error={confirmPassword && password !== confirmPassword ? 'Password tidak cocok' : ''}
                            required
                        />

                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                required
                                className="w-4 h-4 mt-1 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                            />
                            <span className="text-gray-400 text-sm">
                                Saya setuju dengan{' '}
                                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                                    Syarat dan Ketentuan
                                </a>{' '}
                                serta{' '}
                                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                                    Kebijakan Privasi
                                </a>
                            </span>
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full"
                            size="lg"
                        >
                            Daftar Sekarang
                            <ArrowRight size={18} />
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-gray-400">
                        Sudah punya akun?{' '}
                        <Link
                            to="/login"
                            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                        >
                            Masuk di sini
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
        </div>
    );
}
