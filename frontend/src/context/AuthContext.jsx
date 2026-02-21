import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Backend puts user_id and role in payload
                setUser({
                    id: decoded.user_id,
                    role: decoded.role,
                });
            } catch (err) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user_role');
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        const decoded = jwtDecode(token);
        localStorage.setItem('access_token', token);
        localStorage.setItem('user_role', decoded.role);
        setUser({
            id: decoded.user_id,
            role: decoded.role,
        });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
