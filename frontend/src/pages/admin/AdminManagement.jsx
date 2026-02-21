import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Store, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';

const AdminManagement = () => {
    const navigate = useNavigate();

    const options = [
        {
            title: 'User Management',
            description: 'Oversee regular users, view their activity, and manage access permissions or registrations.',
            icon: Users,
            path: '/admin/users',
            color: '#6366f1',
            badge: 'System Users',
            iconBg: 'rgba(99, 102, 241, 0.1)'
        },
        {
            title: 'Vendor Management',
            description: 'Manage partner vendors, review service categories, and handle business account settings.',
            icon: Store,
            path: '/admin/vendors',
            color: '#ec4899',
            badge: 'Service Partners',
            iconBg: 'rgba(236, 72, 153, 0.1)'
        }
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '48px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px' }}>Management Hub</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Centralized control for all participants in the Event Management ecosystem.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
                {options.map((option) => {
                    const Icon = option.icon;
                    return (
                        <div
                            key={option.title}
                            className="premium-card"
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '320px',
                                border: '1px solid var(--border)'
                            }}
                            onClick={() => navigate(option.path)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.borderColor = option.color;
                                e.currentTarget.style.boxShadow = `0 20px 25px -5px ${option.color}20`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: option.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={32} color={option.color} />
                                    </div>
                                    <span className="badge" style={{ background: 'var(--surface-hover)', color: 'var(--text-muted)' }}>{option.badge}</span>
                                </div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '16px' }}>{option.title}</h2>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>{option.description}</p>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: option.color, fontWeight: '700', marginTop: 'auto', paddingTop: '24px' }}>
                                Access Module <ArrowRight size={18} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default AdminManagement;
