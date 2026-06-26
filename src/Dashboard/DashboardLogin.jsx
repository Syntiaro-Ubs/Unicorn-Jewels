import { useState } from 'react';
import { API_BASE } from '@/config';
import { motion } from 'motion/react';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function DashboardLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/92 backdrop-blur-md rounded-[2rem] shadow-[0_36px_90px_-42px_rgba(17,17,17,0.4)] overflow-hidden border border-slate-200"
      >
        <div className="p-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20">
              <Shield className="text-white" size={32} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.36em] text-slate-400">Unicorn Jewels</p>
            <h1 className="text-4xl text-slate-900 tracking-[0.08em] mt-3">Admin Console</h1>
            <p className="text-slate-500 text-sm mt-3 tracking-[0.08em]">Sign in to manage Unicorn Jewels</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-[0.28em] ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <User size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-sm"
                  placeholder="admin@unicornjewels.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-[0.28em] ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 transition-all text-sm"
                  placeholder="********"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-4 uppercase tracking-[0.22em] text-sm"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-200 text-center">
          <p className="text-slate-500 text-xs tracking-[0.18em] uppercase">
            (c) 2026 Unicorn Jewels - Administrative Access Only
          </p>
        </div>
      </motion.div>
    </div>
  );
}
