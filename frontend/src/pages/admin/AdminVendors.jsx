import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { UserPlus, Edit2, Trash2, X, Save, Store, Mail } from 'lucide-react';

const AdminVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', passwords: '', category: '' });

    const categories = ['catering', 'florist', 'decoration', 'lighting'];

    const fetchVendors = async () => {
        try {
            const response = await api.get('/admin/vendors');
            setVendors(response.data);
        } catch (err) {
            console.error('Failed to fetch vendors', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleOpenModal = (vendor = null) => {
        if (vendor) {
            setEditingVendor(vendor);
            setFormData({ name: vendor.name, email: vendor.email, passwords: '', category: vendor.category || '' });
        } else {
            setEditingVendor(null);
            setFormData({ name: '', email: '', passwords: '', category: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingVendor(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVendor) {
                await api.put(`/admin/update-vendor/${editingVendor.id}?name=${encodeURIComponent(formData.name)}&category=${encodeURIComponent(formData.category)}`);
            } else {
                await api.post('/admin/add-vendor', formData);
            }
            fetchVendors();
            handleCloseModal();
        } catch (err) {
            alert(err.response?.data?.detail || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vendor?')) return;
        try {
            await api.delete(`/admin/delete-vendor/${id}`);
            fetchVendors();
        } catch (err) {
            alert('Failed to delete vendor');
        }
    };

    if (loading) return <div className="main-content">Loading vendors...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Vendor Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Oversee partner event services</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <UserPlus size={18} /> Add New Vendor
                </button>
            </div>

            <div className="premium-card" style={{ padding: '0' }}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.length > 0 ? vendors.map(vendor => (
                            <tr key={vendor.id}>
                                <td><span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>#{vendor.id}</span></td>
                                <td><div style={{ fontWeight: '600' }}>{vendor.name}</div></td>
                                <td>{vendor.email}</td>
                                <td>
                                    <div className="badge badge-warning" style={{ textTransform: 'capitalize' }}>
                                        {vendor.category}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn btn-outline" style={{ padding: '8px' }} onClick={() => handleOpenModal(vendor)}>
                                            <Edit2 size={16} color="var(--primary)" />
                                        </button>
                                        <button className="btn btn-outline" style={{ padding: '8px', borderColor: 'rgba(239, 68, 68, 0.2)' }} onClick={() => handleDelete(vendor.id)}>
                                            <Trash2 size={16} color="var(--error)" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No vendors found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="premium-card" style={{ width: '100%', maxWidth: '450px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3>{editingVendor ? 'Edit Vendor' : 'Add New Vendor'}</h3>
                            <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Vendor Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} required>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
                                </select>
                            </div>
                            {!editingVendor && (
                                <div className="input-group">
                                    <label>Initial Password</label>
                                    <input type="password" name="passwords" value={formData.passwords} onChange={handleChange} required />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                    <Save size={18} /> {editingVendor ? 'Update Vendor' : 'Create Vendor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVendors;
