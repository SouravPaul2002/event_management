import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingBag, ShoppingCart, Users, ArrowRight, Heart, Calendar } from 'lucide-react';

const UserHome = () => {
    const navigate = useNavigate();

    const quickLinks = [
        {
            title: 'Browse Vendors',
            description: 'Find the best catering, decoration, and more for your event.',
            icon: Store,
            path: '/user/vendors',
            color: '#6366f1',
            bg: 'rgba(99, 102, 241, 0.1)'
        },
        {
            title: 'My Orders',
            description: 'Track your bookings and view your order history.',
            icon: ShoppingBag,
            path: '/user/orders',
            color: '#ec4899',
            bg: 'rgba(236, 72, 153, 0.1)'
        },
        {
            title: 'Shopping Cart',
            description: 'Review your selected services and proceed to checkout.',
            icon: ShoppingCart,
            path: '/user/cart',
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.1)'
        },
        {
            title: 'Guest List',
            description: 'Manage your invitees and track RSVPs easily.',
            icon: Users,
            path: '/user/guests',
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.1)'
        }
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>Welcome Back!</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Ready to plan your next spectacular event?</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                        <div
                            key={link.title}
                            className="premium-card"
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                padding: '32px',
                                transition: 'all 0.3s ease'
                            }}
                            onClick={() => navigate(link.path)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.borderColor = link.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = 'var(--border)';
                            }}
                        >
                            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: link.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                <Icon size={32} color={link.color} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{link.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{link.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UserHome;
