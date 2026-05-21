import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPanel from '../components/consultation/VideoPanel';
import ChatBox from '../components/consultation/ChatBox';
import { useNotification } from '../context/NotificationContext';
import { useAppointments } from '../context/AppointmentsContext';
import { useDoctors } from '../context/DoctorsContext';
import { useSocket } from '../context/SocketContext';
import useWebRTC from '../hooks/useWebRTC';

// ConsultationRoom component — Patient side with real WebRTC video calling
const ConsultationRoom = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { doctors, loading: doctorsLoading } = useDoctors();
    const [doctor, setDoctor] = useState(null);
    const [appointment, setAppointment] = useState(null);

    const { appointments, completeAppointment, hasFetched } = useAppointments();

    // ── WebRTC: Patient is the initiator (creates the offer) ──────────────────
    const { socket, joinRoom } = useSocket();
    const webrtcRoomId = `appt-${appointmentId}`;

    const {
        localStream,
        remoteStream,
        toggleMic,
        toggleCamera,
        micOn,
        cameraOn,
        connectionState,
    } = useWebRTC({
        socket,
        roomId: webrtcRoomId,
        isInitiator: true,   // Patient creates the offer
        onRemoteHangup: () => {
            showNotification('The doctor has ended the call.', 'info');
            navigate('/my-treatments');
        }
    });

    // Join the socket room for WebRTC signaling
    useEffect(() => {
        if (socket && appointmentId) {
            joinRoom(webrtcRoomId);
        }
    }, [socket, appointmentId]);

    // Load appointment details and find corresponding doctor
    useEffect(() => {
        if (!hasFetched || doctorsLoading) return;

        const apt = appointments.find(a => a.id.toString() === appointmentId);
        if (apt) {
            setAppointment(apt);
            // Find doctor from context (supports both id and _id)
            const found = doctors.find(d =>
                d.id === apt.doctorId || d.id === apt.doctor?._id || d._id === apt.doctorId
            );
            setDoctor(found);
        } else {
            navigate('/appointments');
        }
    }, [appointmentId, navigate, appointments, doctors, hasFetched, doctorsLoading]);

    const handleEndCall = async () => {
        if (socket) {
            socket.emit('webrtc-hangup', { roomId: webrtcRoomId });
        }
        if (!appointment) return navigate('/appointments');
        await completeAppointment(appointment.id);
        showNotification('Consultation ended.', 'info');
        navigate('/my-treatments');
    };

    if (!hasFetched || doctorsLoading) {
        return (
            <div className="h-screen bg-bg-soft flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-bg-soft flex flex-col">
            {/* Header */}
            <div className="px-8 py-4 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">V</div>
                    <div>
                        <h2 className="text-md font-bold text-text-dark">Ongoing Consultation</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary-green rounded-full shadow-[0_0_8px_rgba(43,182,115,0.8)]" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Secure &amp; Encrypted</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-red-50 px-4 py-2 rounded-xl text-red-500 text-xs font-bold">
                        Emergency Contact: 911
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-0 p-6 flex gap-6 overflow-hidden">
                {/* Video Area */}
                <div className="flex-[2.5] flex flex-col h-full overflow-hidden">
                    <VideoPanel
                        remoteStream={remoteStream}
                        localStream={localStream}
                        connectionState={connectionState}
                        doctor={doctor}
                        isDoctor={false}
                    />

                    {/* Controls */}
                    <div className="mt-6 flex justify-center gap-6">
                        <button
                            onClick={toggleMic}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${micOn ? 'bg-white text-gray-400 hover:text-text-dark' : 'bg-red-500 text-white shadow-red-200'
                                }`}
                            title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
                        >
                            {micOn ? (
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
                            onClick={toggleCamera}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${cameraOn ? 'bg-white text-gray-400 hover:text-text-dark' : 'bg-red-500 text-white shadow-red-200'
                                }`}
                            title={cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleEndCall}
                            className="w-20 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all shadow-xl shadow-red-200"
                            title="End Call"
                        >
                            <svg className="w-7 h-7 transform rotate-[135deg]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <ChatBox roomId={appointmentId} asDoctor={false} />
                </div>
            </div>
        </div>
    );
};

export default ConsultationRoom;
