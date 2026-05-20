import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import DoctorLogin from '../pages/DoctorLogin';
import ProfileSetup from '../pages/ProfileSetup';
import PatientDashboard from '../pages/PatientDashboard';
import DoctorDashboard from '../pages/DoctorDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminLogin from '../pages/AdminLogin';
import Doctors from '../pages/Doctors';
import BookAppointment from '../pages/BookAppointment';
import Appointments from '../pages/Appointments';
import ConsultationRoom from '../pages/ConsultationRoom';
import Prescription from '../pages/Prescription';
import MyTreatments from '../pages/MyTreatments';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import DepartmentDetails from '../pages/DepartmentDetails';
import AboutPage from '../pages/AboutPage';
import HowItWorksPage from '../pages/HowItWorksPage';
import SpecialtiesPage from '../pages/SpecialtiesPage';
import DoctorConsultationRoom from '../pages/DoctorConsultationRoom';
import DoctorPrescriptions from '../pages/DoctorPrescriptions';

// Main routing component that defines all application routes
const AppRoutes = () => {
    const { user, loading } = useAuth();

    // Show spinner while the auth state loads from localStorage
    if (loading) {
        return (
            <div className="min-h-screen bg-bg-soft flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Helper: where to redirect already-authenticated users away from auth pages
    const getAuthRedirect = (u) => {
        if (!u) return null;
        if (u.role === 'admin') return '/admin-dashboard';
        if (u.role === 'doctor') return '/doctor-dashboard';
        return '/dashboard';
    };

    const authRedirect = getAuthRedirect(user);

    return (
        <Routes>
            {/* ── Public Routes ──────────────────────────────────── */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/specialties" element={<SpecialtiesPage />} />
            <Route path="/departments/:id" element={<DepartmentDetails />} />
            <Route path="/doctors" element={<Doctors />} />

            <Route
                path="/login"
                element={authRedirect ? <Navigate to={authRedirect} replace /> : <Login />}
            />
            <Route
                path="/signup"
                element={authRedirect ? <Navigate to={authRedirect} replace /> : <Signup />}
            />

            {/* Secret Admin Login — not linked in the public navbar */}
            <Route
                path="/admin-login"
                element={
                    user?.role === 'admin'
                        ? <Navigate to="/admin-dashboard" replace />
                        : <AdminLogin />
                }
            />

            {/* Hidden Doctor Login — not linked in the UI */}
            <Route
                path="/doctor-login"
                element={authRedirect ? <Navigate to={authRedirect} replace /> : <DoctorLogin />}
            />

            {/* ── Patient Protected Routes ────────────────────────── */}
            <Route path="/profile-setup" element={
                <ProtectedRoute allowedRole="patient"><ProfileSetup /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
                <ProtectedRoute allowedRole="patient"><PatientDashboard /></ProtectedRoute>
            } />
            <Route path="/prescription" element={
                <ProtectedRoute allowedRole="patient"><Prescription /></ProtectedRoute>
            } />
            <Route path="/my-treatments" element={
                <ProtectedRoute allowedRole="patient"><MyTreatments /></ProtectedRoute>
            } />
            <Route path="/book-appointment" element={
                <ProtectedRoute allowedRole="patient"><BookAppointment /></ProtectedRoute>
            } />
            <Route path="/appointments" element={
                <ProtectedRoute allowedRole="patient"><Appointments /></ProtectedRoute>
            } />
            <Route path="/consultation/:appointmentId" element={
                <ProtectedRoute allowedRole="patient"><ConsultationRoom /></ProtectedRoute>
            } />

            {/* ── Doctor Protected Routes ─────────────────────────── */}
            <Route path="/doctor-dashboard" element={
                <ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>
            } />
            <Route path="/doctor-consultation/:appointmentId" element={
                <ProtectedRoute allowedRole="doctor"><DoctorConsultationRoom /></ProtectedRoute>
            } />
            <Route path="/doctor-prescriptions" element={
                <ProtectedRoute allowedRole="doctor"><DoctorPrescriptions /></ProtectedRoute>
            } />

            {/* ── Admin Protected Routes ──────────────────────────── */}
            <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>
            } />

            {/* Fallback - redirect unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
