import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { url } from '../config/url';

const SocketContext = createContext(null);

const SOCKET_URL = url;

/**
 * SocketProvider — connects once on mount, exposes the socket instance
 * and a joinRoom helper to all children.
 */
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Create a single persistent connection
        const s = io(SOCKET_URL, {
            transports: ['websocket'],
            reconnectionAttempts: 5,
        });

        s.on('connect', () => {
            console.log('[Socket.io] Connected:', s.id);
        });

        s.on('disconnect', () => {
            console.log('[Socket.io] Disconnected');
        });

        setSocket(s);

        return () => {
            s.disconnect();
        };
    }, []);

    /** Join a private consultation room keyed by appointment ID */
    const joinRoom = (roomId) => {
        if (socket) {
            socket.emit('joinRoom', roomId);
            console.log('[Socket.io] Joined room:', roomId);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, joinRoom }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error('useSocket must be used inside SocketProvider');
    return ctx;
};
