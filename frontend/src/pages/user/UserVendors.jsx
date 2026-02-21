import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Store } from 'lucide-react';

const UserVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [category, setCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categories = ['catering', 'florist', 'decoration', 'lighting'];

    const fetchVendors = async (cat = '') => {
        setLoading(true);
        try {
            const response = await api.get('/user/vendors', { params: { category: cat } });
            setVendors(response.data);
        } catch (err) {
            console.error('Failed to fetch vendors', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleCategoryClick = (cat) => {
        const newCat = category === cat ? '' : cat;
        setCategory(newCat);
        fetchVendors(newCat);
    };

    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Find Your Perfect Vendor</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Browse top-rated event services near you</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '300px' }}>
                    <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder=""
                        style={{ width: '100%', padding: '14px 14px 14px 48px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                    <button
                        className={`btn ${category === '' ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handleCategoryClick('')}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`btn ${category === cat ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => handleCategoryClick(cat)}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading vendors...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {filteredVendors.length > 0 ? filteredVendors.map(vendor => (
                        <div key={vendor.id} className="premium-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/user/vendors/${vendor.id}/products`)}>
                            <div style={{ height: '180px', background: 'linear-gradient(45deg, #f1f5f9, #e2e8f0)', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {vendor.image_url ? (
                                    <img src={vendor.image_url} alt={vendor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Store size={48} color="var(--primary)" />
                                )}
                            </div>
                            <h3 style={{ marginBottom: '8px' }}>{vendor.name}</h3>
                            <div className="badge badge-success" style={{ marginBottom: '12px', textTransform: 'capitalize' }}>{vendor.category}</div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>{vendor.email}</p>
                            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>View Products</button>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            No vendors found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserVendors;
