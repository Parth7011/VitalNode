import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppointments } from '../context/AppointmentsContext';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { useNotification } from '../context/NotificationContext';
import SmartRecommendation from '../components/dashboard/SmartRecommendation';
import TreatmentOverview from '../components/dashboard/TreatmentOverview';

const StatusBadge = ({ status }) => {
    const map = {
        pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
        approved:  { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Approved' },
        rejected:  { bg: 'bg-red-100',    text: 'text-red-600',    label: 'Rejected' },
        completed: { bg: 'bg-blue-100',   text: 'text-blue-600',   label: 'Completed' },
        cancelled: { bg: 'bg-gray-100',   text: 'text-gray-500',   label: 'Cancelled' }
    };
    const c = map[status] || map.pending;
    return <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${c.bg} ${c.text}`}>{c.label}</span>;
};

// PatientDashboard component serves as the main hub for patient users to manage their health
const PatientDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { getPatientAppointments, cancelAppointment } = useAppointments();

    // Fetch appointments securely via context
    const patientAppointments = getPatientAppointments(user?.id || user?.email);

    // State to toggle the visibility of the notifications dropdown
    const [showNotifications, setShowNotifications] = useState(false);

    // Mock notification data for demonstration purposes
    const notifications = [
        { id: 1, title: 'Welcome to VitalNode', desc: 'Securely manage your healthcare sessions.', time: 'Just now', type: 'info' },
        { id: 2, title: 'Session Reminder', desc: 'Your consultation with Dr. Johnson is in 1 hour.', time: '1h ago', type: 'urgent' },
        { id: 3, title: 'Platform Update', desc: 'New dental specialists are now available.', time: '5h ago', type: 'new' }
    ];

    // Function to handle appointment cancellation
    const handleCancel = (id) => {
        cancelAppointment(id);
        showNotification('Appointment cancelled successfully', 'success');
    };

    // Filter appointments into upcoming and past categories
    const upcoming = patientAppointments.filter(a => a.status === 'pending' || a.status === 'approved');
    const past = patientAppointments.filter(a => a.status === 'past' || a.status === 'completed' || a.status === 'rejected' || a.status === 'cancelled');

    return (
        <div className="min-h-screen bg-bg-soft flex overflow-hidden">
            <DashboardSidebar />

            <main className="flex-1 overflow-y-auto h-screen p-8 lg:p-12">
                <div className="max-w-6xl mx-auto">
                    {/* Top Header */}
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <span className="text-primary-green font-black uppercase tracking-[0.3em] text-[10px]">Welcome Back</span>
                            <h1 className="text-3xl font-bold text-text-dark mt-1">Hello, <span className="text-primary-green">{user?.name}</span> 👋</h1>
                        </div>
                        <div className="flex items-center gap-4 relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border relative ${showNotifications ? 'bg-primary-green text-white border-primary-green shadow-lg shadow-primary-green/20' : 'bg-white text-gray-400 hover:text-primary-green border-gray-100 shadow-sm'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                {!showNotifications && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-3xl shadow-2xl border border-gray-50 z-50 overflow-hidden animate-fadeInUp">
                                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                        <h3 className="font-bold text-text-dark">Notifications</h3>
                                        <span className="text-[10px] font-black text-primary-green bg-primary-green/5 px-2 py-1 rounded-lg uppercase tracking-widest">{notifications.length} New</span>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map(n => (
                                            <div key={n.id} className="p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                                                <div className="flex gap-4">
                                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'urgent' ? 'bg-red-500' : n.type === 'new' ? 'bg-primary-green' : 'bg-blue-500'
                                                        }`} />
                                                    <div>
                                                        <h4 className="text-sm font-bold text-text-dark group-hover:text-primary-green transition-colors">{n.title}</h4>
                                                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{n.desc}</p>
                                                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-2 block">{n.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] hover:bg-gray-50 transition-colors">Mark all as read</button>
                                </div>
                            )}

                            <div className="w-12 h-12 bg-primary-green rounded-2xl overflow-hidden shadow-lg border-2 border-white shadow-primary-green/20">
                                <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=2BB673&color=fff`} alt="Profile" />
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <QuickAction
                            title="Find Doctor"
                            desc="Browse all specialists"
                            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />}
                            onClick={() => navigate('/doctors')}
                        />
                        <QuickAction
                            title="Book Appointment"
                            desc="Schedule a new session"
                            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />}
                            onClick={() => navigate('/doctors')}
                            primary
                        />
                        <QuickAction
                            title="View Appointments"
                            desc="Manage your schedule"
                            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                            onClick={() => navigate('/appointments')}
                        />
                        <QuickAction
                            title="Prescriptions"
                            desc="View medical records"
                            icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                            onClick={() => navigate('/prescription')}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column: Appointments */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Upcoming */}
                            <section>
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse" />
                                        <h2 className="text-xl font-bold text-text-dark">Upcoming Appointments</h2>
                                    </div>
                                </div>

                                {upcoming.length > 0 ? (
                                    <div className="space-y-4">
                                        {upcoming.map(app => (
                                            <div key={app.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow group">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm shrink-0">
                                                    <img src={app.doctorImage} alt={app.doctorName} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-text-dark">{app.doctorName}</h3>
                                                    <p className="text-xs font-bold text-primary-green uppercase tracking-widest leading-none mb-1">{app.specialty}</p>
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <StatusBadge status={app.status} />
                                                        {app.status === 'approved' ? (
                                                            <>
                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">{app.date}</span>
                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg">{app.time}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg italic">Waiting for Doctor...</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    {app.status === 'approved' && (
                                                        <button
                                                            onClick={() => navigate(`/consultation/${app.id}`)}
                                                            className="px-6 py-2.5 bg-primary-green text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary-green/20 hover:scale-105 transition-all"
                                                        >
                                                            Join
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleCancel(app.id)}
                                                        className="px-4 py-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                                        <p className="text-gray-400 font-medium">No upcoming consultations.</p>
                                        <button onClick={() => navigate('/doctors')} className="mt-4 text-primary-green font-black uppercase tracking-widest text-[10px] hover:underline">Book Your First Session</button>
                                    </div>
                                )}
                            </section>

                            {/* History */}
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                    <h2 className="text-xl font-bold text-text-dark opacity-60">Recent History</h2>
                                </div>
                                {past.length > 0 ? (
                                    <div className="space-y-4 opacity-60">
                                        {past.map(app => (
                                            <div key={app.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 grayscale">
                                                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm shrink-0">
                                                    <img src={app.doctorImage} alt={app.doctorName} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-text-dark">{app.doctorName}</h3>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{app.specialty}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{app.date || app.status}</p>
                                                </div>
                                                <StatusBadge status={app.status} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm italic py-4">No past records found.</p>
                                )}
                            </section>
                        </div>

                        {/* Right Column: Profile Summary & Tips */}
                        <div className="space-y-8">
                            {/* Profile Status */}
                            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-green/5 rounded-bl-[80px] group-hover:bg-primary-green/10 transition-colors" />
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-text-dark">Profile Details</h3>
                                    <button
                                        onClick={() => navigate('/profile-setup')}
                                        className="text-[10px] font-black text-primary-green uppercase tracking-widest hover:underline"
                                    >
                                        Edit
                                    </button>
                                </div>
                                {user?.vitals && Object.values(user.vitals).some(v => v) ? (
                                    <div className="space-y-4 mb-6 relative z-10">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Weight:</span>
                                            <span className="font-bold">{user?.vitals?.weight ? `${user.vitals.weight} kg` : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Height:</span>
                                            <span className="font-bold">{user?.vitals?.height ? `${user.vitals.height} cm` : 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Blood Group:</span>
                                            <span className="font-bold">{user?.vitals?.bloodGroup || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Conditions:</span>
                                            <span className="font-bold truncate max-w-[120px] text-right" title={user?.vitals?.previousDiseases}>{user?.vitals?.previousDiseases || 'None'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Meds:</span>
                                            <span className="font-bold truncate max-w-[120px] text-right" title={user?.vitals?.currentMedications}>{user?.vitals?.currentMedications || 'None'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Allergies:</span>
                                            <span className="font-bold truncate max-w-[120px] text-right" title={user?.vitals?.allergies}>{user?.vitals?.allergies || 'None'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 relative z-10">
                                        <div className="w-14 h-14 bg-primary-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-7 h-7 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-gray-400 text-sm font-medium mb-3">Complete your health profile for a better experience</p>
                                        <button
                                            onClick={() => navigate('/profile-setup')}
                                            className="px-6 py-2.5 bg-primary-green text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary-green/20 hover:scale-105 transition-all"
                                        >
                                            Complete Profile
                                        </button>
                                    </div>
                                )}
                                <div className="mt-8 pt-8 border-t border-gray-50">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Profile Completion</p>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-green rounded-full transition-all duration-500" style={{ width: user?.profileComplete ? '100%' : '40%' }} />
                                    </div>
                                </div>
                            </div>

                            <SmartRecommendation />

                            {/* Health Tip */}
                            <div className="bg-primary-green p-8 rounded-[40px] text-white relative group overflow-hidden shadow-xl shadow-primary-green/10">
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                                <div className="relative z-10">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold mb-2">Daily Insight</h3>
                                    <p className="text-white/80 text-sm leading-relaxed">Stay hydrated! Drinking enough water can improve your energy levels and brain function significantly.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Treatment Overview - Full width section */}
                    <TreatmentOverview />
                </div>
            </main>
        </div>
    );
};

// Reusable component for quick action buttons on the dashboard
const QuickAction = ({ title, desc, icon, onClick, primary }) => (
    <button
        onClick={onClick}
        className={`p-6 rounded-[32px] border flex flex-col items-start transition-all text-left group hover:-translate-y-1 shadow-sm hover:shadow-lg ${primary
            ? 'bg-primary-green border-primary-green text-white shadow-primary-green/20'
            : 'bg-white border-gray-100 text-text-dark hover:border-primary-green/30'
            }`}
    >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${primary ? 'bg-white/20' : 'bg-gray-50 text-primary-green group-hover:bg-primary-green group-hover:text-white'
            }`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {icon}
            </svg>
        </div>
        <h3 className="font-bold text-lg leading-tight">{title}</h3>
        <p className={`text-xs mt-1 font-medium ${primary ? 'text-white/70' : 'text-gray-400'}`}>{desc}</p>
    </button>
);

// Reusable component for displaying completion steps in the profile health section
const ProfileStep = ({ label, completed }) => (
    <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${completed ? 'bg-primary-green border-primary-green text-white' : 'border-gray-100'
            }`}>
            {completed && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
            )}
        </div>
        <span className={`text-sm font-bold ${completed ? 'text-text-dark' : 'text-gray-300'}`}>{label}</span>
    </div>
);

export default PatientDashboard;
