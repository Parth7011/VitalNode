import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPanel from '../components/consultation/VideoPanel';
import ChatBox from '../components/consultation/ChatBox';
import { doctors } from '../data/doctors';
import { useNotification } from '../context/NotificationContext';
import { useAppointments } from '../context/AppointmentsContext';

// Simulated doctor responses based on specialty
const doctorResponses = {
    'Cardiology': {
        condition: 'Hypertension Management',
        medicines: ['Amlodipine 5mg (once daily)', 'Losartan 50mg (once daily)'],
        notes: 'Blood pressure slightly elevated. Continue medication and follow a low-sodium diet. Monitor BP twice daily.',
        observation: 'improvement',
    },
    'Neurology': {
        condition: 'Chronic Migraine Treatment',
        medicines: ['Sumatriptan 50mg (as needed)', 'Propranolol 40mg (twice daily)'],
        notes: 'Migraine episodes reducing in frequency. Maintain trigger journal and ensure adequate sleep.',
        observation: 'improvement',
    },
    'Dermatology': {
        condition: 'Eczema Flare-Up Treatment',
        medicines: ['Hydrocortisone cream 1% (twice daily)', 'Cetrizine 10mg (once daily)'],
        notes: 'Skin inflammation reducing. Continue moisturizing routine and avoid known irritants.',
        observation: 'improvement',
    },
    'Orthopedics': {
        condition: 'Joint Pain Assessment',
        medicines: ['Ibuprofen 400mg (as needed)', 'Calcium + Vitamin D supplement'],
        notes: 'Mild joint inflammation observed. Physical therapy recommended. Follow-up in 2 weeks.',
        observation: 'stable',
    },
    'default': {
        condition: 'General Health Consultation',
        medicines: ['Multivitamin supplement (once daily)'],
        notes: 'Overall health is satisfactory. Continue healthy lifestyle and schedule regular check-ups.',
        observation: 'stable',
    }
};

// ConsultationRoom component for conducting video calls and chat between patient and doctor
const ConsultationRoom = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [doctor, setDoctor] = useState(null);
    const [appointment, setAppointment] = useState(null);
    // State to manage media controls (microphone and camera)
    const [controls, setControls] = useState({ mic: true, camera: true });

    const { appointments, completeAppointment } = useAppointments();

    // Load ongoing appointment details to fetch the corresponding doctor
    useEffect(() => {
        const apt = appointments.find(a => a.id.toString() === appointmentId);
        if (apt) {
            setAppointment(apt);
            const found = doctors.find(d => d.id === apt.doctorId);
            setDoctor(found);
        } else {
            navigate('/appointments');
        }
    }, [appointmentId, navigate, appointments]);

    // Handle ending the consultation — update treatment data with doctor feedback
    const handleEndCall = () => {
        if (!appointment || !doctor) {
            navigate('/appointments');
            return;
        }

        // Get simulated doctor response based on specialty
        const response = doctorResponses[doctor.specialty] || doctorResponses['default'];

        // Update the appointment status to 'completed' via context
        completeAppointment(parseInt(appointmentId));

        // Update or create the treatment entry
        const treatments = JSON.parse(localStorage.getItem('vitalnode_treatments') || '[]');
        const existingIdx = treatments.findIndex(t => t.doctorId === doctor.id && t.status === 'ongoing');

        if (existingIdx !== -1) {
            // Update existing treatment with consultation results
            const existing = treatments[existingIdx];
            const newCompletedVisits = existing.completedVisits + 1;
            const isCompleted = newCompletedVisits >= existing.totalVisits;
            const newRecovery = isCompleted ? 100 : Math.min(90, Math.round((newCompletedVisits / existing.totalVisits) * 80) + 10);

            treatments[existingIdx] = {
                ...existing,
                condition: response.condition,
                medicines: response.medicines,
                notes: response.notes,
                observation: response.observation,
                completedVisits: newCompletedVisits,
                recoveryPercent: newRecovery,
                lastVisit: appointment.date || new Date().toISOString().split('T')[0],
                nextVisit: isCompleted ? null : existing.nextVisit,
                status: isCompleted ? 'completed' : 'ongoing',
            };
        } else {
            // Create treatment if none exists
            treatments.push({
                id: Date.now(),
                appointmentId: appointment.id,
                doctorId: doctor.id,
                doctorName: doctor.name,
                doctorImage: doctor.image,
                specialty: doctor.specialty,
                condition: response.condition,
                status: 'ongoing',
                completedVisits: 1,
                totalVisits: 3,
                recoveryPercent: 25,
                lastVisit: appointment.date || new Date().toISOString().split('T')[0],
                nextVisit: null,
                medicines: response.medicines,
                notes: response.notes,
                observation: response.observation,
                createdAt: new Date().toISOString(),
            });
        }

        localStorage.setItem('vitalnode_treatments', JSON.stringify(treatments));
        window.dispatchEvent(new Event('treatmentsUpdated'));

        showNotification('Consultation completed. Treatment updated.', 'success');
        navigate('/my-treatments');
    };

    return (
        <div className="h-screen bg-bg-soft flex flex-col">
            {/* Header */}
            <div className="px-8 py-4 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center text-white font-bold shadow-lg">V</div>
                    <div>
                        <h2 className="text-md font-bold text-text-dark">Ongoing Consultation</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary-green rounded-full shadow-[0_0_8px_rgba(43,182,115,0.8)]" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Secure & Encrypted</span>
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
                    <VideoPanel doctor={doctor} />

                    {/* Controls */}
                    <div className="mt-6 flex justify-center gap-6">
                        <button
                            onClick={() => setControls(prev => ({ ...prev, mic: !prev.mic }))}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${controls.mic ? 'bg-white text-gray-400 hover:text-text-dark' : 'bg-red-500 text-white shadow-red-200'
                                }`}
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
                            onClick={() => setControls(prev => ({ ...prev, camera: !prev.camera }))}
                            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${controls.camera ? 'bg-white text-gray-400 hover:text-text-dark' : 'bg-red-500 text-white shadow-red-200'
                                }`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleEndCall}
                            className="w-20 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center hover:bg-red-700 transition-all shadow-xl shadow-red-200"
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
