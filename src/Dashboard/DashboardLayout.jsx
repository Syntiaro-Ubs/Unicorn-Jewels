import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  ShoppingBag,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  Image as ImageIcon,
  FolderTree,
  ShieldAlert,
  Palette,
  Package,
  TrendingUp
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router';
import { DASHBOARD_PERMISSION_IDS } from './dashboardPermissions';

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');
    if (!token || !user) {
      navigate('/dashboard/login');
    } else {
      setAdminUser(JSON.parse(user));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/dashboard/login');
  };

  const userPermissions = adminUser?.username === 'admin'
    ? Array.from(new Set([...(adminUser?.permissions || []), ...DASHBOARD_PERMISSION_IDS]))
    : (adminUser?.permissions || []);

  const navItems = [
    { id: 'overview', name: 'Overview', icon: <TrendingUp size={20} />, path: '/dashboard/overview' },
    { id: 'home', name: 'Home Page', icon: <Home size={20} />, path: '/dashboard/home' },
    { id: 'banner', name: 'Banner Management', icon: <ImageIcon size={20} />, path: '/dashboard/banner' },
    { id: 'products', name: 'Products', icon: <ShoppingBag size={20} />, path: '/dashboard/products' },
    { id: 'taxonomy', name: 'Collections & Categories', icon: <FolderTree size={20} />, path: '/dashboard/taxonomy' },
    { id: 'shop-by-look', name: 'Shop by Look', icon: <Palette size={20} />, path: '/dashboard/shop-by-look' },
    { id: 'users', name: 'Customer Directory', icon: <User size={20} />, path: '/dashboard/users' },
    { id: 'orders', name: 'Orders', icon: <Package size={20} />, path: '/dashboard/orders' },
    { id: 'team', name: 'Team Management', icon: <ShieldAlert size={20} />, path: '/dashboard/team' },
  ].filter(item => {
    return item.id === 'overview' || userPermissions.includes(item.id);
  });

  if (!adminUser) return null;

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 88 : 280 }}
        className="bg-white/90 backdrop-blur-md border-r border-slate-200 flex flex-col z-20 shadow-[0_24px_60px_-40px_rgba(17,17,17,0.4)] transition-all"
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-200 shrink-0">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center shrink-0 shadow-[0_18px_32px_-20px_rgba(17,17,17,0.45)]">
            <span className="text-white text-lg tracking-[0.18em] uppercase">U</span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-4 text-slate-900 tracking-[0.16em] uppercase text-[0.95rem]"
              >
                Unicorn Console
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center rounded-xl transition-all ${isActive
                    ? 'bg-slate-100 text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  } ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-4'}`}
              >
                <div className={`${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="text-sm tracking-[0em]">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#ece4d8] space-y-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center rounded-xl p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all gap-4 overflow-hidden"
          >
            <div className="shrink-0"><LogOut size={20} /></div>
            {!isCollapsed && <span className="text-sm tracking-[0.08em]">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/88 backdrop-blur-md border-b border-slate-200 px-10 flex items-center justify-between shrink-0 z-10 shadow-[0_18px_48px_-38px_rgba(17,17,17,0.28)]">
          <div className="flex items-center gap-4">
            <h2 className="text-[1.6rem] text-slate-900 tracking-[0.06em]">
              {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-50 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-slate-900 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200"></div>

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-slate-900 group-hover:text-slate-900 transition-colors tracking-[0.06em]">{adminUser.username}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.28em]">System Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-100 transition-colors border border-slate-200">
                <User size={20} className="text-slate-500 group-hover:text-slate-900" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-transparent p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
