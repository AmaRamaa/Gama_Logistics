import React from 'react';
import { supabase } from '../../supaBase/supaBase';
import 'bootstrap/dist/css/bootstrap.min.css';

const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover'
};

const Driver = () => {
    const [users, setUsers] = React.useState([]);
    const [editingUser, setEditingUser] = React.useState(null);
    const [form, setForm] = React.useState({
        name: '',
        email: '',
        avatar_url: '',
        role: '',
        phone: ''
    });

    React.useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('Users')
                .select('*');
            if (!error) setUsers(data);
        };
        fetchUsers();
    }, []);

    const handleEdit = (user) => {
        setEditingUser(user.id);
        setForm({
            name: user.name || '',
            email: user.email || '',
            avatar_url: user.avatar_url || '',
            role: user.role || '',
            phone: user.phone || ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const { data, error } = await supabase
            .from('users')
            .update(form)
            .eq('id', editingUser)
            .select()
            .single();
        if (!error && data) {
            setUsers(users.map(u => u.id === editingUser ? data : u));
            setEditingUser(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);
        if (!error) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Edit Users</h2>
            <table className="table table-bordered table-hover mt-3">
                <thead className="thead-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Avatar</th>
                        <th>Role</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            {editingUser === user.id ? (
                                <>
                                    <td>
                                        <input
                                            className="form-control"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            name="avatar_url"
                                            value={form.avatar_url}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            name="phone"
                                            value={form.phone}
                                            onChange={handleChange}
                                        />
                                    </td>
                                    <td>
                                        <button className="btn btn-success btn-sm me-2" onClick={handleSave}>Save</button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => setEditingUser(null)}>Cancel</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt={user.name}
                                                style={avatarStyle}
                                            />
                                        ) : (
                                            <span>No Avatar</span>
                                        )}
                                    </td>
                                    <td>{user.role}</td>
                                    <td>{user.phone}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(user)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Driver;
