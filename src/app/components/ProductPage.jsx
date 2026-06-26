import { useState, useEffect, useMemo } from 'react';
import { API_BASE } from '@/config';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Plus, Minus, Ruler, Info, X, ChevronDown, Instagram } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const RING_CHART_DATA = [
  { tiffanySize: '3', diameter: '14.1', circumference: '44.2', conversions: { 'UNITED STATES': '3', 'SOUTH KOREA': '4', 'UNITED KINGDOM': 'F', 'ITALY': '4', 'GERMANY': '14', 'FRANCE': '44' } },
  { tiffanySize: '3.5', diameter: '14.5', circumference: '45.5', conversions: { 'UNITED STATES': '3.5', 'SOUTH KOREA': '5', 'UNITED KINGDOM': 'G', 'ITALY': '5.25', 'GERMANY': '14.5', 'FRANCE': '45' } },
  { tiffanySize: '4', diameter: '14.9', circumference: '46.8', conversions: { 'UNITED STATES': '4', 'SOUTH KOREA': '6', 'UNITED KINGDOM': 'H', 'ITALY': '6.5', 'GERMANY': '15', 'FRANCE': '47' } },
  { tiffanySize: '4.5', diameter: '15.3', circumference: '48.0', conversions: { 'UNITED STATES': '4.5', 'SOUTH KOREA': '7', 'UNITED KINGDOM': 'I 1/2', 'ITALY': '7.75', 'GERMANY': '15.25', 'FRANCE': '48' } },
  { tiffanySize: '5', diameter: '15.7', circumference: '49.3', conversions: { 'UNITED STATES': '5', 'SOUTH KOREA': '8', 'UNITED KINGDOM': 'J 1/2', 'ITALY': '9', 'GERMANY': '15.75', 'FRANCE': '49' } },
  { tiffanySize: '5.5', diameter: '16.1', circumference: '50.6', conversions: { 'UNITED STATES': '5.5', 'SOUTH KOREA': '9', 'UNITED KINGDOM': 'L', 'ITALY': '10.25', 'GERMANY': '16', 'FRANCE': '51' } },
  { tiffanySize: '6', diameter: '16.5', circumference: '51.9', conversions: { 'UNITED STATES': '6', 'SOUTH KOREA': '11', 'UNITED KINGDOM': 'M', 'ITALY': '11.5', 'GERMANY': '16.5', 'FRANCE': '52' } },
  { tiffanySize: '6.5', diameter: '16.9', circumference: '53.1', conversions: { 'UNITED STATES': '6.5', 'SOUTH KOREA': '12', 'UNITED KINGDOM': 'N', 'ITALY': '12.75', 'GERMANY': '17', 'FRANCE': '53' } },
  { tiffanySize: '7', diameter: '17.3', circumference: '54.4', conversions: { 'UNITED STATES': '7', 'SOUTH KOREA': '13', 'UNITED KINGDOM': 'O', 'ITALY': '14', 'GERMANY': '17.25', 'FRANCE': '54' } },
  { tiffanySize: '7.5', diameter: '17.7', circumference: '55.7', conversions: { 'UNITED STATES': '7.5', 'SOUTH KOREA': '14', 'UNITED KINGDOM': 'P', 'ITALY': '15.25', 'GERMANY': '17.75', 'FRANCE': '56' } },
  { tiffanySize: '8', diameter: '18.1', circumference: '57.0', conversions: { 'UNITED STATES': '8', 'SOUTH KOREA': '15', 'UNITED KINGDOM': 'Q', 'ITALY': '16.5', 'GERMANY': '18', 'FRANCE': '57' } },
  { tiffanySize: '8.5', diameter: '18.5', circumference: '58.3', conversions: { 'UNITED STATES': '8.5', 'SOUTH KOREA': '16', 'UNITED KINGDOM': 'R', 'ITALY': '17.75', 'GERMANY': '18.5', 'FRANCE': '58' } },
  { tiffanySize: '9', diameter: '18.9', circumference: '59.5', conversions: { 'UNITED STATES': '9', 'SOUTH KOREA': '17', 'UNITED KINGDOM': 'S', 'ITALY': '19', 'GERMANY': '19', 'FRANCE': '59' } },
  { tiffanySize: '9.5', diameter: '19.4', circumference: '60.8', conversions: { 'UNITED STATES': '9.5', 'SOUTH KOREA': '18', 'UNITED KINGDOM': 'T', 'ITALY': '20.25', 'GERMANY': '19.5', 'FRANCE': '61' } },
  { tiffanySize: '10', diameter: '19.8', circumference: '62.1', conversions: { 'UNITED STATES': '10', 'SOUTH KOREA': '19', 'UNITED KINGDOM': 'U', 'ITALY': '21.5', 'GERMANY': '20', 'FRANCE': '62' } },
  { tiffanySize: '10.5', diameter: '20.2', circumference: '63.4', conversions: { 'UNITED STATES': '10.5', 'SOUTH KOREA': '20', 'UNITED KINGDOM': 'V', 'ITALY': '22.75', 'GERMANY': '20.25', 'FRANCE': '63' } },
  { tiffanySize: '11', diameter: '20.6', circumference: '64.6', conversions: { 'UNITED STATES': '11', 'SOUTH KOREA': '22', 'UNITED KINGDOM': 'W', 'ITALY': '24', 'GERMANY': '20.75', 'FRANCE': '64' } },
  { tiffanySize: '11.5', diameter: '21.0', circumference: '65.9', conversions: { 'UNITED STATES': '11.5', 'SOUTH KOREA': '23', 'UNITED KINGDOM': 'X', 'ITALY': '25.25', 'GERMANY': '21', 'FRANCE': '66' } },
  { tiffanySize: '12', diameter: '21.4', circumference: '67.2', conversions: { 'UNITED STATES': '12', 'SOUTH KOREA': '24', 'UNITED KINGDOM': 'Y', 'ITALY': '26.5', 'GERMANY': '21.25', 'FRANCE': '67' } },
  { tiffanySize: '12.5', diameter: '21.8', circumference: '68.5', conversions: { 'UNITED STATES': '12.5', 'SOUTH KOREA': '25', 'UNITED KINGDOM': 'Z', 'ITALY': '27.75', 'GERMANY': '21.75', 'FRANCE': '68' } },
  { tiffanySize: '13', diameter: '22.2', circumference: '69.7', conversions: { 'UNITED STATES': '13', 'SOUTH KOREA': '26', 'UNITED KINGDOM': 'Z+1', 'ITALY': '29', 'GERMANY': '22', 'FRANCE': '69' } }
];

