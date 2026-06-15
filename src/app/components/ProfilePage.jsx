import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Heart, MapPin, User, LogOut, ArrowLeft, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const imgNecklace = "https://images.unsplash.com/photo-1770721478216-3e5dbbe8dcc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwbmVja2xhY2UlMjBvbiUyMG1vZGVsfGVufDF8fHx8MTc3NTczMzIxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const imgRing = "https://images.unsplash.com/photo-1737314418233-c61ff046e647?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvbnl4JTIwcmluZyUyMG9uJTIwZmluZ2VyfGVufDF8fHx8MTc3NTczMzIxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const imgPendant = "https://images.unsplash.com/photo-1623448585160-48b86b876b32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzYXBwaGlyZSUyMHBlbmRhbnR8ZW58MXx8fHwxNzc1NzMzMjEyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const imgEarrings = "https://images.unsplash.com/photo-1774504347388-3d01f7cac097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwc3R1ZCUyMGVhcnJpbmdzfGVufDF8fHx8MTc3NTY5NzYzM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const imgPortrait = "https://images.unsplash.com/photo-1694463814421-5eff6fd605c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kc29tZSUyMG1hbiUyMHN1aXQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzU2ODIwMjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

export function ProfilePage({
  onBack,
  onLogout,
  userInitial,
  user,
  initialTab = 'overview',
  wishlist = new Set(),
  wishlistItems = [],
  toggleWishlist,
  addToCart,
  onProductClick,
  orders = [],
  addresses = [],
  onUpdateProfile,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onTrackShipment,
  onDownloadReceipt,
  onCancelOrder
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const tabs = [{
    id: 'overview',
    label: 'Overview',
    icon: User
  }, {
    id: 'orders',
    label: 'Order History',
    icon: Package
  }, {
    id: 'wishlist',
    label: 'Wishlist',
    icon: Heart
  }, {
    id: 'addresses',
    label: 'Saved Addresses',
    icon: MapPin
  }];

  return <div className="min-h-screen bg-white text-black pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col mb-16 border-b border-gray-100 pb-12">
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors w-fit mb-12">
            <ArrowLeft size={14} />
            Back to Home
          </button>
          <h1 className="text-5xl md:text-7xl font-serif text-black mb-6 tracking-wide">My Account</h1>
          <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase">
            Welcome back, {user ? `${user.firstName} ${user.lastName}` : userInitial}
          </p>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 flex flex-col gap-2 shrink-0">
            {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-6 px-6 py-5 text-[10px] uppercase tracking-[0.2em] transition-all duration-500 border-l-2 ${isActive ? 'border-black bg-[#fcfcfc] text-black font-medium' : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'}`}>
                  <Icon size={14} className={isActive ? 'text-black' : 'text-gray-400'} />
                  {tab.label}
                </button>;
          })}

            <div className="h-[1px] bg-gray-100 w-full my-6" />

            <button onClick={onLogout} className="flex items-center gap-6 px-6 py-5 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors">
              <LogOut size={14} className="text-gray-400" />
              Sign Out
            </button>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4 min-h-[600px]">
            {activeTab === 'overview' && <OverviewTab user={user} onEdit={() => setIsEditingProfile(true)} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} onTrackShipment={onTrackShipment} onDownloadReceipt={onDownloadReceipt} onCancelOrder={onCancelOrder} />}
            {activeTab === 'wishlist' && <WishlistTab items={wishlistItems} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} onProductClick={onProductClick} />}
            {activeTab === 'addresses' && (
              <AddressesTab 
                user={user} 
                addresses={addresses} 
                onAdd={() => { setEditingAddress(null); setIsAddressModalOpen(true); }}
                onEdit={(addr) => { setEditingAddress(addr); setIsAddressModalOpen(true); }}
                onDelete={onDeleteAddress}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isEditingProfile && (
          <EditProfileModal 
            user={user} 
            onClose={() => setIsEditingProfile(false)} 
            onSave={onUpdateProfile} 
          />
        )}
        {isAddressModalOpen && (
          <AddressModal 
            address={editingAddress} 
            onClose={() => setIsAddressModalOpen(false)} 
            onSave={(data) => editingAddress ? onUpdateAddress(editingAddress.id, data) : onAddAddress(data)} 
          />
        )}
      </AnimatePresence>
    </div>;
}

