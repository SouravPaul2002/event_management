import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
    Package,
    ShoppingBag,
    TrendingUp,
    ArrowRight,
    Truck,
    CheckCircle,
    Clock,
    DollarSign
} from 'lucide-react';

const VendorHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ products: 0, sales: 0, revenue: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [pRes, tRes] = await Promise.all([
                    api.get('/vendor/my-products'),
                    api.get('/vendor/transactions')
                ]);

                const products = pRes.data.length;
                const sales = tRes.data.length;
                const revenue = tRes.data.reduce((acc, curr) => acc + (parseFloat(curr.price) * curr.quantity), 0);

                setStats({ products, sales, revenue });
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    const actions = [
        {
            title: 'Manage Products',
            description: 'Add new services or update your existing inventory.',
            path: '/vendor/products',
            icon: Package,
            color: '#6366f1'
        },
        {
            title: 'View Transactions',
            description: 'Check your sales history and update shipping status.',
            path: '/vendor/transactions',
            icon: ShoppingBag,
            color: '#ec4899'
        }
    ];

    if (loading) return <div className="main-content">Loading your dashboard...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>Vendor Dashboard</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Here's how your business is performing today.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DollarSign size={32} color="#6366f1" />
                    </div>
                    <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Total Revenue</span>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>₹{stats.revenue.toFixed(2)}</h2>
                    </div>
                </div>

                <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ShoppingBag size={32} color="#ec4899" />
                    </div>
                    <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Total Sales</span>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{stats.sales}</h2>
                    </div>
                </div>

                <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Package size={32} color="#10b981" />
                    </div>
                    <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Live Products</span>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{stats.products}</h2>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                {actions.map(action => {
                    const Icon = action.icon;
                    return (
                        <div
                            key={action.title}
                            className="premium-card"
                            style={{
                                cursor: 'pointer',
                                padding: '40px',
                                border: '1px solid var(--border)',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => navigate(action.path)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = action.color;
                                e.currentTarget.style.transform = 'translateY(-5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{ marginBottom: '24px' }}>
                                <Icon size={40} color={action.color} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{action.title}</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>{action.description}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: action.color, fontWeight: '700' }}>
                                Manage Now <ArrowRight size={18} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VendorHome;