export function ProductPage({
  product,
  onBack,
  wishlist,
  toggleWishlist,
  addToCart,
  addedIds,
  onProductClick,
  onBookAppointment
}) {
  const [activeAccordion, setActiveAccordion] = useState('details');
  const additionalImages = useMemo(() => {
    if (!product.additional_images) return [];
    if (Array.isArray(product.additional_images)) return product.additional_images;
    try {
      return JSON.parse(product.additional_images);
    } catch (e) {
      console.error('Error parsing additional_images:', e);
      return [];
    }
  }, [product.additional_images]);

  const additionalVideos = useMemo(() => {
    if (!product.additional_videos) return [];
    if (Array.isArray(product.additional_videos)) return product.additional_videos;
    try {
      return JSON.parse(product.additional_videos);
    } catch (e) {
      console.error('Error parsing additional_videos:', e);
      return [];
    }
  }, [product.additional_videos]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [variants, setVariants] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [isLoadingVariants, setIsLoadingVariants] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [guideTab, setGuideTab] = useState('select');
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('UNITED STATES');
  const REGIONS = ['UNITED STATES', 'SOUTH KOREA', 'UNITED KINGDOM', 'ITALY', 'GERMANY', 'FRANCE'];

  useEffect(() => {
    // Fetch variants for this product
    const fetchVariants = async () => {
      setIsLoadingVariants(true);
      try {
        const response = await fetch(`${API_BASE}/api/products/${product.id}/variants`);
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
    if (selectedSize && variants.length > 0) {
      const activeVariant = variants.find(v => v.size === selectedSize);
      if (activeVariant && activeVariant.weights) {
        try {
          const wList = Array.isArray(activeVariant.weights) 
            ? activeVariant.weights 
            : JSON.parse(activeVariant.weights);
          const validWeights = wList.filter(w => w !== "" && w !== null && w !== undefined);
          if (validWeights.length > 0) {
            const firstFormatted = parseFloat(validWeights[0]).toFixed(2);
            setSelectedWeight(firstFormatted);
            return;
          }
        } catch (e) {
          console.error("Error setting default weight on size change:", e);
        }
      }
    }
    setSelectedWeight('');
  }, [selectedSize, variants]);

  useEffect(() => {
    // Fetch similar products from same collection (prioritize) or category
    const fetchSimilarProducts = async () => {
      setIsLoadingSimilar(true);
      try {
        const response = await fetch(`${API_BASE}/api/products`);
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
  const isRing = product.category_name?.toLowerCase() === 'rings' || 
                 product.category_name?.toLowerCase() === 'ring' ||
                 String(product.id).includes('rings') ||
                 String(product.id).includes('ring') ||
                 product.sourceLabel?.toLowerCase() === 'rings' ||
                 product.sourceLabel?.toLowerCase() === 'ring';

  const isNecklace = product.category_name?.toLowerCase() === 'necklaces' || 
                     product.category_name?.toLowerCase() === 'necklace' ||
                     product.category_name?.toLowerCase() === 'pendants' || 
                     product.category_name?.toLowerCase() === 'pendant' ||
                     String(product.id).includes('necklace') ||
                     String(product.id).includes('pendant') ||
                     product.sourceLabel?.toLowerCase() === 'necklaces' ||
                     product.sourceLabel?.toLowerCase() === 'necklace';

  const isBracelet = product.category_name?.toLowerCase() === 'bracelets' || 
                     product.category_name?.toLowerCase() === 'bracelet' ||
                     product.category_name?.toLowerCase() === 'bangles' || 
                     product.category_name?.toLowerCase() === 'bangle' ||
                     String(product.id).includes('bracelet') ||
                     String(product.id).includes('bangle') ||
                     product.sourceLabel?.toLowerCase() === 'bracelets' ||
                     product.sourceLabel?.toLowerCase() === 'bracelet';

  const FALLBACK_SIZES = isRing 
    ? ['5', '6', '7', '8'] 
    : (isNecklace ? ['16"', '18"', '20"', '22"', '24"'] : ['Small', 'Medium', 'Large']);
  const displaySizes = availableSizes.length > 0 ? availableSizes : FALLBACK_SIZES;

  const guideData = useMemo(() => {
    if (isRing) {
      return {
        title: 'Ring Size Guide',
        chartHeader: ['US Size', 'Circumference (Inches)', 'Circumference (mm)'],
        chartRows: [
          { size: '5', value1: '1.93"', value2: '49.0 mm' },
          { size: '6', value1: '2.04"', value2: '51.8 mm' },
          { size: '7', value1: '2.14"', value2: '54.4 mm' },
          { size: '8', value1: '2.24"', value2: '56.9 mm' },
          { size: '9', value1: '2.35"', value2: '59.5 mm' },
          { size: '10', value1: '2.46"', value2: '62.1 mm' }
        ],
        howToMeasureTitle: 'How to Measure Ring Size',
        howToMeasureSteps: [
          'Wrap a piece of string or paper snugly around the base of the finger you wish to measure.',
          'Mark the exact point where the ends meet to form a complete circle.',
          'Measure the length of the string/paper against a ruler in millimeters to find the circumference.',
          'Use our size chart above to match your circumference measurement with the corresponding US Ring Size. If you fall between sizes, we recommend selecting the larger size.'
        ],
        svgType: 'ring'
      };
    } else if (isNecklace) {
      return {
        title: 'Necklace Size Guide',
        chartHeader: ['Length (Inches)', 'Length (cm)', 'Recommended Fit'],
        chartRows: [
          { size: '16"', value1: '40 cm', value2: 'Choker style, sits at the base of the neck' },
          { size: '18"', value1: '45 cm', value2: 'Princess style, rests on the collarbone (standard)' },
          { size: '20"', value1: '50 cm', value2: 'Matinee style, falls below the collarbone' },
          { size: '22"', value1: '55 cm', value2: 'Sits slightly above the bust line' },
          { size: '24"', value1: '60 cm', value2: 'Hangs at or below the center of the bust' }
        ],
        howToMeasureTitle: 'Necklace Length & Fit Guide',
        howToMeasureSteps: [
          'Choose a favorite necklace that fits just the way you want, measure its total length from clasp to end.',
          'Alternatively, wrap a soft tape measure or piece of string around your neck, holding it at the desired drop point.',
          'Note the measurement in inches or centimeters, and compare it with our sizing details above.',
          'Pendants will add extra length; keep this in mind when choosing the overall drop of your necklace.'
        ],
        svgType: 'necklace'
      };
    } else {
      // Default to Bracelet
      return {
        title: 'Bracelet Size Guide',
        chartHeader: ['Size', 'Wrist Size (Inches)', 'Wrist Size (cm)'],
        chartRows: [
          { size: 'Small', value1: '5.76" – 6.25"', value2: '14.6 – 15.9 cm' },
          { size: 'Medium', value1: '6.26" – 6.75"', value2: '15.9 – 17.1 cm' },
          { size: 'Large', value1: '6.76" – 7.25"', value2: '17.2 – 18.4 cm' }
        ],
        howToMeasureTitle: 'How to Measure Wrist Size',
        howToMeasureSteps: [
          'Wrap a flexible measuring tape or a strip of paper around the widest part of your wrist (just below the wrist bone).',
          'Ensure the wrap is snug but comfortable, and mark where the ends overlap.',
          'Measure the paper strip length against a flat ruler in inches or centimeters.',
          'Refer to the sizing chart above to find your ideal bracelet size. For a looser fit, we recommend selecting one size up.'
        ],
        svgType: 'bracelet'
      };
    }
  }, [isRing, isNecklace]);

  // Set default size if not set
  useEffect(() => {
    if (!selectedSize && displaySizes.length > 0) {
      setSelectedSize(displaySizes[0]);
    }
  }, [displaySizes, selectedSize]);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product.id]);

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
        }} className="w-full min-h-[50vh] sm:min-h-[60vh] lg:min-h-screen flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 relative">
            <ImageWithFallback src={product.image_url ? (product.image_url.startsWith('http') ? product.image_url : `${API_BASE}${product.image_url}`) : product.image} alt={product.name} className="w-full max-w-2xl object-contain mix-blend-multiply" />
            {product.instagram_link && (
              <a
                href={product.instagram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-6 right-6 z-10 w-10 h-10 bg-white hover:bg-black text-black hover:text-white rounded-full flex items-center justify-center shadow-md border border-gray-100 transition-all duration-300 group hover:scale-110 active:scale-95 cursor-pointer"
                title="View on Instagram"
                onClick={(e) => e.stopPropagation()}
              >
                <Instagram className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
              </a>
            )}
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
              {product.price ? (product.price.startsWith('$') ? product.price : `$${product.price}`) : ''}
            </div>

            {/* Size Selector */}
            <div className="mb-8 sm:mb-10">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <span className="text-xs tracking-[0.2em] uppercase text-black">Size</span>
                <button onClick={() => setIsSizeGuideOpen(true)} className="text-[10px] tracking-wide text-gray-400 hover:text-black transition-colors flex items-center gap-1 border-b border-transparent hover:border-black pb-0.5 tap-target">
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

              <div className="mt-4 flex justify-between items-center text-xs">
                <span className="text-gray-500 text-[10px] tracking-wide uppercase font-medium">Need a custom size?</span>
                <button 
                  onClick={() => onBookAppointment?.('care', `I would like to request a custom size for: ${product.name}.`)}
                  className="text-[10px] tracking-widest text-black hover:text-gray-600 transition-colors uppercase font-bold border-b border-black pb-0.5 tap-target"
                >
                  Request Custom Size
                </button>
              </div>
            </div>

            {/* Weight Selector */}
            {(() => {
              const activeVariant = variants.find(v => v.size === selectedSize);
              if (!activeVariant || !activeVariant.weights) return null;
              try {
                const wList = Array.isArray(activeVariant.weights) 
                  ? activeVariant.weights 
                  : JSON.parse(activeVariant.weights);
                const validWeights = wList.filter(w => w !== "" && w !== null && w !== undefined);
                if (validWeights.length === 0) return null;

                const weightCounts = {};
                validWeights.forEach(w => {
                  const formatted = parseFloat(w).toFixed(2);
                  weightCounts[formatted] = (weightCounts[formatted] || 0) + 1;
                });
                const uniqueWeights = Object.keys(weightCounts);

                return (
                  <div className="mb-8 sm:mb-10">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                      <span className="text-xs tracking-[0.2em] uppercase text-black font-semibold">Available Piece Weights</span>
                      <span className="text-[10px] tracking-wide text-gray-400">Select unique piece</span>
                    </div>
                    <div className="relative">
                      <select 
                        value={selectedWeight}
                        onChange={(e) => setSelectedWeight(e.target.value)}
                        className="w-full bg-white text-black text-xs font-medium tracking-widest uppercase py-3.5 px-4 border border-gray-200 outline-none focus:border-black transition-colors appearance-none cursor-pointer"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {uniqueWeights.map((w) => (
                          <option key={w} value={w}>
                            {w} grams ({weightCounts[w]} {weightCounts[w] === 1 ? 'piece' : 'pieces'} available)
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                        <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>
                );
              } catch (e) {
                console.error("Error rendering weight selector:", e);
                return null;
              }
            })()}

            {/* Action Buttons */}
            <div className="flex gap-3 sm:gap-4 mb-12 sm:mb-14 md:mb-16">
              {(() => {
                const currentVariant = variants.find(v => v.size === selectedSize);
                let sizeStock = 0;
                if (currentVariant) {
                  if (selectedWeight && currentVariant.weights) {
                    try {
                      const wList = Array.isArray(currentVariant.weights) ? currentVariant.weights : JSON.parse(currentVariant.weights);
                      sizeStock = wList.filter(w => parseFloat(w).toFixed(2) === selectedWeight).length;
                    } catch (e) {
                      sizeStock = currentVariant.stock || 0;
                    }
                  } else {
                    sizeStock = currentVariant.stock || 0;
                  }
                } else if (variants.length > 0) {
                  sizeStock = 0;
                } else {
                  sizeStock = product.stock;
                }
                
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
                    onClick={() => addToCart(product, selectedSize, sizeStock, selectedWeight)} 
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
                      {product.description && (
                        <p style={{ whiteSpace: 'pre-line' }}>
                          {product.description}
                        </p>
                      )}
                      {product.metal && (
                        <p className="mt-2">
                          <strong>Metal / Type:</strong> {product.metal}
                        </p>
                      )}
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

            {/* Additional Media Gallery */}
            {(additionalImages.length > 0 || additionalVideos.length > 0) && (
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-5">
                {/* Title */}
                <h4 className="text-[10px] tracking-[0.2em] uppercase text-black font-semibold">Gallery</h4>
                <div className="space-y-4">
                  {additionalImages.map((imgUrl, index) => (
                    <div key={`img-${index}`} className="w-full bg-[#f7f7f7] border border-gray-100 overflow-hidden rounded-sm group relative">
                      <img 
                        src={imgUrl.startsWith('http') ? imgUrl : `${API_BASE}${imgUrl}`} 
                        alt={`Product gallery ${index + 1}`} 
                        className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                  ))}
                  {additionalVideos.map((videoUrl, index) => (
                    <div key={`vid-${index}`} className="w-full aspect-video bg-black border border-gray-100 overflow-hidden rounded-sm relative">
                      <video 
                        src={videoUrl.startsWith('http') ? videoUrl : `${API_BASE}${videoUrl}`} 
                        controls 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                      src={item.image_url ? (item.image_url.startsWith('http') ? item.image_url : `${API_BASE}${item.image_url}`) : item.image}
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
                    {item.price ? (item.price.startsWith('$') ? item.price : `$${item.price}`) : ''}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tiffany-style Size Guide Drawer */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-xs z-[999]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[500px] bg-white shadow-2xl z-[1000] flex flex-col font-sans overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-xl text-black" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300 }}>
                    {guideData.title}
                  </h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                    {product.name}
                  </p>
                </div>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-100 rounded-full text-gray-400 hover:text-black hover:border-black transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 shrink-0">
                <button
                  onClick={() => setGuideTab('select')}
                  className={`flex-1 py-4 text-[10px] tracking-[0.2em] uppercase font-semibold transition-all relative ${
                    guideTab === 'select' ? 'text-black' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  Select your size
                  {guideTab === 'select' && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-black"
                    />
                  )}
                </button>
                <button
                  onClick={() => setGuideTab('fit')}
                  className={`flex-1 py-4 text-[10px] tracking-[0.2em] uppercase font-semibold transition-all relative ${
                    guideTab === 'fit' ? 'text-black' : 'text-gray-400 hover:text-black'
                  }`}
                >
                  Find your perfect fit
                  {guideTab === 'fit' && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 inset-x-0 h-0.5 bg-black"
                    />
                  )}
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {guideTab === 'select' ? (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 border border-gray-100 rounded-sm">
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">Currently Selected</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-black">Size {selectedSize || 'None'}</span>
                        <span className="text-[10px] text-gray-500 font-medium">Available: {displaySizes.join(', ')}</span>
                      </div>
                    </div>

                    {isRing ? (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="pb-3 text-[9px] font-semibold text-gray-400 uppercase tracking-widest">
                              Tiffany Size
                            </th>
                            <th className="pb-3 text-[9px] font-semibold text-gray-400 uppercase tracking-widest relative">
                              <div className="inline-block relative">
                                <button
                                  type="button"
                                  onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                                  className="flex items-center gap-1 text-[9px] font-semibold text-gray-400 uppercase tracking-widest border-b border-dashed border-gray-300 pb-0.5 hover:text-black cursor-pointer"
                                >
                                  {selectedRegion} Size
                                  <ChevronDown size={10} className="stroke-[2.5]" />
                                </button>
                                {regionDropdownOpen && (
                                  <>
                                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setRegionDropdownOpen(false)} />
                                    <div className="absolute top-[calc(100%+6px)] left-0 bg-white border border-gray-200 shadow-xl py-1.5 w-44 z-50 rounded-sm">
                                      {REGIONS.map(region => (
                                        <button
                                          key={region}
                                          type="button"
                                          onClick={() => {
                                            setSelectedRegion(region);
                                            setRegionDropdownOpen(false);
                                          }}
                                          className="w-full text-left px-4 py-2 text-[9px] uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-black font-semibold transition-colors block cursor-pointer"
                                        >
                                          {region}
                                        </button>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            </th>
                            <th className="pb-3 text-[9px] font-semibold text-gray-400 uppercase tracking-widest">
                              Interior Diameter (mm)
                            </th>
                            <th className="pb-3 text-[9px] font-semibold text-gray-400 uppercase tracking-widest">
                              Circumference (mm)
                            </th>
                            <th className="pb-3 w-12"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {RING_CHART_DATA.map((row, idx) => {
                            const isAvailable = displaySizes.some(
                              s => s.toString().toLowerCase().replace(/\s/g, '') === row.tiffanySize.toLowerCase().replace(/\s/g, '')
                            );
                            const isSelected = selectedSize.toString().toLowerCase().replace(/\s/g, '') === row.tiffanySize.toLowerCase().replace(/\s/g, '');

                            return (
                              <tr
                                key={idx}
                                onClick={() => {
                                  if (isAvailable) {
                                    setSelectedSize(row.tiffanySize);
                                    setIsSizeGuideOpen(false);
                                  }
                                }}
                                className={`border-b border-gray-50 transition-colors ${
                                  isAvailable
                                    ? 'cursor-pointer hover:bg-gray-50/50'
                                    : 'opacity-50 hover:bg-gray-50/20'
                                } ${isSelected ? 'bg-gray-50/80' : ''}`}
                              >
                                <td className="py-3.5 text-xs font-semibold text-black">
                                  {row.tiffanySize}
                                </td>
                                <td className="py-3.5 text-xs text-gray-900 font-medium font-mono">
                                  {row.conversions[selectedRegion]}
                                </td>
                                <td className="py-3.5 text-xs text-gray-500 font-normal">
                                  {row.diameter}
                                </td>
                                <td className="py-3.5 text-xs text-gray-500 font-normal">
                                  {row.circumference}
                                </td>
                                <td className="py-3.5 text-right w-16 pr-1">
                                  {isAvailable ? (
                                    <div
                                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                        isSelected
                                          ? 'border-black bg-black text-white'
                                          : 'border-gray-300'
                                      }`}
                                    >
                                      {isSelected && (
                                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 fill-none stroke-current stroke-[3.5]">
                                          <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                      )}
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        alert(`Notification Signup Successful!\n\nWe will notify you as soon as "${product.name}" (Size: ${row.tiffanySize}) is back in stock.`);
                                      }}
                                      className="text-[9px] text-gray-400 font-bold uppercase tracking-wider hover:text-black transition-colors underline bg-transparent border-none p-0 cursor-pointer whitespace-nowrap"
                                    >
                                      Notify me
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100">
                            {guideData.chartHeader.map((header, idx) => (
                              <th key={idx} className="pb-3 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {guideData.chartRows.map((row, idx) => {
                            const isAvailable = displaySizes.some(
                              s => s.toString().toLowerCase().replace(/\s/g, '') === row.size.toString().toLowerCase().replace(/\s/g, '')
                            );
                            const isSelected = selectedSize.toString().toLowerCase().replace(/\s/g, '') === row.size.toString().toLowerCase().replace(/\s/g, '');

                            return (
                              <tr
                                key={idx}
                                onClick={() => {
                                  if (isAvailable) {
                                    setSelectedSize(row.size);
                                    setIsSizeGuideOpen(false);
                                  }
                                }}
                                className={`border-b border-gray-50 transition-colors ${
                                  isAvailable
                                    ? 'cursor-pointer hover:bg-gray-50/50'
                                    : 'opacity-40 cursor-not-allowed'
                                } ${isSelected ? 'bg-gray-50 font-medium' : ''}`}
                              >
                                <td className="py-4 text-xs font-semibold text-black">
                                  <div className="flex items-center gap-2">
                                    {row.size}
                                    {isSelected && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                                    )}
                                  </div>
                                </td>
                                <td className="py-4 text-xs text-gray-500">
                                  {row.value1}
                                </td>
                                <td className="py-4 text-xs text-gray-500">
                                  {row.value2}
                                  {!isAvailable && (
                                    <span className="ml-2 text-[8px] text-gray-400 uppercase tracking-wider font-semibold">
                                      (Unavailable)
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* SVG Illustration */}
                    <div className="flex justify-center py-6 bg-gray-50 border border-gray-100 rounded-sm">
                      {guideData.svgType === 'ring' && (
                        <svg viewBox="0 0 100 100" className="w-28 h-28 stroke-black fill-none stroke-[0.75] mx-auto">
                          <circle cx="50" cy="55" r="30" />
                          <circle cx="50" cy="55" r="26" />
                          <path d="M 45 25 L 42 21 L 50 15 L 58 21 L 55 25 Z" />
                          <path d="M 42 21 L 58 21" />
                          <path d="M 50 15 L 50 25" />
                          <line x1="24" y1="55" x2="76" y2="55" stroke="#9ca3af" strokeDasharray="2 2" />
                          <path d="M 27 52 L 24 55 L 27 58 M 73 52 L 76 55 L 73 58" stroke="#9ca3af" />
                          <text x="50" y="48" className="fill-gray-400 stroke-none text-[6px] font-sans" textAnchor="middle">Diameter</text>
                        </svg>
                      )}
                      {guideData.svgType === 'necklace' && (
                        <svg viewBox="0 0 120 120" className="w-28 h-28 stroke-black fill-none stroke-[0.75] mx-auto">
                          <path d="M 25 105 C 35 90 40 85 45 70 C 47 65 47 50 47 30 L 73 30 C 73 50 73 65 75 70 C 80 85 85 90 95 105" />
                          <path d="M 46 72 C 55 77 65 77 74 72" stroke="#e5e7eb" />
                          <path d="M 47.5 45 C 50 58 70 58 72.5 45" stroke="#9ca3af" />
                          <text x="75" y="47" className="fill-gray-400 stroke-none text-[5px] font-sans">16"</text>
                          <path d="M 45.5 60 C 50 75 70 75 74.5 60" stroke="#10b981" strokeWidth="1" />
                          <text x="78" y="63" className="fill-[#10b981] stroke-none text-[5px] font-sans font-bold">18" (Standard)</text>
                          <path d="M 44.5 75 C 50 90 70 90 75.5 75" stroke="#9ca3af" />
                          <text x="78" y="80" className="fill-gray-400 stroke-none text-[5px] font-sans">20"</text>
                          <path d="M 41 90 C 50 110 70 110 79 90" stroke="#9ca3af" strokeDasharray="2 1" />
                          <text x="81" y="98" className="fill-gray-400 stroke-none text-[5px] font-sans">24"</text>
                        </svg>
                      )}
                      {guideData.svgType === 'bracelet' && (
                        <svg viewBox="0 0 100 100" className="w-28 h-28 stroke-black fill-none stroke-[0.75] mx-auto">
                          <path d="M 30 85 L 30 50 C 30 35 40 25 50 25 C 60 25 70 35 70 50 L 70 85" />
                          <path d="M 30 50 C 25 45 25 35 30 30 C 35 25 45 35 50 40 C 55 35 65 25 70 30 C 75 35 75 45 70 50" />
                          <path d="M 27 65 C 27 60 73 60 73 65 C 73 70 27 70 27 65 Z" stroke="#10b981" strokeWidth="1" fill="#f0fdf4" />
                          <line x1="32" y1="63" x2="32" y2="67" stroke="#10b981" strokeWidth="0.5" />
                          <line x1="38" y1="63" x2="38" y2="67" stroke="#10b981" strokeWidth="0.5" />
                          <line x1="44" y1="63" x2="44" y2="67" stroke="#10b981" strokeWidth="0.5" />
                          <line x1="50" y1="63" x2="50" y2="67" stroke="#10b981" strokeWidth="0.5" />
                          <line x1="56" y1="63" x2="56" y2="67" stroke="#10b981" strokeWidth="0.5" />
                          <line x1="62" y1="63" x2="62" y2="67" stroke="#10b981" strokeWidth="0.5" />
                          <line x1="68" y1="63" x2="68" y2="67" stroke="#10b981" strokeWidth="0.5" />
                          <text x="50" y="77" className="fill-[#10b981] stroke-none text-[6px] font-sans font-semibold text-center" textAnchor="middle">Measure Wrist</text>
                        </svg>
                      )}
                    </div>

                    {/* Step-by-step Sizing */}
                    <div className="space-y-5">
                      <h4 className="text-xs tracking-[0.15em] uppercase text-black font-semibold">
                        {guideData.howToMeasureTitle}
                      </h4>
                      <ol className="space-y-4 list-none p-0 m-0">
                        {guideData.howToMeasureSteps.map((step, idx) => (
                          <li key={idx} className="flex gap-4 items-start text-xs text-gray-500 leading-relaxed">
                            <span className="w-5 h-5 rounded-full border border-gray-200 flex items-center justify-center shrink-0 text-[10px] font-semibold text-black">
                              {idx + 1}
                            </span>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Pro tip */}
                    <div className="bg-gray-50 p-4 border border-gray-150 text-[11px] text-gray-500 leading-relaxed rounded-sm">
                      <strong className="text-black font-semibold uppercase tracking-wider text-[9px] block mb-1">PRO MEASUREMENT TIP</strong>
                      For the most accurate measurement, measure your finger or wrist at the end of the day when it is warmest. Ensure your measuring tool fits comfortably without squeezing.
                    </div>
                  </div>
                )}
              </div>

              {/* Service Advisor Integration / Footer */}
              <div className="p-6 bg-gray-50 border-t border-gray-150 flex flex-col gap-4 shrink-0">
                <div className="text-center">
                  <h5 className="text-xs tracking-[0.15em] uppercase text-black font-semibold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    Unicorn Jewels Specialists
                  </h5>
                  <p className="text-[10px] text-gray-400 tracking-wider">
                    Our advisors are here to help you find the perfect fit.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsSizeGuideOpen(false);
                      onBookAppointment?.();
                    }}
                    className="flex-1 py-3 bg-black text-white text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Book Appointment
                  </button>
                  <a
                    href="mailto:concierge@unicornjewels.com?subject=Sizing%20Inquiry"
                    className="flex-1 py-3 bg-white border border-gray-200 text-black text-[10px] tracking-[0.2em] uppercase font-semibold hover:border-black transition-colors text-center"
                  >
                    Email Advisor
                  </a>
                </div>

                <div className="text-center text-[9px] text-gray-400 tracking-wide uppercase">
                  MON-SAT: 9AM - 6PM EST • +1 (800) UNICORN
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>;
}
