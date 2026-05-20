import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppointmentsContext = createContext();

const API_URL = 'http://localhost:5000/api/appointments';
const EMERGENCY_SURCHARGE = 500;

export const AppointmentsProvider = ({ children }) => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAppointments = async () => {
        if (!user || !user.token) return;
        setLoading(true);
        try {
            const res = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (res.ok) {
                // Map backend fields to frontend expectations if necessary
                const mappedData = data.map(appt => ({
                    ...appt,
                    id: appt._id,
                    patientName: appt.patient?.name || 'Unknown Patient',
                    doctorName: appt.doctor?.name || 'Unknown Doctor',
                    doctorImage: appt.doctor?.profileImage || '',
                    specialty: appt.doctor?.specialty || '',
                    problem: appt.reason || '',
                    status: appt.status === 'accepted' ? 'approved' : appt.status, 
                }));
                setAppointments(mappedData);
            }
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [user]);

    // ── Patient actions ────────────────────────────────────────────────────────

    const requestAppointment = async (apptData) => {
        if (!user || !user.token) return;
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    doctorId: apptData.doctorId,
                    reason: apptData.problem,
                    date: apptData.date || 'TBD',
                    time: apptData.time || 'TBD',
                    isEmergency: apptData.isEmergency,
                    type: apptData.type,
                    consultationFee: apptData.consultationFee,
                    totalFee: apptData.totalFee
                })
            });
            const newAppt = await res.json();
            if (res.ok) {
                fetchAppointments(); // Refresh list
                return newAppt;
            }
        } catch (error) {
            console.error('Failed to request appointment:', error);
        }
    };

    // ── Doctor actions ─────────────────────────────────────────────────────────

    const approveAppointment = async (id, { date, time }) => {
        if (!user || !user.token) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    status: 'accepted',
                    date,
                    time
                })
            });
            if (res.ok) fetchAppointments();
        } catch (error) {
            console.error('Failed to approve appointment:', error);
        }
    };

    const rejectAppointment = async (id, reason = '') => {
        if (!user || !user.token) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    status: 'cancelled', // Or a dedicated rejected status if backend supports it
                    rescheduleMessage: reason
                })
            });
            if (res.ok) fetchAppointments();
        } catch (error) {
            console.error('Failed to reject appointment:', error);
        }
    };

    const completeAppointment = async (id) => {
        if (!user || !user.token) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ status: 'completed' })
            });
            if (res.ok) fetchAppointments();
        } catch (error) {
            console.error('Failed to complete appointment:', error);
        }
    };

    const getPatientAppointments = (patientId) => 
        appointments.filter(a => a.patient?._id === patientId || a.patient === patientId);

    const getDoctorRequests = (doctorId) =>
        appointments.filter(a => a.doctor?._id === doctorId || a.doctor === doctorId);

    return (
        <AppointmentsContext.Provider value={{
            appointments,
            loading,
            requestAppointment,
            approveAppointment,
            rejectAppointment,
            completeAppointment,
            getPatientAppointments,
            getDoctorRequests,
            EMERGENCY_SURCHARGE,
            refreshAppointments: fetchAppointments
        }}>
            {children}
        </AppointmentsContext.Provider>
    );
};

export const useAppointments = () => {
    const ctx = useContext(AppointmentsContext);
    if (!ctx) throw new Error('useAppointments must be used inside AppointmentsProvider');
    return ctx;
};
