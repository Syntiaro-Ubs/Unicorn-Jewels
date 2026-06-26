import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Minus, Plus, Gift, Truck, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

function formatPrice(n) {
  return '$' + n.toLocaleString('en-US', {
    minimumFractionDigits: 0
  });
}

export function CartDrawer({
  open,
  onClose,
  items,
  updateQty,
  removeFromCart,
  onCheckout,
  onProductClick
}) {
  const subtotal = items.reduce((sum, i) => sum + i.priceNum * i.quantity, 0);
  const FREE_SHIP_THRESHOLD = 500;
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const scrollRef = useRef(null);
  
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  
  const shipProgress = Math.min(100, subtotal / FREE_SHIP_THRESHOLD * 100);
  
  return <>
      {/* Backdrop */}
      <div className={`fixed inset-0 z-[70] bg-black/40 backdrop-blur-[2px] transition-opacity duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      {/* Drawer */}
      <motion.div initial={{
      x: '100%'
    }} animate={{
      x: open ? 0 : '100%'
    }} transition={{
      type: 'tween',
      duration: 0.48,
      ease: [0.4, 0, 0.2, 1]
    }} className="fixed top-0 right-0 h-full w-full sm:w-[85vw] md:w-[480px] lg:w-[520px] sm:max-w-[480px] md:max-w-[520px] bg-white z-[80] flex flex-col shadow-2xl" style={{
      fontFamily: "'Cormorant Garamond', serif"
    }}>

        {/* ── HEADER ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
          <div className="flex items-baseline gap-2 sm:gap-3">
            <h2 className="text-sm sm:text-base tracking-[0.3em] uppercase" style={{
            fontWeight: 300
          }}>
              My Bag
            </h2>
            {items.length > 0 && <span className="text-[10px] text-gray-400 tracking-[0.15em]">
                ({items.reduce((s, i) => s + i.quantity, 0)})
              </span>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors duration-200 p-1">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── FREE SHIPPING PROGRESS ── */}
        <div className="flex-shrink-0 px-5 sm:px-6 py-3 border-b border-gray-100 bg-[#fafafa]">
          {remaining > 0 ? <>
              <p className="text-[9px] tracking-[0.25em] text-gray-500 uppercase mb-2.5">
                Add <span className="text-black">{formatPrice(remaining)}</span> more for complimentary shipping
              </p>
              <div className="w-full h-[1px] bg-gray-200 relative">
                <motion.div className="absolute top-0 left-0 h-full bg-black" initial={{
              width: 0
            }} animate={{
              width: `${shipProgress}%`
            }} transition={{
              duration: 0.8,
              ease: 'easeOut'
            }} />
              </div>
            </> : <div className="flex items-center gap-2.5">
              <Truck size={11} className="text-black" />
              <p className="text-[9px] tracking-[0.25em] text-black uppercase">
                Complimentary shipping included
              </p>
            </div>}
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto" style={{
        scrollbarWidth: 'none'
      }}>

          {/* ── EMPTY STATE ── */}
          {items.length === 0 ? <div className="flex flex-col items-center justify-center h-64 px-10 text-center pt-16">
              <div className="w-12 h-12 border border-gray-200 rotate-45 flex items-center justify-center mb-8">
                <div className="-rotate-45 text-gray-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl text-black mb-2" style={{
            fontWeight: 300
          }}>Your bag is empty</h3>
              <p className="text-[11px] text-gray-400 mb-8 leading-relaxed tracking-wide">
                Discover our collections and find your next treasure.
              </p>
              <button onClick={onClose} className="text-[9px] tracking-[0.3em] uppercase text-black border-b border-gray-400 pb-0.5 hover:border-black transition-colors">
                Explore Collections
              </button>
            </div> : (/* ── CART ITEMS ── */
            <div className="divide-y divide-gray-100">
              {items.map(item => {
                const maxStock = item.sizeStock !== undefined && item.sizeStock !== null ? item.sizeStock : item.stock;
                const isLimitReached = maxStock !== undefined && maxStock !== null && item.quantity >= maxStock;
                
                return <div key={`${item.id}-${item.selectedSize || ''}-${item.selectedWeight || ''}`} className="flex gap-4 px-5 sm:px-6 py-5">
                  {/* Image */}
                  <div className="w-[75px] h-[75px] flex-shrink-0 bg-[#f7f7f7] overflow-hidden">
                    <button type="button" onClick={() => onProductClick?.(item)} className="block h-full w-full cursor-pointer">
                      <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-contain p-2 transition-transform duration-300 hover:scale-105" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <button type="button" onClick={() => onProductClick?.(item)} className="text-left text-[11px] tracking-[0.15em] uppercase text-black leading-snug hover:text-gray-500 transition-colors" style={{
                    fontWeight: 400
                  }}>
                          {item.name}
                        </button>
                        {item.metal && <p className="text-[9px] tracking-[0.12em] text-gray-400 uppercase mt-1">
                            {item.metal}
                          </p>}
                        {item.selectedSize && <p className="text-[9px] tracking-[0.12em] text-blue-600 font-bold uppercase mt-1">
                            Size: {item.selectedSize}
                          </p>}
                        {item.selectedWeight && <p className="text-[9px] tracking-[0.12em] text-emerald-600 font-bold uppercase mt-1">
                            Weight: {parseFloat(item.selectedWeight).toFixed(2)}g
                          </p>}
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedWeight)} className="text-gray-300 hover:text-black transition-colors flex-shrink-0 mt-0.5">
                        <X size={13} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Qty Controls */}
                      <div className="flex items-center gap-0 border border-gray-200">
                        <button onClick={() => item.quantity > 1 ? updateQty(item.id, item.quantity - 1, item.selectedSize, item.selectedWeight) : removeFromCart(item.id, item.selectedSize, item.selectedWeight)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors border-r border-gray-200">
                          <Minus size={10} strokeWidth={1.5} />
                        </button>
                        <span className="text-xs w-8 text-center" style={{
                    fontWeight: 300
                  }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQty(item.id, item.quantity + 1, item.selectedSize, item.selectedWeight)} 
                          disabled={isLimitReached}
                          className={`w-8 h-8 flex items-center justify-center border-l border-gray-200 transition-colors ${
                            isLimitReached
                              ? 'text-gray-200 cursor-not-allowed bg-gray-50'
                              : 'text-gray-400 hover:text-black'
                          }`}
                        >
                          <Plus size={10} strokeWidth={1.5} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-sm tracking-wider text-black" style={{
                  fontWeight: 300
                }}>
                        {formatPrice(item.priceNum * item.quantity)}
                      </p>
                    </div>

                    {/* ITEM BUTTONS */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                      <button onClick={() => {
                  onClose();
                  onCheckout();
                }} className="flex-1 bg-black text-white py-2 px-3 text-[8px] tracking-[0.15em] uppercase transition-colors hover:bg-gray-800">
                        Buy Now
                      </button>
                      <button 
                        onClick={() => updateQty(item.id, item.quantity + 1, item.selectedSize, item.selectedWeight)} 
                        disabled={isLimitReached}
                        className={`flex-1 py-2 px-3 text-[8px] tracking-[0.15em] uppercase transition-colors border ${
                          isLimitReached
                            ? 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'
                            : 'bg-white border-gray-300 text-black hover:border-black'
                        }`}
                      >
                        Add More
                      </button>
                    </div>
                  </div>
                </div>;
              })}
            </div>)}

          {/* ── SERVICES STRIP ── */}
          <div className="mx-5 sm:mx-6 my-5 border border-gray-100 divide-y divide-gray-100">
            <div className="flex items-center gap-3 px-4 py-3">
              <Gift size={12} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-black">Signature Gift Packaging</p>
                <p className="text-[9px] text-gray-400 mt-0.5 tracking-wide">Every piece arrives in our iconic gift box</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 flex-shrink-0">
                <path d="M12 20h9" /><path d="M16.5 3.5 a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-black">Complimentary Engraving</p>
                <p className="text-[9px] text-gray-400 mt-0.5 tracking-wide">Personalize at checkout, at no extra cost</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Truck size={12} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-black">Free Worldwide Shipping</p>
                <p className="text-[9px] text-gray-400 mt-0.5 tracking-wide">On all orders. Tracked & insured delivery</p>
              </div>
            </div>
          </div>

          {/* Bottom padding */}
          <div className="h-4" />
        </div>

        {/* ── STICKY FOOTER (only when items in bag) ── */}
        {items.length > 0 && <div className="flex-shrink-0 border-t border-gray-100 px-5 sm:px-6 pt-4 pb-6 bg-white space-y-3">
            {/* Order summary */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-[9px] tracking-[0.3em] uppercase text-gray-500 block">Subtotal</span>
                <span className="text-[9px] tracking-wider text-gray-400">Taxes & duties at checkout</span>
              </div>
              <span className="text-2xl text-black" style={{
            fontWeight: 300
          }}>
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Checkout CTA */}
            <motion.button whileHover={{
          backgroundColor: '#1a1a1a'
        }} whileTap={{
          scale: 0.99
        }} onClick={() => {
          onClose();
          onCheckout();
        }} className="w-full bg-black text-white py-3 flex items-center justify-center gap-2 text-[9px] tracking-[0.25em] uppercase transition-colors duration-300" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400
        }}>
              <span>Proceed to Checkout</span>
              <ChevronRight size={12} />
            </motion.button>

            {/* Continue */}
            <button onClick={onClose} className="w-full text-center text-[9px] tracking-[0.25em] uppercase text-gray-400 hover:text-black transition-colors py-1">
              Continue Shopping
            </button>
          </div>}
      </motion.div>
    </>;
}
