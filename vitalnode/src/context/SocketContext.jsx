import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_URL = 'http://localhost:5000';

/**
 * SocketProvider — connects once on mount, exposes the socket instance
 * and a joinRoom helper to all children.
 */
export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);

    useEffect(() => {
        // Create a single persistent connection
        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });

        socketRef.current.on('connect', () => {
            console.log('[Socket.io] Connected:', socketRef.current.id);
        });

        socketRef.current.on('disconnect', () => {
            console.log('[Socket.io] Disconnected');
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    /** Join a private consultation room keyed by appointment ID */
    const joinRoom = (roomId) => {
        if (socketRef.current) {
            socketRef.current.emit('joinRoom', roomId);
            console.log('[Socket.io] Joined room:', roomId);
        }
    };

    return (
        <SocketContext.Provider value={{ socket: socketRef, joinRoom }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error('useSocket must be used inside SocketProvider');
    return ctx;
};
