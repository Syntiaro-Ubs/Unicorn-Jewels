import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, ChevronDown, SlidersHorizontal, X, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getProductHoverImage } from './productHoverImage';
import { withScopedProductIds } from './productIdentity';
import { ShopByLookBlock } from './ShopByLookBlock';
import { buildShopByLookGridItems } from './shopByLookGrid';
export const collectionsData = {
  'Promise Bloom': {
    subtitle: 'Where love takes root and blossoms into eternity.',
    editorial: 'Floral Elegance',
    hero: 'https://images.unsplash.com/photo-1743560834737-e350c159d992?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9taXNlJTIwYmxvb20lMjBqZXdlbHJ5fGVufDF8fHx8MTc3NDM0OTYxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    products: [{
      id: 401,
      name: 'Bloom Solitaire Ring',
      price: '$4,200',
      priceNum: 4200,
      metal: 'Platinum',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMHJpbmd8ZW58MXx8fHwxNzc0MzUyMTQxfDA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 402,
      name: 'Petal Diamond Earrings',
      price: '$2,800',
      priceNum: 2800,
      metal: '18k White Gold',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWludHklMjBlYXJyaW5nc3xlbnwxfHx8fDE3NzQzNTIxNjV8MA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 403,
      name: 'Rose Diamond Pendant',
      price: '$3,100',
      priceNum: 3100,
      metal: '18k Rose Gold',
      image: 'https://images.unsplash.com/photo-1599643478514-4a7190d6ec34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5kYW50fGVufDF8fHx8MTc3NDM1MjE4M3ww&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 404,
      name: 'Vine Diamond Bracelet',
      price: '$6,500',
      priceNum: 6500,
      metal: 'Platinum',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwYnJhY2VsZXR8ZW58MXx8fHwxNzc0MzUyMjExfDA&ixlib=rb-4.1.0&q=80&w=400'
    }]
  },
  'The Vanguard': {
    subtitle: 'Bold geometries for the modern visionary.',
    editorial: 'Architectural Form',
    hero: 'https://images.unsplash.com/photo-1762505464397-6abf1a645981?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZ3MlMjBlbGVnYW50JTIwamV3ZWxyeXxlbnwxfHx8fDE3NzQzNDk2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    products: [{
      id: 405,
      name: 'Vanguard Angle Ring',
      price: '$5,500',
      priceNum: 5500,
      metal: '18k Yellow Gold',
      image: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwcmluZ3xlbnwxfHx8fDE3NzQzNTIyMzZ8MA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 406,
      name: 'Geometric Hoop Earrings',
      price: '$3,400',
      priceNum: 3400,
      metal: '18k Yellow Gold',
      image: 'https://images.unsplash.com/photo-1590548784585-643d2b9f2925?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29wJTIwZWFycmluZ3N8ZW58MXx8fHwxNzc0MzUyMjYyfDA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 407,
      name: 'Structured Link Necklace',
      price: '$12,000',
      priceNum: 12000,
      metal: '18k Yellow Gold',
      image: 'https://images.unsplash.com/photo-1599643477874-ce44fb6b4f74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0MzUyMjkwfDA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 408,
      name: 'Vanguard Cuff',
      price: '$8,900',
      priceNum: 8900,
      metal: '18k Yellow Gold',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwY3VmZnxlbnwxfHx8fDE3NzQzNTIzMjJ8MA&ixlib=rb-4.1.0&q=80&w=400'
    }]
  },
  'Lumina Letter': {
    subtitle: 'Personalization refined to its most radiant state.',
    editorial: 'Signature Spark',
    hero: 'https://images.unsplash.com/photo-1772571092191-eb7010126fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBuZWNrbGFjZSUyMHBlbmRhbnQlMjBsdXh1cnl8ZW58MXx8fHwxNzc0MzQ5NjIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    products: [{
      id: 409,
      name: 'Initial Diamond Pendant',
      price: '$1,800',
      priceNum: 1800,
      metal: '18k Rose Gold',
      image: 'https://images.unsplash.com/photo-1599643478514-4a7190d6ec34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5kYW50fGVufDF8fHx8MTc3NDM1MjE4M3ww&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 410,
      name: 'Lumina Charm Bracelet',
      price: '$2,200',
      priceNum: 2200,
      metal: '18k White Gold',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwYnJhY2VsZXR8ZW58MXx8fHwxNzc0MzUyMjExfDA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 411,
      name: 'Engravable Signet Ring',
      price: '$2,900',
      priceNum: 2900,
      metal: '18k Yellow Gold',
      image: 'https://images.unsplash.com/photo-1622398925373-3f91b1e275f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwcmluZ3xlbnwxfHx8fDE3NzQzNTIyMzZ8MA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 412,
      name: 'Letter Drop Earrings',
      price: '$1,500',
      priceNum: 1500,
      metal: '18k Rose Gold',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWludHklMjBlYXJyaW5nc3xlbnwxfHx8fDE3NzQzNTIxNjV8MA&ixlib=rb-4.1.0&q=80&w=400'
    }]
  },
  'Aura Everyday': {
    subtitle: 'Effortless radiance designed for the diurnal rhythm.',
    editorial: 'Daily Brilliance',
    hero: 'https://images.unsplash.com/photo-1721206624552-d945fc1a3b8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYnJhY2VsZXQlMjBtb2Rlcm4lMjBkZXNpZ258ZW58MXx8fHwxNzc0MzQ5NjI2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    products: [{
      id: 413,
      name: 'Aura Minimalist Chain',
      price: '$950',
      priceNum: 950,
      metal: '18k Yellow Gold',
      image: 'https://images.unsplash.com/photo-1599643477874-ce44fb6b4f74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwbmVja2xhY2V8ZW58MXx8fHwxNzc0MzUyMjkwfDA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 414,
      name: 'Essential Studs',
      price: '$800',
      priceNum: 800,
      metal: 'Platinum',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWludHklMjBlYXJyaW5nc3xlbnwxfHx8fDE3NzQzNTIxNjV8MA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 415,
      name: 'Aura Stacking Ring',
      price: '$1,200',
      priceNum: 1200,
      metal: '18k White Gold',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMHJpbmd8ZW58MXx8fHwxNzc0MzUyMTQxfDA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 416,
      name: 'Delicate Bangle',
      price: '$1,800',
      priceNum: 1800,
      metal: '18k Rose Gold',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwYnJhY2VsZXR8ZW58MXx8fHwxNzc0MzUyMjExfDA&ixlib=rb-4.1.0&q=80&w=400'
    }]
  }
};
Object.keys(collectionsData).forEach(name => {
  collectionsData[name] = {
    ...collectionsData[name],
    products: withScopedProductIds(collectionsData[name].products, `collection-${name}`)
  };
});
export function CollectionPage({
  collectionName,
  onBack,
  onCollectionChange,
  wishlist,
  toggleWishlist,
  addToCart,
  addedIds,
  onProductClick
}) {
  const data = collectionsData[collectionName];
  const [sort, setSort] = useState('Featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [metalFilter, setMetalFilter] = useState('All Materials');
  const [priceFilter, setPriceFilter] = useState('All Prices');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('Collection');
  useEffect(() => {
    setSort('Featured');
    setMetalFilter('All Materials');
    setPriceFilter('All Prices');
    setCategoryFilter('All Categories');
    setSortOpen(false);
    setFilterDrawerOpen(false);
  }, [collectionName]);
  const availableMetals = useMemo(() => {
    if (!data) return ['All Materials'];
    const metals = new Set(data.products.map(p => p.metal));
    return ['All Materials', ...Array.from(metals).sort()];
  }, [data]);
  const filteredAndSortedProducts = useMemo(() => {
    if (!data) return [];
    let list = [...data.products];
    if (categoryFilter !== 'All Categories') {
      list = list.filter(p => {
        const nameLower = p.name.toLowerCase();
        if (categoryFilter === 'Rings') return nameLower.includes('ring');
        if (categoryFilter === 'Necklaces') return nameLower.includes('necklace') || nameLower.includes('pendant') || nameLower.includes('chain');
        if (categoryFilter === 'Earrings') return nameLower.includes('earring') || nameLower.includes('studs');
        if (categoryFilter === 'Bracelets') return nameLower.includes('bracelet') || nameLower.includes('cuff') || nameLower.includes('bangle');
        return true;
      });
    }
    if (metalFilter !== 'All Materials') {
      list = list.filter(p => p.metal.includes(metalFilter));
    }
    if (priceFilter !== 'All Prices') {
      if (priceFilter === 'Under $2,000') list = list.filter(p => p.priceNum < 2000);else if (priceFilter === '$2,000 - $5,000') list = list.filter(p => p.priceNum >= 2000 && p.priceNum <= 5000);else if (priceFilter === 'Over $5,000') list = list.filter(p => p.priceNum > 5000);
    }
    if (sort === 'Price: Low to High') {
      list.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sort === 'Price: High to Low') {
      list.sort((a, b) => b.priceNum - a.priceNum);
    }
    return list;
  }, [data, sort, metalFilter, priceFilter, categoryFilter]);
  const finalItems = useMemo(() => buildShopByLookGridItems(filteredAndSortedProducts), [filteredAndSortedProducts]);

  // If collection name doesn't match our data, just return a fallback.
  if (!data) {
    return <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fafafa]">
        <h2 className="text-3xl mb-4" style={{
        fontWeight: 300
      }}>Collection not found</h2>
        <button onClick={onBack} className="text-sm uppercase tracking-widest border-b border-black pb-1">Return Home</button>
      </div>;
  }
  return <div className="bg-white min-h-screen" style={{
    fontFamily: "'Cormorant Garamond', serif"
  }}>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-[#0a0a0a]">
        <ImageWithFallback src={data.hero} alt={collectionName} className="w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-6 text-center z-10 pt-16">
          <motion.span initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-[10px] tracking-[0.4em] uppercase text-gray-300 mb-6 block">
            {data.editorial}
          </motion.span>
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="text-5xl lg:text-7xl mb-6" style={{
          fontWeight: 300,
          letterSpacing: '0.05em'
        }}>
            {collectionName}
          </motion.h1>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-lg lg:text-xl text-gray-200 max-w-2xl mx-auto" style={{
          fontWeight: 300,
          lineHeight: 1.8
        }}>
            {data.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Toolbar */}
      <section className="relative z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 px-6">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => {
            setFilterDrawerOpen(true);
            setSortOpen(false);
          }} className="flex items-center gap-2 text-xs text-gray-800 uppercase tracking-widest hover:text-gray-500 transition-colors" style={{
            fontWeight: 400
          }}>
              <SlidersHorizontal size={14} />
              <span>Filter</span>
            </button>
            <span className="text-xs text-gray-500 tracking-widest uppercase hidden md:inline-block" style={{
            fontWeight: 400
          }}>{filteredAndSortedProducts.length} Results</span>
          </div>

          {/* Sort Dropdown */}
          <div className="relative shrink-0 flex justify-end">
            <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-2 text-xs text-gray-800 uppercase tracking-widest hover:text-gray-500 transition-colors" style={{
            fontWeight: 400
          }}>
              <span>Sort by: {sort}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && <div className="absolute top-full right-0 mt-4 w-48 bg-white border border-gray-100 shadow-xl py-2 z-50">
                {['Featured', 'Price: Low to High', 'Price: High to Low'].map(option => <button key={option} onClick={() => {
              setSort(option);
              setSortOpen(false);
            }} className={`block w-full text-left px-6 py-2 text-sm tracking-wide hover:bg-gray-50 ${sort === option ? 'font-medium' : 'font-light text-gray-600'}`}>
                    {option}
                  </button>)}
              </div>}
          </div>
        </div>
      </section>

      {/* ── FILTER DRAWER (Tiffany Style) ─────────────────── */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${filterDrawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={() => setFilterDrawerOpen(false)} />
        
        {/* Drawer panel */}
        <motion.div initial={{
        x: '-100%'
      }} animate={{
        x: filterDrawerOpen ? '0%' : '-100%'
      }} transition={{
        type: 'spring',
        damping: 30,
        stiffness: 300
      }} className="absolute top-0 left-0 bottom-0 w-[400px] max-w-[90vw] bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
            <h2 className="text-sm tracking-[0.2em] uppercase font-light">Filters</h2>
            <button onClick={() => setFilterDrawerOpen(false)} className="text-gray-400 hover:text-black transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Collection Accordion */}
            <div className="border-b border-gray-100 pb-4">
              <button className="w-full flex items-center justify-between py-2 text-sm tracking-widest uppercase font-light hover:text-gray-500" onClick={() => setOpenAccordion(openAccordion === 'Collection' ? null : 'Collection')}>
                <span>Collection</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${openAccordion === 'Collection' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'Collection' ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-3 pb-2">
                  {Object.keys(collectionsData).map(option => <button key={option} onClick={() => {
                  if (onCollectionChange && option !== collectionName) {
                    onCollectionChange(option);
                  }
                }} className="flex items-center w-full group">
                      <div className={`w-4 h-4 border flex items-center justify-center mr-4 transition-colors ${collectionName === option ? 'border-black bg-black text-white' : 'border-gray-300 bg-transparent group-hover:border-black'}`}>
                        {collectionName === option && <Check size={12} />}
                      </div>
                      <span className={`text-sm tracking-wide ${collectionName === option ? 'font-medium' : 'font-light text-gray-600 group-hover:text-black'}`}>{option}</span>
                    </button>)}
                </div>
              </div>
            </div>

            {/* Category Accordion */}
            <div className="border-b border-gray-100 pb-4">
              <button className="w-full flex items-center justify-between py-2 text-sm tracking-widest uppercase font-light hover:text-gray-500" onClick={() => setOpenAccordion(openAccordion === 'Category' ? null : 'Category')}>
                <span>Category</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${openAccordion === 'Category' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'Category' ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-3 pb-2">
                  {['All Categories', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'].map(option => <button key={option} onClick={() => setCategoryFilter(option)} className="flex items-center w-full group">
                      <div className={`w-4 h-4 border flex items-center justify-center mr-4 transition-colors ${categoryFilter === option ? 'border-black bg-black text-white' : 'border-gray-300 bg-transparent group-hover:border-black'}`}>
                        {categoryFilter === option && <Check size={12} />}
                      </div>
                      <span className={`text-sm tracking-wide ${categoryFilter === option ? 'font-medium' : 'font-light text-gray-600 group-hover:text-black'}`}>{option}</span>
                    </button>)}
                </div>
              </div>
            </div>

            {/* Material Accordion */}
            <div className="border-b border-gray-100 pb-4">
              <button className="w-full flex items-center justify-between py-2 text-sm tracking-widest uppercase font-light hover:text-gray-500" onClick={() => setOpenAccordion(openAccordion === 'Material' ? null : 'Material')}>
                <span>Material</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${openAccordion === 'Material' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'Material' ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-3 pb-2">
                  {availableMetals.map(option => <button key={option} onClick={() => setMetalFilter(option)} className="flex items-center w-full group">
                      <div className={`w-4 h-4 border flex items-center justify-center mr-4 transition-colors ${metalFilter === option ? 'border-black bg-black text-white' : 'border-gray-300 bg-transparent group-hover:border-black'}`}>
                        {metalFilter === option && <Check size={12} />}
                      </div>
                      <span className={`text-sm tracking-wide ${metalFilter === option ? 'font-medium' : 'font-light text-gray-600 group-hover:text-black'}`}>{option}</span>
                    </button>)}
                </div>
              </div>
            </div>

            {/* Price Accordion */}
            <div className="border-b border-gray-100 pb-4">
              <button className="w-full flex items-center justify-between py-2 text-sm tracking-widest uppercase font-light hover:text-gray-500" onClick={() => setOpenAccordion(openAccordion === 'Price' ? null : 'Price')}>
                <span>Price</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${openAccordion === 'Price' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'Price' ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-3 pb-2">
                  {['All Prices', 'Under $2,000', '$2,000 - $5,000', 'Over $5,000'].map(option => <button key={option} onClick={() => setPriceFilter(option)} className="flex items-center w-full group">
                      <div className={`w-4 h-4 border flex items-center justify-center mr-4 transition-colors ${priceFilter === option ? 'border-black bg-black text-white' : 'border-gray-300 bg-transparent group-hover:border-black'}`}>
                        {priceFilter === option && <Check size={12} />}
                      </div>
                      <span className={`text-sm tracking-wide ${priceFilter === option ? 'font-medium' : 'font-light text-gray-600 group-hover:text-black'}`}>{option}</span>
                    </button>)}
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(metalFilter !== 'All Materials' || priceFilter !== 'All Prices' || categoryFilter !== 'All Categories') && <div className="pt-4">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Applied Filters</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryFilter !== 'All Categories' && <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs tracking-wide">
                      {categoryFilter}
                      <button onClick={() => setCategoryFilter('All Categories')} className="hover:text-black text-gray-500 ml-1"><X size={10} /></button>
                    </span>}
                  {metalFilter !== 'All Materials' && <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs tracking-wide">
                      {metalFilter}
                      <button onClick={() => setMetalFilter('All Materials')} className="hover:text-black text-gray-500 ml-1"><X size={10} /></button>
                    </span>}
                  {priceFilter !== 'All Prices' && <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-xs tracking-wide">
                      {priceFilter}
                      <button onClick={() => setPriceFilter('All Prices')} className="hover:text-black text-gray-500 ml-1"><X size={10} /></button>
                    </span>}
                </div>
                <button onClick={() => {
              setMetalFilter('All Materials');
              setPriceFilter('All Prices');
              setCategoryFilter('All Categories');
            }} className="text-xs uppercase tracking-widest text-gray-500 hover:text-black mt-4 block underline underline-offset-4">
                  Clear All
                </button>
              </div>}

          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-gray-200 shrink-0">
            <button onClick={() => setFilterDrawerOpen(false)} className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors">
              View {filteredAndSortedProducts.length} Results
            </button>
          </div>
        </motion.div>
      </div>

      {/* Grid */}
      <section className="py-24 px-6 bg-[#fafafa]">
        <div className="max-w-[1400px] mx-auto">
          {filteredAndSortedProducts.length === 0 ? <div className="text-center py-20">
              <h3 className="text-2xl text-gray-400 mb-4" style={{
            fontWeight: 300
          }}>No products found matching your criteria.</h3>
              <button onClick={() => {
            setCategoryFilter('All Categories');
            setMetalFilter('All Materials');
            setPriceFilter('All Prices');
          }} className="text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                Clear Filters
              </button>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
              {finalItems.map(item => {
            if (item.type === 'shopByLook') {
              return <ShopByLookBlock key={item.id} variant={item.variant} contentAlign={item.contentAlign} />;
            }
            const product = item.data;
            return <motion.div key={product.id} initial={{
                opacity: 0,
                y: 40
              }} whileInView={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.8,
                delay: item.productIndex % 3 * 0.1
              }} viewport={{
                once: true
              }} className="group cursor-pointer flex flex-col" onClick={() => onProductClick(product)}>
                    <div className="relative mb-6 overflow-hidden bg-white aspect-[4/5] shadow-sm">
                      <ImageWithFallback src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover p-8 transition-all duration-1000 ease-out group-hover:scale-110 group-hover:opacity-0" />
                      <ImageWithFallback src={getProductHoverImage(product)} alt={`${product.name} styled on model`} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-1000 ease-out group-hover:scale-105 group-hover:opacity-100" />
                      <button onClick={e => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }} className="absolute top-4 right-4 z-10 p-2">
                        <Heart size={20} className={wishlist.has(product.id) ? 'fill-black' : 'fill-none'} stroke="black" strokeWidth={1} />
                      </button>
                      <button onClick={e => {
                    e.stopPropagation();
                    addToCart(product);
                  }} className="absolute bottom-0 left-0 right-0 z-10 py-4 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 translate-y-full group-hover:translate-y-0" style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400,
                    background: addedIds.has(product.id) ? '#1a1a1a' : '#000',
                    color: '#fff'
                  }}>
                        {addedIds.has(product.id) ? '✓ Added to Bag' : 'Add to Bag'}
                      </button>
                    </div>
                    <h3 className="text-sm uppercase tracking-widest mb-1 text-black" style={{
                  fontWeight: 400
                }}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-black" style={{
                  fontWeight: 400
                }}>{product.price}</p>
                  </motion.div>;
          })}
            </div>}
        </div>
      </section>
    </div>;
}
