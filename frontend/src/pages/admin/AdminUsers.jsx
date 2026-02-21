import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserPlus, Edit2, Trash2, X, Save, Shield, User as UserIcon } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', passwords: '' });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({ name: user.name, email: user.email, passwords: '' });
        } else {
            setEditingUser(null);
            setFormData({ name: '', email: '', passwords: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await api.put(`/admin/update-user/${editingUser.id}?name=${encodeURIComponent(formData.name)}`);
            } else {
                await api.post('/admin/add-user', formData);
            }
            fetchUsers();
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data?.detail || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await api.delete(`/admin/delete-user/${id}`);
            fetchUsers();
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    if (loading) return <div className="main-content">Loading users...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>User Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage system users and their access</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <UserPlus size={18} /> Add New User
                </button>
            </div>

            <div className="premium-card" style={{ padding: '0' }}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? users.map(user => (
                            <tr key={user.id}>
                                <td><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{user.id}</span></td>
                                <td><div style={{ fontWeight: '600' }}>{user.name}</div></td>
                                <td>{user.email}</td>
                                <td>
                                    <div className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                        <UserIcon size={12} /> {user.role}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn btn-outline" style={{ padding: '8px' }} onClick={() => handleOpenModal(user)}>
                                            <Edit2 size={16} color="var(--primary)" />
                                        </button>
                                        <button className="btn btn-outline" style={{ padding: '8px', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(user.id)}>
                                            <Trash2 size={16} color="var(--error)" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No users found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="premium-card" style={{ width: '100%', maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                            <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            {!editingUser && (
                                <div className="input-group">
                                    <label>Initial Password</label>
                                    <input type="password" name="passwords" value={formData.passwords} onChange={handleChange} required />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                    <Save size={18} /> {editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
