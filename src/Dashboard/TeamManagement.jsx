import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ShieldAlert, 
  Mail, 
  User as UserIcon, 
  Shield, 
  X,
  Loader2,
  AlertCircle,
  Key
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/admins-mgmt';

export default function TeamManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    permissions: []
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch team members');
      const data = await res.json();
      setAdmins(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        username: admin.username,
        email: admin.email,
        password: '',
        permissions: admin.permissions || []
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        username: '',
        email: '',
        password: '',
        permissions: ['home'] // Default access
      });
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const url = editingAdmin ? `${API_BASE}/${editingAdmin.id}` : API_BASE;
    const method = editingAdmin ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Something went wrong');
      }

      await fetchAdmins();
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/${adminId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete team member');
      await fetchAdmins();
      setAdminToDelete(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAdmins = admins.filter(a => 
    a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      <p className="text-slate-500 font-medium">Loading team registry...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Team Management</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage dashboard access and administrative roles.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 font-semibold text-sm"
        >
          <ShieldAlert size={18} />
          Add Administrator
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center px-6">
        <Search className="text-slate-400 mr-4" size={20} />
        <input 
          type="text" 
          placeholder="Search administrators..."
          className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdmins.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
            <p className="text-slate-400 font-medium">No administrators found matching your search.</p>
          </div>
        ) : filteredAdmins.map((admin) => (
          <div key={admin.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 group hover:border-indigo-200 transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <UserIcon size={24} />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(admin)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                </button>
                {admin.username !== 'admin' && (
                  <button 
                    onClick={() => setAdminToDelete(admin)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{admin.username}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                  <Shield size={10} className="text-indigo-500" />
                  Administrator
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(admin.permissions || []).map(p => (
                  <span key={p} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase tracking-wider border border-slate-200">
                    {p}
                  </span>
                ))}
              </div>
              
              <div className="pt-4 border-t border-slate-50 space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} className="text-slate-400" />
                  <span className="text-sm font-medium truncate">{admin.email}</span>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Created {new Date(admin.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {editingAdmin ? 'Edit Admin' : 'Add Team Member'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {formError && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 flex gap-2">
                    <AlertCircle size={18} />
                    {formError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all font-medium text-slate-800"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all font-medium text-slate-800"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                    {editingAdmin ? 'Update Password (Optional)' : 'Set Password'}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      required={!editingAdmin}
                      className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all font-medium text-slate-800"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Dashboard Access</label>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    {[
                      { id: 'home', label: 'Home Page' },
                      { id: 'banner', label: 'Banners' },
                      { id: 'products', label: 'Products' },
                      { id: 'taxonomy', label: 'Taxonomy' },
                      { id: 'users', label: 'Customers' },
                      { id: 'team', label: 'Team' }
                    ].map(opt => (
                      <label key={opt.id} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                          checked={formData.permissions.includes(opt.id)}
                          onChange={(e) => {
                            const newPerms = e.target.checked 
                              ? [...formData.permissions, opt.id]
                              : formData.permissions.filter(p => p !== opt.id);
                            setFormData({...formData, permissions: newPerms});
                          }}
                        />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="submit"
                    disabled={formLoading}
                    className="w-full px-6 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 font-bold text-sm flex items-center justify-center gap-2"
                  >
                    {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingAdmin ? 'Update Access' : 'Grant Access'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {adminToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Revoke Admin Access?</h3>
              <p className="text-slate-500 mt-3 font-medium leading-relaxed">
                You are about to remove <span className="text-slate-900 font-bold">{adminToDelete.username}</span> from the dashboard team.
              </p>
              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => setAdminToDelete(null)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all font-bold text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(adminToDelete.id)}
                  disabled={isDeleting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 font-bold text-sm flex items-center justify-center"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Yes, Revoke'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
