import { useState } from 'react';
import { useTreatments } from '../context/TreatmentsContext';
import { useAuth } from '../context/AuthContext';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';

const DoctorPrescriptions = () => {
    const { user } = useAuth();
    const { treatments, addOrUpdateTreatment } = useTreatments();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [prescriptionForm, setPrescriptionForm] = useState({ medicines: '', notes: '' });
    const [saving, setSaving] = useState(false);

    const filteredTreatments = treatments.filter(t => {
        const name = t.patient?.name || t.patientName || '';
        const condition = t.condition || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               condition.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSavePrescription = async (patientId) => {
        setSaving(true);
        try {
            const medicinesArray = prescriptionForm.medicines.split(',').map(m => m.trim()).filter(m => m);
            await addOrUpdateTreatment({
                patientId,
                medicines: medicinesArray,
                notes: prescriptionForm.notes
            });
            setPrescriptionForm({ medicines: '', notes: '' });
            setExpandedId(null);
        } catch (error) {
            console.error('Failed to save prescription:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-soft flex overflow-hidden p-6 gap-6">
            <DashboardSidebar />
            <main className="flex-1 bg-white rounded-[40px] shadow-sm overflow-y-auto p-8 lg:p-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-text-dark mb-1">Prescriptions</h1>
                        <p className="text-gray-400 text-sm font-medium">Manage prescriptions for your patients</p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search patients..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-3 pl-11 pr-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-primary-green focus:bg-white focus:ring-1 focus:ring-primary-green transition-all text-sm font-bold"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Patient Cards */}
                {filteredTreatments.length > 0 ? (
                    <div className="space-y-4">
                        {filteredTreatments.map((treatment) => {
                            const isExpanded = expandedId === treatment.id;
                            const patientName = treatment.patient?.name || treatment.patientName || 'Unknown';
                            const patientId = treatment.patient?._id || treatment.patient;

                            return (
                                <div key={treatment.id} className="border border-gray-100 rounded-3xl overflow-hidden hover:border-primary-green/30 transition-all shadow-sm hover:shadow-md">
                                    {/* Card Header */}
                                    <div className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary-green/10 rounded-2xl flex items-center justify-center text-primary-green font-black text-lg">
                                                {patientName[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-dark">{patientName}</h3>
                                                <p className="text-xs text-gray-400 font-medium">{treatment.condition || 'General Consultation'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                                                treatment.status === 'ongoing'
                                                    ? 'bg-primary-green/10 text-primary-green'
                                                    : 'bg-gray-50 text-gray-400'
                                            }`}>
                                                {treatment.status}
                                            </span>
                                            {treatment.medicines?.length > 0 && (
                                                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-blue-50 text-blue-600">
                                                    {treatment.medicines.length} meds
                                                </span>
                                            )}
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : treatment.id)}
                                                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary-green hover:text-white transition-all"
                                            >
                                                <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Section */}
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="px-6 pb-6 border-t border-gray-50 pt-4">
                                            {/* Current Medicines */}
                                            {treatment.medicines?.length > 0 && (
                                                <div className="mb-6">
                                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Current Prescription</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {treatment.medicines.map((med, idx) => (
                                                            <span key={idx} className="text-xs font-semibold bg-primary-green/10 text-primary-green px-3 py-1.5 rounded-lg">
                                                                {med}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    {treatment.notes && (
                                                        <div className="mt-3 bg-gray-50 rounded-xl p-3">
                                                            <p className="text-sm text-gray-600 italic">"{treatment.notes}"</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Add/Update Prescription Form */}
                                            <div className="bg-gray-50 rounded-2xl p-5">
                                                <h4 className="text-xs font-bold text-text-dark mb-3 flex items-center gap-2">
                                                    <svg className="w-4 h-4 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    {treatment.medicines?.length > 0 ? 'Update Prescription' : 'Write Prescription'}
                                                </h4>
                                                <input
                                                    type="text"
                                                    value={prescriptionForm.medicines}
                                                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicines: e.target.value })}
                                                    placeholder="Medicines (comma separated) e.g. Amoxicillin 500mg, Ibuprofen 200mg"
                                                    className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl mb-3 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                                                />
                                                <textarea
                                                    value={prescriptionForm.notes}
                                                    onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                                                    placeholder="Doctor notes (dosage, frequency, instructions...)"
                                                    className="w-full p-3 text-sm bg-white border border-gray-200 rounded-xl mb-3 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green resize-none h-24"
                                                />
                                                <button
                                                    onClick={() => handleSavePrescription(patientId)}
                                                    disabled={saving || !prescriptionForm.medicines.trim()}
                                                    className="bg-primary-green text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-secondary-green transition-all shadow-lg shadow-primary-green/20 disabled:opacity-50"
                                                >
                                                    {saving ? 'Saving...' : 'Save Prescription'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-200 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-text-dark mb-2">No patients yet</h3>
                        <p className="text-gray-400 text-sm max-w-sm mx-auto">
                            Patients will appear here when appointments are approved and treatments begin.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorPrescriptions;