function OverviewTab({ user, onEdit }) {
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest User';
  const email = user ? user.email : 'guest@example.com';
  const phone = user?.phone || '+1 (555) 123-4567';
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1]
  }} className="flex flex-col gap-16 h-full">
      <div className="max-w-2xl w-full flex flex-col">
        <div className="border border-gray-200 p-10 md:p-12 h-full flex flex-col relative">
          <h2 className="font-serif text-3xl mb-12">Personal Information</h2>
          <div className="space-y-10 flex-1">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Name</p>
              <p className="text-sm tracking-wide">{fullName}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Email</p>
              <p className="text-sm tracking-wide">{email}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Phone</p>
              <p className="text-sm tracking-wide">{phone}</p>
            </div>
            <div className="pt-12 mt-auto">
              <button onClick={onEdit} className="text-[10px] uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                Edit Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>;
}

function OrdersTab({ orders = [], onTrackShipment, onDownloadReceipt, onCancelOrder }) {
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1]
  }}>
      <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-6">
        <h2 className="font-serif text-4xl">Order History</h2>
        <button className="text-[10px] uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
          View All Returns
        </button>
      </div>
      
      <div className="flex flex-col gap-12">
        {orders.length === 0 ? (
          <div className="text-center py-20 border border-gray-100">
            <p className="text-gray-500 tracking-wider">No orders found.</p>
          </div>
        ) : orders.map(order => <div key={order.id} className="border border-gray-200 p-8 flex flex-col md:flex-row gap-10 items-center md:items-start group hover:border-black transition-colors duration-700">
            {/* Image */}
            <div className="w-full md:w-56 aspect-[4/5] bg-[#fcfcfc] overflow-hidden shrink-0 relative">
              <ImageWithFallback src={order.image} alt={order.item} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            </div>
            
            {/* Details */}
            <div className="flex-1 w-full flex flex-col h-full gap-8">
              <div className="flex flex-col xl:flex-row justify-between gap-6 xl:items-start border-b border-gray-100 pb-8">
                <div>
                  <h3 className="font-serif text-2xl mb-3">{order.item}</h3>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-gray-500">Order {order.id} <span className="mx-2">•</span> {order.date}</p>
                </div>
                <div className="text-left xl:text-right">
                  <p className="text-sm tracking-wider mb-3">{order.total}</p>
                  <p className="text-[9px] tracking-[0.2em] uppercase text-[#C0C0C0] font-medium">
                    {order.status === 'Cancelled' ? (
                      <>
                        <span className="text-red-500 font-semibold">Cancelled</span>
                        {order.refundStatus === 'SUCCESS' && <span className="text-emerald-600 font-semibold ml-2">(Refunded)</span>}
                        {order.refundStatus === 'PENDING' && <span className="text-amber-500 font-semibold ml-2">(Refund Pending)</span>}
                        {!order.refundStatus && <span className="text-gray-400 font-semibold ml-2">(Refund Initiated)</span>}
                      </>
                    ) : (
                      order.status
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-8 mt-auto pt-4">
                <button onClick={() => onDownloadReceipt?.(order)} className="text-[9px] uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  View Digital Receipt
                </button>
                <button onClick={() => onTrackShipment?.(order)} className="text-[9px] uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Track Shipment
                </button>
                {['Processing', 'Pending Payment', 'Pending'].includes(order.status) && (
                  <button onClick={() => onCancelOrder?.(order.id)} className="text-[9px] uppercase tracking-[0.2em] border-b border-red-300 text-red-500 pb-1 hover:text-red-700 hover:border-red-700 transition-colors">
                    Cancel Order
                  </button>
                )}
                {order.status === 'Delivered' && (
                  <button className="text-[9px] uppercase tracking-[0.2em] border-b border-gray-300 text-gray-500 pb-1 hover:text-black hover:border-black transition-colors xl:ml-auto">
                    Request Return
                  </button>
                )}
              </div>
            </div>
          </div>)}
      </div>
    </motion.div>;
}

function WishlistTab({
  items,
  wishlist,
  toggleWishlist,
  addToCart,
  onProductClick
}) {
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1]
  }}>
      <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-6">
        <h2 className="font-serif text-4xl">Curated Wishlist</h2>
        <span className="text-[10px] tracking-[0.2em] uppercase text-gray-500">{items.length} Items</span>
      </div>

      {items.length === 0 ? <div className="border border-gray-200 bg-[#fcfcfc] px-10 py-20 text-center">
          <h3 className="font-serif text-3xl mb-4">Your wishlist is empty</h3>
          <p className="text-sm text-gray-500 tracking-wide">Save the pieces you love and they will appear here.</p>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {items.map(item => <div key={item.id} className="group cursor-pointer flex flex-col" onClick={() => onProductClick?.(item)}>
              <div className="aspect-[3/4] bg-[#fcfcfc] overflow-hidden relative mb-8">
                <ImageWithFallback src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                <button onClick={e => {
              e.stopPropagation();
              toggleWishlist?.(item.id);
            }} className="absolute top-5 right-5 p-3 bg-white/90 backdrop-blur-sm hover:bg-black hover:text-white transition-colors z-10 opacity-0 group-hover:opacity-100 duration-500" aria-label="Remove from wishlist">
                  <Heart size={14} fill={wishlist?.has(item.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex justify-between items-start gap-6">
                  <h3 className="font-serif text-2xl leading-snug">{item.name}</h3>
                  <p className="text-sm tracking-wider shrink-0 pt-1">{item.price}</p>
                </div>
                {item.metal && <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">{item.metal}</p>}
                <button onClick={e => {
              e.stopPropagation();
              addToCart?.(item);
            }} className="mt-auto pt-6 w-full py-5 border border-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors duration-300">
                  Add to My Bag
                </button>
              </div>
            </div>)}
        </div>}
    </motion.div>;
}

function AddressesTab({ user, addresses = [], onAdd, onEdit, onDelete }) {
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest User';
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1]
  }}>
      <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-6">
        <h2 className="font-serif text-4xl">Saved Addresses</h2>
        <button onClick={onAdd} className="text-[10px] uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
          Add New Address
        </button>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {addresses.length === 0 ? (
          <div className="col-span-full border border-gray-100 py-20 text-center">
            <p className="text-gray-500 tracking-wider uppercase text-[10px]">No saved addresses yet.</p>
          </div>
        ) : addresses.map(addr => (
          <div key={addr.id} className={`border p-10 relative flex flex-col min-h-[320px] transition-colors duration-500 ${addr.is_primary ? 'border-black' : 'border-gray-200 hover:border-gray-400'}`}>
            {addr.is_primary && (
              <span className="absolute top-10 right-10 text-[9px] uppercase tracking-[0.2em] bg-black text-white px-4 py-1.5">Primary</span>
            )}
            <h3 className="font-serif text-2xl mb-8">{addr.type}</h3>
            <div className="space-y-3 text-sm text-gray-500 mb-12 tracking-wide leading-relaxed flex-1">
              <p className="text-black font-medium tracking-widest uppercase text-[10px] mb-6">{fullName}</p>
              <p>{addr.street}</p>
              {addr.apartment && <p>{addr.apartment}</p>}
              <p>{addr.city}, {addr.state} {addr.zip}</p>
              <p>{addr.country}</p>
            </div>
            <div className="flex gap-8 mt-auto pt-8 border-t border-gray-100">
              <button onClick={() => onEdit(addr)} className="text-[9px] uppercase tracking-[0.2em] border-b border-gray-300 pb-1 hover:border-black transition-colors">Edit</button>
              <button onClick={() => onDelete(addr.id)} className="text-[9px] uppercase tracking-[0.2em] border-b border-gray-300 pb-1 hover:border-black transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>;
}

function AddressModal({ address, onClose, onSave }) {
  const [formData, setFormData] = useState(address || {
    type: 'Home',
    is_primary: false,
    street: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await onSave(formData);
    setLoading(false);
    if (result.success) onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-xl p-10 md:p-12 relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors">
          <X size={20} />
        </button>
        <h2 className="font-serif text-3xl mb-10">{address ? 'Edit Address' : 'New Address'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 block">Address Type</label>
              <input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors" placeholder="Home, Office, etc." required />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={formData.is_primary} onChange={e => setFormData({...formData, is_primary: e.target.checked})} className="w-4 h-4 accent-black" />
                <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500 group-hover:text-black transition-colors">Set as Primary</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 block">Street Address</label>
            <input value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors" placeholder="1040 Fifth Avenue" required />
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 block">Apartment, Suite, etc. (Optional)</label>
            <input value={formData.apartment} onChange={e => setFormData({...formData, apartment: e.target.value})} className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors" placeholder="Apt 14B" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 block">City</label>
              <input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors" placeholder="New York" required />
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 block">State / Province</label>
              <input value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors" placeholder="NY" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 block">ZIP / Postal Code</label>
              <input value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors" placeholder="10028" required />
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 block">Country</label>
              <input value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors" placeholder="United States" required />
            </div>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Address'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

function EditProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await onSave(formData);
    setLoading(false);
    if (result.success) onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-lg p-10 md:p-12 relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors">
          <X size={20} />
        </button>
        <h2 className="font-serif text-3xl mb-10">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 block">First Name</label>
              <input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors" required />
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 block">Last Name</label>
              <input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors" required />
            </div>
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 block">Email Address</label>
            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors" required />
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 block">Phone Number</label>
            <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors" placeholder="+1 (555) 000-0000" />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-black text-white py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
