import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Package, Heart, MapPin, User, LogOut, ArrowLeft } from 'lucide-react';
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
  initialTab = 'overview',
  wishlist = new Set(),
  wishlistItems = [],
  toggleWishlist,
  addToCart,
  onProductClick
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
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
          <p className="text-gray-500 text-[10px] tracking-[0.2em] uppercase">Welcome back, {userInitial}</p>
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
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'wishlist' && <WishlistTab items={wishlistItems} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} onProductClick={onProductClick} />}
            {activeTab === 'addresses' && <AddressesTab />}
          </div>
        </div>
      </div>
    </div>;
}
function OverviewTab() {
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 h-full">
        {/* Left 40% - Profile details */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="border border-gray-200 p-10 md:p-12 h-full flex flex-col relative">
            <h2 className="font-serif text-3xl mb-12">Personal Information</h2>
            <div className="space-y-10 flex-1">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Name</p>
                <p className="text-sm tracking-wide">Elara Vance</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Email</p>
                <p className="text-sm tracking-wide">elara.vance@example.com</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Phone</p>
                <p className="text-sm tracking-wide">+1 (555) 123-4567</p>
              </div>
              <div className="pt-12 mt-auto">
                <button className="text-[10px] uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Edit Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 60% - Private Concierge */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="bg-[#fcfcfc] border border-gray-100 p-10 md:p-12 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gray-100 rounded-full blur-3xl -mr-32 -mt-32 transition-all duration-1000 group-hover:bg-[#f0f0f0]"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-10">
                <h2 className="font-serif text-3xl">Private Concierge</h2>
                <span className="text-[9px] uppercase tracking-[0.2em] bg-black text-white px-4 py-1.5">Active</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-16 max-w-[400px]">
                Your dedicated jewelry advisor is available to assist you with bespoke requests, private viewings, and curating your personal collection to your exacting standards.
              </p>
              <div className="flex items-center gap-6 mt-auto">
                <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border border-gray-200">
                  <ImageWithFallback src={imgPortrait} alt="Julian Sterling" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase mb-1.5 font-medium">Julian Sterling</p>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#C0C0C0]">Senior Advisor</p>
                </div>
                <button className="ml-auto bg-black text-white text-[9px] uppercase tracking-[0.2em] py-4 px-8 hover:bg-gray-800 transition-colors">
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>;
}
function OrdersTab() {
  const mockOrders = [{
    id: "ORD-993-841",
    date: "October 12, 2025",
    status: "Delivered",
    total: "$12,450",
    item: "Lumière Diamond Choker",
    image: imgNecklace
  }, {
    id: "ORD-842-109",
    date: "July 04, 2025",
    status: "Delivered",
    total: "$8,900",
    item: "Eclipse Onyx Ring",
    image: imgRing
  }];
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
        {mockOrders.map(order => <div key={order.id} className="border border-gray-200 p-8 flex flex-col md:flex-row gap-10 items-center md:items-start group hover:border-black transition-colors duration-700">
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
                  <p className="text-[9px] tracking-[0.2em] uppercase text-[#C0C0C0] font-medium">{order.status}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-8 mt-auto pt-4">
                <button className="text-[9px] uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  View Digital Receipt
                </button>
                <button className="text-[9px] uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
                  Track Shipment
                </button>
                <button className="text-[9px] uppercase tracking-[0.2em] border-b border-gray-300 text-gray-500 pb-1 hover:text-black hover:border-black transition-colors xl:ml-auto">
                  Request Return
                </button>
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
function AddressesTab() {
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
        <button className="text-[10px] uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors">
          Add New Address
        </button>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="border border-black p-10 relative flex flex-col min-h-[320px]">
          <span className="absolute top-10 right-10 text-[9px] uppercase tracking-[0.2em] bg-black text-white px-4 py-1.5">Primary</span>
          <h3 className="font-serif text-2xl mb-8">Home</h3>
          <div className="space-y-3 text-sm text-gray-500 mb-12 tracking-wide leading-relaxed flex-1">
            <p className="text-black font-medium tracking-widest uppercase text-[10px] mb-6">Elara Vance</p>
            <p>1040 Fifth Avenue</p>
            <p>Apt 14B</p>
            <p>New York, NY 10028</p>
            <p>United States</p>
          </div>
          <div className="flex gap-8 mt-auto pt-8 border-t border-gray-100">
            <button className="text-[9px] uppercase tracking-[0.2em] border-b border-gray-300 pb-1 hover:border-black transition-colors">Edit</button>
            <button className="text-[9px] uppercase tracking-[0.2em] border-b border-gray-300 pb-1 hover:border-black transition-colors">Delete</button>
          </div>
        </div>

        <div className="border border-gray-200 p-10 flex flex-col min-h-[320px] hover:border-gray-400 transition-colors duration-500">
          <h3 className="font-serif text-2xl mb-8">Office</h3>
          <div className="space-y-3 text-sm text-gray-500 mb-12 tracking-wide leading-relaxed flex-1">
            <p className="text-black font-medium tracking-widest uppercase text-[10px] mb-6">Elara Vance</p>
            <p>Vance Media Group</p>
            <p>1 World Trade Center</p>
            <p>New York, NY 10007</p>
            <p>United States</p>
          </div>
          <div className="flex gap-8 mt-auto pt-8 border-t border-gray-100">
            <button className="text-[9px] uppercase tracking-[0.2em] border-b border-gray-300 pb-1 hover:border-black transition-colors">Edit</button>
            <button className="text-[9px] uppercase tracking-[0.2em] border-b border-gray-300 pb-1 hover:border-black transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </motion.div>;
}
