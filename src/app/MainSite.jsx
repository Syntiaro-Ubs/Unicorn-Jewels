import { useState, useEffect, useMemo } from 'react';
const heroImage = "https://images.unsplash.com/photo-1729641246245-64405c363263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHdlYXJpbmclMjBsdXh1cnklMjBkaWFtb25kJTIwamV3ZWxyeSUyMGF2YW50LWdhcmRlfGVufDF8fHx8MTc3Njc2NTMxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catRings = "https://images.unsplash.com/photo-1662434921251-a6eba45ac40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catNecklaces = "https://images.unsplash.com/photo-1590845947379-6c663322efea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwbmVja2xhY2UlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catBracelets = "https://images.unsplash.com/photo-1612437830721-4f8eab90c5a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwYnJhY2VsZXQlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catEarrings = "https://images.unsplash.com/photo-1726507367666-08c5f025bdf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwZWFycmluZ3MlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catEngagement = "https://images.unsplash.com/photo-1587947330318-88fcd9055420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwZW5nYWdlbWVudCUyMHJpbmclMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catSets = "https://images.unsplash.com/photo-1702476320482-0736c4b962f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoaWdoJTIwamV3ZWxyeSUyMHNldCUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const silverCollectionFrontImg = "https://images.unsplash.com/photo-1758391929001-55983449a84c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBqZXdlbHJ5JTIwY29sbGVjdGlvbiUyMG1vZGVsJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc3Njc2NTMyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const silverCollectionImg = "https://images.unsplash.com/photo-1524324625284-39263f7046aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG9zZSUyMHVwJTIwc2lsdmVyJTIwamV3ZWxyeSUyMGF2YW50JTIwZ2FyZGV8ZW58MXx8fHwxNzc2NzY1MzIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const platinumPerfectionImg = "https://images.unsplash.com/photo-1679156271420-e6c596e9c10a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF0aW51bSUyMGRpYW1vbmQlMjByaW5nJTIwbHV4dXJ5fGVufDF8fHx8MTc3Njc2NTMzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const justUnveiledBlue = "https://images.unsplash.com/photo-1610661022658-5068c4d8f286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBwZW5kYW50JTIwbmVja2xhY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzc2NzY1MzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const sapphirePendantImg = "https://images.unsplash.com/photo-1610661022658-5068c4d8f286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBwZW5kYW50JTIwbmVja2xhY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzc2NzY1MzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const sapphireEarringsImg = "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBlYXJyaW5ncyUyMGx1eHVyeSUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const ourStoryModel = "https://images.unsplash.com/photo-1771012266370-6bbe78f801c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBsb29raW5nJTIwYmFjayUyMGVsZWdhbnQlMjBqZXdlbHJ5fGVufDF8fHx8MTc3Njc2NTMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const eternallyDesired1 = "https://images.unsplash.com/photo-1724937721228-f7bf3df2a4d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGVybmFsbHklMjBkZXNpcmVkJTIwY2xhc3NpYyUyMGRpYW1vbmQlMjBqZXdlbHJ5fGVufDF8fHx8MTc3Njc2NTMyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const eternallyDesired2 = "https://images.unsplash.com/photo-1635987739727-11e2578bd0cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwamV3ZWxyeSUyMHNjdWxwdHVyYWwlMjBnb2xkfGVufDF8fHx8MTc3Njc2NTMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const eternallyDesired3 = "https://images.unsplash.com/photo-1637536701306-3214e9cec64a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGFuZCUyMHdoaXRlJTIwamV3ZWxyeSUyMGVkaXRvcmlhbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Njc2NTMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const eternallyDesired4 = "https://images.unsplash.com/photo-1633701394188-c11a1e6a4e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZW5kJTIwbHV4dXJ5JTIwamV3ZWxyeSUyMG1vZGVsJTIwc2hvb3R8ZW58MXx8fHwxNzc2NzY1MzI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const personalStylingImg = "https://images.unsplash.com/photo-1634546269105-4dbc3e8f0052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHN0eWxpbmclMjBqZXdlbHJ5JTIwZXhwZXJ0JTIwY29uc3VsdGF0aW9ufGVufDF8fHx8MTc3Njc2NTMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const diamondEdit1 = "https://images.unsplash.com/photo-1662434921251-a6eba45ac40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const diamondEdit2 = "https://images.unsplash.com/photo-1590845947379-6c663322efea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwbmVja2xhY2UlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const diamondEdit3 = "https://images.unsplash.com/photo-1612437830721-4f8eab90c5a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwYnJhY2VsZXQlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const hauteJoaillerieImg = "https://images.unsplash.com/photo-1614999612412-3b1dbcd68e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwamV3ZWxyeSUyMGRpYW1vbmQlMjBuZWNrbGFjZSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzc2NzY1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const logoImage = "/images/unicorn-logo.svg";
import { motion } from 'motion/react';
import { Menu, X, ShoppingBag, Search, User, Heart, ChevronRight, Instagram, Mail, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { AppointmentPage } from './components/AppointmentPage';
import { CheckoutPage } from './components/CheckoutPage';
import { CartDrawer } from './components/CartDrawer';
import { CategoryPage, catalogue } from './components/CategoryPage';
import { CollectionPage, collectionsData } from './components/CollectionPage';
import { ProfilePage } from './components/ProfilePage';
import { OurStoryPage } from './components/OurStoryPage';
import { ProductPage } from './components/ProductPage';
import { buildProductIndex, withScopedProductIds } from './components/productIdentity';
import GiftGuidePage from './components/GiftGuidePage';

const featuredCollectionCards = withScopedProductIds([{
  id: 1,
  name: 'Promise Bloom',
  price: '$12,500',
  priceNum: 12500,
  metal: 'Platinum Â· Round Brilliant',
  image: eternallyDesired1
}, {
  id: 2,
  name: 'The Vanguard',
  price: '$8,900',
  priceNum: 8900,
  metal: '18k Rose Gold',
  image: eternallyDesired2
}, {
  id: 3,
  name: 'Lumina Letter',
  price: '$2,750',
  priceNum: 2750,
  metal: '18k Yellow Gold',
  image: eternallyDesired3
}, {
  id: 4,
  name: 'Aura Everyday',
  price: '$4,200',
  priceNum: 4200,
  metal: 'Platinum',
  image: eternallyDesired4
}], 'home-featured-collections');
const homeNewArrivals = withScopedProductIds([{
  id: 10,
  name: 'Sapphire Cushion Ring',
  price: '$4,800',
  priceNum: 4800,
  metal: 'Platinum Â· Cushion Cut',
  tag: 'NEW',
  image: justUnveiledBlue
}, {
  id: 11,
  name: 'Sapphire Cushion Pendant',
  price: '$5,200',
  priceNum: 5200,
  metal: '18k White Gold',
  tag: 'NEW',
  image: sapphirePendantImg
}, {
  id: 12,
  name: 'Sapphire Cushion Earrings',
  price: '$5,950',
  priceNum: 5950,
  metal: 'Platinum Â· Pair',
  tag: 'EXCLUSIVE',
  image: sapphireEarringsImg
}], 'home-new-arrivals');
export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [appointmentMode, setAppointmentMode] = useState('standard');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productBackPage, setProductBackPage] = useState('home');
  const [productHistory, setProductHistory] = useState([]);
  const [savedScrollPos, setSavedScrollPos] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSilverModalOpen, setIsSilverModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addedIds, setAddedIds] = useState(new Set());
  const [profileInitialTab, setProfileInitialTab] = useState('overview');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeCollection, setActiveCollection] = useState(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [dynamicBanner, setDynamicBanner] = useState({
    title: 'Unicorn Jewels',
    subtitle: 'Sustainable spark. Soulful shine.',
    description: 'Discover our newest collection of handcrafted jewelry, where every piece tells a story of exceptional artistry and enduring beauty.',
    imageUrl: heroImage
  });

  useEffect(() => {
    const getPageKey = () => {
      if (currentPage === 'home') return 'home';
      if (currentPage === 'category' && activeCategory) return activeCategory.toLowerCase();
      if (currentPage === 'collection' && activeCollection) return activeCollection.toLowerCase();
      if (currentPage === 'story') return 'story';
      if (currentPage === 'gift-guide') return 'gift-guide';
      return 'home';
    };

    const pageKey = getPageKey();
    
    // Set immediate defaults while fetching to avoid showing previous page's banner
    if (pageKey === 'home') {
      setDynamicBanner({
        title: 'Unicorn Jewels',
        subtitle: 'Sustainable spark. Soulful shine.',
        description: 'Discover our newest collection of handcrafted jewelry, where every piece tells a story of exceptional artistry and enduring beauty.',
        imageUrl: heroImage
      });
    } else {
      setDynamicBanner({ title: '', subtitle: '', description: '', imageUrl: '' });
    }

    // Fetch dynamic banner content for the specific page
    fetch(`http://localhost:5000/api/content/banner/${pageKey}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.page_key) {
          setDynamicBanner({
            title: data.title || '',
            subtitle: data.subtitle || '',
            description: data.description || '',
            imageUrl: data.image_url ? (data.image_url.startsWith('http') ? data.image_url : `http://localhost:5000${data.image_url}`) : (pageKey === 'home' ? heroImage : '')
          });
        }
      })
      .catch(err => {
        console.error('Error fetching banner:', err);
      });
  }, [currentPage, activeCategory, activeCollection]);

  const productIndex = useMemo(() => buildProductIndex([...Object.entries(catalogue).filter(([name]) => name !== 'Jewelry').flatMap(([, section]) => section.products), ...Object.values(collectionsData).flatMap(section => section.products), ...featuredCollectionCards, ...homeNewArrivals]), []);
  const wishlistItems = useMemo(() => Array.from(wishlist).map(id => productIndex.get(id)).filter(Boolean), [wishlist, productIndex]);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const openProfileTab = (tab = 'overview') => {
    if (!isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    setProfileInitialTab(tab);
    setAccountDropdownOpen(false);
    setCurrentPage('profile');
    window.scrollTo(0, 0);
  };
  const toggleWishlist = id => {
    if (!isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    setWishlist(prev => {
      const nextWishlist = new Set(prev);
      if (nextWishlist.has(id)) {
        nextWishlist.delete(id);
      } else {
        nextWishlist.add(id);
      }
      return nextWishlist;
    });
  };
  const addToCart = item => {
    if (!isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? {
          ...i,
          quantity: i.quantity + 1
        } : i);
      }
      return [...prev, {
        ...item,
        quantity: 1
      }];
    });
    setAddedIds(prev => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedIds(prev => {
        const s = new Set(prev);
        s.delete(item.id);
        return s;
      });
    }, 1600);
    setCartOpen(true);
  };
  const updateQty = (id, qty) => {
    setCartItems(prev => prev.map(i => i.id === id ? {
      ...i,
      quantity: qty
    } : i));
  };
  const removeFromCart = id => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };
  const openProductPage = (product, backPage = currentPage, scrollPos = window.scrollY) => {
    if (currentPage === 'product' && selectedProduct?.id === product.id) {
      setCartOpen(false);
      return;
    }
    if (currentPage === 'product' && selectedProduct) {
      setProductHistory(prev => [...prev, {
        product: selectedProduct,
        backPage: productBackPage,
        scrollPos: savedScrollPos
      }]);
    } else {
      setProductHistory([]);
    }
    setSavedScrollPos(scrollPos);
    setSelectedProduct(product);
    setProductBackPage(backPage);
    setCartOpen(false);
    setCurrentPage('product');
    window.scrollTo(0, 0);
  };
  const openCartProductPage = product => {
    const backPage = currentPage === 'product' ? productBackPage : currentPage;
    const scrollPos = currentPage === 'product' ? savedScrollPos : window.scrollY;
    openProductPage(product, backPage, scrollPos);
  };
  const goBackFromProduct = () => {
    if (productHistory.length > 0) {
      const previousView = productHistory[productHistory.length - 1];
      setProductHistory(productHistory.slice(0, -1));
      setSelectedProduct(previousView.product);
      setProductBackPage(previousView.backPage);
      setSavedScrollPos(previousView.scrollPos);
      setCartOpen(false);
      window.scrollTo(0, 0);
      return;
    }
    setCartOpen(false);
    setProductHistory([]);
    setCurrentPage(productBackPage);
    setTimeout(() => window.scrollTo(0, savedScrollPos), 0);
  };
  const openAppointment = (mode = 'standard') => {
    setAppointmentMode(mode);
    setCurrentPage('appointment');
    window.scrollTo(0, 0);
  };

  // Render auth pages
  if (currentPage === 'login') {
    return <LoginPage onBack={() => setCurrentPage('home')} onGoToSignup={() => setCurrentPage('signup')} onSuccess={initial => {
      setIsLoggedIn(true);
      setUserInitial(initial);
      setCurrentPage('home');
    }} />;
  }
  if (currentPage === 'signup') {
    return <SignUpPage onBack={() => setCurrentPage('home')} onGoToLogin={() => setCurrentPage('login')} onSuccess={initial => {
      setIsLoggedIn(true);
      setUserInitial(initial);
      setCurrentPage('home');
    }} />;
  }

  if (currentPage === 'product' && selectedProduct) {
    return <>
        {/* Sticky navbar on product page */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100" style={{
        fontFamily: "'Cormorant Garamond', serif"
      }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={goBackFromProduct} className="text-xs tracking-[0.25em] uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2">
              <span>← Back</span>
            </button>
            <div className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" onClick={() => setCurrentPage('home')}>
              <ImageWithFallback src={logoImage} alt="Unicorn Jewels Logo" className="h-12 md:h-14 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-5">
              <div className="relative">
                {accountDropdownOpen && isLoggedIn && <div className="fixed inset-0 z-[90]" onClick={() => setAccountDropdownOpen(false)} />}
                <button onClick={() => {
                if (isLoggedIn) {
                  setAccountDropdownOpen(!accountDropdownOpen);
                } else {
                  setCurrentPage('login');
                }
              }} className="hover:text-gray-500 transition-colors flex items-center gap-2" aria-label="Account">
                  {isLoggedIn ? <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-sans">
                      {userInitial}
                    </div> : <User size={18} />}
                </button>
                
                {/* Account Dropdown */}
                {accountDropdownOpen && isLoggedIn && <motion.div initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="absolute right-0 mt-4 w-48 bg-white border border-gray-200 shadow-xl z-[100] py-2 font-sans">
                      <button onClick={() => {
                  setAccountDropdownOpen(false);
                  setCurrentPage('profile');
                }} className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-black hover:bg-gray-50 transition-colors">
                        My Account
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={() => {
                  setAccountDropdownOpen(false);
                  setIsLoggedIn(false);
                }} className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors">
                        Sign Out
                      </button>
                    </motion.div>}
                {/* Account Dropdown end */}
              </div>

              <button className="hover:text-gray-500 transition-colors" aria-label="Search">
                <Search size={18} />
              </button>
              <button onClick={() => openProfileTab('wishlist')} className="hover:text-gray-500 transition-colors" aria-label="Wishlist">
                <Heart size={18} className={wishlist.size > 0 ? "fill-black" : "fill-none"} stroke={wishlist.size > 0 ? "black" : "currentColor"} />
              </button>
              <button onClick={() => setCartOpen(true)} className="hover:text-gray-500 transition-colors relative" aria-label="Shopping bag">
                <ShoppingBag size={18} />
                {cartItems.length > 0 && <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>}
              </button>
            </div>
          </div>
        </div>

        <ProductPage product={selectedProduct} onBack={goBackFromProduct} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} addedIds={addedIds} />

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} addedIds={addedIds} updateQty={updateQty} removeFromCart={removeFromCart} wishlist={wishlist} toggleWishlist={toggleWishlist} onCheckout={() => setCurrentPage('checkout')} onProductClick={openCartProductPage} />
      </>;
  }
  if (currentPage === 'story') {
    return <OurStoryPage onBack={() => {
      window.scrollTo(0, 0);
      setCurrentPage('home');
    }} />;
  }
  if (currentPage === 'gift-guide') {
    return <GiftGuidePage onBack={() => {
      window.scrollTo(0, 0);
      setCurrentPage('home');
    }} />;
  }
  if (currentPage === 'profile') {
    return <>
        <ProfilePage onBack={() => setCurrentPage('home')} onLogout={() => {
        setIsLoggedIn(false);
        setAccountDropdownOpen(false);
        setCurrentPage('home');
      }} userInitial={userInitial || 'E'} initialTab={profileInitialTab} wishlist={wishlist} wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} addToCart={addToCart} onProductClick={p => openProductPage(p, 'profile')} />

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} addedIds={addedIds} updateQty={updateQty} removeFromCart={removeFromCart} wishlist={wishlist} toggleWishlist={toggleWishlist} onCheckout={() => setCurrentPage('checkout')} onProductClick={openCartProductPage} />
      </>;
  }
  if (currentPage === 'appointment') {
    return <AppointmentPage mode={appointmentMode} onBack={() => {
      setAppointmentMode('standard');
      setCurrentPage('home');
    }} />;
  }
  if (currentPage === 'checkout') {
    return <CheckoutPage items={cartItems} onBack={() => setCurrentPage('home')} onCompletePurchase={() => {
      setCartItems([]);
      setAddedIds(new Set());
    }} onViewTracking={() => openProfileTab('orders')} onContinueShopping={() => setCurrentPage('home')} />;
  }
  if (currentPage === 'collection' && activeCollection) {
    return <>
        {/* Sticky navbar on collection page */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100" style={{
        fontFamily: "'Cormorant Garamond', serif"
      }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setCurrentPage('home')} className="text-xs tracking-[0.25em] uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2">
              <span>← Back</span>
            </button>
            <div className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" onClick={() => setCurrentPage('home')}>
              <ImageWithFallback src={logoImage} alt="Unicorn Jewels Logo" className="h-12 md:h-14 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-5">
              <div className="relative">
                {accountDropdownOpen && isLoggedIn && <div className="fixed inset-0 z-[90]" onClick={() => setAccountDropdownOpen(false)} />}
                <button onClick={() => {
                if (isLoggedIn) {
                  setAccountDropdownOpen(!accountDropdownOpen);
                } else {
                  setCurrentPage('login');
                }
              }} className="relative z-[95] hover:text-gray-500 transition-colors flex items-center justify-center w-[18px] h-[18px]" aria-label="Account">
                  {isLoggedIn && userInitial ? <span className="text-[14px] font-medium leading-none text-gray-800">{userInitial}</span> : <User size={18} />}
                </button>
                {accountDropdownOpen && isLoggedIn && <motion.div initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="absolute right-0 top-[calc(100%+16px)] w-40 bg-white border border-gray-100 shadow-xl py-2 z-[100]">
                    <button onClick={() => {
                  setCurrentPage('profile');
                  setAccountDropdownOpen(false);
                  window.scrollTo(0, 0);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors">Profile</button>
                    <button onClick={() => {
                  setCurrentPage('profile');
                  setAccountDropdownOpen(false);
                  window.scrollTo(0, 0);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors">Orders</button>
                    <div className="h-[1px] bg-gray-100 my-1 w-full" />
                    <button onClick={() => {
                  setIsLoggedIn(false);
                  setAccountDropdownOpen(false);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors text-red-600">
                      Sign Out
                    </button>
                  </motion.div>}
              </div>
              <button onClick={() => openProfileTab('wishlist')} className="hover:text-gray-500 transition-colors" aria-label="Wishlist">
                <Heart size={18} className={wishlist.size > 0 ? "fill-black" : "fill-none"} stroke={wishlist.size > 0 ? "black" : "currentColor"} />
              </button>
              <button onClick={() => setCartOpen(true)} className="hover:text-gray-500 transition-colors relative" aria-label="Shopping bag">
                <ShoppingBag size={18} />
                {cartItems.length > 0 && <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>}
              </button>
            </div>
          </div>
        </div>

        <CollectionPage 
          collectionName={activeCollection} 
          onBack={() => setCurrentPage('home')} 
          onCollectionChange={name => {
            setActiveCollection(name);
            window.scrollTo({
              top: 0,
              behavior: 'instant'
            });
          }} 
          wishlist={wishlist} 
          toggleWishlist={toggleWishlist} 
          addToCart={addToCart} 
          addedIds={addedIds} 
          onProductClick={p => openProductPage(p, 'collection')} 
          dynamicBanner={dynamicBanner}
        />

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} addedIds={addedIds} updateQty={updateQty} removeFromCart={removeFromCart} wishlist={wishlist} toggleWishlist={toggleWishlist} onCheckout={() => setCurrentPage('checkout')} onProductClick={openCartProductPage} />
      </>;
  }
  if (currentPage === 'category' && activeCategory) {
    return <>
        {/* Sticky navbar on category page */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100" style={{
        fontFamily: "'Cormorant Garamond', serif"
      }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setCurrentPage('home')} className="text-xs tracking-[0.25em] uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2">
              <span>← Back</span>
            </button>
            <div className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" onClick={() => setCurrentPage('home')}>
              <ImageWithFallback src={logoImage} alt="Unicorn Jewels Logo" className="h-12 md:h-14 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-5">
              <div className="relative">
                {accountDropdownOpen && isLoggedIn && <div className="fixed inset-0 z-[90]" onClick={() => setAccountDropdownOpen(false)} />}
                <button onClick={() => {
                if (isLoggedIn) {
                  setAccountDropdownOpen(!accountDropdownOpen);
                } else {
                  setCurrentPage('login');
                }
              }} className="relative z-[95] hover:text-gray-500 transition-colors flex items-center justify-center w-[18px] h-[18px]" aria-label="Account">
                  {isLoggedIn && userInitial ? <span className="text-[14px] font-medium leading-none text-gray-800">{userInitial}</span> : <User size={18} className={isLoggedIn ? "text-gray-500" : ""} />}
                </button>
                {accountDropdownOpen && isLoggedIn && <motion.div initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="absolute right-0 top-[calc(100%+16px)] w-40 bg-white border border-gray-100 shadow-xl py-2 z-[100]">
                    <button onClick={() => {
                  setCurrentPage('profile');
                  setAccountDropdownOpen(false);
                  window.scrollTo(0, 0);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors">Profile</button>
                    <button onClick={() => {
                  setCurrentPage('profile');
                  setAccountDropdownOpen(false);
                  window.scrollTo(0, 0);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors">Orders</button>
                    <div className="h-[1px] bg-gray-100 my-1 w-full" />
                    <button onClick={() => {
                  setIsLoggedIn(false);
                  setAccountDropdownOpen(false);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors text-red-600">
                      Sign Out
                    </button>
                  </motion.div>}
              </div>
              <button onClick={() => setCartOpen(true)} className="hover:text-gray-500 transition-colors relative" aria-label="Cart">
                <ShoppingBag size={18} />
                {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </span>}
              </button>
            </div>
          </div>
        </div>

        <CategoryPage 
          category={activeCategory} 
          onCategoryChange={setActiveCategory} 
          onBack={() => setCurrentPage('home')} 
          wishlist={wishlist} 
          toggleWishlist={toggleWishlist} 
          addToCart={addToCart} 
          addedIds={addedIds} 
          onProductClick={p => openProductPage(p, 'category')} 
          dynamicBanner={dynamicBanner}
        />

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} addedIds={addedIds} updateQty={updateQty} removeFromCart={removeFromCart} wishlist={wishlist} toggleWishlist={toggleWishlist} onCheckout={() => setCurrentPage('checkout')} onProductClick={openCartProductPage} />
      </>;
  }
  if (currentPage === 'gift-guide') {
    return <>
        {/* Sticky navbar on gift guide page */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100" style={{
        fontFamily: "'Cormorant Garamond', serif"
      }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button onClick={() => setCurrentPage('home')} className="text-xs tracking-[0.25em] uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2">
              <span>← Back</span>
            </button>
            <div className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" onClick={() => setCurrentPage('home')}>
              <ImageWithFallback src={logoImage} alt="Unicorn Jewels Logo" className="h-12 md:h-14 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-5">
              <div className="relative">
                {accountDropdownOpen && isLoggedIn && <div className="fixed inset-0 z-[90]" onClick={() => setAccountDropdownOpen(false)} />}
                <button onClick={() => {
                if (isLoggedIn) {
                  setAccountDropdownOpen(!accountDropdownOpen);
                } else {
                  setCurrentPage('login');
                }
              }} className="relative z-[95] hover:text-gray-500 transition-colors flex items-center justify-center w-[18px] h-[18px]" aria-label="Account">
                  {isLoggedIn && userInitial ? <span className="text-[14px] font-medium leading-none text-gray-800">{userInitial}</span> : <User size={18} className={isLoggedIn ? "text-gray-500" : ""} />}
                </button>
                {accountDropdownOpen && isLoggedIn && <motion.div initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="absolute right-0 top-[calc(100%+16px)] w-40 bg-white border border-gray-100 shadow-xl py-2 z-[100]">
                    <button onClick={() => {
                  setCurrentPage('profile');
                  setAccountDropdownOpen(false);
                  window.scrollTo(0, 0);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors">Profile</button>
                    <button onClick={() => {
                  setCurrentPage('profile');
                  setAccountDropdownOpen(false);
                  window.scrollTo(0, 0);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors">Orders</button>
                    <div className="h-[1px] bg-gray-100 my-1 w-full" />
                    <button onClick={() => {
                  setIsLoggedIn(false);
                  setAccountDropdownOpen(false);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors text-red-600">
                      Sign Out
                    </button>
                  </motion.div>}
              </div>
              <button onClick={() => setCartOpen(true)} className="hover:text-gray-500 transition-colors relative" aria-label="Cart">
                <ShoppingBag size={18} />
                {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </span>}
              </button>
            </div>
          </div>
        </div>

        <GiftGuidePage 
          onBack={() => setCurrentPage('home')} 
          onNavigateCategory={(cat) => {
            setActiveCategory(cat);
            setCurrentPage('category');
            window.scrollTo(0,0);
          }}
        />

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} addedIds={addedIds} updateQty={updateQty} removeFromCart={removeFromCart} wishlist={wishlist} toggleWishlist={toggleWishlist} onCheckout={() => setCurrentPage('checkout')} onProductClick={openCartProductPage} />
      </>;
  }
  const categories = [{
    name: 'Rings',
    image: catRings
  }, {
    name: 'Necklaces',
    image: catNecklaces
  }, {
    name: 'Bracelets',
    image: catBracelets
  }, {
    name: 'Earrings',
    image: catEarrings
  }, {
    name: 'Engagement',
    image: catEngagement
  }, {
    name: 'Sets',
    image: catSets
  }];
  const products = [{
    id: 'home-featured-collections-1',
    name: 'Promise Bloom',
    price: '$12,500',
    priceNum: 12500,
    metal: 'Platinum · Round Brilliant',
    image: eternallyDesired1
  }, {
    id: 'home-featured-collections-2',
    name: 'The Vanguard',
    price: '$8,900',
    priceNum: 8900,
    metal: '18k Rose Gold',
    image: eternallyDesired2
  }, {
    id: 'home-featured-collections-3',
    name: 'Lumina Letter',
    price: '$2,750',
    priceNum: 2750,
    metal: '18k Yellow Gold',
    image: eternallyDesired3
  }, {
    id: 'home-featured-collections-4',
    name: 'Aura Everyday',
    price: '$4,200',
    priceNum: 4200,
    metal: 'Platinum',
    image: eternallyDesired4
  }];
  const instagramImages = [catRings, catNecklaces, catBracelets, catEarrings, catEngagement, catSets];
  const newArrivals = [{
    id: 'home-new-arrivals-10',
    name: 'Sapphire Cushion Ring',
    price: '$4,800',
    priceNum: 4800,
    metal: 'Platinum · Cushion Cut',
    tag: 'NEW',
    image: justUnveiledBlue
  }, {
    id: 'home-new-arrivals-11',
    name: 'Sapphire Cushion Pendant',
    price: '$5,200',
    priceNum: 5200,
    metal: '18k White Gold',
    tag: 'NEW',
    image: sapphirePendantImg
  }, {
    id: 'home-new-arrivals-12',
    name: 'Sapphire Cushion Earrings',
    price: '$5,950',
    priceNum: 5950,
    metal: 'Platinum · Pair',
    tag: 'EXCLUSIVE',
    image: sapphireEarringsImg
  }];
  return <div className="min-h-screen bg-white overflow-x-hidden" style={{
    fontFamily: "'Cormorant Garamond', serif"
  }}>
      {/* Slide-out Menu Backdrop — always mounted for smooth animation; pointer-events off when closed */}
      <motion.div initial={false} animate={{
      opacity: menuOpen ? 1 : 0
    }} transition={{
      duration: 0.4
    }} className="fixed inset-0 z-[60] bg-black/40" style={{
      pointerEvents: menuOpen ? 'auto' : 'none'
    }} onClick={() => setMenuOpen(false)} />

      {/* Slide-out Menu Panel — always mounted for smooth animation; pointer-events off when closed */}
      <motion.div initial={{
      x: '-100%'
    }} animate={{
      x: menuOpen ? 0 : '-100%'
    }} transition={{
      type: 'tween',
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }} className="fixed top-0 left-0 h-full w-full sm:w-[380px] sm:max-w-[85vw] bg-white shadow-2xl flex flex-col z-[65]" style={{
      fontFamily: "'Cormorant Garamond', serif",
      pointerEvents: menuOpen ? 'auto' : 'none'
    }}>
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-200">
            <span className="text-base sm:text-lg tracking-widest" style={{
          fontWeight: 300,
          letterSpacing: '0.15em'
        }}>MENU</span>
            <button onClick={() => setMenuOpen(false)} className="hover:text-gray-500 transition-colors" style={{
          pointerEvents: 'auto'
        }}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 sm:py-8" style={{
        scrollbarWidth: 'none'
      }}>
            <div className="space-y-0">
              {/* Collections */}
              <button type="button" className="flex items-center justify-between py-3 text-lg tracking-wider hover:text-gray-500 transition-colors w-full text-left" style={{
            fontWeight: 300,
            pointerEvents: 'auto',
            background: 'none',
            cursor: 'pointer',
            borderBottom: collectionsDropdownOpen ? '1px solid #e5e7eb' : '1px solid #f3f4f6'
          }} onClick={() => setCollectionsDropdownOpen(prev => !prev)}>
                <span>COLLECTIONS</span>
                <motion.span animate={{
              rotate: collectionsDropdownOpen ? 90 : 0
            }} transition={{
              duration: 0.2
            }} style={{
              display: 'flex'
            }}>
                  <ChevronRight size={16} className="text-gray-400" />
                </motion.span>
              </button>

              <motion.div initial={false} animate={{
            height: collectionsDropdownOpen ? 'auto' : 0
          }} transition={{
            duration: 0.35,
            ease: [0.4, 0, 0.2, 1]
          }} style={{
            overflow: 'hidden'
          }}>
                <div className="bg-gray-50 pl-6 pr-4 py-2">
                  {[{
                label: 'The Vanguard',
                key: 'The Vanguard'
              }, {
                label: 'Lumina Letter',
                key: 'Lumina Letter'
              }, {
                label: 'Promise Bloom',
                key: 'Promise Bloom'
              }, {
                label: 'Aura Everyday',
                key: 'Aura Everyday'
              }].map(sub => <button key={sub.key} type="button" className="flex items-center justify-between w-full py-2.5 text-sm tracking-[0.2em] text-gray-500 hover:text-black transition-colors text-left" style={{
                fontWeight: 300,
                pointerEvents: 'auto',
                background: 'none',
                cursor: 'pointer',
                borderBottom: '1px solid #ececec'
              }} onClick={() => {
                setMenuOpen(false);
                setCollectionsDropdownOpen(false);
                setActiveCollection(sub.key);
                setCurrentPage('collection');
                window.scrollTo(0, 0);
              }}>
                      <span>{sub.label.toUpperCase()}</span>
                      <ChevronRight size={12} className="text-gray-300" />
                    </button>)}
                </div>
              </motion.div>

              {/* Category with accordion dropdown */}
              <div>
                <button type="button" className="flex items-center justify-between py-3 text-lg tracking-wider hover:text-gray-500 transition-colors w-full text-left" style={{
              fontWeight: 300,
              pointerEvents: 'auto',
              background: 'none',
              cursor: 'pointer',
              borderBottom: categoryDropdownOpen ? '1px solid #e5e7eb' : '1px solid #f3f4f6'
            }} onClick={() => setCategoryDropdownOpen(prev => !prev)}>
                  <span>CATEGORY</span>
                  <motion.span animate={{
                rotate: categoryDropdownOpen ? 90 : 0
              }} transition={{
                duration: 0.2
              }} style={{
                display: 'flex'
              }}>
                    <ChevronRight size={16} className="text-gray-400" />
                  </motion.span>
                </button>

                <motion.div initial={false} animate={{
              height: categoryDropdownOpen ? 'auto' : 0
            }} transition={{
              duration: 0.35,
              ease: [0.4, 0, 0.2, 1]
            }} style={{
              overflow: 'hidden'
            }}>
                  <div className="bg-gray-50 pl-6 pr-4 py-2">
                    {[{
                  label: 'Rings',
                  key: 'Rings'
                }, {
                  label: 'Earrings',
                  key: 'Earrings'
                }, {
                  label: 'Necklaces',
                  key: 'Necklaces'
                }, {
                  label: 'Sets',
                  key: 'Sets'
                }, {
                  label: 'Bracelets',
                  key: 'Bracelets'
                }, {
                  label: 'Engagement',
                  key: 'Engagement'
                }].map(sub => <button key={sub.key} type="button" className="flex items-center justify-between w-full py-2.5 text-sm tracking-[0.2em] text-gray-500 hover:text-black transition-colors text-left" style={{
                  fontWeight: 300,
                  pointerEvents: 'auto',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: '1px solid #ececec'
                }} onClick={() => {
                  setMenuOpen(false);
                  setCategoryDropdownOpen(false);
                  setActiveCategory(sub.key);
                  setCurrentPage('category');
                  window.scrollTo({
                    top: 0,
                    behavior: 'instant'
                  });
                }}>
                        <span>{sub.label.toUpperCase()}</span>
                        <ChevronRight size={12} className="text-gray-300" />
                      </button>)}
                  </div>
                </motion.div>
              </div>

              {/* Jewelry */}
              <button type="button" className="flex items-center justify-between py-3 text-lg tracking-wider hover:text-gray-500 transition-colors w-full text-left" style={{
            fontWeight: 300,
            pointerEvents: 'auto',
            background: 'none',
            cursor: 'pointer',
            borderBottom: '1px solid #f3f4f6'
          }} onClick={() => {
            setMenuOpen(false);
            setCategoryDropdownOpen(false);
            setCollectionsDropdownOpen(false);
            setActiveCategory('Jewelry');
            setCurrentPage('category');
            window.scrollTo({
              top: 0,
              behavior: 'instant'
            });
          }}>
                <span>JEWELRY</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>

              {/* Book an Appointment */}
              <button type="button" className="flex items-center justify-between py-3 text-lg tracking-wider hover:text-gray-500 transition-colors w-full text-left" style={{
            fontWeight: 300,
            pointerEvents: 'auto',
            background: 'none',
            cursor: 'pointer',
            borderBottom: '1px solid #f3f4f6'
          }} onClick={() => {
            setMenuOpen(false);
            openAppointment();
          }}>
                <span>BOOK AN APPOINTMENT</span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            </div>
          </nav>
          <div className="px-6 sm:px-8 py-5 sm:py-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-400 tracking-wider" style={{
          fontWeight: 300
        }}>1-800-UNICORN</p>
          </div>
        </motion.div>

      {/* Main Navigation */}
      <motion.header className={`sticky top-0 z-50 transition-all duration-500 w-full ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 w-full">
          <div className="flex items-center justify-between">
            {/* Left Icons */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-1">
              <button onClick={() => setMenuOpen(true)} className="hover:text-gray-500 transition-colors tap-target" aria-label="Open menu">
                <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />
              </button>
              <button className="hover:text-gray-500 transition-colors tap-target hidden sm:block" aria-label="Search">
                <Search size={18} className="sm:w-[20px] sm:h-[20px]" />
              </button>
            </div>

            {/* Centered Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => {
            setCurrentPage('home');
            window.scrollTo(0, 0);
          }}>
              <ImageWithFallback src={logoImage} alt="Unicorn Jewels Logo" className="h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 w-auto object-contain hover:opacity-80 transition-opacity" />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-1 justify-end">
              <button onClick={() => openAppointment()} className="hover:text-gray-500 transition-colors tap-target hidden md:block" aria-label="Book appointment">
                <Calendar size={18} className="md:w-[20px] md:h-[20px]" />
              </button>
              <div className="relative">
                {accountDropdownOpen && isLoggedIn && <div className="fixed inset-0 z-[90]" onClick={() => setAccountDropdownOpen(false)} />}
                <button onClick={() => {
                if (isLoggedIn) {
                  setAccountDropdownOpen(!accountDropdownOpen);
                } else {
                  setCurrentPage('login');
                }
              }} className="relative z-[95] hover:text-gray-500 transition-colors flex items-center justify-center tap-target" aria-label="Account">
                  {isLoggedIn && userInitial ? <span className="text-sm sm:text-base font-medium leading-none text-gray-800">{userInitial}</span> : <User size={18} className={`sm:w-[20px] sm:h-[20px] ${isLoggedIn ? "text-gray-500" : ""}`} />}
                </button>
                {accountDropdownOpen && isLoggedIn && <motion.div initial={{
                opacity: 0,
                y: 10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="absolute right-0 top-[calc(100%+16px)] w-40 bg-white border border-gray-100 shadow-xl py-2 z-[100]">
                    <button onClick={() => {
                  setCurrentPage('profile');
                  setAccountDropdownOpen(false);
                  window.scrollTo(0, 0);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors text-black">Profile</button>
                    <button onClick={() => {
                  setCurrentPage('profile');
                  setAccountDropdownOpen(false);
                  window.scrollTo(0, 0);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors text-black">Orders</button>
                    <div className="h-[1px] bg-gray-100 my-1 w-full" />
                    <button onClick={() => {
                  setIsLoggedIn(false);
                  setAccountDropdownOpen(false);
                }} className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors text-red-600">
                      Sign Out
                    </button>
                  </motion.div>}
              </div>
              <button onClick={() => setCartOpen(true)} className="hover:text-gray-500 transition-colors relative tap-target" aria-label="Cart">
                <ShoppingBag size={18} className="sm:w-[20px] sm:h-[20px]" />
                {cartItems.length > 0 && <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-black text-white text-[10px] sm:text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </span>}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-black overflow-hidden border-b border-gray-900 w-full">
        {/* Text Content (40%) */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-0 z-10 bg-black order-2 lg:order-1 max-w-full">
          <motion.div initial={{
          opacity: 0,
          x: -30
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 1,
          delay: 0.2
        }}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] leading-[0.85] text-white mb-6 sm:mb-8 drop-shadow-2xl" style={{
            fontWeight: 300,
            letterSpacing: '-0.02em'
          }}>
              {dynamicBanner.title.includes(' ') ? (
                <>
                  {dynamicBanner.title.split(' ')[0]}<br />
                  <span className="italic text-[#C0C0C0]">{dynamicBanner.title.split(' ').slice(1).join(' ')}</span>
                </>
              ) : (
                dynamicBanner.title
              )}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white mb-3 sm:mb-4 drop-shadow-lg" style={{
            fontWeight: 300,
            lineHeight: 1.6
          }}>
              {dynamicBanner.subtitle}
            </p>
            <p className="text-sm sm:text-base text-white/90 mb-8 sm:mb-10 md:mb-12 max-w-sm tracking-wide leading-relaxed drop-shadow-lg" style={{
            fontWeight: 300
          }}>
              {dynamicBanner.description}
            </p>

            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 items-start sm:items-center mt-2">
              <button onClick={() => {
              document.getElementById('eternally-desired').scrollIntoView({
                behavior: 'smooth'
              });
            }} className="group flex items-center gap-3 sm:gap-4 text-xs sm:text-sm uppercase tracking-[0.2em] text-white hover:text-[#C0C0C0] transition-colors tap-target min-h-[44px]">
                <span className="drop-shadow-lg">Explore Collection</span>
                <span className="w-6 sm:w-8 h-[1px] bg-white group-hover:bg-[#C0C0C0] group-hover:w-12 sm:group-hover:w-16 transition-all duration-500 drop-shadow-lg"></span>
              </button>
              <button onClick={() => {
              openAppointment();
            }} className="group flex items-center gap-3 sm:gap-4 text-xs sm:text-sm uppercase tracking-[0.2em] text-white hover:text-[#C0C0C0] transition-colors tap-target min-h-[44px]">
                <span className="drop-shadow-lg">Book Consultation</span>
                <span className="w-6 sm:w-8 h-[1px] bg-white group-hover:bg-[#C0C0C0] group-hover:w-12 sm:group-hover:w-16 transition-all duration-500 drop-shadow-lg"></span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Image Content (60%) */}
        <div className="w-full lg:w-[60%] h-[50vh] sm:h-[60vh] lg:h-auto lg:min-h-[calc(100vh-80px)] relative overflow-hidden group order-1 lg:order-2 max-w-full">
          <motion.div initial={{
          opacity: 0,
          scale: 1.05
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 1.5,
          ease: "easeOut"
        }} className="w-full h-full absolute inset-0 max-w-full">
            <ImageWithFallback src={dynamicBanner.imageUrl} alt="Luxury Jewelry" className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[2000ms] ease-out" />

            {/* Gradient overlay for better text contrast on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />
          </motion.div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-10 md:mb-12" style={{
          fontWeight: 300,
          letterSpacing: '0.1em'
        }}>
            Curated Collections
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {categories.map(category => <div key={category.name} className="text-center">
                <button type="button" className="group cursor-pointer w-full text-center bg-transparent border-none outline-none" onClick={() => {
              setActiveCategory(category.name);
              setCurrentPage('category');
              window.scrollTo({
                top: 0,
                behavior: 'instant'
              });
            }}>
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden">
                    <ImageWithFallback src={category.image} alt={category.name} className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg tracking-wider" style={{
                fontWeight: 400
              }}>
                    {category.name}
                  </h3>
                </button>
              </div>)}
          </div>
        </div>
      </section>

      {/* Editorial Section - The Silver Collection */}
      <section className="py-12 sm:py-16 md:py-20 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }} viewport={{
            once: true
          }} className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] cursor-pointer overflow-hidden bg-gray-50" onClick={() => setIsSilverModalOpen(true)}>
              <ImageWithFallback src={silverCollectionFrontImg} alt="The Silver Collection - Ring" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out hover:scale-105" />
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            x: 50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }} viewport={{
            once: true
          }} className="space-y-4 sm:space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl" style={{
              fontWeight: 300,
              letterSpacing: '0.05em'
            }}>
                The Silver Collection
              </h2>
              <p className="text-base sm:text-lg text-gray-600" style={{
              fontWeight: 300,
              lineHeight: 1.8
            }}>
                Our signature silver pieces embody modern sophistication. Each design is meticulously crafted by master artisans who bring decades of expertise to every detail, creating heirlooms for generations to come.
              </p>
              <button className="flex items-center gap-2 text-black border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors text-sm sm:text-base tap-target">
                <span className="tracking-wider">DISCOVER MORE</span>
                <ChevronRight size={18} className="sm:w-[20px] sm:h-[20px]" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Editorial Section - Platinum Perfection */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }} viewport={{
            once: true
          }} className="space-y-4 sm:space-y-6 order-2 md:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl" style={{
              fontWeight: 300,
              letterSpacing: '0.05em'
            }}>
                Platinum Perfection
              </h2>
              <p className="text-base sm:text-lg text-gray-600" style={{
              fontWeight: 300,
              lineHeight: 1.8
            }}>
                The rarest and most precious of metals, platinum represents the pinnacle of luxury. Our platinum collection showcases extraordinary diamonds set in designs that celebrate life's most meaningful moments.
              </p>
              <button className="flex items-center gap-2 text-black border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors text-sm sm:text-base tap-target">
                <span className="tracking-wider">EXPLORE COLLECTION</span>
                <ChevronRight size={18} className="sm:w-[20px] sm:h-[20px]" />
              </button>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            x: 50
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }} viewport={{
            once: true
          }} className="order-1 md:order-2">
              <ImageWithFallback src={platinumPerfectionImg} alt="Platinum Perfection" className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-contain" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Just Unveiled */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }}>
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Sparkles size={16} className="sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] text-gray-400" />
                <span className="text-xs sm:text-sm tracking-[0.3em] text-gray-400" style={{
                fontWeight: 400
              }}>JUST ARRIVED</span>
                <Sparkles size={16} className="sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] text-gray-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4" style={{
              fontWeight: 300,
              letterSpacing: '0.1em'
            }}>
                Just Unveiled
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto px-4" style={{
              fontWeight: 300
            }}>
                Be the first to discover our latest creations, fresh from the atelier
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {newArrivals.map((item, index) => <motion.div key={item.id} initial={{
            opacity: 0,
            y: 40
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.7,
            delay: index * 0.15
          }} viewport={{
            once: true
          }} className="group cursor-pointer">
                <div className="relative mb-4 sm:mb-5 overflow-hidden">
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-64 sm:h-80 md:h-96 object-contain bg-gray-50 p-6 sm:p-8 group-hover:scale-105 transition-transform duration-700" />
                  <button onClick={e => {
                e.stopPropagation();
                toggleWishlist(item.id);
              }} className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors z-10 tap-target">
                    <Heart size={16} className={`sm:w-[18px] sm:h-[18px] ${wishlist.has(item.id) ? 'fill-black' : 'fill-none'}`} stroke="black" />
                  </button>
                  {/* Tiffany-style Add to Bag */}
                  <button onClick={e => {
                e.stopPropagation();
                addToCart(item);
              }} className="absolute bottom-0 left-0 right-0 z-10 py-3 sm:py-4 text-[10px] sm:text-xs tracking-[0.25em] uppercase transition-all duration-300 translate-y-full group-hover:translate-y-0" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                background: addedIds.has(item.id) ? '#1a1a1a' : '#000',
                color: '#fff'
              }}>
                    {addedIds.has(item.id) ? '✓ Added to Bag' : 'Add to Bag'}
                  </button>
                </div>
                <h3 className="text-lg sm:text-xl mb-2" style={{
              fontWeight: 400
            }}>{item.name}</h3>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Brand Origin - Asymmetric Editorial */}
      <section className="py-32 px-6 bg-[#0a0a0a] text-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-32">
            <motion.div initial={{
            opacity: 0,
            clipPath: 'inset(10% 10% 10% 10%)'
          }} whileInView={{
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)'
          }} transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1]
          }} viewport={{
            once: true
          }} className="w-full md:w-5/12 h-[80vh] min-h-[600px] max-h-[900px] relative group overflow-hidden">
              <div className="absolute inset-0 bg-[#111] z-0"></div>
              <ImageWithFallback src={ourStoryModel} alt="Unicorn Jewels Model" className="w-full h-full object-cover object-center absolute inset-0 z-10" />
              <ImageWithFallback src="https://images.unsplash.com/photo-1706955008775-c00874bb4d4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbGVyJTIwY3JhZnRpbmclMjBjdXN0b20lMjByaW5nJTIwd29ya3Nob3B8ZW58MXx8fHwxNzc0MDcwNDEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" alt="Master Jeweler" className="w-full h-full object-cover object-center absolute inset-0 mix-blend-luminosity opacity-80" />
              <div className="absolute inset-0 border border-white/10 z-20 m-6 lg:m-10 pointer-events-none mix-blend-overlay"></div>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            y: 40
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }} viewport={{
            once: true
          }} className="w-full md:w-6/12 flex flex-col justify-center">
              <span className="text-xs tracking-[0.4em] uppercase text-gray-300 mb-8 block font-medium">Our Story</span>
              <h2 className="text-5xl lg:text-7xl mb-10 text-white leading-tight" style={{
              fontWeight: 300
            }}>
                A New Era of <br /><span className="italic text-gray-400">Brilliance</span>
              </h2>
              <div className="w-12 h-[1px] bg-white/40 mb-10"></div>
              <p className="text-lg lg:text-xl mb-8 text-gray-300 max-w-lg" style={{
              fontWeight: 300,
              lineHeight: 1.8
            }}>
                Born from a passion for disrupting traditional luxury, Unicorn Jewels was founded to bring uncompromising craftsmanship to the modern collector.
              </p>
              <p className="text-sm text-gray-400 mb-12 max-w-md tracking-wide" style={{
              fontWeight: 300,
              lineHeight: 1.8
            }}>
                Every piece is conceptualized in our studio and brought to life by master artisans. We don't just create jewelry; we engineer future heirlooms.
              </p>
              <button onClick={() => {
              window.scrollTo(0, 0);
              setCurrentPage('story');
            }} className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-white hover:text-gray-300 transition-colors w-max">
                <span>Discover Our Vision</span>
                <span className="w-8 h-[1px] bg-white group-hover:w-12 transition-all duration-300"></span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Eternally Desired - Gallery Grid */}
      <section id="eternally-desired" className="py-32 px-6 bg-[#fafafa]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} viewport={{
            once: true
          }}>
              <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-6 block">Featured Collections</span>
              <h2 className="text-5xl lg:text-7xl mb-10 text-black leading-tight" style={{
              fontWeight: 300
            }}>
                Eternally <br /><span className="italic text-gray-500">Desired</span>
              </h2>
            </motion.div>
            <button className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] hover:text-gray-500 transition-colors">
              <span>View Collection</span>
              <span className="w-8 h-[1px] bg-black group-hover:w-12 transition-all duration-300"></span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {products.map((product, index) => <motion.div key={product.id} initial={{
            opacity: 0,
            y: 40
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: index * 0.1
          }} viewport={{
            once: true
          }} className="group cursor-pointer flex flex-col" onClick={() => {
            setActiveCollection(product.name);
            setCurrentPage('collection');
            window.scrollTo(0, 0);
          }}>
                <div className="relative mb-6 overflow-hidden bg-[#f0f0f0] aspect-[4/5]">
                  <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover p-4 group-hover:scale-110 transition-transform duration-1000 ease-out" />
                  <button onClick={e => {
                e.stopPropagation();
                toggleWishlist(product.id);
              }} className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
                    <Heart size={20} className={wishlist.has(product.id) ? 'fill-black' : 'fill-none'} stroke="black" strokeWidth={1} />
                  </button>
                </div>
                <h3 className="text-sm uppercase tracking-widest mb-2 text-black" style={{
              fontWeight: 400
            }}>
                  {product.name}
                </h3>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* The Stone Edit - Staggered Masonry Look */}
      <section className="py-40 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} viewport={{
          once: true
        }} className="text-center mb-32">
            <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-6 block">The Diamond Collection</span>
            <h2 className="text-5xl lg:text-6xl text-black mb-8" style={{
            fontWeight: 300
          }}>
              The Diamond <span className="italic text-gray-500">Edit</span>
            </h2>
          </motion.div>
          
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {[{
            name: 'Red Diamond Pendant',
            subtitle: 'The Eternal Flame',
            image: diamondEdit1,
            offset: 'mt-0'
          }, {
            name: 'Red Diamond Bracelet',
            subtitle: 'Passion Captured',
            image: diamondEdit2,
            offset: 'md:mt-32'
          }, {
            name: 'Red Diamond Ring',
            subtitle: 'Rare Romance',
            image: diamondEdit3,
            offset: 'md:mt-16'
          }].map((stone, index) => <motion.div key={stone.name} initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 1,
            delay: index * 0.2
          }} viewport={{
            once: true
          }} className={`flex-1 group cursor-pointer ${stone.offset}`}>
                <div className="aspect-[3/4] overflow-hidden mb-8 relative bg-[#f8f8f8]">
                  <ImageWithFallback src={stone.image} alt={stone.name} className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-3xl text-black mb-2" style={{
                  fontWeight: 300
                }}>{stone.name}</h3>
                    <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">{stone.subtitle}</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-black transition-colors -translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 duration-500" />
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Personal Styling & Art of Giving - Combined Editorial Spread */}
      <section className="py-32 px-6 bg-[#fafafa]">
        <div className="max-w-[1400px] mx-auto">
          {/* Styling */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 mb-40">
            <motion.div initial={{
            opacity: 0,
            x: -40
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 1
          }} viewport={{
            once: true
          }} className="w-full md:w-5/12 order-2 md:order-1">
              <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8 block">Concierge</span>
              <h2 className="text-5xl lg:text-6xl mb-10 text-black leading-tight" style={{
              fontWeight: 300
            }}>
                Personal <br /><span className="italic text-gray-500">Styling</span>
              </h2>
              <p className="text-lg text-gray-600 mb-12 max-w-md" style={{
              fontWeight: 300,
              lineHeight: 1.8
            }}>
                Our style consultants curate a personalized selection based on your taste, occasion, and wardrobe — whether for a gala, a wedding, or everyday elegance.
              </p>
              <button onClick={() => {
              openAppointment();
            }} className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] hover:text-gray-500 transition-colors w-max">
                <span>Book a Session</span>
                <span className="w-8 h-[1px] bg-black group-hover:w-12 transition-all duration-300"></span>
              </button>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            clipPath: 'inset(100% 0 0 0)'
          }} whileInView={{
            opacity: 1,
            clipPath: 'inset(0% 0 0 0)'
          }} transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1]
          }} viewport={{
            once: true
          }} className="w-full md:w-7/12 aspect-[4/3] md:aspect-[16/9] overflow-hidden order-1 md:order-2">
              <ImageWithFallback src={personalStylingImg} alt="Personal Styling" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Gifting */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <motion.div initial={{
            opacity: 0,
            clipPath: 'inset(0 0 0 100%)'
          }} whileInView={{
            opacity: 1,
            clipPath: 'inset(0 0 0 0%)'
          }} transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1]
          }} viewport={{
            once: true
          }} className="w-full md:w-6/12 aspect-[3/4] overflow-hidden">
              <ImageWithFallback src={catEngagement} alt="The Art of Giving" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            x: 40
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 1
          }} viewport={{
            once: true
          }} className="w-full md:w-5/12 lg:pl-16">
              <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8 block">Services</span>
              <h2 className="text-5xl lg:text-6xl mb-10 text-black leading-tight" style={{
              fontWeight: 300
            }}>
                The Art of <br /><span className="italic text-gray-500">Giving</span>
              </h2>
              <p className="text-lg text-gray-600 mb-12 max-w-md" style={{
              fontWeight: 300,
              lineHeight: 1.8
            }}>
                Every piece arrives in our signature presentation box, hand-tied with a silk ribbon. Complimentary engraving and personal shopping assistance ensure a gift as memorable as the jewel itself.
              </p>
              <button 
                onClick={() => {
                  setCurrentPage('gift-guide');
                  window.scrollTo(0, 0);
                }}
                className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] hover:text-gray-500 transition-colors w-max"
              >
                <span>Explore Gift Guide</span>
                <span className="w-8 h-[1px] bg-black group-hover:w-12 transition-all duration-300"></span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Haute Joaillerie - Dark Avant-Garde Editorial */}
      <section className="py-32 px-6 bg-[#0a0a0a] text-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            <motion.div initial={{
            opacity: 0,
            y: 40
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1]
          }} viewport={{
            once: true
          }} className="w-full lg:w-5/12 flex flex-col justify-center order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-white/40"></div>
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/60">The Vault</span>
              </div>
              <h2 className="text-5xl lg:text-7xl mb-8 leading-[1.1]" style={{
              fontWeight: 300
            }}>
                Haute <br /><span className="italic text-white/50">Joaillerie</span>
              </h2>
              <p className="text-lg lg:text-xl mb-8 text-white/70 max-w-md" style={{
              fontWeight: 300,
              lineHeight: 1.8
            }}>
                Where imagination knows no bounds. Discover our most spectacular, one-of-a-kind masterworks reserved for the discerning collector.
              </p>
              <p className="text-sm text-white/40 mb-12 max-w-md tracking-wide" style={{
              fontWeight: 300,
              lineHeight: 1.8
            }}>
                Crafted with impossibly rare gems and hundreds of hours of painstaking artisanal labor, the High Jewelry collection represents the absolute zenith of the Unicorn Jewels legacy.
              </p>
              <button onClick={() => openAppointment('vault')} className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-white hover:text-white/70 transition-colors w-max">
                <span>Request Private Viewing</span>
                <span className="w-8 h-[1px] bg-white group-hover:w-12 transition-all duration-300"></span>
              </button>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            clipPath: 'inset(10% 10% 10% 10%)'
          }} whileInView={{
            opacity: 1,
            clipPath: 'inset(0% 0% 0% 0%)'
          }} transition={{
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1]
          }} viewport={{
            once: true
          }} className="w-full lg:w-7/12 aspect-[3/4] lg:aspect-[4/5] relative group order-1 lg:order-2 overflow-hidden">
              <div className="absolute inset-0 bg-[#111] z-0"></div>
              <ImageWithFallback src={hauteJoaillerieImg} alt="Haute Joaillerie High Fashion Editorial" className="w-full h-full object-cover object-center absolute inset-0 z-10 transition-transform duration-[2000ms] group-hover:scale-105" />
              <div className="absolute inset-0 border border-white/10 z-20 m-6 lg:m-10 pointer-events-none mix-blend-overlay"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Instagram size={24} />
              <h2 className="text-3xl" style={{
              fontWeight: 300,
              letterSpacing: '0.1em'
            }}>
                @UnicornJewels
              </h2>
            </div>
            <p className="text-gray-600" style={{
            fontWeight: 300
          }}>
              Follow us for daily inspiration and exclusive behind-the-scenes moments
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {instagramImages.map((image, index) => <motion.div key={index} initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.5,
            delay: index * 0.05
          }} viewport={{
            once: true
          }} className="aspect-square overflow-hidden cursor-pointer group">
                <ImageWithFallback src={image} alt={`Instagram ${index + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-16 pb-6 sm:pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Newsletter */}
          <div className="border-b border-gray-300 pb-12 mb-12">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl mb-4" style={{
              fontWeight: 300,
              letterSpacing: '0.1em'
            }}>
                Join Our Community
              </h3>
              <p className="text-gray-600 mb-6" style={{
              fontWeight: 300
            }}>
                Be the first to discover new collections and exclusive offerings
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input type="email" placeholder="Email Address" className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black" />
                <button className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors flex items-center gap-2">
                  <Mail size={18} />
                  <span>Subscribe</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="mb-4 tracking-wider" style={{
              fontWeight: 500
            }}>
                SHOP
              </h4>
              <ul className="space-y-2 text-gray-600" style={{
              fontWeight: 300
            }}>
                <li><a href="#" className="hover:text-black">Engagement Rings</a></li>
                <li><a href="#" className="hover:text-black">Necklaces</a></li>
                <li><a href="#" className="hover:text-black">Bracelets</a></li>
                <li><a href="#" className="hover:text-black">Earrings</a></li>
                <li><a href="#" className="hover:text-black">Timepieces</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 tracking-wider" style={{
              fontWeight: 500
            }}>
                CLIENT CARE
              </h4>
              <ul className="space-y-2 text-gray-600" style={{
              fontWeight: 300
            }}>
                <li><a href="#" className="hover:text-black">Contact Us</a></li>
                <li><a href="#" className="hover:text-black">Book Appointment</a></li>
                <li><button onClick={() => setCurrentPage('profile')} className="hover:text-black text-left w-full">Track Order</button></li>
                <li><a href="#" className="hover:text-black">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-black">Care & Repair</a></li>
                <li><a href="#" className="hover:text-black">Size Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 tracking-wider" style={{
              fontWeight: 500
            }}>
                OUR WORLD
              </h4>
              <ul className="space-y-2 text-gray-600" style={{
              fontWeight: 300
            }}>
                <li><a href="#" className="hover:text-black">About Unicorn</a></li>
                <li><a href="#" className="hover:text-black">Craftsmanship</a></li>
                <li><a href="#" className="hover:text-black">Sustainability</a></li>
                <li><a href="#" className="hover:text-black">Heritage</a></li>
                <li><a href="#" className="hover:text-black">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 tracking-wider" style={{
              fontWeight: 500
            }}>
                CONNECT
              </h4>
              <ul className="space-y-2 text-gray-600" style={{
              fontWeight: 300
            }}>
                <li><a href="#" className="hover:text-black">Instagram</a></li>
                <li><a href="#" className="hover:text-black">Facebook</a></li>
                <li><a href="#" className="hover:text-black">Pinterest</a></li>
                <li><a href="#" className="hover:text-black">Twitter</a></li>
                <li><a href="#" className="hover:text-black">YouTube</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-300 pt-6 sm:pt-8 pb-2 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p style={{
            fontWeight: 300
          }}>Designed & Developed by Syntiaro</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-black" style={{
              fontWeight: 300
            }}>Privacy Policy</a>
              <a href="#" className="hover:text-black" style={{
              fontWeight: 300
            }}>Terms of Service</a>
              <a href="#" className="hover:text-black" style={{
              fontWeight: 300
            }}>Accessibility</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Silver Collection Image Modal */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isSilverModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/90 cursor-zoom-out" onClick={() => setIsSilverModalOpen(false)} />
        <div className="absolute top-6 right-6 z-10">
          <button onClick={() => setIsSilverModalOpen(false)} className="text-white hover:text-gray-300 transition-colors bg-black/50 p-2 rounded-full backdrop-blur-sm">
            <X size={24} />
          </button>
        </div>
        <div className="absolute inset-4 md:inset-12 flex items-center justify-center pointer-events-none">
          <motion.div initial={{
          scale: 0.95,
          opacity: 0
        }} animate={{
          scale: isSilverModalOpen ? 1 : 0.95,
          opacity: isSilverModalOpen ? 1 : 0
        }} transition={{
          duration: 0.4
        }} className={`w-full h-full flex items-center justify-center ${isSilverModalOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <ImageWithFallback src={silverCollectionImg} alt="The Silver Collection High Resolution" className="max-w-full max-h-full object-contain" />
          </motion.div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} items={cartItems} addedIds={addedIds} updateQty={updateQty} removeFromCart={removeFromCart} wishlist={wishlist} toggleWishlist={toggleWishlist} onCheckout={() => setCurrentPage('checkout')} onProductClick={openCartProductPage} />
    </div>;
}
