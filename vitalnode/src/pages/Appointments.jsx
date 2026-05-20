import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppointments } from '../context/AppointmentsContext';
import { useAuth } from '../context/AuthContext';

// ── Status badge ───────────────────────────────────────────────────────────────
const StatusBadge = ({ status, isEmergency }) => {
    const map = {
        pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '⏳ Awaiting Approval' },
        approved:  { bg: 'bg-green-100',  text: 'text-green-700',  label: '✅ Approved' },
        rejected:  { bg: 'bg-red-100',    text: 'text-red-600',    label: '❌ Declined' },
        completed: { bg: 'bg-blue-100',   text: 'text-blue-600',   label: '✔ Completed' },
    };
    const c = map[status] || map.pending;
    return (
        <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${c.bg} ${c.text}`}>{c.label}</span>
            {isEmergency && <span className="text-[10px] font-black px-2 py-1 rounded-full bg-red-100 text-red-600">🚨 Emergency</span>}
        </div>
    );
};

/**
 * Appointments — Patient's view of all their appointment requests and statuses.
 */
const Appointments = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { appointments } = useAppointments();

    // Since the backend already filters by the logged-in user, we can use the list directly
    const mine = appointments;

    const pending   = mine.filter((a) => a.status === 'pending');
    const approved  = mine.filter((a) => a.status === 'approved');
    const rejected  = mine.filter((a) => a.status === 'rejected');
    const completed = mine.filter((a) => a.status === 'completed');

    const sections = [
        { title: 'Awaiting Doctor Approval', items: pending,  color: 'bg-yellow-400', empty: 'No pending requests.' },
        { title: 'Confirmed Appointments',   items: approved, color: 'bg-primary-green', empty: 'No confirmed appointments yet.' },
        { title: 'Declined',                 items: rejected, color: 'bg-red-400',    empty: null },
        { title: 'Completed',                items: completed,color: 'bg-gray-300',   empty: null },
    ].filter((s) => s.items.length > 0 || s.empty);

    return (
        <div className="app-container bg-bg-soft">
            <Navbar />
            <main className="content-area pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-10">
                        <span className="text-primary-green font-black uppercase tracking-[0.3em] text-[10px]">My Bookings</span>
                        <h1 className="text-3xl font-bold text-text-dark mt-2">My <span className="text-primary-green">Appointments</span></h1>
                    </div>

                    {mine.length === 0 ? (
                        <div className="bg-white rounded-3xl p-14 text-center border border-gray-100">
                            <div className="text-5xl mb-4">📋</div>
                            <h3 className="font-bold text-text-dark mb-2">No appointments yet</h3>
                            <p className="text-gray-400 text-sm mb-6">Browse our doctors and send a booking request.</p>
                            <button onClick={() => navigate('/doctors')} className="btn-primary-gradient text-white font-bold px-8 py-3 rounded-full">
                                Browse Doctors
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {sections.map(({ title, items, color, empty }) => (
                                <div key={title}>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                                        <h2 className="font-black text-text-dark">{title} {items.length > 0 && <span className="text-gray-400 font-normal text-sm">({items.length})</span>}</h2>
                                    </div>

                                    {items.length === 0 && empty ? (
                                        <p className="text-gray-400 text-sm italic pl-5">{empty}</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {items.map((appt) => (
                                                <div key={appt.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0">
                                                            <img
                                                                src={appt.doctorImage}
                                                                alt={appt.doctorName}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder-doctor.png'; }}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-text-dark">{appt.doctorName}</h3>
                                                            <p className="text-xs font-bold text-primary-green uppercase tracking-widest mb-2">{appt.specialty}</p>
                                                            <StatusBadge status={appt.status} isEmergency={appt.isEmergency} />

                                                            {/* Approved: show set date/time */}
                                                            {appt.status === 'approved' && appt.date && (
                                                                <div className="mt-3 flex items-center gap-3 text-sm font-bold text-text-dark bg-green-50 border border-green-100 rounded-xl px-4 py-2">
                                                                    <span>📅 {appt.date}</span>
                                                                    <span>·</span>
                                                                    <span>🕐 {appt.time}</span>
                                                                    <span>·</span>
                                                                    <span>{appt.type === 'video' ? '📹 Video' : '🏥 In-Person'}</span>
                                                                </div>
                                                            )}

                                                            {/* Pending: show submitted complaint */}
                                                            {appt.status === 'pending' && (
                                                                <p className="mt-2 text-xs text-gray-400">
                                                                    Submitted {new Date(appt.requestedAt).toLocaleDateString()} — waiting for the doctor to confirm your slot.
                                                                </p>
                                                            )}

                                                            {/* Rejected: show reason */}
                                                            {appt.status === 'rejected' && appt.rejectionReason && (
                                                                <div className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                                                                    <strong>Reason:</strong> {appt.rejectionReason}
                                                                </div>
                                                            )}

                                                            {/* Fee */}
                                                            <p className="text-[10px] text-gray-400 mt-2">Fee: ₹{appt.totalFee}</p>
                                                        </div>

                                                        {appt.status === 'approved' && (
                                                            <button
                                                                onClick={() => navigate(`/consultation/${appt.id}`)}
                                                                className="shrink-0 px-4 py-2 bg-primary-green text-white text-xs font-black rounded-xl hover:bg-secondary-green transition-all"
                                                            >
                                                                Join
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Appointments;
