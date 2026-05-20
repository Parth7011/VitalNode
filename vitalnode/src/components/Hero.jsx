import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Hero component displaying the main headline and call-to-action buttons on the Home page
const Hero = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    return (
        <section className="relative h-screen flex items-center overflow-hidden hero-gradient">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col md:flex-row items-center gap-12">
                {/* Left Side: Content */}
                <div className="md:w-1/2 text-white space-y-8 animate-fadeIn">
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                        We Provide <span className="underline decoration-bg-soft/30">Best Online</span> Healthcare Consultation
                    </h1>
                    <p className="text-xl opacity-90 leading-relaxed max-w-lg">
                        Experience world-class healthcare from the comfort of your home. Connect with certified doctors via secure video calls in minutes.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => navigate(isAuthenticated ? '/doctors' : '/login')}
                            className="btn-modern bg-[#B0E5BD] text-[#0f172a] px-[18px] py-[10px] hover:bg-[#9ED9AB] active:scale-[0.98]"
                        >
                            Book Appointment
                        </button>
                        <button
                            onClick={() => navigate('/prescription')}
                            className="btn-modern bg-[#B0E5BD] text-[#0f172a] px-[18px] py-[10px] hover:bg-[#9ED9AB] active:scale-[0.98] relative overflow-hidden group"
                        >
                            <span className="relative z-10">My Prescriptions</span>
                            <div className="absolute inset-0 bg-white/20 transform -translate-x-full skew-x-12 group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
                        </button>
                    </div>
                </div>

                {/* Right Side: Image Placeholder */}
                <div className="md:w-1/2 relative group">
                    <div className="absolute -inset-1 bg-white/20 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white/10 group-hover:border-white/20 transition-all duration-500">
                        <img
                            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800&h=800"
                            alt="Healthcare Consultation"
                            className="w-full h-full object-cover transform transition duration-700 group-hover:scale-105"
                        />
                    </div>
                </div>
            </div>

            {/* Wave Shape Bottom */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[60px] fill-bg-soft">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;
