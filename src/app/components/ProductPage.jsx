import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Plus, Minus, Ruler, Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
export function ProductPage({
  product,
  onBack,
  wishlist,
  toggleWishlist,
  addToCart,
  addedIds
}) {
  const [activeAccordion, setActiveAccordion] = useState('details');
  const [selectedSize, setSelectedSize] = useState('Medium');
  const SIZES = ['Small', 'Medium', 'Large'];
  return <div className="min-h-screen bg-white text-black font-sans relative">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Images (60%) */}
        <div className="w-full lg:w-[60%] lg:h-screen lg:sticky lg:top-0 bg-[#f7f7f7] flex flex-col items-center overflow-y-auto">
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 1
        }} className="w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-screen flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12">
            <ImageWithFallback src={product.image} alt={product.name} className="w-full max-w-2xl object-contain mix-blend-multiply" />
          </motion.div>
        </div>

        {/* Right Side: Product Details (40%) */}
        <div className="w-full lg:w-[40%] px-6 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-24 flex flex-col justify-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="max-w-md mx-auto w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-black mb-3 sm:mb-4 leading-tight" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300
          }}>
              {product.name}
            </h1>
            
            <p className="text-xs sm:text-sm tracking-[0.1em] text-gray-500 uppercase mb-6 sm:mb-8">
              {product.metal}
            </p>

            <div className="text-xl sm:text-2xl mb-8 sm:mb-10 md:mb-12" style={{
            fontWeight: 300
          }}>
              {product.price}
            </div>

            {/* Size Selector */}
            <div className="mb-8 sm:mb-10">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-xs tracking-[0.2em] uppercase text-black">Size</span>
                <button className="text-[10px] tracking-wide text-gray-400 hover:text-black transition-colors flex items-center gap-1 border-b border-transparent hover:border-black pb-0.5 tap-target">
                  <Ruler size={10} /> Size Guide
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {SIZES.map(size => <button key={size} onClick={() => setSelectedSize(size)} className={`py-2.5 sm:py-3 text-xs tracking-widest uppercase transition-all border ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-black hover:border-black'} tap-target`}>
                    {size}
                  </button>)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 sm:gap-4 mb-12 sm:mb-14 md:mb-16">
              <button onClick={() => addToCart(product)} className={`flex-1 py-3 sm:py-4 text-xs tracking-[0.2em] uppercase transition-all duration-300 border tap-target ${addedIds.has(product.id) ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' : 'bg-black border-black text-white hover:bg-gray-800'}`}>
                {addedIds.has(product.id) ? 'Added to Bag' : 'Add to Bag'}
              </button>
              <button onClick={() => toggleWishlist(product.id)} className="w-12 sm:w-14 h-[44px] sm:h-[48px] border border-gray-200 flex items-center justify-center hover:border-black transition-colors shrink-0 tap-target">
                <Heart size={14} strokeWidth={1.5} className={`sm:w-[16px] sm:h-[16px] ${wishlist.has(product.id) ? 'fill-black text-black' : 'text-black'}`} />
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-gray-200">
              {/* Description */}
              <div className="border-b border-gray-200">
                <button onClick={() => setActiveAccordion(activeAccordion === 'details' ? null : 'details')} className="w-full py-5 sm:py-6 flex justify-between items-center text-xs tracking-[0.2em] uppercase text-black group tap-target">
                  Description & Details
                  <span className="text-gray-400 group-hover:text-black transition-colors">
                    {activeAccordion === 'details' ? <Minus size={12} className="sm:w-[14px] sm:h-[14px]" /> : <Plus size={12} className="sm:w-[14px] sm:h-[14px]" />}
                  </span>
                </button>
                {activeAccordion === 'details' && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} className="overflow-hidden">
                    <div className="pb-6 text-[11px] text-gray-500 leading-relaxed tracking-wide space-y-4">
                      <p>
                        An exquisite piece from our latest collection, embodying the bold elegance and timeless craftsmanship that defines Unicorn Jewels. The striking contrast of polished metal and brilliant facets catches the light from every angle.
                      </p>
                      <ul className="list-disc pl-4 space-y-2">
                        <li>{product.metal}</li>
                        <li>High-polish finish</li>
                        <li>Handcrafted in our Geneva atelier</li>
                        <li>Engraving available at checkout</li>
                      </ul>
                      <p className="mt-4 text-[10px] text-gray-400 italic">
                        Product number: UJ-{product.id}
                      </p>
                    </div>
                  </motion.div>}
              </div>

              {/* Delivery & Returns */}
              <div className="border-b border-gray-200">
                <button onClick={() => setActiveAccordion(activeAccordion === 'delivery' ? null : 'delivery')} className="w-full py-6 flex justify-between items-center text-xs tracking-[0.2em] uppercase text-black group">
                  Delivery & Returns
                  <span className="text-gray-400 group-hover:text-black transition-colors">
                    {activeAccordion === 'delivery' ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                {activeAccordion === 'delivery' && <motion.div initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }}>
                    <div className="pb-6 text-[11px] text-gray-500 leading-relaxed tracking-wide space-y-3">
                      <p><strong>Complimentary Express Shipping</strong><br />Delivery within 2-4 business days.</p>
                      <p><strong>Returns & Exchanges</strong><br />Items can be returned within 30 days of purchase in original condition.</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-2">
                        <Info size={10} /> Signature required upon delivery
                      </p>
                    </div>
                  </motion.div>}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>;
}
