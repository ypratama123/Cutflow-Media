import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, PlayCircle, FileText, Loader, ArrowRight, Folder } from 'lucide-react';
import { projectService } from '../../services/projectService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function CustomerProjectsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await projectService.getMyProjects();
            setProjects(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
            case 'review': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'revision': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
            case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-white font-heading">Project Saya</h1>
                <p className="text-gray-400 mt-1">Pantau progress video editing Anda</p>
            </motion.div>

            {loading ? (
                <div className="flex justify-center py-12"><Loader className="animate-spin text-cyan-500" /></div>
            ) : projects.length === 0 ? (
                <Card className="text-center py-12 border-dashed">
                    <Folder size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-white font-bold mb-2">Belum ada project aktif</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                        Project akan otomatis dibuat setelah pesanan Anda statusnya "Processing".
                    </p>
                    <Link to="/dashboard/checkout">
                        <Button>Buat Pesanan Baru</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="p-6 hover:border-cyan-500/50 transition-colors group">
                                <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-3 py-1 rounded text-xs font-bold uppercase border ${getStatusColor(project.status)}`}>
                                                {project.status}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                Order #{project.orders?.order_number}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            Paket: {project.orders?.packages?.name}
                                        </p>
                                    </div>

                                    <div className="w-full md:w-1/3 space-y-2">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-400">Progress</span>
                                            <span className="text-cyan-400 font-bold">{project.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000"
                                                style={{ width: `${project.progress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Deadline:</span>
                                            <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'TBA'}</span>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto">
                                        <Link to={`/dashboard/projects/${project.id}`}>
                                            <Button variant="outline" className="w-full md:w-auto group-hover:bg-cyan-500 group-hover:text-white group-hover:border-cyan-500">
                                                Buka Project <ArrowRight size={16} className="ml-2" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
