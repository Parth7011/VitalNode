// ConsultationType component allows patients to select between Video or Chat consultation
const ConsultationType = ({ selectedType, setSelectedType }) => {
    const types = [
        {
            id: 'video', label: 'Video Consultation', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'chat', label: 'Chat Consultation', icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            )
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {types.map((type) => {
                const isSelected = selectedType === type.id;
                return (
                    <button
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${isSelected
                                ? 'border-primary-green bg-green-50/50 shadow-sm'
                                : 'border-gray-100 bg-white hover:border-primary-green/30'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-primary-green text-white' : 'bg-gray-50 text-gray-400'}`}>
                            {type.icon}
                        </div>
                        <div className="text-left">
                            <span className={`block font-bold ${isSelected ? 'text-text-dark' : 'text-gray-500'}`}>{type.label}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 block">Recommended</span>
                        </div>
                        <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-primary-green bg-primary-green' : 'border-gray-200'
                            }`}>
                            {isSelected && (
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default ConsultationType;
