import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon, 
  X, 
  Save, 
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    price_num: '',
    description: '',
    category_id: '',
    collection_id: '',
    metal: '',
    tag: '',
    is_featured: false,
    is_new_arrival: false,
    image: null,
    image_url: '',
    hover_image: null,
    hover_image_url: ''
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [hoverPreviewUrl, setHoverPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodRes, catRes, collRes] = await Promise.all([
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/categories'),
        fetch('http://localhost:5000/api/collections')
      ]);

      const [prods, cats, colls] = await Promise.all([
        prodRes.json(),
        catRes.json(),
        collRes.json()
      ]);

      setProducts(prods);
      setCategories(cats);
      setCollections(colls);
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('error', 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'name' && !editingProduct) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleHoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, hover_image: file }));
      setHoverPreviewUrl(URL.createObjectURL(file));
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      price: '',
      price_num: '',
      description: '',
      category_id: '',
      collection_id: '',
      metal: '',
      tag: '',
      is_featured: false,
      is_new_arrival: false,
      image: null,
      image_url: '',
      hover_image: null,
      hover_image_url: ''
    });
    setPreviewUrl('');
    setHoverPreviewUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      price: product.price,
      price_num: product.price_num,
      description: product.description || '',
      category_id: product.category_id || '',
      collection_id: product.collection_id || '',
      metal: product.metal || '',
      tag: product.tag || '',
      is_featured: product.is_featured === 1,
      is_new_arrival: product.is_new_arrival === 1,
      image: null,
      image_url: product.image_url || '',
      hover_image: null,
      hover_image_url: product.hover_image_url || ''
    });
    setPreviewUrl(product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `http://localhost:5000${product.image_url}`) : '');
    setHoverPreviewUrl(product.hover_image_url ? (product.hover_image_url.startsWith('http') ? product.hover_image_url : `http://localhost:5000${product.hover_image_url}`) : '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData[key]) {
        data.append('image', formData[key]);
      } else if (key === 'hover_image' && formData[key]) {
        data.append('hover_image', formData[key]);
      } else if (key !== 'image' && key !== 'hover_image') {
        data.append(key, formData[key]);
      }
    });

    try {
      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : 'http://localhost:5000/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: data
      });

      if (response.ok) {
        showMessage('success', `Product ${editingProduct ? 'updated' : 'created'} successfully`);
        setIsModalOpen(false);
        fetchData();
      } else {
        showMessage('error', 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      showMessage('error', 'An error occurred while saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        showMessage('success', 'Product deleted successfully');
        fetchData();
      } else {
        showMessage('error', 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showMessage('error', 'An error occurred while deleting');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.collection_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 mt-1">Manage your jewelry catalog and inventory</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Message Toast */}
      <AnimatePresence>
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-10 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}
          >
            {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <span className="font-semibold">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: products.length, color: 'blue' },
          { label: 'Featured Items', value: products.filter(p => p.is_featured).length, color: 'amber' },
          { label: 'New Arrivals', value: products.filter(p => p.is_new_arrival).length, color: 'emerald' },
          { label: 'Categories', value: categories.length, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-black mt-2 text-${stat.color}-600`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, category, or collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-slate-700"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-100">
          <Filter size={18} />
          <span className="font-semibold">Filters</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 font-bold text-slate-600 text-sm">Product</th>
                <th className="px-8 py-5 font-bold text-slate-600 text-sm">Category</th>
                <th className="px-8 py-5 font-bold text-slate-600 text-sm">Collection</th>
                <th className="px-8 py-5 font-bold text-slate-600 text-sm">Price</th>
                <th className="px-8 py-5 font-bold text-slate-600 text-sm">Status</th>
                <th className="px-8 py-5 font-bold text-slate-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-medium tracking-wide">Loading products...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-500 font-medium">No products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
                          {product.image_url ? (
                            <img 
                              src={product.image_url.startsWith('http') ? product.image_url : `http://localhost:5000${product.image_url}`} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{product.name}</p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                        {product.category_name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-slate-600 font-medium">{product.collection_name || '—'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-800">{product.price}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        {product.is_featured === 1 && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                            Featured
                          </span>
                        )}
                        {product.is_new_arrival === 1 && (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            New Arrival
                          </span>
                        )}
                        {product.is_featured === 0 && product.is_new_arrival === 0 && (
                          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Standard</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shrink-0">
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Image Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider text-center block">Primary Image</label>
                      <div 
                        onClick={() => document.getElementById('imageInput').click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all overflow-hidden group relative"
                      >
                        {previewUrl ? (
                          <>
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                              <span className="text-white font-bold text-xs">Change</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setPreviewUrl('');
                                  setFormData(prev => ({ ...prev, image: null, image_url: '' }));
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md"
                                title="Remove Primary Image"
                              >
                                <X size={12} strokeWidth={3} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors">
                              <Plus size={20} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-500 text-center">Upload</p>
                          </>
                        )}
                        <input 
                          type="file" 
                          id="imageInput" 
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden" 
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider text-center block">Hover Image</label>
                      <div 
                        onClick={() => document.getElementById('hoverImageInput').click()}
                        className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all overflow-hidden group relative"
                      >
                        {hoverPreviewUrl ? (
                          <>
                            <img src={hoverPreviewUrl} alt="Hover Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                              <span className="text-white font-bold text-xs">Change</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setHoverPreviewUrl('');
                                  setFormData(prev => ({ ...prev, hover_image: null, hover_image_url: '' }));
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md"
                                title="Remove Hover Image"
                              >
                                <X size={12} strokeWidth={3} />
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors">
                              <Plus size={20} />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-500 text-center">Upload</p>
                          </>
                        )}
                        <input 
                          type="file" 
                          id="hoverImageInput" 
                          accept="image/*"
                          onChange={handleHoverImageChange}
                          className="hidden" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Product Name</label>
                      <input 
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Diamond Stud Earrings"
                        className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-slate-800 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Slug (URL)</label>
                      <input 
                        required
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="diamond-stud-earrings"
                        className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-slate-800 font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Display Price</label>
                      <input 
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="e.g. $1,250"
                        className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-slate-800 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Numeric Price</label>
                      <input 
                        type="number"
                        name="price_num"
                        value={formData.price_num}
                        onChange={handleInputChange}
                        placeholder="1250"
                        className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-slate-800 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
                    <select 
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-slate-800 font-medium appearance-none cursor-pointer"
                    >
                      <option value="">Select a Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Collection</label>
                    <select 
                      name="collection_id"
                      value={formData.collection_id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-slate-800 font-medium appearance-none cursor-pointer"
                    >
                      <option value="">Select a Collection</option>
                      {collections.map(coll => (
                        <option key={coll.id} value={coll.id}>{coll.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Metal / Type</label>
                    <input 
                      name="metal"
                      value={formData.metal}
                      onChange={handleInputChange}
                      placeholder="e.g. 18k White Gold"
                      className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-slate-800 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Badge Tag</label>
                    <input 
                      name="tag"
                      value={formData.tag}
                      onChange={handleInputChange}
                      placeholder="e.g. NEW, EXCLUSIVE"
                      className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-slate-800 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe the piece, its inspiration, and craftsmanship..."
                    className="w-full px-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 rounded-xl outline-none transition-all text-slate-800 font-medium resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-wrap gap-6 pt-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                      <input 
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="peer hidden"
                      />
                      <div className="w-full h-full border-2 border-slate-200 rounded-md bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                      <Check className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={16} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors uppercase tracking-wider">Featured on Home</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative w-6 h-6 flex items-center justify-center">
                      <input 
                        type="checkbox"
                        name="is_new_arrival"
                        checked={formData.is_new_arrival}
                        onChange={handleInputChange}
                        className="peer hidden"
                      />
                      <div className="w-full h-full border-2 border-slate-200 rounded-md bg-white peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all"></div>
                      <Check className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={16} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800 transition-colors uppercase tracking-wider">Mark as New Arrival</span>
                  </label>
                </div>
              </form>

              <div className="px-8 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 uppercase tracking-widest text-sm"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Save size={18} />
                  )}
                  <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
