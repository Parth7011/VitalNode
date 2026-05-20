import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPanel from '../components/consultation/VideoPanel';
import ChatBox from '../components/consultation/ChatBox';
import { useNotification } from '../context/NotificationContext';
import { useAppointments } from '../context/AppointmentsContext';
import { useAuth } from '../context/AuthContext';

/**
 * DoctorConsultationRoom — the doctor's side of the live consultation.
 * Shares the same appointment ID room as the patient's ConsultationRoom,
 * enabling real-time Socket.io chat between both parties.
 */
const DoctorConsultationRoom = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { user } = useAuth();
    const { appointments, completeAppointment } = useAppointments();
    const [appointment, setAppointment] = useState(null);
    const [controls, setControls] = useState({ mic: true, camera: true });

    useEffect(() => {
        const apt = appointments.find((a) => a.id.toString() === appointmentId);
        if (apt) {
            setAppointment(apt);
        } else {
            navigate('/doctor-dashboard');
        }
    }, [appointmentId, appointments, navigate]);

    const handleEndCall = () => {
        if (!appointment) return navigate('/doctor-dashboard');
        completeAppointment(parseInt(appointmentId));
        showNotification('Consultation session ended. Appointment marked complete.', 'success');
        navigate('/doctor-dashboard');
    };

    // Simulated doctor video (avatar panel)
    const doctorAsPanel = {
        name: user?.name || 'Doctor',
        specialty: 'Consulting',
        image: null,
    };

    return (
        <div className="h-screen bg-bg-soft flex flex-col">
            {/* Header */}
            <div className="px-8 py-4 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                        V
                    </div>
                    <div>
                        <h2 className="text-md font-bold text-text-dark">Doctor Console</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary-green rounded-full shadow-[0_0_8px_rgba(43,182,115,0.8)] animate-pulse" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                Live Session · {appointment?.patientName || 'Patient'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {appointment?.isEmergency && (
                        <div className="bg-red-50 px-4 py-2 rounded-xl text-red-500 text-xs font-bold flex items-center gap-2">
                            🚨 Emergency
                        </div>
                    )}
                    <div className="bg-gray-50 px-4 py-2 rounded-xl text-gray-500 text-xs font-bold">
                        Room: appt-{appointmentId}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 p-6 flex gap-6 overflow-hidden">
                {/* Video Area */}
                <div className="flex-[2.5] flex flex-col h-full overflow-hidden">
                    <VideoPanel doctor={doctorAsPanel} />

                    {/* Patient Info Card */}
                    {appointment && (
                        <div className="mt-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary-green/10 flex items-center justify-center font-black text-primary-green text-lg">
                                {appointment.patientName?.[0] || 'P'}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-text-dark text-sm">{appointment.patientName}</p>
                                <p className="text-xs text-gray-400 font-bold">{appointment.reason}</p>
                            </div>
                            {appointment.isEmergency && (
                                <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                    Emergency
                                </span>
                            )}
                        </div>
                    )}

                    {/* Controls */}
                    <div className="mt-4 flex justify-center gap-6">
                        <button
                            onClick={() => setControls((prev) => ({ ...prev, mic: !prev.mic }))}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                                controls.mic ? 'bg-white text-gray-400 hover:text-text-dark' : 'bg-red-500 text-white shadow-red-200'
                            }`}
                            title={controls.mic ? 'Mute' : 'Unmute'}
                        >
                            {controls.mic ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={() => setControls((prev) => ({ ...prev, camera: !prev.camera }))}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                                controls.camera ? 'bg-white text-gray-400 hover:text-text-dark' : 'bg-red-500 text-white shadow-red-200'
                            }`}
                            title={controls.camera ? 'Turn off camera' : 'Turn on camera'}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>

                        <button
                            onClick={handleEndCall}
                            className="w-20 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all shadow-xl shadow-red-200"
                            title="End Session"
                        >
                            <svg className="w-7 h-7 transform rotate-[135deg]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Chat Area — Socket.io, asDoctor=true */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <ChatBox roomId={appointmentId} asDoctor={true} />
                </div>
            </div>
        </div>
    );
};

export default DoctorConsultationRoom;
