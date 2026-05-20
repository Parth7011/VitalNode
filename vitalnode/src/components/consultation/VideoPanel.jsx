// VideoPanel component simulates the video feed interface during a consultation
const VideoPanel = ({ doctor }) => {
    return (
        <div className="relative h-full bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            {/* Main Doctor Feed (Simulated) */}
            <div className="absolute inset-0">
                <img src={doctor?.image} alt="Doctor Feed" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Doctor Info Badge */}
            <div className="absolute bottom-8 left-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-primary-green p-0.5">
                    <img src={doctor?.image} alt="Dr. Sarah" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                    <p className="text-white font-bold text-lg leading-tight">{doctor?.name}</p>
                    <p className="text-primary-green text-xs font-black uppercase tracking-widest">Consulting Now</p>
                </div>
            </div>

            {/* Patient Preview (Pip) */}
            <div className="absolute bottom-8 right-8 w-40 h-52 bg-gray-800 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <div className="absolute inset-0 bg-gray-700 flex items-center justify-center">
                    <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div className="absolute bottom-2 left-2 truncate right-2">
                    <p className="text-white text-[10px] font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full inline-block">You (Patient)</p>
                </div>
            </div>

            {/* Time Indicator */}
            <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-white text-xs font-bold tracking-widest">08:42</span>
            </div>
        </div>
    );
};

export default VideoPanel;
