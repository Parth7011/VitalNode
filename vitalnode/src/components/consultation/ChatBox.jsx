import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

/**
 * ChatBox — real-time Socket.io chat shared by both Patient & Doctor consultation rooms.
 * Props:
 *   roomId  — appointment ID used as the private socket room key
 *   asDoctor — true when rendered inside the Doctor's consultation room
 */
const ChatBox = ({ roomId, asDoctor = false }) => {
    const { socket, joinRoom } = useSocket();
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'system',
            text: 'Consultation session started. Messages are end-to-end encrypted.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    // Join the shared room and listen for incoming messages
    useEffect(() => {
        if (!roomId || !socket) return;

        joinRoom(`appt-${roomId}`);

        const handleReceive = (msg) => {
            setMessages((prev) => [...prev, { id: Date.now(), ...msg }]);
        };

        socket.on('receiveMessage', handleReceive);

        return () => {
            socket.off('receiveMessage', handleReceive);
        };
    }, [roomId, socket]);

    // Auto-scroll to the latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim() || !socket) return;

        const senderRole = asDoctor ? 'doctor' : 'patient';
        const senderName = user?.name || (asDoctor ? 'Doctor' : 'Patient');
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        socket.emit('sendMessage', {
            roomId: `appt-${roomId}`,
            text: input.trim(),
            sender: senderRole,
            senderName,
            timestamp,
        });

        setInput('');
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-gray-50 flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-primary-green rounded-full shadow-[0_0_8px_rgba(43,182,115,0.6)] animate-pulse" />
                <div>
                    <h3 className="font-bold text-text-dark text-sm">Consultation Chat</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live · Room {roomId}</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 no-scrollbar">
                {messages.map((msg) => {
                    if (msg.sender === 'system') {
                        return (
                            <div key={msg.id} className="flex justify-center">
                                <span className="text-[10px] text-gray-400 bg-gray-50 px-3 py-1 rounded-full font-bold">
                                    {msg.text}
                                </span>
                            </div>
                        );
                    }

                    const isMe = asDoctor ? msg.sender === 'doctor' : msg.sender === 'patient';

                    return (
                        <div key={msg.id} className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider px-1">
                                {isMe ? 'You' : msg.senderName}
                            </span>
                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                                    isMe
                                        ? 'bg-primary-green text-white rounded-tr-none'
                                        : 'bg-gray-100 text-text-dark rounded-tl-none'
                                }`}
                            >
                                {msg.text}
                                <span className="block text-[9px] opacity-60 mt-1 uppercase font-black">
                                    {msg.timestamp}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-5 border-t border-gray-50">
                <form onSubmit={handleSend} className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Write a message..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary-green text-white rounded-xl flex items-center justify-center hover:bg-secondary-green transition-colors shadow-lg shadow-primary-green/20 disabled:opacity-40"
                        disabled={!input.trim()}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;
