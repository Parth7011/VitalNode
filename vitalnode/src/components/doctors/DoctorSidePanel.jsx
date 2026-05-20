import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

// DoctorSidePanel component displays detailed information about a doctor when selected, sliding in from the right
const DoctorSidePanel = ({ doctor, isOpen, onClose }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showNotification } = useNotification();
    // State to toggle between 'about', 'schedule', and 'reviews' tabs
    const [activeTab, setActiveTab] = useState('about');

    // Handle booking appointment action
    const handleBooking = () => {
        if (!user) {
            showNotification('Please login to book an appointment', 'error');
            navigate('/login');
            return;
        }
        navigate(`/book-appointment?doctorId=${doctor.id}`);
    };

    if (!doctor) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-white z-[101] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="relative h-64 shrink-0">
                        <img 
                            src={doctor.image} 
                            alt={doctor.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/placeholder-doctor.png";
                            }}
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                            <h2 className="text-2xl font-bold text-white mb-1">{doctor.name}</h2>
                            <p className="text-white/80 font-medium">{doctor.specialty}</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 border-b border-gray-100 divide-x divide-gray-100">
                        <div className="p-4 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                            <p className="text-sm font-bold text-text-dark">{doctor.experience}</p>
                        </div>
                        <div className="p-4 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Patients</p>
                            <p className="text-sm font-bold text-text-dark">{doctor.patientsTreated}</p>
                        </div>
                        <div className="p-4 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rating</p>
                            <div className="flex items-center justify-center gap-1">
                                <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-sm font-bold text-text-dark">{doctor.rating}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-100">
                        {['about', 'schedule', 'reviews'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors relative ${activeTab === tab ? 'text-primary-green' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-green rounded-t-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Professional Biography</h4>
                                    <p className="text-gray-600 leading-relaxed text-sm">{doctor.about}</p>
                                </div>
                                <div>
                                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Qualifications</h4>
                                    <p className="text-gray-800 font-bold text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">{doctor.qualification}</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'schedule' && (
                            <div className="text-center py-10">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-sm font-bold text-text-dark mb-1">Next Available: Today</h4>
                                <p className="text-xs text-gray-400">Slots available from 04:00 PM</p>
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="space-y-4">
                                {doctor.reviews.length > 0 ? (
                                    doctor.reviews.map(review => (
                                        <div key={review.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-bold text-sm">{review.user}</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 italic">"{review.comment}"</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 text-sm py-10">No reviews yet.</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consultation Fee</p>
                                <p className="text-2xl font-black text-primary-green">₹{doctor.fee}</p>
                            </div>
                            <div className="bg-green-50 px-4 py-2 rounded-xl text-primary-green text-xs font-bold">
                                100% Secure
                            </div>
                        </div>
                        <button
                            onClick={handleBooking}
                            className="w-full btn-primary-gradient text-white font-black tracking-[0.2em] uppercase text-sm py-5 rounded-2xl shadow-xl hover:shadow-primary-green/30 transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorSidePanel;
