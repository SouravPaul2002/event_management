import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, RoleProtectedRoute } from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// User Pages
import UserVendors from './pages/user/UserVendors';
import UserProducts from './pages/user/UserProducts';
import UserCart from './pages/user/UserCart';
import UserCheckout from './pages/user/UserCheckout';
import UserOrders from './pages/user/UserOrders';
import UserGuests from './pages/user/UserGuests';
import UserHome from './pages/user/UserHome';

// Vendor Pages
import VendorProducts from './pages/vendor/VendorProducts';
import VendorTransactions from './pages/vendor/VendorTransactions';
import VendorHome from './pages/vendor/VendorHome';

// Admin Pages
import AdminUsers from './pages/admin/AdminUsers';
import AdminVendors from './pages/admin/AdminVendors';
import AdminMemberships from './pages/admin/AdminMemberships';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminSummary from './pages/admin/AdminSummary';
import AdminManagement from './pages/admin/AdminManagement';

// Layout Component
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* User Routes */}
        <Route element={<RoleProtectedRoute allowedRoles={['user']} />}>
          <Route element={<MainLayout role="user" />}>
            <Route path="/user" element={<Navigate to="/user/home" replace />} />
            <Route path="/user/home" element={<UserHome />} />
            <Route path="/user/vendors" element={<UserVendors />} />
            <Route path="/user/vendors/:vendorId/products" element={<UserProducts />} />
            <Route path="/user/cart" element={<UserCart />} />
            <Route path="/user/checkout" element={<UserCheckout />} />
            <Route path="/user/orders" element={<UserOrders />} />
            <Route path="/user/guests" element={<UserGuests />} />
          </Route>
        </Route>

        {/* Vendor Routes */}
        <Route element={<RoleProtectedRoute allowedRoles={['vendor']} />}>
          <Route element={<MainLayout role="vendor" />}>
            <Route path="/vendor" element={<Navigate to="/vendor/home" replace />} />
            <Route path="/vendor/home" element={<VendorHome />} />
            <Route path="/vendor/products" element={<VendorProducts />} />
            <Route path="/vendor/transactions" element={<VendorTransactions />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<MainLayout role="admin" />}>
            <Route path="/admin" element={<Navigate to="/admin/management" replace />} />
            <Route path="/admin/management" element={<AdminManagement />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/vendors" element={<AdminVendors />} />
            <Route path="/admin/memberships" element={<AdminMemberships />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
            <Route path="/admin/summary" element={<AdminSummary />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
