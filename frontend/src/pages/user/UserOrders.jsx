import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Package, Clock, Truck, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/my-orders');
                setOrders(response.data);
            } catch (err) {
                console.error('Failed to fetch orders', err);
            }
            setLoading(false);
        };
        fetchOrders();
    }, []);


    const getShippingStatusConfig = (status) => {
        switch (status) {
            case 'received':
                return { label: 'Received', color: 'var(--warning)', icon: Clock };
            case 'ready_for_shipping':
                return { label: 'Ready for Shipping', color: 'var(--primary)', icon: Package };
            case 'out_for_delivery':
                return { label: 'Out for Delivery', color: 'var(--success)', icon: Truck };
            default:
                return { label: status, color: 'var(--text-muted)', icon: Package };
        }
    };

    if (loading) return <div className="main-content">Loading your orders...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '32px' }}>Your Orders</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders.length > 0 ? orders.map(order => (
                    <div key={order.order_id} className="premium-card" style={{ padding: '0' }}>
                        <div
                            style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => setExpandedId(expandedId === order.order_id ? null : order.order_id)}
                        >
                            <div style={{ display: 'flex', gap: '24px' }}>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>ORDER ID</div>
                                    <div style={{ fontWeight: '700' }}>#{order.order_id}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>DATE</div>
                                    <div style={{ fontWeight: '600' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>TOTAL</div>
                                    <div style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{order.total_amount.toFixed(2)}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '700' }}>
                                <span>STATUS</span>
                                {expandedId === order.order_id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {expandedId === order.order_id && (
                            <div style={{ padding: '0 24px 24px', borderTop: '1px solid var(--border)', marginTop: '-8px', paddingTop: '24px' }}>
                                <h4 style={{ marginBottom: '16px' }}>Items & Shipping Status</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {order.items.map((item, idx) => {
                                        const config = getShippingStatusConfig(item.shipping_status);
                                        const StatusIcon = config.icon;
                                        return (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--surface)', borderRadius: '12px', border: `1px solid ${config.color}20` }}>
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{item.product_name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} • ₹{item.price} each</div>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: config.color }}>
                                                    <StatusIcon size={18} />
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{config.label}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="premium-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No orders found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserOrders;
