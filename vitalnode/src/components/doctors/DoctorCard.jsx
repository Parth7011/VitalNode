// DoctorCard component displays summary information for a single doctor in a card format
const DoctorCard = ({ doctor, onClick }) => {
    return (
        <div
            onClick={() => onClick(doctor)}
            className="card-modern cursor-pointer group overflow-hidden"
        >
            {/* Image Container */}
            <div className="relative h-48 img-zoom-container">
                <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="img-cover-rounded"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder-doctor.png";
                    }}
                />
                <div className="absolute top-4 right-4">
                    <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
                <div className="absolute bottom-4 left-4">
                    <span className="bg-primary-green text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                        {doctor.specialty}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-text-dark group-hover:text-primary-green transition-colors">{doctor.name}</h3>
                        <p className="text-gray-400 text-sm font-medium">{doctor.qualification}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-bold text-yellow-700">{doctor.rating}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-4 py-4 border-t border-gray-50">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</span>
                        <span className="text-sm font-bold text-text-dark">{doctor.experience}</span>
                    </div>
                    <div className="flex flex-col border-l border-gray-100 pl-4">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consultation</span>
                        <span className="text-sm font-bold text-primary-green">₹{doctor.fee}</span>
                    </div>
                </div>

                <button className="btn-modern w-full mt-2 py-3 bg-gray-50 hover:bg-primary-green hover:text-white text-gray-500 rounded-xl text-sm gap-2 group/btn">
                    Quick View
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default DoctorCard;
