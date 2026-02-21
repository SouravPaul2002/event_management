import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    ShoppingBag,
    User as UserIcon,
    Mail,
    MapPin,
    Phone,
    Calendar,
    Truck,
    CheckCircle2,
    Package,
    ChevronDown
} from 'lucide-react';

const VendorTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/vendor/transactions');
            // If no transactions found, backend returns a message object
            if (response.data.message) {
                setTransactions([]);
            } else {
                setTransactions(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch transactions', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleStatusUpdate = async (orderItemId, newStatus) => {
        setUpdatingId(orderItemId);
        try {
            await api.put(`/vendor/update-status/${orderItemId}`, null, {
                params: { new_status: newStatus }
            });
            fetchTransactions();
        } catch (err) {
            alert('Failed to update status: ' + (err.response?.data?.detail || 'Error'));
        }
        setUpdatingId(null);
    };

    const statusOptions = [
        { value: 'received', label: 'Received', color: 'var(--warning)' },
        { value: 'ready_for_shipping', label: 'Ready for Shipping', color: 'var(--primary)' },
        { value: 'out_for_delivery', label: 'Out for Delivery', color: 'var(--success)' }
    ];

    if (loading) return <div className="main-content">Loading sales history...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '32px' }}>Your Sales Transactions</h1>

            {transactions.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {transactions.map((t) => (
                        <div key={t.order_item_id} className="premium-card" style={{ padding: '0' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', borderBottom: '1px solid var(--border)' }}>
                                {/* Product & Order Info */}
                                <div style={{ padding: '24px', borderRight: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '12px' }}>
                                            <Package color="var(--primary)" size={24} />
                                        </div>
                                        <div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700' }}>ORDER #{t.order_id}</div>
                                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>{t.product_name}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontWeight: '600' }}>Qty: {t.quantity}</div>
                                        <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.2rem' }}>₹{(t.price * t.quantity).toFixed(2)}</div>
                                    </div>
                                </div>

                                {/* Customer Details */}
                                <div style={{ padding: '24px', borderRight: '1px solid var(--border)' }}>
                                    <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Customer Details</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem' }}>
                                            <UserIcon size={14} /> <strong>{t.customer_name}</strong>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <Mail size={14} /> {t.customer_email}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <Phone size={14} /> {t.customer_phone}
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping info & Status */}
                                <div style={{ padding: '24px' }}>
                                    <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Shipping Status</h4>
                                    <div className="input-group" style={{ marginBottom: '0' }}>
                                        <select
                                            value={t.shipping_status}
                                            onChange={(e) => handleStatusUpdate(t.order_item_id, e.target.value)}
                                            disabled={updatingId === t.order_item_id}
                                            style={{
                                                borderColor: statusOptions.find(o => o.value === t.shipping_status)?.color,
                                                fontWeight: '600'
                                            }}
                                        >
                                            {statusOptions.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {updatingId === t.order_item_id && <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--primary)' }}>Updating...</div>}

                                    <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        <MapPin size={14} /> {t.city}, {t.state}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="premium-card" style={{ textAlign: 'center', padding: '60px' }}>
                    <ShoppingBag size={64} color="var(--text-muted)" style={{ marginBottom: '20px' }} />
                    <h3>No sales record found</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Keep growing your business to see transactions here.</p>
                </div>
            )}
        </div>
    );
};

export default VendorTransactions;
