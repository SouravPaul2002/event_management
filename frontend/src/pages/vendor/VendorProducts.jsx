import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Power, PowerOff, Package, X, Save } from 'lucide-react';

const VendorProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: ''
    });

    const fetchProducts = async () => {
        try {
            const response = await api.get('/vendor/my-products');
            setProducts(response.data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price,
                stock: product.stock,
                image_url: product.image_url || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', stock: '', image_url: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/vendor/update-product/${editingProduct.id}`, formData);
            } else {
                await api.post('/vendor/add-product', formData);
            }
            fetchProducts();
            handleCloseModal();
        } catch (err) {
            alert('Failed to save product');
        }
    };

    const handleToggleStatus = async (productId) => {
        try {
            await api.put(`/vendor/toggle-status/${productId}`);
            fetchProducts();
        } catch (err) {
            alert('Failed to toggle status');
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Delete this product permanently?')) return;
        try {
            await api.delete(`/vendor/delete-product/${productId}`);
            fetchProducts();
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    if (loading) return <div className="main-content">Loading your products...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Your Products & Services</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your inventory and availability</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Add New Product
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {products.length > 0 ? products.map(product => (
                    <div key={product.id} className="premium-card">
                        <div style={{ position: 'relative' }}>
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
                            ) : (
                                <div style={{ height: '180px', background: 'var(--surface-hover)', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Package size={48} color="var(--text-muted)" />
                                </div>
                            )}
                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                <span className={`badge ${product.status === 'available' ? 'badge-success' : 'badge-error'}`}>
                                    {product.status}
                                </span>
                            </div>
                        </div>

                        <h3 style={{ marginBottom: '8px' }}>{product.name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>₹{product.price}</span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Stock: {product.stock}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <button className="btn btn-outline" onClick={() => handleOpenModal(product)}>
                                <Edit2 size={16} /> Edit
                            </button>
                            <button
                                className={`btn ${product.status === 'available' ? 'btn-outline' : 'btn-primary'}`}
                                onClick={() => handleToggleStatus(product.id)}
                                style={{ borderColor: product.status === 'available' ? 'var(--error)' : 'var(--success)', background: product.status === 'available' ? 'transparent' : 'var(--success)' }}
                            >
                                {product.status === 'available' ? <PowerOff size={16} color="var(--error)" /> : <Power size={16} color="white" />}
                                <span style={{ color: product.status === 'available' ? 'var(--error)' : 'white' }}>{product.status === 'available' ? 'Hide' : 'Show'}</span>
                            </button>
                            <button className="btn btn-outline" style={{ gridColumn: 'span 2', justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)' }} onClick={() => handleDelete(product.id)}>
                                <Trash2 size={16} /> Delete Product
                            </button>
                        </div>
                    </div>
                )) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px' }}>
                        <Package size={64} color="var(--text-muted)" style={{ marginBottom: '20px' }} />
                        <h3>No products found</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Start adding your services to reach customers.</p>
                        <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add Your First Product</button>
                    </div>
                )}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="premium-card" style={{ width: '100%', maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Product Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} style={{ width: '100%', minHeight: '100px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', color: 'var(--text)' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div className="input-group">
                                    <label>Price (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" />
                                </div>
                                <div className="input-group">
                                    <label>Stock</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Image URL (Optional)</label>
                                <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} />
                            </div>

                            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                    <Save size={18} /> {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorProducts;
