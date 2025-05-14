import { useEffect, useState } from 'react';
import { supabase } from './supaBase'; // Update this import path

const ErrorConsoleListener = () => {
    const [errors, setErrors] = useState([]);

    // Helper to send error to Supabase
    const sendErrorToSupabase = async (message) => {
        await supabase.from('Notifications').insert([
            {
                user_id: null, // Set this if you have a user context
                message,
                status: 'unread',
                created_at: new Date().toISOString(),
            }
        ]);
    };

    useEffect(() => {
        const handleError = (event) => {
            const msg = `Error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`;
            setErrors(prev => [...prev, msg]);
            sendErrorToSupabase(msg);
        };

        const handlePromiseRejection = (event) => {
            const msg = `Unhandled Promise Rejection: ${event.reason}`;
            setErrors(prev => [...prev, msg]);
            sendErrorToSupabase(msg);
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handlePromiseRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handlePromiseRejection);
        };
        // eslint-disable-next-line
    }, []);

    if (errors.length === 0) return null;

    return (
        <div style={{ backgroundColor: '#ffdddd', padding: '10px', border: '1px solid red' }}>
            <h3>Console Errors Detected:</h3>
            <ul>
                {errors.map((err, index) => <li key={index}>{err}</li>)}
            </ul>
        </div>
    );
};

export default ErrorConsoleListener;