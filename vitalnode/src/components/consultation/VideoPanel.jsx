import { useEffect, useRef } from 'react';

/**
 * VideoPanel — Displays real WebRTC video streams.
 *
 * Props:
 *   remoteStream     — MediaStream from the remote peer (shown full-size)
 *   localStream      — MediaStream from our own camera (shown as PiP)
 *   connectionState  — 'new' | 'connecting' | 'connected' | 'disconnected' | 'failed'
 *   doctor           — { name, specialty, image } for fallback display
 *   isDoctor         — true when this panel is rendered in the doctor's console
 */
const VideoPanel = ({ remoteStream, localStream, connectionState, doctor, isDoctor = false }) => {
    const remoteVideoRef = useRef(null);
    const localVideoRef = useRef(null);

    // Attach the remote stream to the main <video> element whenever it changes
    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    // Attach the local stream to the PiP <video> element
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    const isConnected = connectionState === 'connected';
    const isConnecting = connectionState === 'connecting' || connectionState === 'new';
    const isFailed = connectionState === 'failed' || connectionState === 'disconnected';

    return (
        <div className="relative h-full bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">

            {/* ── Remote Video (Full-size) ─────────────────────────────────── */}
            {remoteStream ? (
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                /* Fallback: avatar/placeholder when remote stream is not available */
                <div className="absolute inset-0">
                    {doctor?.image ? (
                        <img src={doctor.image} alt="Doctor Feed" className="w-full h-full object-cover opacity-40" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="text-gray-400 font-bold text-lg">{doctor?.name || (isDoctor ? 'Patient' : 'Doctor')}</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    {isConnecting && 'Waiting for connection...'}
                                    {isFailed && 'Connection lost'}
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
            )}

            {/* ── Connection Status Badge ──────────────────────────────────── */}
            <div className="absolute top-6 left-6 flex items-center gap-3">
                <div className={`px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md ${
                    isConnected ? 'bg-black/40' : isFailed ? 'bg-red-500/30' : 'bg-black/40'
                }`}>
                    <div className={`w-2 h-2 rounded-full ${
                        isConnected ? 'bg-green-400 animate-pulse' : isFailed ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
                    }`} />
                    <span className="text-white text-xs font-bold tracking-wider uppercase">
                        {isConnected && 'Live'}
                        {isConnecting && 'Connecting'}
                        {isFailed && 'Disconnected'}
                    </span>
                </div>

                {isConnected && (
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-white text-xs font-bold tracking-widest">REC</span>
                    </div>
                )}
            </div>

            {/* ── Remote Peer Info Badge ───────────────────────────────────── */}
            <div className="absolute bottom-8 left-8 flex items-center gap-3">
                {doctor?.image && (
                    <div className="w-12 h-12 rounded-full border-2 border-primary-green p-0.5">
                        <img src={doctor.image} alt={doctor.name} className="w-full h-full rounded-full object-cover" />
                    </div>
                )}
                <div>
                    <p className="text-white font-bold text-lg leading-tight">
                        {doctor?.name || (isDoctor ? 'Patient' : 'Doctor')}
                    </p>
                    <p className="text-primary-green text-xs font-black uppercase tracking-widest">
                        {isConnected ? 'Consulting Now' : 'Waiting to Join'}
                    </p>
                </div>
            </div>

            {/* ── Local Video (Picture-in-Picture) ────────────────────────── */}
            <div className="absolute bottom-8 right-8 w-40 h-52 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                {localStream ? (
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted  /* Always mute local preview to prevent audio feedback */
                        className="w-full h-full object-cover mirror"
                        style={{ transform: 'scaleX(-1)' }}  /* Mirror effect so it looks natural */
                    />
                ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                )}
                <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-[10px] font-bold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full inline-block">
                        You ({isDoctor ? 'Doctor' : 'Patient'})
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VideoPanel;
