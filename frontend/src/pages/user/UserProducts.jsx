import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react';

const UserProducts = () => {
    const { vendorId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null);
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/user/products', { params: { vendor_id: vendorId } });
                setProducts(response.data);
                // Initialize quantities to 1
                const initialQuants = {};
                response.data.forEach(p => initialQuants[p.id] = 1);
                setQuantities(initialQuants);
            } catch (err) {
                console.error('Failed to fetch products', err);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [vendorId]);

    const handleQuantityChange = (id, delta) => {
        setQuantities(prev => ({
            ...prev,
            [id]: Math.max(1, (prev[id] || 1) + delta)
        }));
    };

    const handleAddToCart = async (product) => {
        setAddingId(product.id);
        try {
            await api.post('/cart/add', {
                product_id: product.id,
                quantity: quantities[product.id] || 1
            });
            alert(`${product.name} added to cart!`);
        } catch (err) {
            alert('Failed to add to cart: ' + (err.response?.data?.detail || 'Error'));
        }
        setAddingId(null);
    };

    if (loading) return <div className="main-content">Loading products...</div>;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button className="btn btn-outline" onClick={() => navigate('/user/vendors')}>
                    <ArrowLeft size={18} /> Back to Vendors
                </button>
                <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Available Services</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {products.length > 0 ? products.map(product => (
                    <div key={product.id} className="premium-card">
                        {product.image_url ? (
                            <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
                        ) : (
                            <div style={{ height: '180px', background: 'var(--surface-hover)', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Package size={48} color="var(--text-muted)" />
                            </div>
                        )}
                        <h3 style={{ marginBottom: '8px' }}>{product.name}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px', height: '40px', overflow: 'hidden' }}>{product.description}</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>₹{product.price}</span>
                            <span style={{ fontSize: '0.85rem', color: product.stock > 0 ? 'var(--success)' : 'var(--error)' }}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                                <button
                                    className="btn"
                                    style={{ padding: '8px' }}
                                    onClick={() => handleQuantityChange(product.id, -1)}
                                    disabled={product.stock === 0}
                                >
                                    <Minus size={16} />
                                </button>
                                <span style={{ width: '30px', textAlign: 'center' }}>{quantities[product.id]}</span>
                                <button
                                    className="btn"
                                    style={{ padding: '8px' }}
                                    onClick={() => handleQuantityChange(product.id, 1)}
                                    disabled={product.stock === 0 || quantities[product.id] >= product.stock}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 1, justifyContent: 'center' }}
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock === 0 || addingId === product.id}
                            >
                                {addingId === product.id ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                )) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        This vendor has no products available.
                    </div>
                )}
            </div>
        </div>
    );
};

import { Package } from 'lucide-react';

export default UserProducts;
