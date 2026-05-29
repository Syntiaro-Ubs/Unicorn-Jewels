import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, Plus, Minus, Ruler, Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ProductPage({
  product,
  onBack,
  wishlist,
  toggleWishlist,
  addToCart,
  addedIds,
  onProductClick
}) {
  const [activeAccordion, setActiveAccordion] = useState('details');
  const [selectedSize, setSelectedSize] = useState('');
  const [variants, setVariants] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);

  useEffect(() => {
    // Fetch variants for this product
    const fetchVariants = async () => {
      setIsLoadingVariants(true);
      try {
        const response = await fetch(`http://localhost:5000/api/products/${product.id}/variants`);
        if (response.ok) {
          const data = await response.json();
          setVariants(data);
          
          // Extract unique sizes
          const sizes = [...new Set(data.filter(v => v.size).map(v => v.size))];
          setAvailableSizes(sizes);
          
          // Set default selected size
          if (sizes.length > 0) {
            setSelectedSize(sizes[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching variants:', error);
      } finally {
        setIsLoadingVariants(false);
      }
    };

    if (product.id) {
      fetchVariants();
    }
  }, [product.id]);

  useEffect(() => {
    // Fetch similar products from same collection (prioritize) or category
    const fetchSimilarProducts = async () => {
      setIsLoadingSimilar(true);
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const allProducts = await response.json();
          
          let similar = [];
          
          // First priority: Same collection (show up to 4 products from collection)
          if (product.collection_id) {
            similar = allProducts.filter(p => 
              p.id !== product.id && 
              p.collection_id === product.collection_id
            ).slice(0, 4);
          }
          
          // If no collection products found, try category
          if (similar.length === 0 && product.category_id) {
            similar = allProducts.filter(p => 
              p.id !== product.id && 
              p.category_id === product.category_id
            ).slice(0, 4);
          }
          
          setSimilarProducts(similar);
        }
      } catch (error) {
        console.error('Error fetching similar products:', error);
      } finally {
        setIsLoadingSimilar(false);
      }
    };

    if (product.id) {
      fetchSimilarProducts();
    }
  }, [product.id, product.category_id, product.collection_id]);

  // Fallback sizes if no variants
  const FALLBACK_SIZES = ['Small', 'Medium', 'Large'];
  const displaySizes = availableSizes.length > 0 ? availableSizes : FALLBACK_SIZES;

  // Set default size if not set
  useEffect(() => {
    if (!selectedSize && displaySizes.length > 0) {
      setSelectedSize(displaySizes[0]);
    }
  }, [displaySizes, selectedSize]);
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
              {isLoadingVariants ? (
                <div className="py-8 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                </div>
              ) : displaySizes.length > 0 ? (
                <div className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(displaySizes.length, 5)}, minmax(0, 1fr))` }}>
                  {displaySizes.map(size => <button key={size} onClick={() => setSelectedSize(size)} className={`py-2.5 sm:py-3 text-xs tracking-widest uppercase transition-all border ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-black hover:border-black'} tap-target`}>
                      {size}
                    </button>)}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">One size fits all</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 sm:gap-4 mb-12 sm:mb-14 md:mb-16">
              {(() => {
                const currentVariant = variants.find(v => v.size === selectedSize);
                const sizeStock = currentVariant ? currentVariant.stock : (variants.length > 0 ? 0 : product.stock);
                
                if (sizeStock === 0) {
                  return (
                    <button 
                      onClick={() => alert(`Notification Signup Successful!\n\nWe will notify you as soon as "${product.name}"${selectedSize ? ` (Size: ${selectedSize})` : ''} is back in stock.`)} 
                      className="flex-1 py-3 sm:py-4 text-xs tracking-[0.2em] uppercase transition-all duration-300 border tap-target bg-[#f1f5f9] border-[#cbd5e1] text-[#475569] hover:bg-[#e2e8f0]"
                    >
                      Notify Me
                    </button>
                  );
                }
                
                return (
                  <button 
                    onClick={() => addToCart(product, selectedSize, sizeStock)} 
                    className={`flex-1 py-3 sm:py-4 text-xs tracking-[0.2em] uppercase transition-all duration-300 border tap-target ${addedIds.has(product.id) ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' : 'bg-black border-black text-white hover:bg-gray-800'}`}
                  >
                    {addedIds.has(product.id) ? 'Added to Bag' : 'Add to Bag'}
                  </button>
                );
              })()}
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

      {/* You May Also Like Section */}
      <div className="w-full bg-white py-12 sm:py-16 md:py-20 px-6 sm:px-8 md:px-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl text-center mb-8 sm:mb-12" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300
          }}>
            You May Also Like
          </h2>
          
          {isLoadingSimilar ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            </div>
          ) : similarProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-400">No similar products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {similarProducts.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="group cursor-pointer"
                  onClick={() => onProductClick?.(item)}
                >
                  <div className="relative aspect-square bg-[#f7f7f7] mb-3 sm:mb-4 overflow-hidden">
                    <ImageWithFallback
                      src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`) : item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Wishlist button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item.id);
                      }}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Heart
                        size={14}
                        strokeWidth={1.5}
                        className={`sm:w-[16px] sm:h-[16px] ${
                          wishlist.has(item.id) ? 'fill-black text-black' : 'text-black'
                        }`}
                      />
                    </button>

                    {/* Quick add button */}
                    {item.stock === 0 ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Notification Signup Successful!\n\nWe will notify you as soon as "${item.name}" is back in stock.`);
                        }}
                        className="absolute inset-x-0 bottom-0 bg-[#f1f5f9] text-[#475569] border-t border-[#cbd5e1] py-2 sm:py-3 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      >
                        Notify Me
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className="absolute inset-x-0 bottom-0 bg-black text-white py-2 sm:py-3 text-[9px] sm:text-[10px] tracking-[0.2em] uppercase translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      >
                        {addedIds.has(item.id) ? 'Added to Bag' : 'Quick Add'}
                      </button>
                    )}
                  </div>

                  <h3 className="text-xs sm:text-sm tracking-[0.1em] uppercase text-black mb-1 leading-snug" style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400
                  }}>
                    {item.name}
                  </h3>
                  
                  {item.metal && (
                    <p className="text-[10px] sm:text-xs text-gray-400 tracking-wider uppercase mb-1">
                      {item.metal}
                    </p>
                  )}
                  
                  <p className="text-xs sm:text-sm text-black tracking-wider" style={{
                    fontWeight: 300
                  }}>
                    {item.price}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>;
}
