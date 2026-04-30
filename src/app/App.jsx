import { Routes, Route, Navigate } from 'react-router';
import MainSite from './MainSite';
import DashboardLogin from '../Dashboard/DashboardLogin';
import DashboardLayout from '../Dashboard/DashboardLayout';
import Overview from '../Dashboard/Overview';
import BannerManagement from '../Dashboard/BannerManagement';
import ProductManagement from '../Dashboard/ProductManagement';

import HomeManagement from '../Dashboard/HomeManagement';

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
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomeManagement />} />
        <Route path="banner" element={<BannerManagement />} />
        <Route path="products" element={<ProductManagement />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
