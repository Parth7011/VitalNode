import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDoctors } from '../context/DoctorsContext';
import { useAppointments } from '../context/AppointmentsContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

/**
 * BookAppointment — Patient submits a booking REQUEST.
 * The doctor reviews this and sets the actual date/time on approval.
 * Emergency option is available with a ₹500 surcharge.
 */
const BookAppointment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { doctors } = useDoctors();
    const { requestAppointment, EMERGENCY_SURCHARGE } = useAppointments();
    const { user } = useAuth();

    const queryParams = new URLSearchParams(location.search);
    const doctorId = queryParams.get('doctorId');

    const [doctor, setDoctor] = useState(null);
    const [problem, setProblem] = useState('');
    const [consultType, setConsultType] = useState('video');
    const [isEmergency, setIsEmergency] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const found = doctors.find((d) => d.id === doctorId);
        if (found) {
            setDoctor(found);
        } else {
            navigate('/doctors');
        }
    }, [doctorId, doctors, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!problem.trim()) {
            showNotification('Please describe your symptoms or reason for visit', 'error');
            return;
        }
        setSubmitting(true);
        await new Promise((r) => setTimeout(r, 700)); // simulate network

        requestAppointment({
            doctorId: doctor.id,
            doctorName: doctor.name,
            doctorImage: doctor.image,
            specialty: doctor.specialty,
            consultationFee: doctor.fee,
            problem,
            type: consultType,
            isEmergency,
            patientName: user?.name || 'Patient',
            patientId: user?.email || 'unknown',
            totalFee: totalFee,
        });

        showNotification(
            isEmergency
                ? 'Emergency request sent! The doctor will respond as soon as possible.'
                : 'Appointment request sent! The doctor will approve and set your date & time.',
            'success'
        );
        setTimeout(() => navigate('/appointments'), 1500);
    };

    if (!doctor) return null;

    const totalFee = doctor.fee + (isEmergency ? EMERGENCY_SURCHARGE : 0);

    return (
        <div className="app-container bg-bg-soft">
            <Navbar />
            <main className="content-area pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-10 text-center">
                        <span className="text-primary-green font-black uppercase tracking-[0.3em] text-[10px]">Booking</span>
                        <h1 className="text-3xl font-bold text-text-dark mt-2">
                            Request an <span className="text-primary-green">Appointment</span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                            Submit your request — the doctor will review it and confirm your date &amp; time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* ── Doctor Info ── */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg border-2 border-primary-green/20">
                                    <img
                                        src={doctor.image}
                                        alt={doctor.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-doctor.png'; }}
                                    />
                                </div>
                                <div className="text-center mb-6">
                                    <h3 className="font-bold text-lg text-text-dark">{doctor.name}</h3>
                                    <p className="text-primary-green text-sm font-bold uppercase tracking-widest">{doctor.specialty}</p>
                                </div>
                                <div className="space-y-3 border-t border-gray-50 pt-5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Base Fee</span>
                                        <span className="text-text-dark font-black">₹{doctor.fee}</span>
                                    </div>
                                    {isEmergency && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-red-400 font-bold uppercase tracking-widest text-[10px]">Emergency Surcharge</span>
                                            <span className="text-red-500 font-black">+₹{EMERGENCY_SURCHARGE}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-sm border-t pt-3 border-dashed border-gray-200">
                                        <span className="text-gray-600 font-black uppercase tracking-widest text-[10px]">Total</span>
                                        <span className={`font-black text-lg ${isEmergency ? 'text-red-500' : 'text-primary-green'}`}>₹{totalFee}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Experience</span>
                                        <span className="text-text-dark font-black">{doctor.experience}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Available</span>
                                        <span className="text-text-dark font-black text-xs">{doctor.availableHours || '10 AM – 5 PM'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Request Form ── */}
                        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                            {/* Consultation Type */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">1. Consultation Type</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'video', label: 'Video Call', icon: '📹', desc: 'Consult from anywhere' },
                                        { id: 'in-person', label: 'In-Person', icon: '🏥', desc: 'Visit the clinic' },
                                    ].map(({ id, label, icon, desc }) => (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => setConsultType(id)}
                                            className={`p-5 rounded-2xl border-2 text-left transition-all ${consultType === id
                                                ? 'border-primary-green bg-primary-green/5'
                                                : 'border-gray-100 hover:border-gray-200'
                                            }`}
                                        >
                                            <div className="text-2xl mb-2">{icon}</div>
                                            <div className="font-bold text-text-dark text-sm">{label}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Symptoms */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">2. Describe Your Symptoms</h4>
                                <textarea
                                    value={problem}
                                    onChange={(e) => setProblem(e.target.value)}
                                    placeholder="e.g., I've been having severe chest pain and shortness of breath for 3 days..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all min-h-[130px] resize-y"
                                    required
                                />
                                <p className="text-[10px] text-gray-400 mt-2 font-medium">
                                    Be as specific as possible — this helps the doctor prepare before your appointment.
                                </p>
                            </div>

                            {/* Emergency Option */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">3. Appointment Priority</h4>
                                <div className="space-y-3">
                                    {/* Normal */}
                                    <button
                                        type="button"
                                        onClick={() => setIsEmergency(false)}
                                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${!isEmergency ? 'border-primary-green bg-primary-green/5' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className="text-2xl">📅</div>
                                        <div>
                                            <div className="font-bold text-text-dark text-sm">Standard Appointment</div>
                                            <div className="text-xs text-gray-400 mt-0.5">Doctor will confirm your slot within 24 hrs — base fee: ₹{doctor.fee}</div>
                                        </div>
                                        {!isEmergency && <div className="ml-auto w-5 h-5 rounded-full bg-primary-green flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
                                    </button>

                                    {/* Emergency */}
                                    <button
                                        type="button"
                                        onClick={() => setIsEmergency(true)}
                                        className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${isEmergency ? 'border-red-400 bg-red-50' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className="text-2xl">🚨</div>
                                        <div>
                                            <div className="font-bold text-red-600 text-sm">Emergency Consultation</div>
                                            <div className="text-xs text-gray-400 mt-0.5">Priority handling, responded within 2 hrs — extra ₹{EMERGENCY_SURCHARGE} surcharge applied</div>
                                        </div>
                                        {isEmergency && <div className="ml-auto w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
                                    </button>
                                </div>

                                {isEmergency && (
                                    <div className="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 text-xs text-red-700 font-medium">
                                        ⚠️ Emergency surcharge of <strong>₹{EMERGENCY_SURCHARGE}</strong> will be added. Total: <strong>₹{totalFee}</strong>. The doctor will prioritise your request.
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full font-black tracking-[0.2em] uppercase text-sm py-5 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 ${
                                    isEmergency
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-red-200'
                                        : 'btn-primary-gradient text-white hover:shadow-primary-green/30'
                                } disabled:opacity-60`}
                            >
                                {submitting ? (
                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending Request...</>
                                ) : isEmergency ? (
                                    '🚨 Send Emergency Request'
                                ) : (
                                    'Send Appointment Request'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookAppointment;
