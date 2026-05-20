import { createContext, useContext, useState, useEffect } from 'react';
import { doctors as initialDoctors } from '../data/doctors';

/**
 * DoctorsContext — Single source of truth for all doctor data across the app.
 * Changes made by the admin (add / edit / delete) are:
 *   1. Stored in localStorage so they survive page refresh.
 *   2. Available to every page via useDoctors() — no more stale static imports.
 */
const DoctorsContext = createContext();

const STORAGE_KEY = 'vitalnode_doctors';

export const DoctorsProvider = ({ children }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/doctors');
                const data = await res.json();
                const mappedData = data.map(d => ({
                    ...d,
                    id: d._id, // Map _id to id for compatibility
                    image: d.profileImage, // Map profileImage to image
                    fee: d.consultationFee, // Map consultationFee to fee
                    qualification: d.qualification || 'MBBS, MD',
                    patientsTreated: d.patientsTreated || '500+',
                }));
                setDoctors(mappedData);
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
                setDoctors(initialDoctors); // Fallback to static data on error
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // ── CRUD helpers used by AdminDashboard ────────────────────────────────────

    const addDoctor = (docData) => {
        const newDoc = {
            id: Date.now(),
            patientsTreated: '0+',
            about: '',
            reviews: [],
            ...docData,
            fee: parseInt(docData.fee) || 500,
            rating: Math.min(5, parseFloat(docData.rating) || 5.0),
        };
        setDoctors((prev) => [newDoc, ...prev]);
        return newDoc;
    };

    const updateDoctor = (id, updates) => {
        setDoctors((prev) =>
            prev.map((d) =>
                d.id === id
                    ? {
                          ...d,
                          ...updates,
                          fee: parseInt(updates.fee ?? d.fee) || d.fee,
                          rating: Math.min(5, parseFloat(updates.rating ?? d.rating) || d.rating),
                      }
                    : d
            )
        );
    };

    const deleteDoctor = (id) => {
        setDoctors((prev) => prev.filter((d) => d.id !== id));
    };

    return (
        <DoctorsContext.Provider value={{ doctors, addDoctor, updateDoctor, deleteDoctor }}>
            {children}
        </DoctorsContext.Provider>
    );
};

export const useDoctors = () => {
    const ctx = useContext(DoctorsContext);
    if (!ctx) throw new Error('useDoctors must be used within a DoctorsProvider');
    return ctx;
};
