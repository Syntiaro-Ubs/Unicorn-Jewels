import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Minus, Plus, Gift, Truck, ChevronRight, Heart, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { withScopedProductIds } from './productIdentity';
function formatPrice(n) {
  return '$' + n.toLocaleString('en-US', {
    minimumFractionDigits: 0
  });
}
const YOU_MAY_ALSO_LIKE = withScopedProductIds([{
  id: 101,
  name: 'Pavé Diamond Band',
  metal: 'Platinum',
  price: '$6,200',
  image: 'https://images.unsplash.com/photo-1662434921251-a6eba45ac40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGx1eHVyeSUyMGpld2VscnklMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc0MjUwMjg4fDA&ixlib=rb-4.1.0&q=80&w=1080'
}, {
  id: 102,
  name: 'Eternal Gold Pendant',
  metal: '18k Yellow Gold',
  price: '$3,400',
  image: 'https://images.unsplash.com/photo-1688406264720-e2f9389c9ed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwcGVuZGFudCUyMG5lY2tsYWNlJTIwZWxlZ2FudCUyMG1pbmltYWx8ZW58MXx8fHwxNzc0MjUwMjkwfDA&ixlib=rb-4.1.0&q=80&w=1080'
}, {
  id: 103,
  name: 'Brilliance Drop Earrings',
  metal: 'Platinum · Pair',
  price: '$8,750',
  image: 'https://images.unsplash.com/photo-1770757587030-5c2c889fc36d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwZWFycmluZ3MlMjBsdXh1cnklMjBkcm9wJTIwd2hpdGV8ZW58MXx8fHwxNzc0MjUwMjkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
}, {
  id: 104,
  name: 'Pearl Strand Bracelet',
  metal: 'South Sea Pearl',
  price: '$4,100',
  image: 'https://images.unsplash.com/photo-1772698262368-1f341873b96d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGJyYWNlbGV0JTIwZmluZSUyMGpld2Vscnl8ZW58MXx8fHwxNzc0MjUwMjkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
}, {
  id: 105,
  name: 'Royal Sapphire Ring',
  metal: 'Platinum · Ceylon',
  price: '$11,500',
  image: 'https://images.unsplash.com/photo-1675377294835-e71bdcd9850f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMHJpbmclMjBwbGF0aW51bSUyMGx1eHVyeSUyMGNsb3NldXB8ZW58MXx8fHwxNzc0MjUwMjkyfDA&ixlib=rb-4.1.0&q=80&w=1080'
}], 'cart-recommendations');
const DISCOVER_MORE = [{
  id: 1,
  title: 'The New Arrivals',
  subtitle: 'Just unveiled from the atelier',
  cta: 'Discover',
  image: 'https://images.unsplash.com/photo-1763906473317-c9193c8ef05a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwZWRpdG9yaWFsJTIwZmFzaGlvbiUyMG1vZGVsfGVufDF8fHx8MTc3NDI1MDI5NHww&ixlib=rb-4.1.0&q=80&w=1080'
}, {
  id: 2,
  title: 'Our Craft',
  subtitle: 'Centuries of artisanal mastery',
  cta: 'Explore',
  image: 'https://images.unsplash.com/photo-1706955008775-c00874bb4d4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwamV3ZWxyeSUyMGNyYWZ0c21hbnNoaXAlMjBhdGVsaWVyJTIwd29ya3Nob3B8ZW58MXx8fHwxNzc0MjUwMjk1fDA&ixlib=rb-4.1.0&q=80&w=1080'
}];
export function CartDrawer({
  open,
  onClose,
  items,
  addedIds,
  updateQty,
  removeFromCart,
  wishlist,
  toggleWishlist,
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
    }} className="fixed top-0 right-0 h-full w-full sm:w-[90vw] md:w-[750px] lg:w-[900px] sm:max-w-[750px] md:max-w-[900px] bg-white z-[80] flex flex-col shadow-2xl" style={{
      fontFamily: "'Cormorant Garamond', serif"
    }}>

        {/* ── HEADER ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-100">
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
        <div className="flex-shrink-0 px-8 py-4 border-b border-gray-100 bg-[#fafafa]">
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
              {items.map(item => <div key={item.id} className="flex gap-5 px-8 py-6">
                  {/* Image */}
                  <div className="w-[90px] h-[90px] flex-shrink-0 bg-[#f7f7f7] overflow-hidden">
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
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-black transition-colors flex-shrink-0 mt-0.5">
                        <X size={13} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Qty Controls */}
                      <div className="flex items-center gap-0 border border-gray-200">
                        <button onClick={() => item.quantity > 1 ? updateQty(item.id, item.quantity - 1) : removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors border-r border-gray-200">
                          <Minus size={10} strokeWidth={1.5} />
                        </button>
                        <span className="text-xs w-8 text-center" style={{
                    fontWeight: 300
                  }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black transition-colors border-l border-gray-200">
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

                    {/* NEW ITEM BUTTONS */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 flex-wrap">
                      <button onClick={() => {
                  onClose();
                  onCheckout();
                }} className="flex-1 bg-black text-white py-2 text-[8px] tracking-[0.2em] uppercase transition-colors hover:bg-gray-800">
                        Buy Now
                      </button>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)} className="flex-1 bg-white border border-gray-300 text-black py-2 text-[8px] tracking-[0.2em] uppercase transition-colors hover:border-black">
                        Add to Cart
                      </button>
                      <button onClick={() => toggleWishlist(item.id)} className={`flex-1 bg-white border ${wishlist.has(item.id) ? 'border-black' : 'border-gray-300'} text-black py-2 text-[8px] tracking-[0.2em] uppercase transition-colors hover:border-black`}>
                        {wishlist.has(item.id) ? 'Saved' : 'Wishlist'}
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>)}

          {/* ── EDITORIAL IMAGES ── */}
          {items.length > 0 && <div className="px-8 mt-6 mb-8">
              <div className="flex flex-col gap-4">
                <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-gray-100">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1761706660175-b4750af86afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwamV3ZWxyeSUyMG1vZGVsJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NzY3NjA0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Jewelry Model Editorial" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out" />
                </div>
                <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-gray-100">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1714747453609-1cb3acaccf62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByaW5ncyUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzc2NzYwNDgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Luxury Rings Detail" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out" />
                </div>
                <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-gray-100">
                  <ImageWithFallback src="https://images.unsplash.com/photo-1763906473317-c9193c8ef05a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwbW9kZWwlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc2NzYwNDc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Fine Jewelry Editorial" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out" />
                </div>
              </div>
            </div>}

          {/* ── SERVICES STRIP ── */}
          <div className="mx-8 my-6 border border-gray-100 divide-y divide-gray-100">
            <div className="flex items-center gap-3 px-4 py-3">
              <Gift size={12} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-black">Signature Gift Packaging</p>
                <p className="text-[9px] text-gray-400 mt-0.5 tracking-wide">Every piece arrives in our iconic gift box</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400 flex-shrink-0">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
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

          {/* ── YOU MAY ALSO LIKE ── */}
          {items.length > 0 && <>
              <div className="mt-2 mb-8">
            <div className="flex items-center justify-between px-8 mb-5">
              <h3 className="text-[9px] tracking-[0.35em] uppercase text-black" style={{
                fontWeight: 400
              }}>
                You May Also Like
              </h3>
              <button className="text-[8px] tracking-[0.2em] uppercase text-gray-400 hover:text-black transition-colors flex items-center gap-1">
                View All <ChevronRight size={10} />
              </button>
            </div>

            {/* Horizontal scroll */}
            <div ref={scrollRef} className="flex gap-4 px-8 overflow-x-auto pb-2" style={{
              scrollbarWidth: 'none',
              scrollSnapType: 'x mandatory'
            }}>
              {YOU_MAY_ALSO_LIKE.map(product => <div key={product.id} className="flex-shrink-0 w-36 group cursor-pointer" style={{
                scrollSnapAlign: 'start'
              }}>
                  <div className="relative w-full h-36 bg-[#f7f7f7] overflow-hidden mb-3">
                    <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {/* Wishlist */}
                    <button onClick={e => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Heart size={13} strokeWidth={1.5} className={wishlist.has(product.id) ? "fill-black text-black" : "text-black"} />
                    </button>
                    {/* Quick add overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-black text-white text-center py-2 text-[8px] tracking-[0.2em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      Quick Add
                    </div>
                  </div>
                  <h4 className="text-[9px] tracking-[0.12em] uppercase text-black leading-snug mb-1" style={{
                  fontWeight: 400
                }}>
                    {product.name}
                  </h4>
                  <p className="text-[9px] text-gray-400 tracking-wider">{product.metal}</p>
                  <p className="text-[10px] text-black mt-1 tracking-wider" style={{
                  fontWeight: 300
                }}>{product.price}</p>
                </div>)}
            </div>
          </div>

          {/* ── DISCOVER MORE ── */}
          <div className="mb-8">
            <div className="px-8 mb-5">
              <h3 className="text-[9px] tracking-[0.35em] uppercase text-black" style={{
                fontWeight: 400
              }}>
                Discover More
              </h3>
            </div>

            <div className="flex gap-4 px-8">
              {DISCOVER_MORE.map(card => <div key={card.id} className="flex-1 group cursor-pointer relative overflow-hidden" style={{
                minWidth: 0
              }}>
                  {/* Image */}
                  <div className="w-full aspect-[3/4] overflow-hidden relative">
                    <ImageWithFallback src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Text overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-[8px] tracking-[0.25em] uppercase text-white/70 mb-1">{card.subtitle}</p>
                      <h4 className="text-sm text-white leading-tight mb-3" style={{
                      fontWeight: 300
                    }}>
                        {card.title}
                      </h4>
                      <button className="flex items-center gap-1.5 text-[8px] tracking-[0.2em] uppercase text-white border-b border-white/50 pb-0.5 hover:border-white transition-colors group-hover:gap-2.5 duration-300">
                        <span>{card.cta}</span>
                        <ArrowRight size={9} />
                      </button>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
            </>}

          {/* Bottom padding */}
          <div className="h-4" />
        </div>

        {/* ── STICKY FOOTER (only when items in bag) ── */}
        {items.length > 0 && <div className="flex-shrink-0 border-t border-gray-100 px-8 pt-5 pb-7 bg-white space-y-4">
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
        }} className="w-full bg-black text-white py-4 flex items-center justify-center gap-3 text-[10px] tracking-[0.3em] uppercase transition-colors duration-300" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400
        }}>
              <span>Proceed to Checkout</span>
              <ChevronRight size={13} />
            </motion.button>

            {/* Continue */}
            <button onClick={onClose} className="w-full text-center text-[9px] tracking-[0.25em] uppercase text-gray-400 hover:text-black transition-colors py-1">
              Continue Shopping
            </button>
          </div>}
      </motion.div>
    </>;
}
