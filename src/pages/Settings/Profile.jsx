import React, { useEffect, useState } from 'react';
import { supabase } from '../../supaBase/supaBase';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async (email) => {
            const { data: userDetails, error } = await supabase
                .from('Users')
                .select('*')
                .eq('email', email)
                .single();

            if (error) console.error('Error fetching user details:', error);
            else setUser(userDetails);
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

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="card shadow-lg">
                <div className="card-header text-center bg-primary text-white">
                    <img
                        src={user.avatar_url}
                        alt="Profile"
                        className="rounded-circle mb-3"
                        style={{ width: '150px', height: '150px' }}
                    />
                    <h1 className="h4">{user.name || 'John Doe'}</h1>
                    <p className="mb-0">{user.role || 'Driver'}</p>
                </div>
                <div className="card-body">
                    <h2 className="h5">About</h2>
                    <p>{user.about || 'No details available.'}</p>
                    <h2 className="h5 mt-4">Contact Information</h2>
                    <ul className="list-unstyled">
                        <li><strong>Email:</strong> {user.email}</li>
                        <li><strong>Phone:</strong> {user.phone || 'N/A'}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profile;