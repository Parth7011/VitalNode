import { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';

// Create context to manage user authentication state globally
const AuthContext = createContext();

// ─── Hardcoded Admin Credentials (Option A) ───────────────────────────────────
// Change these values to set your admin username and password.
// When you connect a real backend, replace adminLogin() with an API call.
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'vitalnode@admin123';
// ─────────────────────────────────────────────────────────────────────────────

// Provider component to wrap around the application or components that need auth access
export const AuthProvider = ({ children }) => {
    const { showNotification } = useNotification();
    // State to hold user data (null if not authenticated)
    const [user, setUser] = useState(null);
    // State to track if the user is authenticated
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // State to handle the initial loading of auth data from localStorage
    const [loading, setLoading] = useState(true);

    // API URL
    const API_URL = 'http://localhost:5000/api/auth';

    // Check for stored user session on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('vitalnode_user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    // Login using backend API
    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Invalid email or password');
            }

            const userWithToken = { ...data, id: data._id }; 
            localStorage.setItem('vitalnode_user', JSON.stringify(userWithToken));
            setUser(userWithToken);
            setIsAuthenticated(true);
            return userWithToken;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Dedicated admin login — checks against hardcoded credentials.
     */
    const adminLogin = (username, password) => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const adminUser = {
                role: 'admin',
                name: 'Hospital Admin',
                email: 'admin@vitalnode.internal',
                token: 'simulated-admin-jwt-token',
            };
            localStorage.setItem('vitalnode_user', JSON.stringify(adminUser));
            setUser(adminUser);
            setIsAuthenticated(true);
            showNotification('Welcome back, Admin!', 'success');
            return true;
        }
        return false;
    };

    // Signup using backend API
    const signup = async (userData) => {
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            const userWithToken = { ...data, id: data._id };
            localStorage.setItem('vitalnode_user', JSON.stringify(userWithToken));
            setUser(userWithToken);
            setIsAuthenticated(true);
            return userWithToken;
        } catch (error) {
            throw error;
        }
    };

    // Update user profile with additional data
    const updateProfile = (profileData) => {
        const updatedUser = { ...user, ...profileData, profileComplete: true };
        localStorage.setItem('vitalnode_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    // Logout — clears session from state and localStorage
    const logout = () => {
        localStorage.removeItem('vitalnode_user');
        setUser(null);
        setIsAuthenticated(false);
        showNotification('Logged out successfully', 'success');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, adminLogin, signup, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access to the Auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
