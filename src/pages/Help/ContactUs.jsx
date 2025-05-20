import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactUs = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="container mt-5" style={{ maxWidth: 500 }}>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h2 className="card-title mb-4">Contact Us</h2>
                    {submitted ? (
                        <div className="alert alert-success">
                            Thank you for contacting us! We will get back to you soon.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Message</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className="form-control"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary px-4">Send</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;