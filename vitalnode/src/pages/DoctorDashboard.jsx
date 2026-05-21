import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppointments } from '../context/AppointmentsContext';
import { useNotification } from '../context/NotificationContext';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import TreatmentOverview from '../components/dashboard/TreatmentOverview';

// ── Status badge helper ────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const map = {
        pending:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
        approved:  { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Approved' },
        rejected:  { bg: 'bg-red-100',    text: 'text-red-600',    label: 'Rejected' },
        completed: { bg: 'bg-blue-100',   text: 'text-blue-600',   label: 'Completed' },
    };
    const c = map[status] || map.pending;
    return <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${c.bg} ${c.text}`}>{c.label}</span>;
};

// ── Approval modal ─────────────────────────────────────────────────────────────
const ApproveModal = ({ appt, onConfirm, onClose }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fadeIn">
                <h3 className="text-xl font-black text-text-dark mb-1">Approve Appointment</h3>
                <p className="text-gray-400 text-sm mb-6">Set the date and time for <strong>{appt.patientName}</strong></p>

                {appt.isEmergency && (
                    <div className="mb-4 bg-red-50 border border-red-100 rounded-2xl p-3 text-xs text-red-700 font-bold flex items-center gap-2">
                        🚨 Emergency request — please prioritise this patient
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                        <input
                            type="date"
                            min={today}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-green"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-green"
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
                    <button
                        onClick={() => { if (date && time) onConfirm(date, time); }}
                        disabled={!date || !time}
                        className="flex-2 py-3 px-6 bg-primary-green text-white rounded-2xl font-bold shadow-lg shadow-primary-green/20 hover:bg-secondary-green transition-all disabled:opacity-50"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

// ── Reject modal ───────────────────────────────────────────────────────────────
const RejectModal = ({ appt, onConfirm, onClose }) => {
    const [reason, setReason] = useState('');
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fadeIn">
                <h3 className="text-xl font-black text-text-dark mb-1">Decline Request</h3>
                <p className="text-gray-400 text-sm mb-6">Optionally provide a reason for <strong>{appt.patientName}</strong></p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Not available on requested dates."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 min-h-[100px] resize-none"
                />
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
                    <button onClick={() => onConfirm(reason)} className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all">Decline</button>
                </div>
            </div>
        </div>
    );
};

// ── Edit Profile Modal ─────────────────────────────────────────────────────────
const EditProfileModal = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        specialty: user?.specialty || 'General Physician',
        location: user?.location || 'New York, USA',
        dob: user?.dob || '1986-07-17',
        bloodGroup: user?.bloodGroup || 'A(II) Rh+',
        workingHours: user?.workingHours || '9am - 5pm'
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fadeIn">
                <h3 className="text-xl font-black text-text-dark mb-6">Edit Profile</h3>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-text-dark focus:ring-2 focus:ring-primary-green" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Specialty</label>
                            <input name="specialty" value={formData.specialty} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-text-dark focus:ring-2 focus:ring-primary-green" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</label>
                        <input name="location" value={formData.location} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-text-dark focus:ring-2 focus:ring-primary-green" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Date of Birth</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-text-dark focus:ring-2 focus:ring-primary-green" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Blood Type</label>
                            <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-text-dark focus:ring-2 focus:ring-primary-green" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Working Hours</label>
                            <input name="workingHours" value={formData.workingHours} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-text-dark focus:ring-2 focus:ring-primary-green" />
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50">Cancel</button>
                    <button onClick={() => onSave(formData)} className="flex-1 py-3 bg-primary-green text-white rounded-2xl font-bold shadow-lg shadow-primary-green/20">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

// ── Add Plan Modal ─────────────────────────────────────────────────────────────
const AddPlanModal = ({ onSave, onClose }) => {
    const [title, setTitle] = useState('');
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fadeIn">
                <h3 className="text-xl font-black text-text-dark mb-4">Add Quick Plan</h3>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Call lab for results" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-text-dark focus:ring-2 focus:ring-primary-green mb-6" 
                />
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-500">Cancel</button>
                    <button onClick={() => { if(title) onSave(title); }} className="flex-1 py-3 bg-primary-green text-white rounded-xl font-bold">Add</button>
                </div>
            </div>
        </div>
    );
};

// ── Circular Progress Chart ────────────────────────────────────────────────────
const CircularProgress = ({ percentage }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r={radius} className="stroke-gray-100" strokeWidth="12" fill="none" />
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-primary-green transition-all duration-1000 ease-out"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    fill="none"
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-text-dark">{percentage}%</span>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Busyness</span>
            </div>
        </div>
    );
};

// ── Main DoctorDashboard ──────────────────────────────────────────────────────
const DoctorDashboard = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { showNotification } = useNotification();
    const { appointments, approveAppointment, rejectAppointment } = useAppointments();

    const [approveTarget, setApproveTarget] = useState(null);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    
    // New States for Interactivity
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showAddPlan, setShowAddPlan] = useState(false);
    const [scheduleFilter, setScheduleFilter] = useState('today'); // 'today', 'tomorrow', 'week'
    const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Refs for scrolling
    const pendingRef = useRef(null);
    const scheduleRef = useRef(null);
    const patientsRef = useRef(null);
    const profileRef = useRef(null);

    const scrollToRef = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Hash-based auto-scroll for sidebar links
    useEffect(() => {
        const hash = location.hash;
        if (hash === '#schedule') scrollToRef(scheduleRef);
        else if (hash === '#patients') scrollToRef(patientsRef);
        else if (hash === '#profile') scrollToRef(profileRef);
    }, [location.hash]);

    // Filter appointments
    const pending   = appointments.filter((a) => a.status === 'pending');
    const approved  = appointments.filter((a) => a.status === 'approved');
    const completed = appointments.filter((a) => a.status === 'completed');

    // Active patients
    const activePatients = Array.from(
        new Map([...approved, ...completed].map((a) => [a.patient?._id || a.patient, a])).values()
    );

    const handleApprove = (date, time) => {
        approveAppointment(approveTarget.id, { date, time });
        showNotification(`Appointment confirmed for ${approveTarget.patientName}`, 'success');
        setApproveTarget(null);
    };

    const handleReject = (reason) => {
        rejectAppointment(rejectTarget.id, reason);
        showNotification(`Request from ${rejectTarget.patientName} declined`, 'info');
        setRejectTarget(null);
    };

    const handleSaveProfile = (data) => {
        updateProfile(data);
        setShowEditProfile(false);
        showNotification('Profile updated successfully', 'success');
    };

    const notifications = pending.map(p => ({
        id: p.id,
        title: 'New Request',
        desc: `Appointment requested by ${p.patientName}`,
        time: new Date(p.requestedAt).toLocaleDateString(),
        type: p.isEmergency ? 'urgent' : 'new'
    }));

    // Date Logic
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Schedule Filter Logic (Busyness Chart)
    let filteredAppointments = [];
    let maxAppointments = 10;
    if (scheduleFilter === 'today') {
        filteredAppointments = approved.filter(a => a.date === todayStr);
    } else if (scheduleFilter === 'tomorrow') {
        filteredAppointments = approved.filter(a => a.date === tomorrowStr);
    } else {
        filteredAppointments = approved.filter(a => new Date(a.date) >= today && new Date(a.date) <= nextWeek);
        maxAppointments = 50; // Arbitrary max for a week
    }
    const busynessPercentage = Math.min(100, Math.round((filteredAppointments.length / maxAppointments) * 100));

    // Calendar Selection Logic
    const selectedDayAppointments = approved.filter(a => a.date === selectedCalendarDate);

    // Plans Done Logic
    const totalConsultations = approved.length + completed.length;
    const totalRequests = pending.length;
    const totalAll = totalConsultations + totalRequests || 1; 

    const consultationPct = Math.round((totalConsultations / totalAll) * 100);
    const pendingPct = Math.round((totalRequests / totalAll) * 100);
    const completedPct = Math.round((completed.length / totalAll) * 100);

    return (
        <div className="min-h-screen bg-bg-soft flex flex-col md:flex-row overflow-hidden p-2 sm:p-4 md:p-6 gap-2 sm:gap-4 md:gap-6">
            <DashboardSidebar />

            <main className="flex-1 bg-white rounded-[24px] md:rounded-[40px] shadow-sm overflow-y-auto h-full flex flex-col xl:flex-row">
                
                {/* ── Center Content Area ── */}
                <div className="flex-1 p-4 sm:p-6 lg:p-12 border-b xl:border-b-0 xl:border-r border-gray-50 w-full overflow-hidden">
                    
                    {/* Top Header */}
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div className="relative w-full sm:w-96">
                            <input 
                                type="text" 
                                placeholder="Search for events, patients etc." 
                                className="w-full bg-gray-50 border border-gray-100 rounded-full py-3 px-12 text-sm font-bold text-text-dark focus:outline-none focus:border-primary-green focus:bg-white transition-all"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:text-primary-green transition-all relative"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                                {notifications.length > 0 && !showNotifications && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>}
                            </button>
                            <button className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50 text-gray-400 hover:text-primary-green transition-all">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute top-24 right-[400px] mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-50 z-50 overflow-hidden animate-fadeInUp">
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-bold text-text-dark">Notifications</h3>
                                <span className="text-[10px] font-black text-primary-green bg-primary-green/5 px-2 py-1 rounded-lg uppercase tracking-widest">{notifications.length} New</span>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map(n => (
                                    <div key={n.id} className="p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                                        <div className="flex gap-4">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === 'urgent' ? 'bg-red-500' : 'bg-primary-green'}`} />
                                            <div>
                                                <h4 className="text-sm font-bold text-text-dark group-hover:text-primary-green transition-colors">{n.title}</h4>
                                                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{n.desc}</p>
                                                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest mt-2 block">{n.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : <p className="p-5 text-sm text-gray-400">No new notifications.</p>}
                            </div>
                        </div>
                    )}

                    {/* Hero Banner */}
                    <div className="bg-primary-green rounded-[32px] p-8 mb-8 text-white relative overflow-hidden flex justify-between items-center shadow-lg shadow-primary-green/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-green to-[#239961] opacity-90"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 400 200" fill="none"><path d="M0 100 C 100 0, 300 200, 400 100" stroke="white" strokeWidth="2" fill="none"/><circle cx="350" cy="50" r="10" fill="white"/><rect x="250" y="150" width="20" height="20" rx="4" fill="white"/></svg>
                        </div>
                        <div className="relative z-10">
                            <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold mb-4 flex items-center gap-2 w-max">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <h1 className="text-4xl font-bold mb-2 tracking-tight">Good Day, {user?.name || 'Doctor'}!</h1>
                            <p className="text-white/80 font-medium">Have a nice {today.toLocaleDateString('en-US', { weekday: 'long' })}!</p>
                        </div>
                        <div className="relative z-10 hidden md:block">
                            <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/20 overflow-hidden">
                                {user?.profileImage ? (
                                    <img 
                                        src={user.profileImage} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '';
                                            e.target.classList.add('hidden');
                                            const fallback = e.target.parentElement.querySelector('.emoji-fallback');
                                            if (fallback) fallback.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <span className={`text-6xl emoji-fallback ${user?.profileImage ? 'hidden' : ''}`}>👨‍⚕️</span>
                            </div>
                        </div>
                    </div>

                    {/* 3 Stats Cards Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Pending Requests Card */}
                        <div onClick={() => scrollToRef(pendingRef)} className="border border-gray-100 rounded-3xl p-6 flex flex-col justify-between hover:border-yellow-200 cursor-pointer transition-colors bg-white shadow-sm hover:-translate-y-1">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Requests</span>
                                <span className="text-gray-300">...</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-4xl font-black text-text-dark mb-1">{pending.length}</div>
                                    <div className="text-xs text-yellow-500 font-bold">New requests</div>
                                </div>
                                <div className="w-16 h-8">
                                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M0 20 Q 25 40, 50 20 T 100 20" stroke="#f59e0b" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
                                </div>
                            </div>
                        </div>

                        {/* Approved Consultations Card */}
                        <div onClick={() => scrollToRef(scheduleRef)} className="border border-gray-100 rounded-3xl p-6 flex flex-col justify-between hover:border-primary-green/30 cursor-pointer transition-colors bg-white shadow-sm hover:-translate-y-1">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scheduled Consults</span>
                                <span className="text-gray-300">...</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-4xl font-black text-text-dark mb-1">{approved.length}</div>
                                    <div className="text-xs text-primary-green font-bold">Confirmed</div>
                                </div>
                                <div className="w-16 h-8">
                                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M0 30 Q 25 10, 50 20 T 100 5" stroke="#2BB673" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
                                </div>
                            </div>
                        </div>

                        {/* Total Patients Card */}
                        <div onClick={() => scrollToRef(patientsRef)} className="border border-gray-100 rounded-3xl p-6 flex flex-col justify-between hover:border-blue-200 cursor-pointer transition-colors bg-white shadow-sm hover:-translate-y-1">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Patients</span>
                                <span className="text-gray-300">...</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-4xl font-black text-text-dark mb-1">{activePatients.length}</div>
                                    <div className="text-xs text-blue-500 font-bold">Active cases</div>
                                </div>
                                <div className="w-16 h-8">
                                    <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M0 20 L 100 20" stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round"/></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Busyness Chart */}
                        <div className="border border-gray-100 rounded-3xl p-8 bg-white shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">My Scheduled Events</span>
                                <select 
                                    value={scheduleFilter} 
                                    onChange={(e) => setScheduleFilter(e.target.value)} 
                                    className="bg-primary-green/10 text-primary-green px-3 py-1 rounded-lg text-xs font-bold outline-none cursor-pointer"
                                >
                                    <option value="today">Today</option>
                                    <option value="tomorrow">Tomorrow</option>
                                    <option value="week">This Week</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-8">
                                <CircularProgress percentage={busynessPercentage} />
                                <div>
                                    <div className="mb-4">
                                        <div className="text-2xl font-black text-text-dark">{filteredAppointments.length}</div>
                                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Consultations</div>
                                    </div>
                                    <div className="mb-4">
                                        <div className="text-2xl font-black text-text-dark">0</div>
                                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Laboratory Analyzes</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Plans Done */}
                        <div className="border border-gray-100 rounded-3xl p-8 bg-white shadow-sm flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-8">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">My Plans Done</span>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-text-dark">Consultations</span>
                                        <span className="text-gray-400">{consultationPct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-primary-green h-1.5 rounded-full transition-all duration-1000" style={{ width: `${consultationPct}%` }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-text-dark">Pending Requests</span>
                                        <span className="text-gray-400">{pendingPct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-yellow-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${pendingPct}%` }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-text-dark">Completed</span>
                                        <span className="text-gray-400">{completedPct}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-blue-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${completedPct}%` }}></div></div>
                                </div>
                            </div>
                            <button onClick={() => setShowAddPlan(true)} className="mt-6 w-full border border-dashed border-primary-green text-primary-green font-bold text-sm py-3 rounded-2xl hover:bg-primary-green/5 transition-colors">
                                Add plan +
                            </button>
                        </div>
                    </div>

                    {/* Pending Requests List Section */}
                    <div ref={pendingRef} className="pt-4">
                        {pending.length > 0 && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" /> Pending Requests
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pending.map(appt => (
                                        <div key={appt.id} className="border border-yellow-200 bg-yellow-50/30 rounded-2xl p-5">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 bg-yellow-200 text-yellow-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                                                    {appt.patientName?.[0] || 'P'}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-text-dark">{appt.patientName}</h4>
                                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">{appt.type === 'video' ? 'Video Call' : 'In-Person'}</span>
                                                </div>
                                                {appt.isEmergency && <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">🚨 Emergency</span>}
                                            </div>
                                            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{appt.problem}</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => setApproveTarget(appt)} className="flex-1 bg-primary-green text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-xl hover:bg-secondary-green transition-all shadow-md shadow-primary-green/20">Approve</button>
                                                <button onClick={() => setRejectTarget(appt)} className="flex-1 bg-red-100 text-red-500 text-[10px] font-black uppercase tracking-widest py-2 rounded-xl hover:bg-red-200 transition-all">Decline</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Consultations Section */}
                    <div className="pt-12">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-text-dark flex items-center gap-2">
                                <div className="w-2 h-2 bg-primary-green rounded-full" /> Upcoming Consultations
                            </h3>
                        </div>
                        {approved.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {approved.map(appt => (
                                    <div key={appt.id} className="border border-gray-100 bg-white rounded-2xl p-5 shadow-sm hover:border-primary-green/30 transition-all flex flex-col">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-primary-green/10 text-primary-green rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                                                {appt.patientName?.[0] || 'P'}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-text-dark">{appt.patientName}</h4>
                                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{appt.type === 'video' ? 'Video Call' : 'In-Person'}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{appt.problem}</p>
                                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-bold text-text-dark">
                                                <svg className="w-4 h-4 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                {new Date(appt.date).toLocaleDateString()} at {appt.time}
                                            </div>
                                            <button onClick={() => navigate(`/doctor-consultation/${appt.id}`)} className="bg-primary-green text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-secondary-green transition-all shadow-md shadow-primary-green/20">
                                                Join
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-8 text-center">
                                <p className="text-sm text-gray-400 font-medium">No upcoming consultations.</p>
                            </div>
                        )}
                    </div>

                    {/* Active Patients & Treatment Timeline */}
                    <div ref={patientsRef} className="pt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <h3 className="text-lg font-bold text-text-dark">Active Patients & Treatment Timeline</h3>
                        </div>
                        <TreatmentOverview fullPage={false} />
                    </div>

                </div>

                {/* ── Right Sidebar Area ── */}
                <div ref={scheduleRef} className="w-full xl:w-96 p-8 lg:p-12 bg-gray-50/50 flex flex-col gap-8 shrink-0">
                    
                    {/* Profile Card */}
                    <div ref={profileRef} className="bg-primary-green rounded-[32px] p-6 text-white shadow-xl shadow-primary-green/20">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-bold tracking-widest uppercase text-white/80">My Profile</span>
                            <button onClick={() => setShowEditProfile(true)} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary-green font-black text-2xl shadow-inner overflow-hidden border-2 border-white/20">
                                {user?.profileImage ? (
                                    <img 
                                        src={user.profileImage} 
                                        alt={user.name} 
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '';
                                            e.target.classList.add('hidden');
                                            const fallback = e.target.parentElement.querySelector('.initials-fallback');
                                            if (fallback) fallback.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <span className={`initials-fallback ${user?.profileImage ? 'hidden' : ''}`}>
                                    {(user?.name?.[0] || 'D').toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{user?.name || 'Doctor'}</h3>
                                <div className="text-[10px] text-white/70 font-black uppercase tracking-widest mb-1">{user?.specialty || 'General Physician'}</div>
                                <div className="text-xs text-white/90 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {user?.location || 'New York, USA'}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 border-t border-white/20 pt-4 mt-2">
                            <div>
                                <div className="text-[9px] text-white/60 font-bold uppercase tracking-widest mb-1">Date Birth</div>
                                <div className="text-xs font-bold">{user?.dob ? new Date(user.dob).toLocaleDateString('en-GB') : '17.07.86'}</div>
                            </div>
                            <div>
                                <div className="text-[9px] text-white/60 font-bold uppercase tracking-widest mb-1">Blood</div>
                                <div className="text-xs font-bold">{user?.bloodGroup || 'A(II) Rh+'}</div>
                            </div>
                            <div>
                                <div className="text-[9px] text-white/60 font-bold uppercase tracking-widest mb-1">Working Hours</div>
                                <div className="text-xs font-bold">{user?.workingHours || '9am - 5pm'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Header */}
                    <div className="bg-primary-green rounded-2xl p-5 text-white flex justify-between items-center shadow-lg shadow-primary-green/20">
                        <span className="text-xs font-bold tracking-widest uppercase">My Calendar</span>
                        <div className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer">
                            {today.toLocaleDateString('en-US', { month: 'long' })} ▾
                        </div>
                    </div>

                    {/* Days Row */}
                    <div className="flex justify-between items-center px-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
                            // Calculate dates for the current week starting from Sunday
                            const curr = new Date(today);
                            const first = curr.getDate() - curr.getDay() + idx;
                            const dayDate = new Date(curr.setDate(first));
                            const dayStr = dayDate.toISOString().split('T')[0];
                            
                            const isSelected = selectedCalendarDate === dayStr;
                            
                            return (
                                <div 
                                    key={day} 
                                    onClick={() => setSelectedCalendarDate(dayStr)}
                                    className={`flex flex-col items-center gap-2 p-2 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-primary-green text-white shadow-lg shadow-primary-green/20' : 'text-gray-400 hover:bg-gray-100 hover:text-text-dark'}`}
                                >
                                    <span className="text-[10px] font-bold uppercase">{day}</span>
                                    <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-text-dark'}`}>{dayDate.getDate()}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Schedule Timeline */}
                    <div className="flex-1 mt-2 relative">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400">
                                {new Date(selectedCalendarDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase()}
                            </h4>
                            <span className="text-gray-300">...</span>
                        </div>
                        
                        <div className="space-y-6">
                            {selectedDayAppointments.length > 0 ? selectedDayAppointments.sort((a,b) => a.time.localeCompare(b.time)).map((appt, i) => (
                                <div key={appt.id} className="relative flex gap-4 group">
                                    {/* Timeline line */}
                                    {i !== selectedDayAppointments.length - 1 && <div className="absolute left-[19px] top-6 bottom-[-24px] w-0.5 bg-gray-100 group-hover:bg-primary-green/30 transition-colors"></div>}
                                    
                                    <div className="text-[10px] font-black text-gray-400 w-12 pt-1">{appt.time}</div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary-green mt-1.5 shrink-0 z-10 shadow-[0_0_0_4px_#f9fafb]"></div>
                                    <div className="flex-1 border-b border-dashed border-gray-200 pb-4 group-hover:border-primary-green transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <h5 className="text-sm font-bold text-text-dark group-hover:text-primary-green transition-colors">Consultation with {appt.patientName}</h5>
                                            <button 
                                                onClick={() => navigate(`/doctor-consultation/${appt.id}`)}
                                                className="bg-primary-green/10 text-primary-green text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-primary-green hover:text-white transition-all shadow-sm"
                                            >
                                                Join
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400 line-clamp-1">{appt.problem}</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <p className="text-sm text-gray-400 font-bold mb-2">No events scheduled for this day</p>
                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto text-2xl">☕</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </main>

            {/* ── Modals ── */}
            {approveTarget && (
                <ApproveModal
                    appt={approveTarget}
                    onConfirm={handleApprove}
                    onClose={() => setApproveTarget(null)}
                />
            )}
            {rejectTarget && (
                <RejectModal
                    appt={rejectTarget}
                    onConfirm={handleReject}
                    onClose={() => setRejectTarget(null)}
                />
            )}
            {showEditProfile && (
                <EditProfileModal 
                    user={user} 
                    onSave={handleSaveProfile} 
                    onClose={() => setShowEditProfile(false)} 
                />
            )}
            {showAddPlan && (
                <AddPlanModal 
                    onSave={(title) => { showNotification(`Plan added: ${title}`, 'success'); setShowAddPlan(false); }} 
                    onClose={() => setShowAddPlan(false)} 
                />
            )}
        </div>
    );
};

export default DoctorDashboard;
