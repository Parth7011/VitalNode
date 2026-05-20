import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { url } from '../config/url';

const TreatmentsContext = createContext();

const API_URL = `${url}/api/treatments`;

export const TreatmentsProvider = ({ children }) => {
    const { user } = useAuth();
    const [treatments, setTreatments] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTreatments = useCallback(async () => {
        if (!user || !user.token) return;
        setLoading(true);
        try {
            const res = await fetch(API_URL, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            const data = await res.json();
            if (res.ok) {
                // Map backend fields to frontend expectations
                const mappedData = data.map(t => ({
                    ...t,
                    id: t._id,
                    patientName: t.patient?.name || 'Unknown Patient',
                    doctorName: t.doctor?.name || 'Unknown Doctor',
                    doctorImage: t.doctor?.profileImage || '',
                    specialty: t.doctor?.specialty || ''
                }));
                setTreatments(mappedData);
            }
        } catch (error) {
            console.error('Failed to fetch treatments:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTreatments();
    }, [fetchTreatments]);

    const addOrUpdateTreatment = async (treatmentData) => {
        if (!user || !user.token) return;
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(treatmentData)
            });
            
            if (res.ok) {
                fetchTreatments();
                return await res.json();
            } else {
                const errData = await res.json();
                throw new Error(errData.message || 'Failed to update treatment');
            }
        } catch (error) {
            console.error('Failed to add/update treatment:', error);
            throw error;
        }
    };

    return (
        <TreatmentsContext.Provider value={{
            treatments,
            loading,
            refreshTreatments: fetchTreatments,
            addOrUpdateTreatment
        }}>
            {children}
        </TreatmentsContext.Provider>
    );
};

export const useTreatments = () => {
    const ctx = useContext(TreatmentsContext);
    if (!ctx) throw new Error('useTreatments must be used inside TreatmentsProvider');
    return ctx;
};
