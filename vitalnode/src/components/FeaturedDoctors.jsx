import { useNavigate } from 'react-router-dom';
import { useDoctors } from '../context/DoctorsContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

/**
 * FeaturedDoctors — shows the doctor grid on the home page.
 * Only logged-in patients see the full list.
 * Unauthenticated users and admins see a "Login to view doctors" card instead.
 */
const FeaturedDoctors = () => {
    const navigate = useNavigate();
    const { doctors } = useDoctors();
    const { user } = useAuth();
    const { showNotification } = useNotification();

    const handleBooking = () => {
        if (!user) {
            showNotification('Please login to book an appointment', 'error');
            navigate('/login');
            return;
        }
        navigate('/doctors');
    };

    // ── Login prompt for non-patients ─────────────────────────────────────────
    if (!user || user.role === 'admin') {
        return (
            <section id="doctors" className="py-24 bg-primary-green/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-20 bg-white curved-bottom" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h4 className="text-secondary-green font-black tracking-widest uppercase text-sm mb-4">Expert Doctors</h4>
                    <h2 className="text-4xl md:text-5xl font-black text-text-dark">Our Medical Team</h2>
                    <div className="w-24 h-1.5 bg-primary-green mx-auto mt-6 rounded-full mb-10" />
                    <div className="bg-white rounded-3xl shadow-premium p-12 max-w-xl mx-auto border border-gray-100">
                        <div className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center mx-auto mb-6">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <h3 className="text-xl font-black text-text-dark mb-3">Our Medical Team</h3>
                        <p className="text-gray-500 mb-8">Login to browse our certified specialists and book your appointment instantly.</p>
                        <button
                            onClick={() => navigate('/login')}
                            className="btn-primary-gradient text-white font-bold px-8 py-3.5 rounded-full shadow-glow hover:shadow-premium transition-all active:scale-95"
                        >
                            Login to View Doctors
                        </button>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-bg-soft transform rotate-180 curved-bottom" />
            </section>
        );
    }

    // ── Full doctor grid for logged-in patients ────────────────────────────────
    return (
        <section id="doctors" className="py-24 bg-primary-green/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-white curved-bottom" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h4 className="text-secondary-green font-black tracking-widest uppercase text-sm mb-4">Expert Doctors</h4>
                    <h2 className="text-4xl md:text-5xl font-black text-text-dark">Ready to Help You</h2>
                    <div className="w-24 h-1.5 bg-primary-green mx-auto mt-6 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="card-modern flex flex-col h-full group overflow-hidden">
                            <div className="relative h-72 m-4 rounded-[32px] img-zoom-container">
                                <img
                                    src={doctor.image}
                                    alt={doctor.name}
                                    className="img-cover-rounded"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "/images/placeholder-doctor.png"; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                                    <span className="bg-white/90 backdrop-blur text-primary-green text-xs font-black px-4 py-1.5 rounded-full shadow-lg">{doctor.specialty}</span>
                                    <div className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1 text-sm font-bold shadow-lg">
                                        <span className="text-yellow-400">★</span>
                                        <span className="text-text-dark">{doctor.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 pt-2 flex flex-col flex-grow text-center">
                                <h3 className="text-2xl font-bold text-text-dark mb-2 group-hover:text-primary-green transition-colors">{doctor.name}</h3>
                                <p className="text-sm text-gray-400 font-semibold mb-6 tracking-wide uppercase">{doctor.qualification}</p>
                                <div className="flex items-center justify-around mb-8 bg-bg-soft py-4 rounded-3xl">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Experience</span>
                                        <span className="font-black text-text-dark">{doctor.experience}</span>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Consult Fee</span>
                                        <span className="font-black text-primary-green">₹{doctor.fee}</span>
                                    </div>
                                </div>
                                <button onClick={handleBooking} className="btn-modern w-full bg-primary-green hover:bg-secondary-green text-white py-4 mt-auto shadow-primary-green/20">
                                    Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-20 bg-bg-soft transform rotate-180 curved-bottom" />
        </section>
    );
};

export default FeaturedDoctors;
