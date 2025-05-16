import React, { useState } from 'react';
import { supabase } from '../../supaBase/supaBase';

const CreateUser = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        role: 'driver',
        avatar_url: '',
        phone: '',
    });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('Users').insert([form]);
        console.log('Error:', error);
        console.log('Form Data:', form);
        
        if (!error) {
            setMessage('User created successfully!');
            setForm({ name: '', email: '', role: 'driver', avatar_url: '', phone: '' });
        } else {
            setMessage('Failed to create user.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm mx-auto" style={{ maxWidth: 500 }}>
                <div className="card-body">
                    <h2 className="card-title mb-4">Create User</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name:</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Role:</label>
                            <select
                                name="role"
                                className="form-select"
                                value={form.role}
                                onChange={handleChange}
                            >
                                <option value="driver">Driver</option>
                                <option value="admin">Admin</option>
                                <option value="courier">Courier</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Avatar URL:</label>
                            <input
                                type="text"
                                name="avatar_url"
                                className="form-control"
                                value={form.avatar_url}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Phone Number:</label>
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                value={form.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            Create User
                        </button>
                    </form>
                    {message && (
                        <div className={`alert mt-3 ${message.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateUser;