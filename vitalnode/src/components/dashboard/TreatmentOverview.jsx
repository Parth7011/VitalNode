import { useState } from 'react';
import { useTreatments } from '../../context/TreatmentsContext';
import { useAuth } from '../../context/AuthContext';

// TreatmentOverview component reads dynamically from the backend
const TreatmentOverview = ({ fullPage = false }) => {
    const { user } = useAuth();
    const { treatments, addOrUpdateTreatment } = useTreatments();
    const [filter, setFilter] = useState('all');
    const [expandedId, setExpandedId] = useState(null);

    // State for the new prescription box
    const [prescriptionForm, setPrescriptionForm] = useState({ medicines: '', notes: '' });

    const filtered = filter === 'all' ? treatments : treatments.filter(t => t.status === filter);
    const ongoingCount = treatments.filter(t => t.status === 'ongoing').length;
    const completedCount = treatments.filter(t => t.status === 'completed').length;

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getObservationConfig = (obs) => {
        switch (obs) {
            case 'improvement':
                return { label: 'Improving', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: '↑' };
            case 'stable':
                return { label: 'Stable', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: '→' };
            case 'concern':
                return { label: 'Needs Attention', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: '!' };
            default:
                return { label: 'Pending Review', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-100', icon: '•' };
        }
    };

    const handleMarkComplete = async (patientId) => {
        try {
            await addOrUpdateTreatment({
                patientId,
                status: 'completed'
            });
        } catch (error) {
            console.error('Failed to mark complete:', error);
        }
    };

    const handleAddPrescription = async (patientId) => {
        try {
            const medicinesArray = prescriptionForm.medicines.split(',').map(m => m.trim()).filter(m => m);
            await addOrUpdateTreatment({
                patientId,
                medicines: medicinesArray,
                notes: prescriptionForm.notes
            });
            setPrescriptionForm({ medicines: '', notes: '' });
            alert('Prescription added successfully!');
        } catch (error) {
            console.error('Failed to add prescription:', error);
            alert('Error adding prescription');
        }
    };

    return (
        <section className={fullPage ? '' : 'mt-12'}>
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-green/10 rounded-2xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <div>
                        <h2 className={`font-bold text-text-dark ${fullPage ? 'text-2xl' : 'text-xl'}`}>
                            {fullPage ? 'My Treatments' : 'Treatment Overview'}
                        </h2>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                            {treatments.length === 0 ? 'No treatments yet' : `${ongoingCount} ongoing · ${completedCount} completed`}
                        </p>
                    </div>
                </div>

                {/* Filter Pills */}
                {treatments.length > 0 && (
                    <div className="flex gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                        {[
                            { key: 'all', label: 'All' },
                            { key: 'ongoing', label: 'Ongoing' },
                            { key: 'completed', label: 'Completed' },
                        ].map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-200 ${
                                    filter === f.key
                                        ? 'bg-primary-green text-white shadow-md'
                                        : 'text-gray-400 hover:text-text-dark hover:bg-gray-100'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Empty State */}
            {treatments.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-text-dark mb-2">No ongoing treatments</h3>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto">
                        Treatments will appear here automatically when you book appointments and consult with doctors.
                    </p>
                </div>
            ) : (
                /* Treatment Cards */
                <div className="space-y-5">
                    {filtered.map((treatment) => {
                        const isExpanded = expandedId === treatment.id;
                        const obsConfig = getObservationConfig(treatment.observation);
                        const progressPercent = treatment.totalVisits > 0
                            ? Math.round((treatment.completedVisits / treatment.totalVisits) * 100)
                            : 0;
                        const displayImage = user?.role === 'doctor' ? (treatment.patient?.profileImage || '') : treatment.doctorImage;
                        const displayName = user?.role === 'doctor' ? treatment.patientName : treatment.doctorName;

                        return (
                            <div
                                key={treatment.id}
                                className={`bg-white rounded-3xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${
                                    treatment.status === 'ongoing' ? 'border-gray-100' : 'border-gray-50'
                                }`}
                            >
                                {/* Main Card Content */}
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row gap-5">
                                        {/* Avatar */}
                                        <div className="shrink-0">
                                            <div className="w-14 h-14 bg-gray-100 text-primary-green flex items-center justify-center font-bold text-xl rounded-2xl overflow-hidden shadow-sm ring-2 ring-gray-50">
                                                {displayImage ? <img src={displayImage} alt={displayName} className="w-full h-full object-cover" /> : displayName[0]}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                                                <div>
                                                    <h3 className="font-bold text-text-dark text-base">{displayName}</h3>
                                                    {user?.role !== 'doctor' && (
                                                        <p className="text-[10px] font-black text-primary-green uppercase tracking-widest">{treatment.specialty}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                                                        treatment.status === 'ongoing'
                                                            ? 'bg-primary-green/10 text-primary-green'
                                                            : 'bg-gray-50 text-gray-400'
                                                    }`}>
                                                        {treatment.status === 'ongoing' ? '● Ongoing' : '✓ Completed'}
                                                    </span>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${obsConfig.bg} ${obsConfig.color} border ${obsConfig.border}`}>
                                                        {obsConfig.icon} {obsConfig.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Condition & Dates */}
                                            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                                                <p className="font-semibold text-text-dark text-sm mb-2">
                                                    {treatment.condition || (treatment.problem ? `Issue: ${treatment.problem}` : 'General Consultation')}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Last: {formatDate(treatment.lastVisit || treatment.updatedAt)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visit Progress</span>
                                                        <span className="text-[10px] font-black text-text-dark">
                                                            {treatment.completedVisits}/{treatment.totalVisits} visits
                                                        </span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-700 ease-out ${
                                                                treatment.status === 'completed' ? 'bg-gray-400' : 'bg-primary-green'
                                                            }`}
                                                            style={{ width: `${progressPercent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expand Toggle */}
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : treatment.id)}
                                        className="w-full mt-4 pt-3 border-t border-gray-50 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary-green transition-colors"
                                    >
                                        {isExpanded ? 'Show Less' : 'View Details'}
                                        <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Expanded Details */}
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            {/* Medicines */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-6 h-6 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Prescribed Medicines</span>
                                                </div>
                                                <div className="space-y-2 mb-6">
                                                    {treatment.medicines && treatment.medicines.length > 0 ? (
                                                        treatment.medicines.map((med, i) => (
                                                            <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                                                                <div className="w-1.5 h-1.5 bg-primary-green rounded-full shrink-0" />
                                                                <span className="text-sm font-semibold text-text-dark">{med}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-sm text-gray-400 italic">Pending doctor's prescription</p>
                                                    )}
                                                </div>

                                                {/* Doctor Section: Add Prescription */}
                                                {user?.role === 'doctor' && (
                                                    <div className="mt-4 border-t border-dashed border-gray-200 pt-4">
                                                        <h4 className="text-xs font-bold text-text-dark mb-2">Add / Update Prescription</h4>
                                                        <input 
                                                            type="text" 
                                                            name="medicines"
                                                            value={prescriptionForm.medicines}
                                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medicines: e.target.value })}
                                                            placeholder="Medicines (comma separated)"
                                                            className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-primary-green"
                                                        />
                                                        <textarea 
                                                            name="notes"
                                                            value={prescriptionForm.notes}
                                                            onChange={(e) => setPrescriptionForm({ ...prescriptionForm, notes: e.target.value })}
                                                            placeholder="Doctor notes"
                                                            className="w-full p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:border-primary-green resize-none h-20"
                                                        />
                                                        <button 
                                                            onClick={() => handleAddPrescription(treatment.patient._id || treatment.patient)}
                                                            className="bg-primary-green text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-secondary-green transition-colors"
                                                        >
                                                            Save Prescription
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Doctor Notes */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-6 h-6 bg-amber-50 rounded-lg flex items-center justify-center">
                                                        <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Doctor's Notes</span>
                                                </div>
                                                <div className="bg-gray-50 rounded-2xl p-4">
                                                    <p className="text-sm text-text-dark leading-relaxed">{treatment.notes || 'Notes will be added after consultation.'}</p>
                                                </div>

                                                {/* Mark Complete button for ongoing treatments */}
                                                {treatment.status === 'ongoing' && fullPage && user?.role === 'patient' && (
                                                    <button
                                                        onClick={() => handleMarkComplete(treatment.patient._id || treatment.patient)}
                                                        className="mt-4 w-full px-4 py-2.5 bg-gray-50 text-gray-500 hover:bg-primary-green/10 hover:text-primary-green text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-gray-100 hover:border-primary-green/20"
                                                    >
                                                        Mark as Completed
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Filtered empty state */}
                    {filtered.length === 0 && treatments.length > 0 && (
                        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                            <p className="text-gray-400 font-medium">No {filter} treatments found.</p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default TreatmentOverview;
