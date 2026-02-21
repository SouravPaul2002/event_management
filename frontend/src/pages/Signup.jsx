import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        passwords: '',
        role: 'user',
        category: '',
        image_url: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // Simple validation
        if (formData.role === 'vendor' && !formData.category) {
            setError('Category is required for vendors');
            return;
        }

        try {
            await api.post('/auth/signup', formData);
            setMessage('Signup successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed. Please try again.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', padding: '40px 0' }}>
            <div className="premium-card" style={{ width: '100%', maxWidth: '450px' }}>
                <h2 style={{ marginBottom: '24px', textAlign: 'center', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Create Account</h2>

                {error && <div className="badge badge-error" style={{ width: '100%', marginBottom: '16px', padding: '12px', textAlign: 'center' }}>{error}</div>}
                {message && <div className="badge badge-success" style={{ width: '100%', marginBottom: '16px', padding: '12px', textAlign: 'center' }}>{message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="passwords" value={formData.passwords} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="user">User</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {formData.role === 'vendor' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="input-group">
                                <label>Service Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} required>
                                    <option value="">Select a category</option>
                                    <option value="catering">Catering</option>
                                    <option value="florist">Florist</option>
                                    <option value="decoration">Decoration</option>
                                    <option value="lighting">Lighting</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Profile Image URL</label>
                                <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>Sign Up</button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
