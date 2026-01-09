import { useState, useEffect } from 'react';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { orderService } from '../../services/orderService';
import Card from '../../components/ui/Card';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        paidOrders: 0
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [packageDistribution, setPackageDistribution] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = await orderService.getAllOrders() as any[];
            // Not setting orders state since it's unused
            processAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics data", error);
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processAnalytics = (data: any[]) => {
        // 1. Summary Cards
        const paidOrdersList = data.filter(o => o.payment_status === 'paid' || o.payment_status === 'lunas'); // Handle various statuses
        const totalRevenue = paidOrdersList.reduce((acc, curr) => acc + (curr.amount || 0), 0);

        setSummary({
            totalRevenue,
            totalOrders: data.length,
            pendingOrders: data.filter(o => o.payment_status === 'pending').length,
            paidOrders: paidOrdersList.length
        });

        // 2. Monthly Revenue & Orders
        const months: { [key: string]: { revenue: number, orders: number } } = {};
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toLocaleString('default', { month: 'short' });
            months[key] = { revenue: 0, orders: 0 };
        }

        data.forEach(order => {
            const date = new Date(order.created_at);
            const key = date.toLocaleString('default', { month: 'short' });
            if (months[key]) {
                months[key].orders += 1;
                if (order.payment_status === 'paid' || order.payment_status === 'lunas') {
                    months[key].revenue += (order.amount || 0);
                }
            }
        });

        const formattedMonthlyData = Object.keys(months).map(key => ({
            name: key,
            revenue: months[key].revenue,
            orders: months[key].orders
        }));
        setMonthlyData(formattedMonthlyData);

        // 3. Package Distribution
        const packages: { [key: string]: number } = {};
        data.forEach(order => {
            const pkgName = order.packages?.name || 'Unknown';
            packages[pkgName] = (packages[pkgName] || 0) + 1;
        });

        const formattedPackageData = Object.keys(packages).map(key => ({
            name: key,
            value: packages[key]
        }));
        setPackageDistribution(formattedPackageData);
    };

    const formatCurrency = (amount: number | undefined) => {
        if (amount === undefined) return 'Rp0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    if (loading) return <div className="text-center py-12 text-gray-400">Loading analytics...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
                <p className="text-gray-400">Overview performa bisnis Anda</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6 border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 text-green-400 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Pendapatan</p>
                            <h3 className="text-2xl font-bold text-white">{formatCurrency(summary.totalRevenue)}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Total Order</p>
                            <h3 className="text-2xl font-bold text-white">{summary.totalOrders}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Menunggu Pembayaran</p>
                            <h3 className="text-2xl font-bold text-white">{summary.pendingOrders}</h3>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-pink-500/20 text-pink-400 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">Order Terbayar</p>
                            <h3 className="text-2xl font-bold text-white">{summary.paidOrders}</h3>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 border-slate-700 bg-slate-800/50">
                    <h3 className="text-lg font-bold text-white mb-6">Pendapatan Bulanan</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" tickFormatter={(val) => `Rp${val / 1000}k`} />
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#fff' }}
                                    formatter={(value: any) => formatCurrency(value)}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6 border-slate-700 bg-slate-800/50">
                    <h3 className="text-lg font-bold text-white mb-6">Order per Bulan</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#fff' }}
                                />
                                <Bar dataKey="orders" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6 border-slate-700 bg-slate-800/50 lg:col-span-1">
                    <h3 className="text-lg font-bold text-white mb-6">Distribusi Paket</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={packageDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {packageDistribution.map((_entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6 border-slate-700 bg-slate-800/50 lg:col-span-2 flex flex-col justify-center items-center text-center">
                    <div className="bg-slate-700/50 p-6 rounded-full mb-4">
                        <TrendingUp size={48} className="text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Insight Bisnis (AI Powered)</h3>
                    <p className="text-gray-400 max-w-md">
                        Analisis mendalam menggunakan AI akan segera hadir untuk membantu Anda mengoptimalkan penjualan dan strategi bisnis.
                    </p>
                    <div className="mt-6 px-4 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-full">
                        Coming Soon
                    </div>
                </Card>
            </div>
        </div>
    );
}
