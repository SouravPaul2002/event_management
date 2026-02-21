import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    Users,
    Store,
    ShoppingBag,
    User as UserIcon,
    LogOut,
    Package,
    ShoppingCart,
    Users2,
    CreditCard,
    BarChart3,
    CalendarDays
} from 'lucide-react';

const MainLayout = ({ role }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const adminLinks = [
        { name: 'Dashboard', path: '/admin/management', icon: Home },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Vendors', path: '/admin/vendors', icon: Store },
        { name: 'Memberships', path: '/admin/memberships', icon: CalendarDays },
        { name: 'Transactions', path: '/admin/transactions', icon: CreditCard },
        { name: 'Summary', path: '/admin/summary', icon: BarChart3 },
    ];

    const vendorLinks = [
        { name: 'Dashboard', path: '/vendor/home', icon: Home },
        { name: 'Your Products', path: '/vendor/products', icon: Package },
        { name: 'Transactions', path: '/vendor/transactions', icon: ShoppingBag },
    ];

    const userLinks = [
        { name: 'Home', path: '/user/home', icon: Home },
        { name: 'Vendors', path: '/user/vendors', icon: Store },
        { name: 'Guest List', path: '/user/guests', icon: Users2 },
        { name: 'My Cart', path: '/user/cart', icon: ShoppingCart },
        { name: 'My Orders', path: '/user/orders', icon: Package },
    ];

    const links = role === 'admin' ? adminLinks : role === 'vendor' ? vendorLinks : userLinks;

    return (
        <div style={{ minHeight: '100vh' }}>
            <header className="glass-nav">
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Event Management System
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{role.toUpperCase()} MODE</span>
                    <button onClick={logout} className="btn btn-outline" style={{ padding: '8px 16px' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </header>

            <div className="sidebar">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`sidebar-link ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </div>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
