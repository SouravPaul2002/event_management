import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';

const UserCheckout = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
        payment_method: 'cash'
    });
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/orders/checkout', formData);
            setSuccessData(response.data);
        } catch (err) {
            alert('Checkout failed: ' + (err.response?.data?.detail || 'Error'));
        }
        setLoading(false);
    };

    if (successData) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
                <div className="premium-card" style={{ maxWidth: '500px' }}>
                    <CheckCircle size={80} color="var(--success)" style={{ marginBottom: '24px' }} />
                    <h1 style={{ marginBottom: '16px' }}>Order Placed!</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
                        Thank you for your booking. Your Order ID is <strong style={{ color: 'var(--text)' }}>#{successData.order_id}</strong>
                    </p>
                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                        <button className="btn btn-primary" onClick={() => navigate('/user/orders')}>View My Orders</button>
                        <button className="btn btn-outline" onClick={() => navigate('/user/vendors')}>Continue Shopping</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '32px' }}>Checkout</h1>

            <form onSubmit={handleSubmit} className="premium-card">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                        <label>Shipping Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Pincode</label>
                        <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Payment Method</label>
                        <select name="payment_method" value={formData.payment_method} onChange={handleChange}>
                            <option value="cash">Cash on Delivery</option>
                            <option value="upi">UPI / Online</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '14px 40px' }} disabled={loading}>
                        {loading ? 'Processing...' : 'Place Order'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserCheckout;
