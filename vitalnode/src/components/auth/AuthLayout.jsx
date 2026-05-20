// Reusable HealthcareIcon component for the authentication layout branding
const HealthcareIcon = ({ className = "w-24 h-24" }) => (
    <div className={`relative ${className} flex items-center justify-center`}>
        {/* Stylized person/heart shape from reference */}
        <div className="absolute top-0 w-6 h-6 bg-white rounded-full shadow-lg z-20"></div>
        <div className="absolute bottom-0 w-20 h-20 flex items-center justify-center">
            <div className="w-full h-full bg-white/20 rounded-full blur-xl absolute scale-150"></div>
            <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current relative z-10 filter drop-shadow-xl">
                <path d="M50 25 C30 25 10 45 10 70 C10 85 30 95 50 95 C70 95 90 85 90 70 C90 45 70 25 50 25 Z" className="opacity-40" />
                <path d="M50 35 C35 35 25 45 25 60 C25 80 50 90 50 90 C50 90 75 80 75 60 C75 45 65 35 50 35 Z" />
            </svg>
        </div>
    </div>
);

// AuthLayout component provides a consistent, two-panel layout for Login and Signup pages
const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans overflow-hidden">

            {/* Left Panel: Branding (Adapted from Reference) */}
            <div className="md:w-[45%] hero-gradient p-12 flex flex-col items-center justify-center text-white relative text-center min-h-[400px]">
                {/* Decorative Circles & Dots (Reference Style) */}
                <div className="absolute top-20 right-10 w-24 h-24 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-40 left-10 w-32 h-32 bg-white/5 rounded-full"></div>
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/20 rounded-full"></div>
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-white/20 rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-white/20 rounded-full"></div>

                {/* stylized wave at bottom */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-white/5 blur-3xl rounded-t-[100%]"></div>

                <div className="relative z-10 flex flex-col items-center space-y-10 animate-fadeIn">
                    <HealthcareIcon className="w-40 h-40" />

                    <div className="space-y-4">
                        <h1 className="text-4xl font-black tracking-[0.2em] uppercase">HEALTHCARE</h1>
                        <p className="text-xl font-medium text-white/80 max-w-xs leading-relaxed">
                            All your healthcare need <br /> on your finger tips
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel: Form Area (Reference Style) */}
            <div className="md:w-[55%] bg-white p-8 md:p-24 flex flex-col justify-center relative relative">
                {/* Geometric Diamond Pattern (Top-Right Reference) */}
                <div className="absolute top-0 right-0 w-64 h-64 overflow-hidden pointer-events-none opacity-10">
                    <div className="absolute top-[-20px] right-20 w-12 h-12 bg-primary-green rotate-45 rounded-sm"></div>
                    <div className="absolute top-20 right-[-10px] w-16 h-16 bg-secondary-green rotate-45 rounded-sm"></div>
                    <div className="absolute top-40 right-20 w-8 h-8 bg-primary-green rotate-45 rounded-sm"></div>
                    <div className="absolute top-0 right-[-30px] w-24 h-24 bg-primary-green/20 rotate-45 rounded-sm"></div>
                </div>

                <div className="max-w-md w-full mx-auto relative z-10">
                    <div className="mb-14">
                        {/* Matching image icon/logo on right panel too */}
                        <div className="mb-8 flex md:hidden items-center gap-3">
                            <HealthcareIcon className="w-12 h-12 !text-primary-green" />
                            <span className="text-primary-green font-black text-xl tracking-tighter">VitalNode</span>
                        </div>

                        <h2 className="text-4xl font-black text-text-dark mb-2 tracking-tight">{title}</h2>
                        <p className="text-gray-400 font-bold text-lg">{subtitle}</p>
                    </div>

                    <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
