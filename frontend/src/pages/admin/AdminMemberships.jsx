import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CalendarDays, Plus, Clock, XCircle, User as UserIcon, Calendar, CheckCircle } from 'lucide-react';

const AdminMemberships = () => {
    const [memberships, setMemberships] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ user_id: '', duration: '6m' });

    const fetchData = async () => {
        try {
            const [mRes, uRes] = await Promise.all([
                api.get('/admin/users'), // To list users for selection
                api.get('/admin/vendors') // We need vendors for memberships usually
            ]);
            // Assuming GET /admin/memberships exists or we list all vendors/users and check membership status
            // Wait, let me check backend for membership listing
            const mList = await api.get('/admin/memberships'); // I should check if this exists
            setMemberships(mList.data);
            setUsers([...uRes.data]); // Focus on vendors for memberships
        } catch (err) {
            console.error('Failed to fetch memberships', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/create-membership', {
                user_id: parseInt(formData.user_id),
                duration: formData.duration
            });
            alert('Membership created successfully');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.detail || 'Operation failed');
        }
    };

    const handleExtend = async (id) => {
        try {
            await api.put('/admin/extend-membership', {
                membership_id: id,
                months: 6
            });
            alert('Membership extended');
            fetchData();
        } catch (err) {
            alert('Failed to extend');
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this membership?')) return;
        try {
            await api.put('/admin/cancel-membership', {
                membership_id: id
            });
            alert('Membership cancelled');
            fetchData();
        } catch (err) {
            alert('Failed to cancel');
        }
    };

    if (loading) return <div className="main-content">Loading membership data...</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '32px' }}>Active Memberships</h1>

                <div className="premium-card" style={{ padding: '0' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Vendor</th>
                                <th>Status</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {memberships.length > 0 ? memberships.map(m => (
                                <tr key={m.id}>
                                    <td>
                                        <div style={{ fontWeight: '600' }}>{m.user_name || `User #${m.user_id}`}</div>
                                    </td>
                                    <td>
                                        <div className={`badge ${m.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                                            {m.status}
                                        </div>
                                    </td>
                                    <td>{new Date(m.start_date).toLocaleDateString()}</td>
                                    <td>{new Date(m.end_date).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '6px', opacity: m.status !== 'active' ? 0.5 : 1 }}
                                                title={m.status !== 'active' ? "Cannot extend" : "Extend 6m"}
                                                onClick={() => m.status === 'active' && handleExtend(m.id, '6m')}
                                                disabled={m.status !== 'active'}
                                            >
                                                <Clock size={16} color={m.status !== 'active' ? "var(--text-muted)" : "var(--primary)"} />
                                            </button>
                                            <button className="btn btn-outline" style={{ padding: '6px', borderColor: 'rgba(239, 68, 68, 0.1)' }} title="Cancel" onClick={() => handleCancel(m.id)}>
                                                <XCircle size={16} color="var(--error)" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No memberships found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '24px' }}>Issue Membership</h2>
                <form className="premium-card" onSubmit={handleCreate}>
                    <div className="input-group">
                        <label>Select Vendor</label>
                        <select value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} required>
                            <option value="">Select Vendor</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.name} ({u.category})</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Duration</label>
                        <select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}>
                            <option value="6m">6 Months</option>
                            <option value="1y">1 Year</option>
                            <option value="2y">2 Years</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                        <Calendar size={18} /> Activate Membership
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminMemberships;
