import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

// Create context to manage application-wide notifications
const NotificationContext = createContext();

// Provider component to wrap around the application for toast notifications
export const NotificationProvider = ({ children }) => {
    // State to store current notification (message and type)
    const [notification, setNotification] = useState(null);

    // Function to display a notification and auto-close it after a delay
    const showNotification = useCallback((message, type = 'success') => {
        setNotification({ message, type });
        // Auto-close after 3 seconds
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    }, []);

    // Function to manually dismiss a notification
    const closeNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {/* Render the Toast component only when a notification exists */}
            {notification && (
                <Toast
                    message={notification.message}
                    type={notification.type}
                    onClose={closeNotification}
                />
            )}
        </NotificationContext.Provider>
    );
};

// Custom hook for easy access to the Notification context
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
