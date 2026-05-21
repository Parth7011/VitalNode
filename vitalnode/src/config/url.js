export const url = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? "http://localhost:5000"
    : "https://vitalnode.onrender.com";