import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DoctorCard from '../components/doctors/DoctorCard';
import DoctorSidePanel from '../components/doctors/DoctorSidePanel';
import DoctorFilters from '../components/doctors/DoctorFilters';
import { useDoctors } from '../context/DoctorsContext';

// Doctors page component for browsing, filtering, and searching the list of doctors
const Doctors = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { doctors } = useDoctors();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search') || '';

    const [selectedSpecialty, setSelectedSpecialty] = useState('All');
    const [filteredDoctors, setFilteredDoctors] = useState(doctors);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    // Re-filter whenever doctors list, specialty, or search changes
    useEffect(() => {
        let result = doctors;
        if (selectedSpecialty !== 'All') {
            result = result.filter(d => d.specialty === selectedSpecialty);
        }
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(d =>
                d.name.toLowerCase().includes(query) ||
                d.specialty.toLowerCase().includes(query)
            );
        }
        setFilteredDoctors(result);
    }, [doctors, selectedSpecialty, searchQuery]);

    // Function to handle doctor selection and open side panel
    const handleDoctorClick = (doctor) => {
        setSelectedDoctor(doctor);
        setIsPanelOpen(true);
    };

    return (
        <div className="app-container bg-bg-soft">
            <Navbar />
            <main className="content-area pt-24 pb-20">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-12">
                    <span className="text-primary-green font-black uppercase tracking-[0.3em] text-[10px]">Browsing</span>
                    <h1 className="text-4xl font-bold text-text-dark mt-2 mb-4">
                        Find Your <span className="text-primary-green">Specialist</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl font-medium">
                        Search from our curated list of certified medical professionals across various specialties.
                    </p>
                </div>

                {/* Filters */}
                <DoctorFilters
                    selectedSpecialty={selectedSpecialty}
                    setSelectedSpecialty={setSelectedSpecialty}
                />

                {/* Results Count & Search Query Info */}
                <div className="flex justify-between items-center mb-8">
                    <p className="text-sm text-gray-400 font-bold">
                        Showing <span className="text-text-dark">{filteredDoctors.length}</span> doctors
                        {searchQuery && (
                            <> for <span className="text-primary-green">"{searchQuery}"</span></>
                        )}
                    </p>
                </div>

                {/* Grid */}
                {filteredDoctors.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredDoctors.map(doctor => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                onClick={handleDoctorClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-text-dark mb-2">No Doctors Found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
                        <button
                            onClick={() => { setSelectedSpecialty('All'); navigate('/doctors'); }}
                            className="mt-6 text-primary-green font-black uppercase tracking-widest text-xs hover:underline"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>

            <DoctorSidePanel
                doctor={selectedDoctor}
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
            />

            </main>

            <Footer />
        </div>
    );
};

export default Doctors;
