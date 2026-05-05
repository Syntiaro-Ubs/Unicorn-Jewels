import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Upload, 
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  FolderTree,
  LayoutGrid,
  Image as ImageIcon
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function TaxonomyManagement() {
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' or 'collections'
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: null,
    image_url: ''
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catRes, collRes] = await Promise.all([
        fetch(`${API_URL}/categories`),
        fetch(`${API_URL}/collections`)
      ]);
      const [cats, colls] = await Promise.all([catRes.json(), collRes.json()]);
      setCategories(cats);
      setCollections(colls);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        slug: item.slug,
        description: item.description || '',
        image: null,
        image_url: item.image_url || ''
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: null,
        image_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from name if editing new item or slug is empty
      if (name === 'name' && (!editingItem || !prev.slug)) {
        updated.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      }
      return updated;
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('slug', formData.slug);
    if (activeTab === 'collections') {
      submitData.append('description', formData.description);
    }
    if (formData.image) {
      submitData.append('image', formData.image);
    } else {
      submitData.append('image_url', formData.image_url);
    }

    try {
      const url = editingItem 
        ? `${API_URL}/${activeTab}/${editingItem.id}` 
        : `${API_URL}/${activeTab}`;
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData
      });

      if (response.ok) {
        showToast(`${activeTab === 'categories' ? 'Category' : 'Collection'} ${editingItem ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        fetchData();
      } else {
        const errorData = await response.json();
        showToast(errorData.message || 'Something went wrong', 'error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return;

    try {
      const response = await fetch(`${API_URL}/${activeTab}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showToast(`${activeTab === 'categories' ? 'Category' : 'Collection'} deleted successfully`);
        fetchData();
      } else {
        showToast('Error deleting item', 'error');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showToast('Error connecting to server', 'error');
    }
  };

  const filteredItems = (activeTab === 'categories' ? categories : collections).filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Taxonomy Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your store's categories and collections</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus size={18} />
          <span>Add New {activeTab === 'categories' ? 'Category' : 'Collection'}</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'categories' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <LayoutGrid size={16} />
            Categories
          </button>
          <button 
            onClick={() => setActiveTab('collections')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'collections' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <FolderTree size={16} />
            Collections
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={`Search ${activeTab}...`}
            className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm w-full md:w-80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-slate-100 shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode='popLayout'>
            {filteredItems.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                  {item.image_url ? (
                    <img 
                      src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <ImageIcon size={48} />
                      <span className="text-xs mt-2 font-medium">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <button 
                      onClick={() => handleOpenModal(item)}
                      className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white/90 backdrop-blur-sm text-slate-700 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-800 truncate pr-2">{item.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-mono tracking-tight mb-3">/{item.slug}</p>
                  
                  {activeTab === 'collections' && item.description && (
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed flex-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredItems.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Filter size={32} />
              </div>
              <p className="text-slate-500 font-medium">No {activeTab} found matching your search.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 font-semibold text-sm hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingItem ? `Edit ${activeTab === 'categories' ? 'Category' : 'Collection'}` : `Add New ${activeTab === 'categories' ? 'Category' : 'Collection'}`}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-sm font-bold text-slate-700">Name</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Engagement Rings"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="text-sm font-bold text-slate-700">Slug</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">/</span>
                      <input 
                        required
                        type="text" 
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="engagement-rings"
                        className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>

                {activeTab === 'collections' && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Description</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Tell us about this collection..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Image</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative group aspect-video sm:aspect-auto sm:h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden hover:border-blue-400 transition-all flex flex-col items-center justify-center cursor-pointer">
                      {formData.image ? (
                        <img src={URL.createObjectURL(formData.image)} className="w-full h-full object-cover" />
                      ) : formData.image_url ? (
                        <img src={formData.image_url.startsWith('http') ? formData.image_url : `http://localhost:5000${formData.image_url}`} className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload className="text-slate-400 mb-2" size={24} />
                          <span className="text-xs font-bold text-slate-500">Upload Photo</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-3">
                      <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                        Recommended: Square or 4:3 aspect ratio. Max size 2MB. Format: JPG, PNG, WEBP.
                      </p>
                      { (formData.image || formData.image_url) && (
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: null, image_url: '' }))}
                          className="text-[11px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1 w-fit"
                        >
                          <Trash2 size={12} />
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                  >
                    {editingItem ? 'Save Changes' : 'Create Now'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="font-bold text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
