import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Navigation bar component that handles routing, authentication state display, and search functionality
const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // State to track if the user has scrolled down the page for styling changes
    const [scrolled, setScrolled] = useState(false);

    // Home page transparency logic
    const isHomePage = location.pathname === '/';

    // Add scroll event listener to update navbar appearance on scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        // Cleanup listener on unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Function to handle user logout and redirect to home
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isHomePage ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-10 h-10 bg-primary-green rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            V
                        </div>
                        <span className={`text-2xl font-bold tracking-tight ${scrolled || !isHomePage ? 'text-text-dark' : 'text-white'
                            }`}>
                            VitalNode
                        </span>
                    </Link>

                    {/* Nav Links + Search */}
                    <div className="hidden md:flex items-center space-x-8 flex-1 justify-center max-w-2xl px-8">
                        {/* Search Bar */}
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search doctors, specialties..."
                                className={`w-full py-2 pl-4 pr-10 rounded-full border border-gray-100 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all ${scrolled || !isHomePage ? 'bg-gray-50 border-gray-200' : 'bg-white/10 text-white placeholder-white/60 border-white/20'
                                    }`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        navigate(`/doctors?search=${e.target.value}`);
                                    }
                                }}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                                <svg className={`w-5 h-5 ${scrolled || !isHomePage ? 'text-gray-400' : 'text-white/60'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6 shrink-0">
                            <Link to="/" className={`font-semibold nav-link-modern ${scrolled || !isHomePage ? 'text-text-dark' : 'text-white'
                                }`}>Home</Link>
                            <Link to="/doctors" className={`font-semibold nav-link-modern ${scrolled || !isHomePage ? 'text-text-dark' : 'text-white'
                                }`}>Doctors</Link>
                            <Link to="/prescription" className={`font-semibold nav-link-modern ${scrolled || !isHomePage ? 'text-text-dark' : 'text-white'
                                }`}>Prescriptions</Link>
                            <a href="#specialties" className={`font-semibold nav-link-modern ${scrolled || !isHomePage ? 'text-text-dark' : 'text-white'
                                }`}>Specialties</a>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className={`font-semibold nav-link-modern ${scrolled || !isHomePage ? 'text-text-dark' : 'text-white'
                                        }`}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn-modern bg-[#B0E5BD] text-[#0f172a] px-5 py-2 hover:bg-[#9ED9AB] active:scale-[0.98]"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={user?.role === 'admin' ? '/admin-dashboard' : user?.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'}
                                    className={`font-semibold nav-link-modern ${scrolled || !isHomePage ? 'text-text-dark' : 'text-white'
                                        }`}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn-modern bg-[#B0E5BD] text-[#0f172a] px-5 py-2 hover:bg-[#9ED9AB] active:scale-[0.98]"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
