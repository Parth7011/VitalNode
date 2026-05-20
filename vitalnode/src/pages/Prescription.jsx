import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTreatments } from '../context/TreatmentsContext';

// Prescription page component for patients to view their medical prescriptions
const Prescription = () => {
    // State to handle the search input for filtering prescriptions
    const [searchTerm, setSearchTerm] = useState('');
    const { treatments } = useTreatments();

    // Only show prescriptions that have medicines prescribed
    const prescriptionList = treatments.filter(t => t.medicines && t.medicines.length > 0);

    // Filter prescriptions based on doctor name, specialty, or condition
    const filteredPrescriptions = prescriptionList.filter(p => {
        const docName = p.doctorName || '';
        const specialty = p.specialty || '';
        const condition = p.condition || '';
        
        return docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
               condition.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="app-container font-sans selection:bg-primary-green selection:text-white relative overflow-hidden">
            {/* Gradient Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50 via-white to-blue-50/50 -z-20"></div>
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-green/10 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-400/10 rounded-full blur-[100px] -z-10"></div>

            <Navbar />

            <main className="content-area pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full relative z-10">
                <div className="animate-fadeIn">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-green to-blue-600 mb-2">
                                My Prescriptions
                            </h1>
                            <p className="text-gray-600">
                                View medical prescriptions updated by your doctors.
                            </p>
                        </div>
                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="Search prescriptions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all shadow-sm"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        {filteredPrescriptions.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredPrescriptions.map((prescription) => (
                                    <div key={prescription.id} className="p-6 md:p-8 hover:bg-gray-50 transition-colors group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                            {/* Details Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${prescription.status === 'ongoing' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                        {prescription.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        {new Date(prescription.updatedAt || prescription.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-bold text-text-dark mb-1">
                                                    {prescription.doctorName}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-3">{prescription.specialty}</p>
                                                
                                                {/* Medicines list */}
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {prescription.medicines.map((med, idx) => (
                                                        <span key={idx} className="text-xs font-semibold bg-primary-green/10 text-primary-green px-2 py-1 rounded-md">
                                                            {med}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="flex items-start gap-2 bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-xl border border-green-100/50 shadow-sm mt-3">
                                                    <svg className="w-5 h-5 text-primary-green shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <p className="text-sm text-gray-700 italic">"{prescription.notes || 'No notes provided'}"</p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex sm:flex-col gap-3 shrink-0">
                                                <button
                                                    onClick={() => alert(`Viewing prescription details from ${prescription.doctorName}`)}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-primary-green to-secondary-green text-white hover:from-secondary-green hover:to-primary-green px-6 py-2.5 rounded-xl font-semibold transition-all shadow-md transform hover:-translate-y-0.5"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => alert(`Downloading prescription...`)}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-green hover:text-primary-green px-6 py-2.5 rounded-xl font-semibold transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center flex flex-col items-center justify-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No prescriptions found</h3>
                                <p className="text-gray-500 max-w-sm">We couldn't find any prescriptions matching your search criteria.</p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="mt-4 text-primary-green font-semibold hover:underline"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Prescription;
