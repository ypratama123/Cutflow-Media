import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Folder, Upload, Download, FileText, CheckCircle, Clock, PlayCircle, ArrowLeft, Loader } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { storageService } from '../../services/storageService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

export default function CustomerProjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [project, setProject] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!id) return;
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const data = await projectService.getProjectById(id!);
            setProject(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !project) return;
        const file = e.target.files[0];

        // Limit 100MB for demo, real app might need chunk upload
        if (file.size > 100 * 1024 * 1024) {
            alert('File terlalu besar (Max 100MB). Gunakan Google Drive link untuk file besar.');
            return;
        }

        try {
            setUploading(true);
            const publicUrl = await storageService.uploadProjectFile(file, project.id, 'raw');

            await projectService.addProjectFile({
                project_id: project.id,
                file_name: file.name,
                file_url: publicUrl,
                file_type: 'raw',
                file_size: file.size
            });

            await fetchProject(); // Refresh
            alert('File berhasil diupload!');
        } catch (error) {
            console.error(error);
            alert('Gagal upload file');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader className="animate-spin text-cyan-500" /></div>;
    if (!project) return <div className="text-center p-10 text-gray-400">Project not found</div>;

    const rawFiles = project.project_files?.filter((f: any) => f.file_type === 'raw') || [];
    const resultFiles = project.project_files?.filter((f: any) => f.file_type === 'result') || [];

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <button
                onClick={() => navigate('/dashboard/projects')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={18} /> Kembali ke Project List
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between gap-4"
            >
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Badge variant="info">{project.status}</Badge>
                        <span className="text-gray-500 text-sm">Created: {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white font-heading">{project.title}</h1>
                    <p className="text-gray-400 mt-1">Paket: {project.orders?.packages?.name}</p>
                </div>

                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 min-w-[250px]">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Total Progress</span>
                        <span className="text-cyan-400 font-bold">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000"
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 text-center">Deadline: {project.deadline || 'Estimasi 3-5 hari'}</p>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* FILES SECTION */}
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Folder size={20} className="text-cyan-500" /> File Project
                        </h3>

                        {/* Result Files (Output) */}
                        <div className="mb-8">
                            <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-3">Hasil Edit (Download)</h4>
                            {resultFiles.length === 0 ? (
                                <div className="bg-slate-900/50 p-4 rounded border border-slate-700 border-dashed text-center text-gray-500 text-sm">
                                    Belum ada hasil edit yang diupload.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {resultFiles.map((file: any) => (
                                        <div key={file.id} className="bg-slate-800 p-3 rounded flex justify-between items-center border border-slate-700">
                                            <div className="flex items-center gap-3">
                                                <PlayCircle className="text-green-400" size={20} />
                                                <div>
                                                    <p className="text-white text-sm font-medium">{file.file_name}</p>
                                                    <p className="text-gray-500 text-xs">{(file.file_size / 1024 / 1024).toFixed(2)} MB • {new Date(file.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <a href={file.file_url} target="_blank" rel="noreferrer" download>
                                                <Button size="sm" variant="secondary" icon={<Download size={14} />}>Download</Button>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Raw Files (Input) */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Bahan Mentah (Upload)</h4>
                                <Button
                                    size="sm"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    icon={uploading ? <Loader className="animate-spin" size={14} /> : <Upload size={14} />}
                                >
                                    {uploading ? 'Uploading...' : 'Upload File'}
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    multiple={false} // Demo single file dulu
                                />
                            </div>

                            {rawFiles.length === 0 ? (
                                <div className="bg-slate-900/50 p-6 rounded border border-slate-700 border-dashed text-center">
                                    <Upload className="mx-auto text-gray-600 mb-2" size={24} />
                                    <p className="text-gray-500 text-sm">Upload footage atau dokumen brief di sini</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {rawFiles.map((file: any) => (
                                        <div key={file.id} className="bg-slate-800/50 p-3 rounded flex justify-between items-center border border-slate-700/50">
                                            <div className="flex items-center gap-3">
                                                <FileText className="text-cyan-500" size={20} />
                                                <div>
                                                    <p className="text-gray-300 text-sm">{file.file_name}</p>
                                                    <p className="text-gray-500 text-xs">Uploaded • {new Date(file.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <a href={file.file_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
                                                <Download size={16} />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Brief Notes</h3>
                        <div className="bg-slate-900 p-4 rounded text-gray-300 text-sm leading-relaxed border border-slate-700 max-h-60 overflow-y-auto">
                            {project.orders?.notes || "Tidak ada catatan khusus."}
                        </div>
                    </Card>

                    <Card className="p-6 border-cyan-500/20 bg-gradient-to-b from-slate-800 to-slate-900">
                        <h3 className="text-white font-bold mb-2">Butuh Bantuan?</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Jika file terlalu besar atau ada revisi mendadak, silakan hubungi project manager.
                        </p>
                        <Button variant="outline" className="w-full">Chat Admin</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
