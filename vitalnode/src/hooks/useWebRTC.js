import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * useWebRTC — Manages the full WebRTC peer connection lifecycle.
 *
 * How it works:
 *   1. Grabs the local camera + mic via getUserMedia()
 *   2. Creates an RTCPeerConnection with STUN servers for NAT traversal
 *   3. Uses Socket.io to exchange SDP offer/answer and ICE candidates
 *   4. The "initiator" (patient) creates the offer; the other side answers
 *   5. Once connected, video/audio flows directly peer-to-peer
 *
 * @param {Object}  params
 * @param {Object}  params.socket       — Socket.io socket instance
 * @param {string}  params.roomId       — appointment room ID (e.g. "appt-123")
 * @param {boolean} params.isInitiator  — true = patient (creates offer), false = doctor (waits)
 *
 * @returns {{ localStream, remoteStream, toggleMic, toggleCamera, micOn, cameraOn, connectionState }}
 */
const useWebRTC = ({ socket, roomId, isInitiator, onRemoteHangup }) => {
    // ── State ──────────────────────────────────────────────────────────────────
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [connectionState, setConnectionState] = useState('new'); // new | connecting | connected | disconnected | failed

    // ── Refs (mutable, don't trigger re-renders) ──────────────────────────────
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteStreamRef = useRef(null);
    const iceCandidateQueue = useRef([]); // Buffer ICE candidates until remote description is set
    const hasCreatedOffer = useRef(false);
    const peerIsReady = useRef(false);
    const hasAckedReady = useRef(false);

    const onRemoteHangupRef = useRef(onRemoteHangup);
    useEffect(() => {
        onRemoteHangupRef.current = onRemoteHangup;
    }, [onRemoteHangup]);

    // ── STUN servers for NAT traversal ────────────────────────────────────────
    // These free Google servers help each browser discover its public IP
    const rtcConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
        ],
    };

    // ── Reset Connection ──────────────────────────────────────────────────────
    const resetConnection = useCallback(() => {
        console.log('[WebRTC] Resetting connection');
        if (peerConnectionRef.current) {
            try {
                peerConnectionRef.current.close();
            } catch (e) {
                console.error('[WebRTC] Error closing peer connection:', e);
            }
            peerConnectionRef.current = null;
        }
        setRemoteStream(null);
        remoteStreamRef.current = null;
        hasCreatedOffer.current = false;
        peerIsReady.current = false;
        hasAckedReady.current = false;
        iceCandidateQueue.current = [];
        setConnectionState('new');
    }, []);

    // ── Create Peer Connection ────────────────────────────────────────────────
    const createPeerConnection = useCallback(() => {
        if (peerConnectionRef.current) return peerConnectionRef.current;

        console.log('[WebRTC] Creating new RTCPeerConnection');
        const pc = new RTCPeerConnection(rtcConfig);

        // Track connection state changes
        pc.onconnectionstatechange = () => {
            console.log('[WebRTC] Connection state:', pc.connectionState);
            setConnectionState(pc.connectionState);
            if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
                console.log('[WebRTC] Connection failed/disconnected. Resetting.');
                resetConnection();
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log('[WebRTC] ICE connection state:', pc.iceConnectionState);
            if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
                setConnectionState('connected');
            } else if (pc.iceConnectionState === 'failed') {
                setConnectionState('failed');
                resetConnection();
            } else if (pc.iceConnectionState === 'disconnected') {
                setConnectionState('disconnected');
                resetConnection();
            }
        };

        // When a local ICE candidate is found, send it to the remote peer via Socket.io
        pc.onicecandidate = (event) => {
            if (event.candidate && socket) {
                console.log('[WebRTC] Sending ICE candidate');
                socket.emit('webrtc-ice-candidate', {
                    roomId,
                    candidate: event.candidate,
                });
            }
        };

        // When the remote peer adds a media track, attach it to our remote stream
        pc.ontrack = (event) => {
            console.log('[WebRTC] Received remote track:', event.track.kind);
            if (!remoteStreamRef.current) {
                remoteStreamRef.current = new MediaStream();
            }
            // Avoid duplicate tracks
            const existingTrack = remoteStreamRef.current.getTracks().find(
                t => t.kind === event.track.kind
            );
            if (existingTrack) {
                remoteStreamRef.current.removeTrack(existingTrack);
            }
            remoteStreamRef.current.addTrack(event.track);
            setRemoteStream(new MediaStream(remoteStreamRef.current.getTracks()));
        };

        peerConnectionRef.current = pc;
        return pc;
    }, [socket, roomId, resetConnection]);

    // ── Process buffered ICE candidates ───────────────────────────────────────
    const processIceCandidateQueue = useCallback(async () => {
        const pc = peerConnectionRef.current;
        if (!pc || !pc.remoteDescription) return;

        while (iceCandidateQueue.current.length > 0) {
            const candidate = iceCandidateQueue.current.shift();
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
                console.log('[WebRTC] Buffered ICE candidate added');
            } catch (err) {
                console.error('[WebRTC] Error adding buffered ICE candidate:', err);
            }
        }
    }, []);

    // ── Main Effect: Setup media + signaling ──────────────────────────────────
    useEffect(() => {
        if (!socket || !roomId) return;

        let isMounted = true;
        let pingInterval = null;

        const setup = async () => {
            // 1. Get local camera + microphone
            try {
                console.log('[WebRTC] Requesting camera + mic access...');
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                if (!isMounted) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }
                localStreamRef.current = stream;
                setLocalStream(stream);
                console.log('[WebRTC] Got local stream');

                // 2. Create peer connection and add local tracks
                const pc = createPeerConnection();
                stream.getTracks().forEach((track) => {
                    pc.addTrack(track, stream);
                });

                // 3. Start periodic pinging to notify peer we are ready
                // This ensures signaling connects even if the peer joins later or refreshes.
                startPinging();

            } catch (err) {
                console.error('[WebRTC] Failed to get user media:', err);
                // Still create the peer connection so we can receive remote video
                createPeerConnection();
                startPinging();
            }
        };

        const startPinging = () => {
            if (pingInterval) clearInterval(pingInterval);
            pingInterval = setInterval(() => {
                const pc = peerConnectionRef.current;
                // Only ping if connection is not established yet
                if (pc && pc.connectionState !== 'connected' && pc.iceConnectionState !== 'connected') {
                    console.log('[WebRTC] Signaling ping: emitting webrtc-ready');
                    socket.emit('webrtc-ready', { roomId });
                }
            }, 1500);
        };

        const createOfferIfReady = async (pc) => {
            if (isInitiator && !hasCreatedOffer.current && peerIsReady.current && localStreamRef.current) {
                hasCreatedOffer.current = true;
                try {
                    console.log('[WebRTC] Both peers ready. Creating offer (initiator)...');
                    setConnectionState('connecting');
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    socket.emit('webrtc-offer', {
                        roomId,
                        sdp: pc.localDescription,
                    });
                    console.log('[WebRTC] Offer sent');
                } catch (err) {
                    console.error('[WebRTC] Error creating offer:', err);
                    hasCreatedOffer.current = false;
                }
            }
        };

        // ── Socket event handlers ────────────────────────────────────────────

        const handleReady = () => {
            console.log('[WebRTC] Received webrtc-ready from peer');
            peerIsReady.current = true;

            if (peerConnectionRef.current) {
                createOfferIfReady(peerConnectionRef.current);
            }
        };

        // Received an SDP offer from the initiator → create and send an answer
        const handleOffer = async ({ sdp }) => {
            console.log('[WebRTC] Received offer');

            // If we have an existing failed/disconnected connection, reset it first
            const pcState = peerConnectionRef.current?.connectionState;
            const iceState = peerConnectionRef.current?.iceConnectionState;
            if (pcState === 'failed' || pcState === 'disconnected' || iceState === 'failed' || iceState === 'disconnected') {
                console.log('[WebRTC] Resetting stale connection before handling new offer');
                resetConnection();
            }

            setConnectionState('connecting');
            const pc = createPeerConnection();

            // Add local tracks if we have them
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => {
                    const senders = pc.getSenders();
                    const alreadyAdded = senders.find(s => s.track === track);
                    if (!alreadyAdded) {
                        pc.addTrack(track, localStreamRef.current);
                    }
                });
            }

            try {
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                console.log('[WebRTC] Remote description set (offer)');

                // Process any ICE candidates that arrived before we had a remote description
                await processIceCandidateQueue();

                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('webrtc-answer', {
                    roomId,
                    sdp: pc.localDescription,
                });
                console.log('[WebRTC] Answer sent');
            } catch (err) {
                console.error('[WebRTC] Error handling offer:', err);
            }
        };

        // Received an SDP answer from the remote peer → set it as remote description
        const handleAnswer = async ({ sdp }) => {
            console.log('[WebRTC] Received answer');
            const pc = peerConnectionRef.current;
            if (!pc) return;

            try {
                await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                console.log('[WebRTC] Remote description set (answer)');
                await processIceCandidateQueue();
            } catch (err) {
                console.error('[WebRTC] Error handling answer:', err);
            }
        };

        // Received an ICE candidate from the remote peer
        const handleIceCandidate = async ({ candidate }) => {
            const pc = peerConnectionRef.current;
            if (!candidate) return;

            if (!pc || !pc.remoteDescription) {
                console.log('[WebRTC] Buffering ICE candidate (no remote description yet)');
                iceCandidateQueue.current.push(candidate);
                return;
            }

            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
                console.log('[WebRTC] ICE candidate added');
            } catch (err) {
                console.error('[WebRTC] Error adding ICE candidate:', err);
            }
        };

        const handleRemoteHangup = () => {
            console.log('[WebRTC] Received remote hangup');
            if (onRemoteHangupRef.current) {
                onRemoteHangupRef.current();
            }
        };

        // Register Socket.io listeners
        socket.on('webrtc-ready', handleReady);
        socket.on('webrtc-offer', handleOffer);
        socket.on('webrtc-answer', handleAnswer);
        socket.on('webrtc-ice-candidate', handleIceCandidate);
        socket.on('webrtc-hangup', handleRemoteHangup);

        // Start setup
        setup();

        return () => {
            isMounted = false;
            if (pingInterval) {
                clearInterval(pingInterval);
            }

            socket.off('webrtc-ready', handleReady);
            socket.off('webrtc-offer', handleOffer);
            socket.off('webrtc-answer', handleAnswer);
            socket.off('webrtc-ice-candidate', handleIceCandidate);
            socket.off('webrtc-hangup', handleRemoteHangup);

            // Stop all local media tracks
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((t) => t.stop());
                localStreamRef.current = null;
            }

            // Close the peer connection
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }

            remoteStreamRef.current = null;
            hasCreatedOffer.current = false;
            iceCandidateQueue.current = [];
        };
    }, [socket, roomId, isInitiator, createPeerConnection, resetConnection, processIceCandidateQueue]);

    // ── Toggle Microphone ─────────────────────────────────────────────────────
    const toggleMic = useCallback(() => {
        if (!localStreamRef.current) return;
        const audioTrack = localStreamRef.current.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setMicOn(audioTrack.enabled);
        }
    }, []);

    // ── Toggle Camera ─────────────────────────────────────────────────────────
    const toggleCamera = useCallback(() => {
        if (!localStreamRef.current) return;
        const videoTrack = localStreamRef.current.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setCameraOn(videoTrack.enabled);
        }
    }, []);

    return {
        localStream,
        remoteStream,
        toggleMic,
        toggleCamera,
        micOn,
        cameraOn,
        connectionState,
    };
};

export default useWebRTC;
