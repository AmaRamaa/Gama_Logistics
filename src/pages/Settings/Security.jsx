import { useState, useEffect } from 'react';
import { supabase } from '../../supaBase/supaBase';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Security = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        const fetchUserDetails = async (email) => {
            const { data: userDetails, error } = await supabase
                .from('Users')
                .select('email, phone, name') // Explicitly select columns
                .eq('email', email)
                .single();

            if (error) console.error('Error fetching user details:', error);
            else {
                setFormData({
                    username: userDetails.name || '',
                    email: userDetails.email || '',
                    phone: userDetails.phone || '',
                });
            }
        };

        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await fetchUserDetails(session.user.email);
            } else {
                window.location.href = '/login';
            }
        };

        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            if (session) fetchUserDetails(session.user.email);
            else window.location.href = '/login';
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('Users')
                .update({
                    name: formData.username || null, // Ensure null-safe updates
                    phone: formData.phone || null,
                })
                .eq('email', formData.email);

            if (error) {
                console.error('Error updating user details:', error);
                alert('Failed to update your information.');
            } else {
                alert('Your information has been updated!');
            }
        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Security Details</h1>
            <p className="text-center">Update your personal information below:</p>
            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="form-control"
                        disabled
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Update Information</button>
            </form>
        </div>
    );
};

export default Security;