import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  Save, 
  X, 
  Upload,
  Search,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';
import { catalogue } from '../app/components/CategoryPage';
import { collectionsData } from '../app/components/CollectionPage';

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);
  const [modalStep, setModalStep] = useState(1); // 1: Selection, 2: Form

  // Form State
  const [formData, setFormData] = useState({
    page_key: '',
    title: '',
    subtitle: '',
    description: '',
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/content/banners');
      const data = await response.json();
      if (response.ok) {
        setBanners(data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({ page_key: '', title: '', subtitle: '', description: '', imageUrl: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setModalStep(1); // Start with selection
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      page_key: banner.page_key,
      title: banner.title,
      subtitle: banner.subtitle,
      description: banner.description,
      imageUrl: banner.image_url
    });
    setSelectedFile(null);
    setPreviewUrl(banner.image_url ? (banner.image_url.startsWith('http') ? banner.image_url : `http://localhost:5000${banner.image_url}`) : '');
    setModalStep(2); // Go straight to form
    setIsModalOpen(true);
  };

  const handleDelete = async (pageKey) => {
    if (!window.confirm(`Are you sure you want to delete the banner for "${pageKey}"?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/content/banner/${pageKey}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      if (response.ok) {
        fetchBanners();
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('subtitle', formData.subtitle);
    submitData.append('description', formData.description);
    submitData.append('imageUrl', formData.imageUrl);
    if (selectedFile) {
      submitData.append('image', selectedFile);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/content/banner/${formData.page_key}`, {
        method: 'PUT',
        body: submitData,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => {
          setSaveStatus(null);
          setIsModalOpen(false);
          fetchBanners();
        }, 1500);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      setSaveStatus('error');
    }
  };

  const filteredBanners = banners.filter(b => 
    (b.page_key?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (b.title?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Banner Management</h3>
          <p className="text-slate-500 text-sm mt-1 font-medium">Control banners across all website pages and collections.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus size={20} />
          Add New Banner
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by page or title..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page Key</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Banner Info</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview</th>
                <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBanners.map((banner) => (
                <tr key={banner.page_key} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold tracking-wide">
                      {banner.page_key}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <h4 className="font-bold text-slate-800 text-sm">{banner.title}</h4>
                    <p className="text-slate-400 text-xs mt-1 truncate max-w-[200px]">{banner.subtitle}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="w-20 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                      <ImageWithFallback 
                        src={banner.image_url ? (banner.image_url.startsWith('http') ? banner.image_url : `http://localhost:5000${banner.image_url}`) : ''} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(banner)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(banner.page_key)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBanners.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 italic">
                    {loading ? 'Loading banners...' : 'No banners found matching your search.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">
                  {editingBanner ? `Edit Banner: ${editingBanner.page_key}` : (modalStep === 1 ? 'Select Page' : `Configure: ${formData.page_key}`)}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-white shadow-sm">
                  <X size={20} />
                </button>
              </div>

              {modalStep === 1 ? (
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <p className="text-sm text-slate-500 font-medium -mt-2">Choose the page you want to create a banner for.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Main Pages */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Main Site Pages</h4>
                      <div className="space-y-2">
                        {['home', 'jewelry', 'story', 'gift-guide'].map(page => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, page_key: page });
                              setModalStep(2);
                            }}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-2xl transition-all group"
                          >
                            <span className="font-bold text-slate-700 group-hover:text-blue-600 capitalize">{page}</span>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Categories */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Categories</h4>
                        <select 
                          onChange={(e) => {
                            if (e.target.value) {
                              setFormData({ ...formData, page_key: e.target.value });
                              setModalStep(2);
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
                        >
                          <option value="">Select Category...</option>
                          {Object.keys(catalogue).filter(c => c !== 'Jewelry').map(cat => (
                            <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Collections */}
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Collections</h4>
                        <select 
                          onChange={(e) => {
                            if (e.target.value) {
                              setFormData({ ...formData, page_key: e.target.value });
                              setModalStep(2);
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-bold appearance-none cursor-pointer"
                        >
                          <option value="">Select Collection...</option>
                          {Object.keys(collectionsData).map(col => (
                            <option key={col} value={col.toLowerCase()}>{col}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Selected Page</label>
                          <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 text-blue-700 font-bold capitalize flex items-center justify-between">
                            {formData.page_key}
                            {!editingBanner && (
                              <button 
                                type="button" 
                                onClick={() => setModalStep(1)}
                                className="text-[10px] text-blue-500 hover:text-blue-700 underline"
                              >
                                Change Page
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Main Heading</label>
                          <input 
                            type="text" 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                            placeholder="Banner title"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Sub-heading</label>
                          <input 
                            type="text" 
                            value={formData.subtitle}
                            onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                            placeholder="Short tagline"
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Banner Image</label>
                          <div className="relative group aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-400">
                            {previewUrl ? (
                              <>
                                <ImageWithFallback src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                                  <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg font-bold flex items-center gap-2 text-[10px] uppercase w-32 justify-center">
                                    <Upload size={14} />
                                    Change
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                                    }} />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setPreviewUrl('');
                                      setSelectedFile(null);
                                      setFormData(prev => ({ ...prev, imageUrl: '' }));
                                    }}
                                    className="bg-white text-red-600 px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg font-bold flex items-center gap-2 text-[10px] uppercase w-32 justify-center"
                                  >
                                    <Trash2 size={14} />
                                    Remove
                                  </button>
                                </div>
                              </>
                            ) : (
                              <label className="cursor-pointer flex flex-col items-center gap-4 group w-full h-full justify-center">
                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                  <ImageIcon size={24} className="text-slate-400" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Image</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                                    }} />
                              </label>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                      <textarea 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium resize-none"
                        placeholder="Enter full description text..."
                      />
                    </div>
                  </form>

                  <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {saveStatus === 'success' && (
                        <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                          <CheckCircle size={14} /> Saved!
                        </span>
                      )}
                      {saveStatus === 'error' && (
                        <span className="text-red-600 text-xs font-bold flex items-center gap-1">
                          <AlertCircle size={14} /> Error!
                        </span>
                      )}
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-3 text-slate-500 hover:text-slate-800 font-bold transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                      >
                        {saveStatus === 'saving' ? 'Saving...' : <><Save size={18} /> Save Banner</>}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
