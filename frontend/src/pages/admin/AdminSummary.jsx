import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { TrendingUp, ShoppingBag, DollarSign, BarChart3, Calendar, ArrowUpRight } from 'lucide-react';

const AdminSummary = () => {
    const [summary, setSummary] = useState({ total_orders: 0, total_revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.get('/admin/sales-summary');
                setSummary(response.data);
            } catch (err) {
                console.error('Failed to fetch summary', err);
            }
            setLoading(false);
        };
        fetchSummary();
    }, []);

    if (loading) return <div className="main-content">Loading sales statistics...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '32px' }}>Sales Analytics</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <div className="premium-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                        <DollarSign size={120} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px' }}>
                            <TrendingUp color="var(--success)" size={24} />
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Revenue</span>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800' }}>₹{summary.total_revenue.toFixed(2)}</h2>
                        </div>
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--success)', fontSize: '0.9rem' }}>
                        <ArrowUpRight size={16} /> <span>Live data from all vendors</span>
                    </div>
                </div>

                <div className="premium-card" style={{ position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}>
                        <ShoppingBag size={120} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '12px' }}>
                            <ShoppingBag color="var(--primary)" size={24} />
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Total Bookings</span>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{summary.total_orders}</h2>
                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '0.9rem' }}>
                        <CheckCircle size={16} /> <span>Orders processed across platform</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { CheckCircle } from 'lucide-react';

export default AdminSummary;
