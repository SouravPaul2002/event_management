import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const UserCart = () => {
    const [cartData, setCartData] = useState({ items: [], grand_total: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart/my-cart');
            setCartData(response.data);
        } catch (err) {
            console.error('Failed to fetch cart', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = async (itemId) => {
        if (!window.confirm('Remove this item?')) return;
        try {
            await api.delete(`/cart/remove/${itemId}`);
            fetchCart();
        } catch (err) {
            alert('Failed to remove item');
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        try {
            await api.put('/cart/update-quantity', {
                cart_item_id: itemId,
                quantity: parseInt(newQuantity)
            });
            fetchCart();
        } catch (err) {
            alert('Failed to update quantity');
        }
    };

    if (loading) return <div className="main-content">Loading your cart...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '32px' }}>Your Shopping Cart</h1>

            {cartData.items.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>
                    <div>
                        <div className="premium-card" style={{ padding: '0' }}>
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: 'left', padding: '16px 24px' }}>Product</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px' }}>Price</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px' }}>Quantity</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px' }}>Total</th>
                                        <th style={{ textAlign: 'left', padding: '16px 24px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartData.items.map((item) => (
                                        <tr key={item.cart_item_id} style={{ borderTop: '1px solid var(--border)' }}>
                                            <td style={{ padding: '16px 24px' }}>
                                                <div style={{ fontWeight: '600' }}>{item.product_name}</div>
                                            </td>
                                            <td style={{ padding: '16px 24px' }}>₹{item.price.toFixed(2)}</td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <select
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.cart_item_id, e.target.value)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid var(--border)',
                                                        background: 'var(--surface)',
                                                        color: 'var(--text)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {[...Array(10).keys()].map(n => (
                                                        <option key={n + 1} value={n + 1}>{n + 1}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td style={{ padding: '16px 24px', fontWeight: '700', color: 'var(--primary)' }}>₹{item.item_total.toFixed(2)}</td>
                                            <td style={{ padding: '16px 24px' }}>
                                                <button className="btn btn-outline" style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)', padding: '8px' }} onClick={() => handleRemove(item.cart_item_id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="premium-card">
                        <h3 style={{ marginBottom: '24px' }}>Order Summary</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--text-muted)' }}>
                            <span>Subtotal</span>
                            <span>₹{cartData.grand_total.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontWeight: '700', fontSize: '1.2rem', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                            <span>Grand Total</span>
                            <span style={{ color: 'var(--primary)' }}>₹{cartData.grand_total.toFixed(2)}</span>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} onClick={() => navigate('/user/checkout')}>
                            Proceed to Checkout <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="premium-card" style={{ textAlign: 'center', padding: '60px' }}>
                    <ShoppingBag size={64} color="var(--text-muted)" style={{ marginBottom: '20px' }} />
                    <h3>Your cart is empty</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Looks like you haven't added anything yet.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/user/vendors')}>Explore Vendors</button>
                </div>
            )}
        </div>
    );
};

export default UserCart;
