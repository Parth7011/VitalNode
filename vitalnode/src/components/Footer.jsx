import { Link } from 'react-router-dom';
import SocialIcons from './SocialIcons';

// Footer component containing links, newsletter subscription, and social media icons
const Footer = () => {
    return (
        <footer className="footer-gradient text-white pt-24 pb-12 relative overflow-hidden">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Info */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-green font-bold text-2xl shadow-lg">V</div>
                            <span className="text-3xl font-black tracking-tight">VitalNode</span>
                        </div>
                        <p className="text-white/80 text-lg leading-relaxed">
                            Redefining online healthcare with professional expertise and innovative technology. Your health is our priority, anywhere and anytime.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xl font-black mb-8 text-white uppercase tracking-widest">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-white/80 hover:text-white hover:translate-x-1.5 transition-all duration-300 ease-out text-lg flex items-center gap-2 group cursor-pointer w-fit"><span className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>Home</Link></li>
                            <li><Link to="/how-it-works" className="text-white/80 hover:text-white hover:translate-x-1.5 transition-all duration-300 ease-out text-lg flex items-center gap-2 group cursor-pointer w-fit"><span className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>How It Works</Link></li>
                            <li><Link to="/doctors" className="text-white/80 hover:text-white hover:translate-x-1.5 transition-all duration-300 ease-out text-lg flex items-center gap-2 group cursor-pointer w-fit"><span className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>Our Doctors</Link></li>
                            <li><Link to="/specialties" className="text-white/80 hover:text-white hover:translate-x-1.5 transition-all duration-300 ease-out text-lg flex items-center gap-2 group cursor-pointer w-fit"><span className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>Specialties</Link></li>
                        </ul>
                    </div>

                    {/* Departments */}
                    <div>
                        <h4 className="text-xl font-black mb-8 text-white uppercase tracking-widest">Departments</h4>
                        <ul className="space-y-4 text-lg">
                            {["Cardiology", "Dermatology", "Pediatrics", "Neurology"].map(dep => (
                                <li key={dep}><Link to={`/departments/${dep.toLowerCase()}`} className="text-white/80 shadow-none hover:text-white hover:underline hover:underline-offset-4 hover:translate-x-1.5 transition-all duration-300 ease-out cursor-pointer inline-block">{dep}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-8">
                        <h4 className="text-xl font-black text-white uppercase tracking-widest">Newsletter</h4>
                        <p className="text-white/80 text-lg">Subscribe to get latest update and health tips.</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full bg-white/10 border-2 border-white/5 rounded-full px-6 py-4 focus:outline-none focus:border-white transition-colors text-lg placeholder:text-white/50"
                            />
                            <button className="btn-modern absolute right-2 top-2 bottom-2 bg-white text-primary-green hover:bg-bg-soft px-8 rounded-full font-bold transition-all shadow-lg active:scale-95 text-lg">
                                Go
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Icons Section */}
                <div className="pt-8 mt-12 mb-8 border-t border-white/10">
                    <SocialIcons />
                </div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-white/60 text-lg">
                        &copy; {new Date().getFullYear()} <span className="text-white font-bold">VitalNode</span>. All rights reserved.
                    </p>
                    <div className="flex gap-8 text-white/60 items-center">
                        <a href="#" className="nav-link-modern hover:text-white">Privacy Policy</a>
                        <a href="#" className="nav-link-modern hover:text-white">Terms of Service</a>
                        {/* Subtle admin portal link — visible but unobtrusive */}
                        <Link
                            to="/admin-login"
                            className="flex items-center gap-1.5 text-white/30 hover:text-white/70 text-sm transition-colors duration-300"
                            title="Hospital Admin Portal"
                        >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
