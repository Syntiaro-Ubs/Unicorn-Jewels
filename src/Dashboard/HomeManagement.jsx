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
  AlertCircle,
  CheckCircle,
  LayoutTemplate,
  ArrowRightLeft,
  Instagram
} from 'lucide-react';
import { ImageWithFallback } from '../app/components/figma/ImageWithFallback';

export default function HomeManagement() {
  const [categories, setCategories] = useState([]);
  const [editorials, setEditorials] = useState([]);
  const [diamondEditItems, setDiamondEditItems] = useState([]);
  const [services, setServices] = useState([]);
  const [instagramPosts, setInstagramPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Category Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', image_url: '' });
  
  // Editorial Modal State
  const [isEditorialModalOpen, setIsEditorialModalOpen] = useState(false);
  const [editingEditorial, setEditingEditorial] = useState(null);
  const [editorialFormData, setEditorialFormData] = useState({
    title: '', description: '', button_text: 'DISCOVER MORE', button_link: '', image_url: '', is_reversed: false, order_index: 0
  });

  // Diamond Edit Modal State
  const [isDiamondModalOpen, setIsDiamondModalOpen] = useState(false);
  const [editingDiamond, setEditingDiamond] = useState(null);
  const [diamondFormData, setDiamondFormData] = useState({
    title: '', subtitle: '', image_url: '', order_index: 0
  });
  
  // Services Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    tag: '', title: '', description: '', button_text: '', button_link: '', image_url: '', is_reversed: false, order_index: 0
  });
  
  // Instagram Modal State
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [editingInstagram, setEditingInstagram] = useState(null);
  const [instagramFormData, setInstagramFormData] = useState({
    post_url: '', image_url: '', order_index: 0
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchEditorials();
    fetchDiamondEdit();
    fetchServices();
    fetchInstagramPosts();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) setCategories(await response.json());
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEditorials = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/editorials');
      if (response.ok) setEditorials(await response.json());
    } catch (error) {
      console.error('Error fetching editorials:', error);
    }
  };

  const fetchDiamondEdit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/diamond-edit');
      if (response.ok) setDiamondEditItems(await response.json());
    } catch (error) {
      console.error('Error fetching diamond edit items:', error);
    }
  };
  
  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      if (response.ok) setServices(await response.json());
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  
  const fetchInstagramPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/instagram');
      if (response.ok) setInstagramPosts(await response.json());
    } catch (error) {
      console.error('Error fetching instagram posts:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (response.ok) setProducts(await response.json());
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const toggleSliderStatus = async (productId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/toggle-new-arrival`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_new_arrival: !currentStatus })
      });
      if (response.ok) fetchProducts();
    } catch (error) {
      console.error('Error toggling slider status:', error);
    }
  };

  const toggleFeaturedStatus = async (productId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}/toggle-featured`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !currentStatus })
      });
      if (response.ok) fetchProducts();
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  // CATEGORY HANDLERS
  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', image_url: '' });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, slug: category.slug, image_url: category.image_url || '' });
    setSelectedFile(null);
    setPreviewUrl(category.image_url ? (category.image_url.startsWith('http') ? category.image_url : `http://localhost:5000${category.image_url}`) : '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the category "${name}"?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/categories/${id}`, { method: 'DELETE' });
      if (response.ok) fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('slug', formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'));
    submitData.append('image_url', formData.image_url);
    if (selectedFile) submitData.append('image', selectedFile);

    try {
      const url = editingCategory ? `http://localhost:5000/api/categories/${editingCategory.id}` : `http://localhost:5000/api/categories`;
      const response = await fetch(url, { method: editingCategory ? 'PUT' : 'POST', body: submitData });
      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => { setSaveStatus(null); setIsModalOpen(false); fetchCategories(); }, 1500);
      } else setSaveStatus('error');
    } catch (error) {
      setSaveStatus('error');
    }
  };

  // EDITORIAL HANDLERS
  const openAddEditorialModal = () => {
    setEditingEditorial(null);
    setEditorialFormData({ title: '', description: '', button_text: 'DISCOVER MORE', button_link: '', image_url: '', is_reversed: false, order_index: editorials.length + 1 });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsEditorialModalOpen(true);
  };

  const openEditEditorialModal = (editorial) => {
    setEditingEditorial(editorial);
    setEditorialFormData({ 
      title: editorial.title, description: editorial.description, button_text: editorial.button_text, 
      button_link: editorial.button_link || '', image_url: editorial.image_url || '', is_reversed: editorial.is_reversed, order_index: editorial.order_index 
    });
    setSelectedFile(null);
    setPreviewUrl(editorial.image_url ? (editorial.image_url.startsWith('http') ? editorial.image_url : `http://localhost:5000${editorial.image_url}`) : '');
    setIsEditorialModalOpen(true);
  };

  const handleDeleteEditorial = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the editorial "${title}"?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/editorials/${id}`, { method: 'DELETE' });
      if (response.ok) fetchEditorials();
    } catch (error) {
      console.error('Error deleting editorial:', error);
    }
  };

  const handleSaveEditorial = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');

    const submitData = new FormData();
    submitData.append('title', editorialFormData.title);
    submitData.append('description', editorialFormData.description);
    submitData.append('button_text', editorialFormData.button_text);
    submitData.append('button_link', editorialFormData.button_link);
    submitData.append('is_reversed', editorialFormData.is_reversed);
    submitData.append('order_index', editorialFormData.order_index);
    submitData.append('image_url', editorialFormData.image_url);
    if (selectedFile) submitData.append('image', selectedFile);

    try {
      const url = editingEditorial ? `http://localhost:5000/api/editorials/${editingEditorial.id}` : `http://localhost:5000/api/editorials`;
      const response = await fetch(url, { method: editingEditorial ? 'PUT' : 'POST', body: submitData });
      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => { setSaveStatus(null); setIsEditorialModalOpen(false); fetchEditorials(); }, 1500);
      } else setSaveStatus('error');
    } catch (error) {
      setSaveStatus('error');
    }
  };

  // DIAMOND EDIT HANDLERS
  const openAddDiamondModal = () => {
    setEditingDiamond(null);
    setDiamondFormData({ title: '', subtitle: '', image_url: '', order_index: diamondEditItems.length + 1 });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsDiamondModalOpen(true);
  };

  const openEditDiamondModal = (item) => {
    setEditingDiamond(item);
    setDiamondFormData({ title: item.title, subtitle: item.subtitle || '', image_url: item.image_url || '', order_index: item.order_index });
    setSelectedFile(null);
    setPreviewUrl(item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`) : '');
    setIsDiamondModalOpen(true);
  };

  const handleDeleteDiamond = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the Diamond Edit item "${title}"?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/diamond-edit/${id}`, { method: 'DELETE' });
      if (response.ok) fetchDiamondEdit();
    } catch (error) {
      console.error('Error deleting diamond edit item:', error);
    }
  };

  const handleSaveDiamondEdit = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');

    const submitData = new FormData();
    submitData.append('title', diamondFormData.title);
    submitData.append('subtitle', diamondFormData.subtitle);
    submitData.append('order_index', diamondFormData.order_index);
    submitData.append('image_url', diamondFormData.image_url);
    if (selectedFile) submitData.append('image', selectedFile);

    try {
      const url = editingDiamond ? `http://localhost:5000/api/diamond-edit/${editingDiamond.id}` : `http://localhost:5000/api/diamond-edit`;
      const response = await fetch(url, { method: editingDiamond ? 'PUT' : 'POST', body: submitData });
      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => { setSaveStatus(null); setIsDiamondModalOpen(false); fetchDiamondEdit(); }, 1500);
      } else setSaveStatus('error');
    } catch (error) {
      setSaveStatus('error');
    }
  };
  
  // SERVICES HANDLERS
  const openAddServiceModal = () => {
    setEditingService(null);
    setServiceFormData({ tag: '', title: '', description: '', button_text: '', button_link: '', image_url: '', is_reversed: false, order_index: services.length + 1 });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsServiceModalOpen(true);
  };
  
  const openEditServiceModal = (service) => {
    setEditingService(service);
    setServiceFormData({ 
      tag: service.tag, title: service.title, description: service.description, button_text: service.button_text, 
      button_link: service.button_link || '', image_url: service.image_url || '', is_reversed: !!service.is_reversed, order_index: service.order_index 
    });
    setSelectedFile(null);
    setPreviewUrl(service.image_url ? (service.image_url.startsWith('http') ? service.image_url : `http://localhost:5000${service.image_url}`) : '');
    setIsServiceModalOpen(true);
  };
  
  const handleDeleteService = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the service "${title}"?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/services/${id}`, { method: 'DELETE' });
      if (response.ok) fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };
  
  const handleSaveService = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    const submitData = new FormData();
    submitData.append('tag', serviceFormData.tag);
    submitData.append('title', serviceFormData.title);
    submitData.append('description', serviceFormData.description);
    submitData.append('button_text', serviceFormData.button_text);
    submitData.append('button_link', serviceFormData.button_link);
    submitData.append('is_reversed', serviceFormData.is_reversed);
    submitData.append('order_index', serviceFormData.order_index);
    submitData.append('image_url', serviceFormData.image_url);
    if (selectedFile) submitData.append('image', selectedFile);
    
    try {
      const url = editingService ? `http://localhost:5000/api/services/${editingService.id}` : `http://localhost:5000/api/services`;
      const response = await fetch(url, { method: editingService ? 'PUT' : 'POST', body: submitData });
      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => { setSaveStatus(null); setIsServiceModalOpen(false); fetchServices(); }, 1500);
      } else setSaveStatus('error');
    } catch (error) {
      setSaveStatus('error');
    }
  };

  // INSTAGRAM HANDLERS
  const openAddInstagramModal = () => {
    setEditingInstagram(null);
    setInstagramFormData({ post_url: '', image_url: '', order_index: instagramPosts.length + 1 });
    setSelectedFile(null);
    setPreviewUrl('');
    setIsInstagramModalOpen(true);
  };
  
  const openEditInstagramModal = (post) => {
    setEditingInstagram(post);
    setInstagramFormData({ post_url: post.post_url, image_url: post.image_url || '', order_index: post.order_index });
    setSelectedFile(null);
    setPreviewUrl(post.image_url ? (post.image_url.startsWith('http') ? post.image_url : `http://localhost:5000${post.image_url}`) : '');
    setIsInstagramModalOpen(true);
  };
  
  const handleDeleteInstagram = async (id) => {
    if (!window.confirm(`Are you sure you want to delete this Instagram post?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/instagram/${id}`, { method: 'DELETE' });
      if (response.ok) fetchInstagramPosts();
    } catch (error) {
      console.error('Error deleting instagram post:', error);
    }
  };
  
  const handleSaveInstagram = async (e) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    const submitData = new FormData();
    submitData.append('post_url', instagramFormData.post_url);
    submitData.append('order_index', instagramFormData.order_index);
    submitData.append('image_url', instagramFormData.image_url);
    if (selectedFile) submitData.append('image', selectedFile);
    
    try {
      const url = editingInstagram ? `http://localhost:5000/api/instagram/${editingInstagram.id}` : `http://localhost:5000/api/instagram`;
      const response = await fetch(url, { method: editingInstagram ? 'PUT' : 'POST', body: submitData });
      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => { setSaveStatus(null); setIsInstagramModalOpen(false); fetchInstagramPosts(); }, 1500);
      } else setSaveStatus('error');
    } catch (error) {
      setSaveStatus('error');
    }
  };

  const filteredCategories = categories.filter(c => (c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-12" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h3 className="text-3xl font-bold text-slate-800 tracking-tight">Home Page Management</h3>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage Collections, Editorials, Services, and the Diamond Edit.</p>
        </div>
      </div>

      {/* CURATED COLLECTIONS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-slate-800">Curated Collections</h4>
            <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold">{categories.length}</span>
          </div>
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
            <Plus size={16} /> Add Collection
          </button>
        </div>
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search collections..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all text-sm font-medium" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-square w-full bg-slate-50 relative overflow-hidden">
                <ImageWithFallback src={category.image_url ? (category.image_url.startsWith('http') ? category.image_url : `http://localhost:5000${category.image_url}`) : ''} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 tracking-wide">{category.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono uppercase mt-1">/{category.slug}</p>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(category)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(category.id, category.name)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 italic">{loading ? 'Loading...' : 'No collections found.'}</div>}
        </div>
      </div>

      {/* JUST UNVEILED SLIDER SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8 mb-8">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-slate-800">Home Page Slider (Just Unveiled)</h4>
            <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
              {products.filter(p => p.is_new_arrival).length} Selected
            </span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">Select which products should appear in the dynamic horizontal slider on the home page.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {products.map(product => (
              <div 
                key={product.id} 
                onClick={() => toggleSliderStatus(product.id, product.is_new_arrival)}
                className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center gap-3 ${product.is_new_arrival ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <ImageWithFallback src={product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `http://localhost:5000${product.image_url}`) : ''} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-slate-800 text-sm truncate">{product.name}</h5>
                  <p className="text-xs text-slate-500 truncate">${product.price}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${product.is_new_arrival ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                  {product.is_new_arrival && <CheckCircle size={12} className="text-white" />}
                </div>
              </div>
            ))}
            {products.length === 0 && <div className="col-span-full text-slate-400 italic text-sm">No products found.</div>}
          </div>
        </div>
      </div>

      {/* FEATURED COLLECTIONS SECTION (Eternally Desired) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-slate-800">Featured Collections (Eternally Desired)</h4>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">
              {products.filter(p => p.is_featured).length} Selected
            </span>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500 mb-4">Select the products to feature in the "Eternally Desired" slider section.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {products.map(product => (
              <div 
                key={`featured-${product.id}`} 
                onClick={() => toggleFeaturedStatus(product.id, product.is_featured)}
                className={`p-3 border rounded-xl cursor-pointer transition-all flex items-center gap-3 ${product.is_featured ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  <ImageWithFallback src={product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `http://localhost:5000${product.image_url}`) : ''} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-slate-800 text-sm truncate">{product.name}</h5>
                  <p className="text-xs text-slate-500 truncate">${product.price}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${product.is_featured ? 'bg-amber-500 border-amber-500' : 'border-slate-300'}`}>
                  {product.is_featured && <CheckCircle size={12} className="text-white" />}
                </div>
              </div>
            ))}
            {products.length === 0 && <div className="col-span-full text-slate-400 italic text-sm">No products found.</div>}
          </div>
        </div>
      </div>

      {/* SERVICES MANAGEMENT SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-slate-800">Services & Concierge</h4>
            <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold">{services.length}</span>
          </div>
          <button onClick={openAddServiceModal} className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
            <Plus size={16} /> Add Service
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {services.map((service) => (
            <div key={service.id} className="p-6 flex flex-col md:flex-row gap-6 items-center hover:bg-slate-50/50 transition-colors group">
              <div className="w-full md:w-48 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <ImageWithFallback src={service.image_url ? (service.image_url.startsWith('http') ? service.image_url : `http://localhost:5000${service.image_url}`) : ''} alt={service.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">{service.tag}</span>
                  <h4 className="text-lg font-bold text-slate-800">{service.title}</h4>
                  {!service.is_reversed ? (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><ArrowRightLeft size={10} /> Image Right</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><LayoutTemplate size={10} /> Image Left</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Button: {service.button_text}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Link: {service.button_link}</div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditServiceModal(service)} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all font-medium text-sm w-full"><Edit2 size={16} /> Edit</button>
                <button onClick={() => handleDeleteService(service.id, service.title)} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium text-sm w-full"><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          ))}
          {services.length === 0 && <div className="py-16 text-center text-slate-400 italic">No services found.</div>}
        </div>
      </div>

      {/* INSTAGRAM POSTS SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-slate-800">Instagram Feed</h4>
            <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold">{instagramPosts.length}</span>
          </div>
          <button onClick={openAddInstagramModal} className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
            <Instagram size={16} /> Add Post
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {instagramPosts.map((post) => (
              <div key={post.id} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <ImageWithFallback src={post.image_url ? (post.image_url.startsWith('http') ? post.image_url : `http://localhost:5000${post.image_url}`) : ''} alt="Instagram" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
                  <button onClick={() => openEditInstagramModal(post)} className="p-2 bg-white text-slate-800 rounded-lg hover:scale-110 transition-transform"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteInstagram(post.id)} className="p-2 bg-white text-red-600 rounded-lg hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                  <a href={post.post_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-pink-600 rounded-lg hover:scale-110 transition-transform"><Instagram size={16} /></a>
                </div>
              </div>
            ))}
            {instagramPosts.length === 0 && <div className="col-span-full py-12 text-center text-slate-400 italic">No Instagram posts found.</div>}
          </div>
        </div>
      </div>

      {/* EDITORIAL FEATURES SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-slate-800">Editorial Features</h4>
            <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold">{editorials.length}</span>
          </div>
          <button onClick={openAddEditorialModal} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
            <Plus size={16} /> Add Editorial
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {editorials.map((editorial) => (
            <div key={editorial.id} className="p-6 flex flex-col md:flex-row gap-6 items-center hover:bg-slate-50/50 transition-colors group">
              <div className="w-full md:w-48 aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <ImageWithFallback src={editorial.image_url ? (editorial.image_url.startsWith('http') ? editorial.image_url : `http://localhost:5000${editorial.image_url}`) : ''} alt={editorial.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-bold text-slate-800">{editorial.title}</h4>
                  {editorial.is_reversed ? (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><ArrowRightLeft size={10} /> Image Right</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><LayoutTemplate size={10} /> Image Left</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{editorial.description}</p>
                <div className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wider">Button: {editorial.button_text}</div>
              </div>
              <div className="flex flex-row md:flex-col gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditEditorialModal(editorial)} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium text-sm w-full"><Edit2 size={16} /> Edit</button>
                <button onClick={() => handleDeleteEditorial(editorial.id, editorial.title)} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium text-sm w-full"><Trash2 size={16} /> Delete</button>
              </div>
            </div>
          ))}
          {editorials.length === 0 && <div className="py-16 text-center text-slate-400 italic">No editorial features found.</div>}
        </div>
      </div>

      {/* DIAMOND EDIT SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h4 className="font-bold text-slate-800">The Diamond Edit (Grid Cards)</h4>
            <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-xs font-bold">{diamondEditItems.length}</span>
          </div>
          <button onClick={openAddDiamondModal} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all">
            <Plus size={16} /> Add Card
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-8">
          {diamondEditItems.map((item) => (
            <div key={item.id} className="group relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-500">
              <div className="aspect-[3/4] w-full bg-slate-50 relative overflow-hidden">
                <ImageWithFallback src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`) : ''} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => openEditDiamondModal(item)} className="bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white hover:text-slate-900 transition-all shadow-lg"><Edit2 size={20} /></button>
                    <button onClick={() => handleDeleteDiamond(item.id, item.title)} className="bg-white/20 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-red-500 transition-all shadow-lg"><Trash2 size={20} /></button>
                  </div>
                </div>
              </div>
              <div className="p-6 text-center">
                <h4 className="text-xl font-bold text-slate-800 tracking-tight">{item.title}</h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">{item.subtitle}</p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500">
                  <LayoutTemplate size={10} /> Position {item.order_index}
                </div>
              </div>
            </div>
          ))}
          {diamondEditItems.length === 0 && <div className="col-span-full py-16 text-center text-slate-400 italic">No diamond edit items found.</div>}
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">{editingCategory ? 'Edit Collection' : 'Add New Collection'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-white shadow-sm"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Collection Name</label>
                    <input type="text" value={formData.name} onChange={(e) => { const name = e.target.value; setFormData({...formData, name, slug: name.toLowerCase().replace(/\s+/g, '-')}); }} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium" placeholder="e.g. Rings" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Slug URL</label>
                    <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase()})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium font-mono text-sm" placeholder="e.g. rings" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Cover Image</label>
                    <div className="relative group aspect-square max-w-[200px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-full flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-400 mx-auto">
                      {previewUrl ? (
                        <>
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                            <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg font-bold flex items-center gap-2 text-[10px] uppercase w-32 justify-center">
                              <Upload size={14} /> Change
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); } }} />
                            </label>
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewUrl(''); setSelectedFile(null); setFormData(prev => ({ ...prev, image_url: '' })); }} className="bg-white text-red-600 px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg font-bold flex items-center gap-2 text-[10px] uppercase w-32 justify-center">
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-4 group w-full h-full justify-center">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><ImageIcon size={24} className="text-slate-400" /></div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); } }} required={!editingCategory && !formData.image_url} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </form>
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {saveStatus === 'success' && <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> Saved!</span>}
                  {saveStatus === 'error' && <span className="text-red-600 text-xs font-bold flex items-center gap-1"><AlertCircle size={14} /> Error!</span>}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-500 hover:text-slate-800 font-bold transition-colors">Cancel</button>
                  <button onClick={handleSave} disabled={saveStatus === 'saving'} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50">
                    {saveStatus === 'saving' ? 'Saving...' : <><Save size={18} /> Save</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDITORIAL MODAL */}
      <AnimatePresence>
        {isEditorialModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditorialModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">{editingEditorial ? 'Edit Editorial Feature' : 'Add Editorial Feature'}</h3>
                <button onClick={() => setIsEditorialModalOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-white shadow-sm"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveEditorial} className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Title</label>
                      <input type="text" value={editorialFormData.title} onChange={(e) => setEditorialFormData({...editorialFormData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium" placeholder="e.g. The Silver Collection" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Button Text</label>
                      <input type="text" value={editorialFormData.button_text} onChange={(e) => setEditorialFormData({...editorialFormData, button_text: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium" placeholder="e.g. DISCOVER MORE" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Layout Style</label>
                      <button type="button" onClick={() => setEditorialFormData(prev => ({...prev, is_reversed: !prev.is_reversed}))} className={`w-full flex items-center justify-center gap-3 py-3 rounded-2xl border-2 font-bold transition-all ${editorialFormData.is_reversed ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                        {editorialFormData.is_reversed ? <><ArrowRightLeft size={18} /> Image on Right</> : <><LayoutTemplate size={18} /> Image on Left</>}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Section Image</label>
                    <div className="relative group aspect-[4/3] w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-400 mx-auto">
                      {previewUrl ? (
                        <>
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                            <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg font-bold flex items-center gap-2 text-[10px] uppercase w-32 justify-center">
                              <Upload size={14} /> Change
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); } }} />
                            </label>
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewUrl(''); setSelectedFile(null); setEditorialFormData(prev => ({ ...prev, image_url: '' })); }} className="bg-white text-red-600 px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg font-bold flex items-center gap-2 text-[10px] uppercase w-32 justify-center">
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-4 group w-full h-full justify-center">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><ImageIcon size={24} className="text-slate-400" /></div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); } }} required={!editingEditorial && !editorialFormData.image_url} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description Paragraph</label>
                  <textarea rows={4} value={editorialFormData.description} onChange={(e) => setEditorialFormData({...editorialFormData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium resize-none" placeholder="Enter the descriptive text for this section..." required />
                </div>
              </form>
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {saveStatus === 'success' && <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> Saved!</span>}
                  {saveStatus === 'error' && <span className="text-red-600 text-xs font-bold flex items-center gap-1"><AlertCircle size={14} /> Error!</span>}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsEditorialModalOpen(false)} className="px-6 py-3 text-slate-500 hover:text-slate-800 font-bold transition-colors">Cancel</button>
                  <button onClick={handleSaveEditorial} disabled={saveStatus === 'saving'} className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50">
                    {saveStatus === 'saving' ? 'Saving...' : <><Save size={18} /> Save Feature</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIAMOND EDIT MODAL */}
      <AnimatePresence>
        {isDiamondModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDiamondModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">{editingDiamond ? 'Edit Diamond Item' : 'Add Diamond Item'}</h3>
                <button onClick={() => setIsDiamondModalOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-white shadow-sm"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveDiamondEdit} className="flex-1 overflow-y-auto p-8 space-y-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Card Title</label>
                    <input type="text" value={diamondFormData.title} onChange={(e) => setDiamondFormData({...diamondFormData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium" placeholder="e.g. Red Diamond Pendant" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Subtitle</label>
                    <input type="text" value={diamondFormData.subtitle} onChange={(e) => setDiamondFormData({...diamondFormData, subtitle: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium" placeholder="e.g. The Eternal Flame" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Display Order</label>
                    <input type="number" value={diamondFormData.order_index} onChange={(e) => setDiamondFormData({...diamondFormData, order_index: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Card Image</label>
                    <div className="relative group aspect-[3/4] w-full max-w-[240px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-400 mx-auto">
                      {previewUrl ? (
                        <>
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                            <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg font-bold flex items-center gap-2 text-[10px] uppercase w-32 justify-center">
                              <Upload size={14} /> Change
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); } }} />
                            </label>
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewUrl(''); setSelectedFile(null); setDiamondFormData(prev => ({ ...prev, image_url: '' })); }} className="bg-white text-red-600 px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg font-bold flex items-center gap-2 text-[10px] uppercase w-32 justify-center">
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-4 group w-full h-full justify-center">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><ImageIcon size={24} className="text-slate-400" /></div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); } }} required={!editingDiamond && !diamondFormData.image_url} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </form>
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {saveStatus === 'success' && <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> Saved!</span>}
                  {saveStatus === 'error' && <span className="text-red-600 text-xs font-bold flex items-center gap-1"><AlertCircle size={14} /> Error!</span>}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsDiamondModalOpen(false)} className="px-6 py-3 text-slate-500 hover:text-slate-800 font-bold transition-colors">Cancel</button>
                  <button onClick={handleSaveDiamondEdit} disabled={saveStatus === 'saving'} className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50">
                    {saveStatus === 'saving' ? 'Saving...' : <><Save size={18} /> Save Item</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SERVICE MODAL */}
      <AnimatePresence>
        {isServiceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsServiceModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
                <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-white shadow-sm"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Tag (e.g. CONCIERGE)</label>
                      <input type="text" value={serviceFormData.tag} onChange={(e) => setServiceFormData({...serviceFormData, tag: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all font-medium" placeholder="e.g. CONCIERGE" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Title</label>
                      <input type="text" value={serviceFormData.title} onChange={(e) => setServiceFormData({...serviceFormData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all font-medium" placeholder="e.g. Personal Styling" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Button Text</label>
                        <input type="text" value={serviceFormData.button_text} onChange={(e) => setServiceFormData({...serviceFormData, button_text: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all font-medium" placeholder="e.g. Book a Session" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Button Link</label>
                        <input type="text" value={serviceFormData.button_link} onChange={(e) => setServiceFormData({...serviceFormData, button_link: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all font-medium" placeholder="e.g. appointment" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Layout Style</label>
                      <button type="button" onClick={() => setServiceFormData(prev => ({...prev, is_reversed: !prev.is_reversed}))} className={`w-full flex items-center justify-center gap-3 py-3 rounded-2xl border-2 font-bold transition-all ${serviceFormData.is_reversed ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                        {serviceFormData.is_reversed ? <><ArrowRightLeft size={18} /> Image on Left</> : <><LayoutTemplate size={18} /> Image on Right</>}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Service Image</label>
                    <div className="relative group aspect-[4/3] w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-amber-400 mx-auto">
                      {previewUrl ? (
                        <>
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                            <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg font-bold flex items-center gap-2 text-[10px] uppercase w-32 justify-center">
                              <Upload size={14} /> Change
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); } }} />
                            </label>
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreviewUrl(''); setSelectedFile(null); setServiceFormData(prev => ({ ...prev, image_url: '' })); }} className="bg-white text-red-600 px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg font-bold flex items-center gap-2 text-[10px] uppercase w-32 justify-center">
                              <Trash2 size={14} /> Remove
                            </button>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-4 group w-full h-full justify-center">
                          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><ImageIcon size={24} className="text-slate-400" /></div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); } }} required={!editingService && !serviceFormData.image_url} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea rows={4} value={serviceFormData.description} onChange={(e) => setServiceFormData({...serviceFormData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-amber-500 focus:bg-white transition-all font-medium resize-none" placeholder="Enter service description..." required />
                </div>
              </form>
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {saveStatus === 'success' && <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> Saved!</span>}
                  {saveStatus === 'error' && <span className="text-red-600 text-xs font-bold flex items-center gap-1"><AlertCircle size={14} /> Error!</span>}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsServiceModalOpen(false)} className="px-6 py-3 text-slate-500 hover:text-slate-800 font-bold transition-colors">Cancel</button>
                  <button onClick={handleSaveService} disabled={saveStatus === 'saving'} className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all disabled:opacity-50">
                    {saveStatus === 'saving' ? 'Saving...' : <><Save size={18} /> Save Service</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INSTAGRAM MODAL */}
      <AnimatePresence>
        {isInstagramModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsInstagramModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">{editingInstagram ? 'Edit Instagram Post' : 'Add Instagram Post'}</h3>
                <button onClick={() => setIsInstagramModalOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-white shadow-sm"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveInstagram} className="p-8 space-y-6 overflow-y-auto">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Post Image</label>
                  <div className="relative group aspect-square w-full max-w-[240px] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-pink-400 mx-auto">
                    {previewUrl ? (
                      <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                          <label className="cursor-pointer bg-white text-slate-800 px-4 py-2 rounded-xl hover:scale-105 transition-all shadow-lg font-bold flex items-center gap-2 text-[10px] uppercase w-32 justify-center">
                            <Upload size={14} /> Change
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); } }} />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center gap-4 group w-full h-full justify-center">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"><ImageIcon size={24} className="text-slate-400" /></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { setSelectedFile(file); setPreviewUrl(URL.createObjectURL(file)); } }} required={!editingInstagram} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Instagram Post URL</label>
                  <input type="url" value={instagramFormData.post_url} onChange={(e) => setInstagramFormData({...instagramFormData, post_url: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition-all font-medium" placeholder="https://www.instagram.com/p/..." required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Order Index</label>
                  <input type="number" value={instagramFormData.order_index} onChange={(e) => setInstagramFormData({...instagramFormData, order_index: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-800 outline-none focus:border-pink-500 focus:bg-white transition-all font-medium" />
                </div>
              </form>
              <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {saveStatus === 'success' && <span className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> Saved!</span>}
                  {saveStatus === 'error' && <span className="text-red-600 text-xs font-bold flex items-center gap-1"><AlertCircle size={14} /> Error!</span>}
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsInstagramModalOpen(false)} className="px-6 py-3 text-slate-500 hover:text-slate-800 font-bold transition-colors">Cancel</button>
                  <button onClick={handleSaveInstagram} disabled={saveStatus === 'saving'} className="bg-pink-600 hover:bg-pink-500 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink-600/20 transition-all disabled:opacity-50">
                    {saveStatus === 'saving' ? 'Saving...' : <><Save size={18} /> Save Post</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
