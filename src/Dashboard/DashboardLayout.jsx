import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Home, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  User,
  Settings,
  Bell
} from 'lucide-react';
import { useNavigate, useLocation, Outlet } from 'react-router';

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

  const navItems = [
    { name: 'Overview', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Banner Management', icon: <Home size={20} />, path: '/dashboard/banner' },
  ];

  if (!adminUser) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: isCollapsed ? 88 : 280 }}
        className="bg-white border-r border-slate-200 flex flex-col z-20 shadow-sm transition-all"
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-4 font-bold text-slate-800 tracking-tight text-lg"
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
                className={`w-full flex items-center rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                } ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-4'}`}
              >
                <div className={`${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-3 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center rounded-xl p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all gap-4 overflow-hidden"
          >
            <div className="shrink-0"><LogOut size={20} /></div>
            {!isCollapsed && <span className="font-semibold text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">
              {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-50 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200"></div>

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{adminUser.username}</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">System Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors border border-slate-200">
                <User size={20} className="text-slate-500 group-hover:text-blue-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
