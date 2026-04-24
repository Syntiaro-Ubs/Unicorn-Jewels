import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Lock, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
const logoImage = "/images/unicorn-logo.svg";
export function CheckoutPage({
  items,
  onBack,
  onViewTracking,
  onContinueShopping,
  onCompletePurchase
}) {
  const [activeSection, setActiveSection] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.priceNum * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 25;
  const taxes = subtotal * 0.08;
  const total = subtotal + shipping + taxes;
  const formatPrice = num => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(num);
  };
  const handlePlaceOrder = () => {
    setIsComplete(true);
    onCompletePurchase();
  };
  if (isComplete) {
    return <div className="min-h-screen bg-white text-black font-sans flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 20
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }} className="max-w-2xl w-full">
          <div className="mb-12 flex justify-center">
            <CheckCircle2 size={64} className="text-black" strokeWidth={1} />
          </div>
          
          <h1 className="text-5xl md:text-7xl mb-6 tracking-tight leading-none" style={{
          fontFamily: "'Cormorant Garamond', serif"
        }}>
            Acquisition <br className="md:hidden" /><span className="italic">Complete.</span>
          </h1>
          
          <p className="text-sm md:text-base text-gray-500 tracking-[0.1em] uppercase max-w-lg mx-auto leading-relaxed mb-16">
            Your transaction has been secured. An electronic decree of your receipt has been dispatched to your correspondence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={onViewTracking} className="w-full sm:w-auto group flex items-center justify-between border border-black p-5 hover:bg-black hover:text-white transition-all duration-500 min-w-[240px]">
              <span className="text-[10px] tracking-[0.3em] uppercase font-sans">
                View Orders
              </span>
              <ArrowRight size={16} className="transform transition-transform duration-500 group-hover:translate-x-2" />
            </button>

            <button onClick={onContinueShopping} className="w-full sm:w-auto group flex items-center justify-between border border-gray-300 p-5 hover:border-black transition-all duration-500 min-w-[240px] text-gray-600 hover:text-black">
              <span className="text-[10px] tracking-[0.3em] uppercase font-sans">
                Continue Shopping
              </span>
              <ArrowRight size={16} className="transform transition-transform duration-500 group-hover:translate-x-2 opacity-0 group-hover:opacity-100" />
            </button>
          </div>
        </motion.div>
      </div>;
  }
  return <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-200">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-12 z-50">
        <button onClick={onBack} className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-black transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
        
        <div className="flex-shrink-0">
          <ImageWithFallback src={logoImage} alt="Unicorn Jewels Logo" className="h-12 md:h-14 lg:h-16 w-auto object-contain" />
        </div>

        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-400">
          <Lock size={12} /> Secure
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="pt-20 min-h-screen flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        
        {/* LEFT COLUMN: FORMS (60%) */}
        <div className="w-full lg:w-[55%] xl:w-[60%] px-6 py-12 md:px-16 md:py-16">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="max-w-3xl mx-auto space-y-12">
            <div>
              <h2 className="text-3xl mb-10" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300
            }}>Checkout</h2>
              
              {/* SECTION: CONTACT */}
              <div className={`mb-8 ${activeSection !== 1 ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                  <h3 className="text-[11px] tracking-[0.2em] uppercase text-black">1. Contact Information</h3>
                  {activeSection > 1 && <button onClick={() => setActiveSection(1)} className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black">Edit</button>}
                </div>
                
                {activeSection === 1 && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} className="space-y-4 pt-2">
                    <input type="email" placeholder="Email Address *" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                    <div className="flex items-center gap-2 mt-2 pb-4">
                      <input type="checkbox" id="offers" className="accent-black w-3 h-3 border-gray-300" />
                      <label htmlFor="offers" className="text-[10px] tracking-wide text-gray-500 uppercase">Email me with news and offers</label>
                    </div>
                    <button onClick={() => setActiveSection(2)} className="bg-black text-white px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-[#1a1a1a] transition-colors">
                      Continue to Shipping
                    </button>
                  </motion.div>}
              </div>

              {/* SECTION: SHIPPING */}
              <div className={`mb-8 ${activeSection !== 2 ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                  <h3 className="text-[11px] tracking-[0.2em] uppercase text-black">2. Shipping Address</h3>
                  {activeSection > 2 && <button onClick={() => setActiveSection(2)} className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-black">Edit</button>}
                </div>

                {activeSection === 2 && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} className="pt-2">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <input type="text" placeholder="First Name *" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                      <input type="text" placeholder="Last Name *" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                      <input type="text" placeholder="Address *" className="col-span-2 w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                      <input type="text" placeholder="Apartment, suite, etc. (optional)" className="col-span-2 w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                      <input type="text" placeholder="City *" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                      <select className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors bg-transparent text-gray-500">
                        <option value="">State / Province *</option>
                        <option value="NY">New York</option>
                        <option value="CA">California</option>
                        <option value="TX">Texas</option>
                      </select>
                      <input type="text" placeholder="ZIP / Postal Code *" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                      <input type="tel" placeholder="Phone *" className="w-full border border-gray-300 px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                    </div>
                    <button onClick={() => setActiveSection(3)} className="bg-black text-white px-8 py-3 text-[10px] tracking-[0.2em] uppercase hover:bg-[#1a1a1a] transition-colors">
                      Continue to Payment
                    </button>
                  </motion.div>}
              </div>

              {/* SECTION: PAYMENT */}
              <div className={`mb-10 ${activeSection !== 3 ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                  <h3 className="text-[11px] tracking-[0.2em] uppercase text-black">3. Payment</h3>
                </div>

                {activeSection === 3 && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} className="pt-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">All transactions are secure and encrypted.</p>
                    <div className="border border-gray-300 p-4 space-y-4 bg-[#fafafa]">
                      <div className="relative">
                        <input type="text" placeholder="Card Number" className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                        <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Expiration (MM/YY)" className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                        <input type="text" placeholder="Security Code" className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                      </div>
                      <input type="text" placeholder="Name on Card" className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-black outline-none transition-colors" />
                    </div>

                    <button onClick={handlePlaceOrder} className="w-full bg-black text-white py-4 mt-8 flex items-center justify-center gap-3 text-[11px] tracking-[0.3em] uppercase hover:bg-[#1a1a1a] transition-colors" style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: '14px'
                }}>
                      <Lock size={14} className="mb-0.5" /> Complete Purchase
                    </button>
                  </motion.div>}
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY (40%) */}
        <div className="w-full lg:w-[45%] xl:w-[40%] bg-[#fafafa] border-l border-gray-100 px-6 py-12 md:px-12 md:py-16">
          <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="max-w-xl mx-auto sticky top-32">
            <h3 className="text-2xl mb-8" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300
          }}>Order Summary</h3>
            
            {items.length === 0 ? <p className="text-sm text-gray-500 tracking-wider">Your bag is empty.</p> : <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2" style={{
            scrollbarWidth: 'thin'
          }}>
                {items.map(item => <div key={item.id} className="flex gap-5">
                    <div className="w-20 h-20 bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center p-2 relative">
                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      <div className="absolute -top-2 -right-2 bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-[10px] tracking-[0.15em] uppercase text-black leading-snug">{item.name}</h4>
                      {item.metal && <p className="text-[9px] text-gray-500 tracking-wider uppercase mt-1">{item.metal}</p>}
                      <p className="text-sm mt-2 text-black" style={{
                  fontWeight: 300
                }}>{formatPrice(item.priceNum * item.quantity)}</p>
                    </div>
                  </div>)}
              </div>}

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Estimated Tax</span>
                <span>{formatPrice(taxes)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6 flex justify-between items-center">
              <span className="text-xl" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400
            }}>Total</span>
              <span className="text-2xl" style={{
              fontWeight: 300
            }}>
                {formatPrice(total)}
              </span>
            </div>

            <div className="mt-10 bg-white border border-gray-200 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <ShieldCheck size={24} className="text-gray-400" />
              <p className="text-[10px] tracking-widest uppercase text-gray-500 leading-relaxed">
                Complimentary Shipping & Returns on all orders.<br />
                All pieces arrive in our signature gift packaging.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </div>;
}
