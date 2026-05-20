import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

// SignupForm component handles new patient registration input and submission
const SignupForm = () => {
    const { signup } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    // State for user registration details
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    // Handle form submission for signup
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name && email && password) {
            setLoading(true);
            try {
                const userData = { name, email, password, role: 'patient' };
                await signup(userData);
                showNotification('Account created successfully. Welcome!', 'success');
                setTimeout(() => {
                    navigate('/profile-setup');
                }, 1000);
            } catch (error) {
                showNotification(error.message, 'error');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
                <div className="relative group border-b-2 border-gray-100 focus-within:border-primary-green transition-all pb-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">FULL NAME</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-transparent outline-none py-2 font-bold text-text-dark text-lg"
                        placeholder="John Doe"
                        required
                    />
                </div>

                <div className="relative group border-b-2 border-gray-100 focus-within:border-primary-green transition-all pb-1">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">EMAIL ADDRESS</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent outline-none py-2 font-bold text-text-dark text-lg"
                        placeholder="name@example.com"
                        required
                    />
                </div>

                <div className="relative group border-b-2 border-gray-100 focus-within:border-primary-green transition-all pb-1 flex items-center">
                    <div className="flex-1">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-1">PASSWORD</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent outline-none py-2 font-bold text-text-dark text-lg"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-primary-green transition-colors focus:outline-none p-2"
                        title={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-[#B0E5BD] text-[#0f172a] rounded-[10px] px-[18px] py-[10px] font-semibold tracking-[0.2em] uppercase text-sm shadow-lg transition-all duration-200 ease-in-out hover:bg-[#9ED9AB] hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)] active:scale-[0.98] mt-4"
            >
                CREATE ACCOUNT
            </button>

            <div className="text-center pt-2">
                <p className="text-gray-400 font-bold text-sm">
                    Already have an account? <a href="/login" className="text-primary-green font-black uppercase tracking-widest text-xs ml-1 hover:underline">Sign In</a>
                </p>
            </div>
        </form>
    );
};

export default SignupForm;
