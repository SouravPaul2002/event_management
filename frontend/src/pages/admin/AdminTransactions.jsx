import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CreditCard, Calendar, User as UserIcon } from 'lucide-react';

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get('/admin/transactions');
                setTransactions(response.data);
            } catch (err) {
                console.error('Failed to fetch transactions', err);
            }
            setLoading(false);
        };
        fetchTransactions();
    }, []);


    if (loading) return <div className="main-content">Loading transactions...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '32px' }}>Platform Transactions</h1>

            <div className="premium-card" style={{ padding: '0' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                            <th>Payment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? transactions.map(order => (
                            <tr key={order.id}>
                                <td><span style={{ fontWeight: '700' }}>#{order.id}</span></td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '600' }}>{order.name || `User #${order.user_id}`}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.email}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                                        <Calendar size={14} color="var(--text-muted)" />
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td>
                                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{order.total_amount.toFixed(2)}</span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                                        <CreditCard size={14} color="var(--text-muted)" />
                                        {order.payment_method}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No transactions recorded yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTransactions;
