import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, profile, loading, isAdmin } = useAuth();
    const location = useLocation();

    // Debugging akses


    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    // Customer trying to access admin area
    if (requireAdmin && profile?.role === 'customer') {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
