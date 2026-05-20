import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — guards a route by auth state and role.
 * - Not logged in → /login
 * - Wrong role (admin on patient page) → /  (home, not /dashboard)
 * - Wrong role (patient/doctor on admin page) → /dashboard
 */
const ProtectedRoute = ({ children, allowedRole }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {
        // Redirect admin to home, everyone else to their dashboard
        return <Navigate to={user?.role === 'admin' ? '/' : '/dashboard'} replace />;
    }

    return children;
};

export default ProtectedRoute;
