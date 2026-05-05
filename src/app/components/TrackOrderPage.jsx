import { motion } from 'motion/react';
import { Package, Truck, CheckCircle2, MapPin, Calendar, ArrowLeft, Search, Clock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function TrackOrderPage({ onBack }) {
  const trackingInfo = {
    orderId: "ORD-993-841",
    status: "In Transit",
    expectedDelivery: "October 15, 2025",
    currentLocation: "New York, NY",
    steps: [
      { status: "Order Placed", date: "Oct 12, 10:30 AM", location: "Online", completed: true },
      { status: "Processing", date: "Oct 12, 02:45 PM", location: "Fulfillment Center", completed: true },
      { status: "Shipped", date: "Oct 13, 09:15 AM", location: "Distribution Center", completed: true },
      { status: "In Transit", date: "Oct 14, 08:30 AM", location: "Local Hub", completed: false, current: true },
      { status: "Out for Delivery", date: "Pending", location: "Delivery Vehicle", completed: false },
      { status: "Delivered", date: "Pending", location: "Destination", completed: false }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-200 pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 border-b border-gray-100 pb-12"
        >
          <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-colors w-fit mb-12"
          >
            <ArrowLeft size={14} />
            Back to Shopping
          </button>
          <h1 className="text-5xl md:text-7xl mb-6 tracking-tight leading-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Track Your <span className="italic text-gray-500">Order.</span>
          </h1>
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400">Enter your order details to see current status</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Input Form or Active Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="bg-[#fcfcfc] border border-gray-200 p-10 md:p-12 space-y-10">
              <div className="space-y-6">
                <h2 className="font-serif text-3xl mb-8">Order Information</h2>
                
                <div>
                  <label className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3 block">Order Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      defaultValue={trackingInfo.orderId}
                      className="w-full border-b border-gray-300 bg-transparent py-3 text-sm focus:border-black outline-none transition-colors"
                    />
                    <Search size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 pt-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Status</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
                      <p className="text-sm tracking-wide font-medium">{trackingInfo.status}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-3">Expected</p>
                    <p className="text-sm tracking-wide">{trackingInfo.expectedDelivery}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white border border-gray-100 shrink-0">
                    <Truck size={18} className="text-gray-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500 mb-1">Carrier</p>
                    <p className="text-sm">FedEx International Priority</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white border border-gray-100 shrink-0">
                    <MapPin size={18} className="text-gray-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-gray-500 mb-1">Destination</p>
                    <p className="text-sm">1040 Fifth Avenue, New York, NY</p>
                  </div>
                </div>
              </div>

              <button className="w-full bg-black text-white text-[10px] uppercase tracking-[0.3em] py-5 hover:bg-gray-800 transition-all duration-500 mt-4">
                Update Me on Status
              </button>
            </div>
          </motion.div>

          {/* Right: Timeline */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-7"
          >
            <h2 className="font-serif text-3xl mb-12">Journey Timeline</h2>
            
            <div className="relative space-y-16">
              {/* Vertical Line */}
              <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-gray-200"></div>

              {trackingInfo.steps.map((step, index) => (
                <div key={index} className="relative pl-12 group">
                  {/* Indicator Dot */}
                  <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 z-10 ${
                    step.completed 
                      ? 'bg-black border-black text-white' 
                      : step.current 
                        ? 'bg-white border-black text-black shadow-lg scale-125' 
                        : 'bg-white border-gray-200 text-gray-300'
                  }`}>
                    {step.completed ? <CheckCircle2 size={12} strokeWidth={2.5} /> : step.current ? <Clock size={12} strokeWidth={2.5} /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                  </div>

                  <div className={`transition-all duration-500 ${step.completed || step.current ? 'opacity-100' : 'opacity-40'}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className={`text-[11px] tracking-[0.25em] uppercase font-medium ${step.current ? 'text-black' : 'text-gray-900'}`}>
                        {step.status}
                      </h3>
                      <span className="text-[9px] tracking-[0.2em] text-gray-400 uppercase">{step.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 tracking-widest uppercase">{step.location}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 p-8 border border-gray-100 bg-[#fafafa] flex items-center gap-6">
              <div className="w-12 h-12 bg-white flex items-center justify-center border border-gray-200 text-gray-400">
                <Calendar size={20} strokeWidth={1} />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                Your piece is currently undergoing security clearance at our international hub. Estimated delivery remains unchanged.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
