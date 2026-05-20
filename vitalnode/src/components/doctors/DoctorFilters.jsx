// DoctorFilters component provides a row of buttons to filter doctors by specialty
const DoctorFilters = ({ selectedSpecialty, setSelectedSpecialty }) => {
    // List of available specialties for filtering
    const specialties = [
        "All",
        "General Physician",
        "Cardiology",
        "Dermatology",
        "Pediatrics",
        "Orthopaedics",
        "Neurology"
    ];

    return (
        <div className="flex flex-wrap gap-3 mb-8">
            {specialties.map((specialty) => (
                <button
                    key={specialty}
                    onClick={() => setSelectedSpecialty(specialty)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${selectedSpecialty === specialty
                            ? 'bg-primary-green text-white shadow-lg shadow-primary-green/20'
                            : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
                        }`}
                >
                    {specialty}
                </button>
            ))}
        </div>
    );
};

export default DoctorFilters;
