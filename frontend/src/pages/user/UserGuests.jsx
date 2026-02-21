import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserPlus, Edit2, Trash2, Mail, Phone, X, Save } from 'lucide-react';

const UserGuests = () => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', contact_number: '' });

    const fetchGuests = async () => {
        try {
            const response = await api.get('/guest/my-guests');
            setGuests(response.data);
        } catch (err) {
            console.error('Failed to fetch guests', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    const handleOpenModal = (guest = null) => {
        if (guest) {
            setEditingGuest(guest);
            setFormData({ name: guest.name, email: guest.email, contact_number: guest.contact_number });
        } else {
            setEditingGuest(null);
            setFormData({ name: '', email: '', contact_number: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingGuest(null);
        setFormData({ name: '', email: '', contact_number: '' });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingGuest) {
                await api.put(`/guest/update/${editingGuest.id}`, formData);
            } else {
                await api.post('/guest/add', formData);
            }
            fetchGuests();
            handleCloseModal();
        } catch (err) {
            alert('Failed to save guest');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this guest?')) return;
        try {
            await api.delete(`/guest/delete/${id}`);
            fetchGuests();
        } catch (err) {
            alert('Failed to delete guest');
        }
    };

    if (loading) return <div className="main-content">Loading guest list...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Guest List</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your event invitation list</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <UserPlus size={18} /> Add New Guest
                </button>
            </div>

            <div className="premium-card" style={{ padding: '0' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact Number</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guests.length > 0 ? guests.map(guest => (
                            <tr key={guest.id}>
                                <td><div style={{ fontWeight: '600' }}>{guest.name}</div></td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                        <Phone size={14} /> {guest.contact_number}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                                        <Mail size={14} /> {guest.email}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn btn-outline" style={{ padding: '8px' }} onClick={() => handleOpenModal(guest)}>
                                            <Edit2 size={16} color="var(--primary)" />
                                        </button>
                                        <button className="btn btn-outline" style={{ padding: '8px', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(guest.id)}>
                                            <Trash2 size={16} color="var(--error)" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                    No guests added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="premium-card" style={{ width: '100%', maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</h3>
                            <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Guest Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Contact Number</label>
                                <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                    <Save size={18} /> {editingGuest ? 'Update Guest' : 'Add Guest'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserGuests;
