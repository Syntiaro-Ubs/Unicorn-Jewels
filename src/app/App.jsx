import { Routes, Route, Navigate } from 'react-router';
import MainSite from './MainSite';
import DashboardLogin from '../Dashboard/DashboardLogin';
import DashboardLayout from '../Dashboard/DashboardLayout';
import Overview from '../Dashboard/Overview';
import BannerManagement from '../Dashboard/BannerManagement';
import ProductManagement from '../Dashboard/ProductManagement';
import TaxonomyManagement from '../Dashboard/TaxonomyManagement';
import ShopByLookManagement from '../Dashboard/ShopByLookManagement';

import HomeManagement from '../Dashboard/HomeManagement';
import UserManagement from '../Dashboard/UserManagement';
import TeamManagement from '../Dashboard/TeamManagement';
import OrderManagement from '../Dashboard/OrderManagement';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/dashboard/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Main Website Route */}
      <Route path="/*" element={<MainSite />} />

      {/* Dashboard Routes */}
      <Route path="/dashboard/login" element={<DashboardLogin />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="home" element={<HomeManagement />} />
        <Route path="banner" element={<BannerManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="taxonomy" element={<TaxonomyManagement />} />
        <Route path="shop-by-look" element={<ShopByLookManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="team" element={<TeamManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
