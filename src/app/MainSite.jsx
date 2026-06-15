import { useState, useEffect, useMemo } from "react";
import { jsPDF } from "jspdf";
import { useSearchParams } from "react-router";
const heroImage =
  "https://images.unsplash.com/photo-1729641246245-64405c363263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHdlYXJpbmclMjBsdXh1cnklMjBkaWFtb25kJTIwamV3ZWxyeSUyMGF2YW50LWdhcmRlfGVufDF8fHx8MTc3Njc2NTMxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catRings =
  "https://images.unsplash.com/photo-1662434921251-a6eba45ac40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catNecklaces =
  "https://images.unsplash.com/photo-1590845947379-6c663322efea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwbmVja2xhY2UlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catBracelets =
  "https://images.unsplash.com/photo-1612437830721-4f8eab90c5a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwYnJhY2VsZXQlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catEarrings =
  "https://images.unsplash.com/photo-1726507367666-08c5f025bdf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwZWFycmluZ3MlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catEngagement =
  "https://images.unsplash.com/photo-1587947330318-88fcd9055420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwZW5nYWdlbWVudCUyMHJpbmclMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const catSets =
  "https://images.unsplash.com/photo-1702476320482-0736c4b962f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoaWdoJTIwamV3ZWxyeSUyMHNldCUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const silverCollectionFrontImg =
  "https://images.unsplash.com/photo-1758391929001-55983449a84c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBqZXdlbHJ5JTIwY29sbGVjdGlvbiUyMG1vZGVsJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc3Njc2NTMyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const silverCollectionImg =
  "https://images.unsplash.com/photo-1524324625284-39263f7046aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG9zZSUyMHVwJTIwc2lsdmVyJTIwamV3ZWxyeSUyMGF2YW50JTIwZ2FyZGV8ZW58MXx8fHwxNzc2NzY1MzIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const platinumPerfectionImg =
  "https://images.unsplash.com/photo-1679156271420-e6c596e9c10a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF0aW51bSUyMGRpYW1vbmQlMjByaW5nJTIwbHV4dXJ5fGVufDF8fHx8MTc3Njc2NTMzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const justUnveiledBlue =
  "https://images.unsplash.com/photo-1610661022658-5068c4d8f286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBwZW5kYW50JTIwbmVja2xhY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzc2NzY1MzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const sapphirePendantImg =
  "https://images.unsplash.com/photo-1610661022658-5068c4d8f286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBwZW5kYW50JTIwbmVja2xhY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzc2NzY1MzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const sapphireEarringsImg =
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBlYXJyaW5ncyUyMGx1eHVyeSUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const ourStoryModel =
  "https://images.unsplash.com/photo-1771012266370-6bbe78f801c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBsb29raW5nJTIwYmFjayUyMGVsZWdhbnQlMjBqZXdlbHJ5fGVufDF8fHx8MTc3Njc2NTMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const eternallyDesired1 =
  "https://images.unsplash.com/photo-1724937721228-f7bf3df2a4d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGVybmFsbHklMjBkZXNpcmVkJTIwY2xhc3NpYyUyMGRpYW1vbmQlMjBqZXdlbHJ5fGVufDF8fHx8MTc3Njc2NTMyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const eternallyDesired2 =
  "https://images.unsplash.com/photo-1635987739727-11e2578bd0cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwamV3ZWxyeSUyMHNjdWxwdHVyYWwlMjBnb2xkfGVufDF8fHx8MTc3Njc2NTMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const eternallyDesired3 =
  "https://images.unsplash.com/photo-1637536701306-3214e9cec64a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGFuZCUyMHdoaXRlJTIwamV3ZWxyeSUyMGVkaXRvcmlhbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Njc2NTMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const eternallyDesired4 =
  "https://images.unsplash.com/photo-1633701394188-c11a1e6a4e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZW5kJTIwbHV4dXJ5JTIwamV3ZWxyeSUyMG1vZGVsJTIwc2hvb3R8ZW58MXx8fHwxNzc2NzY1MzI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const personalStylingImg =
  "https://images.unsplash.com/photo-1634546269105-4dbc3e8f0052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHN0eWxpbmclMjBqZXdlbHJ5JTIwZXhwZXJ0JTIwY29uc3VsdGF0aW9ufGVufDF8fHx8MTc3Njc2NTMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const diamondEdit1 =
  "https://images.unsplash.com/photo-1662434921251-a6eba45ac40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const diamondEdit2 =
  "https://images.unsplash.com/photo-1590845947379-6c663322efea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwbmVja2xhY2UlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const diamondEdit3 =
  "https://images.unsplash.com/photo-1612437830721-4f8eab90c5a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwYnJhY2VsZXQlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const hauteJoaillerieImg =
  "https://images.unsplash.com/photo-1614999612412-3b1dbcd68e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwamV3ZWxyeSUyMGRpYW1vbmQlMjBuZWNrbGFjZSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzc2NzY1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
const logoImage = "/images/unicorn-logo.svg";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  User,
  Heart,
  ChevronRight,
  ChevronLeft,
  Instagram,
  Mail,
  Calendar,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { AppointmentPage } from "./components/AppointmentPage";
import { CheckoutPage } from "./components/CheckoutPage";
import { CartDrawer } from "./components/CartDrawer";
import { CategoryPage, catalogue } from "./components/CategoryPage";
import { CollectionPage, collectionsData } from "./components/CollectionPage";
import { ProfilePage } from "./components/ProfilePage";
import { OurStoryPage } from "./components/OurStoryPage";
import { ProductPage } from "./components/ProductPage";
import {
  buildProductIndex,
  withScopedProductIds,
} from "./components/productIdentity";
import { TrackOrderPage } from "./components/TrackOrderPage";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { TermsOfServicePage } from "./components/TermsOfServicePage";
import defaultPageContent from "../../shared/pageContentDefaults.json";

const cloneContent = (value) => JSON.parse(JSON.stringify(value));
const mergeWithDefaults = (defaults, incoming) => {
  if (Array.isArray(defaults)) {
    const source = Array.isArray(incoming) ? incoming : [];
    return defaults.map((item, index) =>
      mergeWithDefaults(item, source[index]),
    );
  }
  if (defaults && typeof defaults === "object") {
    const source = incoming && typeof incoming === "object" ? incoming : {};
    return Object.keys(defaults).reduce((acc, key) => {
      acc[key] = mergeWithDefaults(defaults[key], source[key]);
      return acc;
    }, {});
  }
  return incoming ?? defaults;
};
const resolveManagedImage = (value) =>
  value
    ? value.startsWith("http")
      ? value
      : `http://localhost:5000${value}`
    : "";

const featuredCollectionCards = withScopedProductIds(
  [
    {
      id: 1,
      name: "Promise Bloom",
      price: "$12,500",
      priceNum: 12500,
      metal: "Platinum Â· Round Brilliant",
      image: eternallyDesired1,
    },
    {
      id: 2,
      name: "The Vanguard",
      price: "$8,900",
      priceNum: 8900,
      metal: "18k Rose Gold",
      image: eternallyDesired2,
    },
    {
      id: 3,
      name: "Lumina Letter",
      price: "$2,750",
      priceNum: 2750,
      metal: "18k Yellow Gold",
      image: eternallyDesired3,
    },
    {
      id: 4,
      name: "Aura Everyday",
      price: "$4,200",
      priceNum: 4200,
      metal: "Platinum",
      image: eternallyDesired4,
    },
  ],
  "home-featured-collections",
);
const homeNewArrivals = withScopedProductIds(
  [
    {
      id: 10,
      name: "Sapphire Cushion Ring",
      price: "$4,800",
      priceNum: 4800,
      metal: "Platinum Â· Cushion Cut",
      tag: "NEW",
      image: justUnveiledBlue,
    },
    {
      id: 11,
      name: "Sapphire Cushion Pendant",
      price: "$5,200",
      priceNum: 5200,
      metal: "18k White Gold",
      tag: "NEW",
      image: sapphirePendantImg,
    },
    {
      id: 12,
      name: "Sapphire Cushion Earrings",
      price: "$5,950",
      priceNum: 5950,
      metal: "Platinum Â· Pair",
      tag: "EXCLUSIVE",
      image: sapphireEarringsImg,
    },
  ],
  "home-new-arrivals",
);
export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(
    () => sessionStorage.getItem("uj_currentPage") || "home",
  );
  const [appointmentMode, setAppointmentMode] = useState("standard");
  const [selectedProduct, setSelectedProduct] = useState(() => {
    const saved = sessionStorage.getItem("uj_selectedProduct");
    return saved ? JSON.parse(saved) : null;
  });
  const [productBackPage, setProductBackPage] = useState(
    () => sessionStorage.getItem("uj_productBackPage") || "home",
  );
  const [productHistory, setProductHistory] = useState(() => {
    const saved = sessionStorage.getItem("uj_productHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [savedScrollPos, setSavedScrollPos] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userInitial, setUserInitial] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSilverModalOpen, setIsSilverModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addedIds, setAddedIds] = useState(new Set());
  const [orders, setOrders] = useState([
    {
      id: "ORD-993-841",
      date: "October 12, 2025",
      status: "Delivered",
      total: "$12,450",
      item: "Lumière Diamond Choker",
      image:
        "https://images.unsplash.com/photo-1770721478216-3e5dbbe8dcc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwbmVja2xhY2UlMjBvbiUyMG1vZGVsfGVufDF8fHx8MTc3NTczMzIxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "ORD-842-109",
      date: "July 04, 2025",
      status: "Delivered",
      total: "$8,900",
      item: "Eclipse Onyx Ring",
      image:
        "https://images.unsplash.com/photo-1737314418233-c61ff046e647?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvbnl4JTIwcmluZyUyMG9uJTIwZmluZ2VyfGVufDF8fHx8MTc3NTczMzIxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ]);
  const [userAddresses, setUserAddresses] = useState([]);
  const [profileInitialTab, setProfileInitialTab] = useState("overview");
  const [activeCategory, setActiveCategory] = useState(
    () => sessionStorage.getItem("uj_activeCategory") || null,
  );
  const [activeCollection, setActiveCollection] = useState(
    () => sessionStorage.getItem("uj_activeCollection") || null,
  );
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [dbProducts, setDbProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [dbCollections, setDbCollections] = useState([]);
  const [dbEditorials, setDbEditorials] = useState([]);
  const [dbDiamondEdit, setDbDiamondEdit] = useState([]);
  const [dbJustUnveiled, setDbJustUnveiled] = useState([]);
  const [dbServices, setDbServices] = useState([]);
  const [dbInstagramPosts, setDbInstagramPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [categorySliderIndex, setCategorySliderIndex] = useState(0);
  const [featuredSliderIndex, setFeaturedSliderIndex] = useState(0);
  const [dynamicBanner, setDynamicBanner] = useState({
    title: "Unicorn Jewels",
    subtitle: "Sustainable spark. Soulful shine.",
    description:
      "Discover our newest collection of handcrafted jewelry, where every piece tells a story of exceptional artistry and enduring beauty.",
    imageUrl: heroImage,
  });
  const [homeVisionSection, setHomeVisionSection] = useState(() =>
    cloneContent(defaultPageContent["home-vision-section"]),
  );
  const [phonepeSuccess, setPhonepeSuccess] = useState(
    () => sessionStorage.getItem("uj_phonepeSuccess") === "true",
  );
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  const handleSetPhonepeSuccess = (val) => {
    setPhonepeSuccess(val);
    if (val) {
      sessionStorage.setItem("uj_phonepeSuccess", "true");
    } else {
      sessionStorage.removeItem("uj_phonepeSuccess");
    }
  };

  const [trackedOrderId, setTrackedOrderId] = useState(
    () => sessionStorage.getItem("uj_trackedOrderId") || "",
  );

  const handleSetTrackedOrderId = (id) => {
    setTrackedOrderId(id);
    if (id) {
      sessionStorage.setItem("uj_trackedOrderId", id);
    } else {
      sessionStorage.removeItem("uj_trackedOrderId");
    }
  };

  // Sync state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("uj_currentPage", currentPage);
  }, [currentPage]);
  useEffect(() => {
    if (selectedProduct)
      sessionStorage.setItem(
        "uj_selectedProduct",
        JSON.stringify(selectedProduct),
      );
    else sessionStorage.removeItem("uj_selectedProduct");
  }, [selectedProduct]);
  useEffect(() => {
    sessionStorage.setItem("uj_productBackPage", productBackPage);
  }, [productBackPage]);
  useEffect(() => {
    sessionStorage.setItem("uj_productHistory", JSON.stringify(productHistory));
  }, [productHistory]);
  useEffect(() => {
    if (activeCategory)
      sessionStorage.setItem("uj_activeCategory", activeCategory);
    else sessionStorage.removeItem("uj_activeCategory");
  }, [activeCategory]);
  useEffect(() => {
    if (activeCollection)
      sessionStorage.setItem("uj_activeCollection", activeCollection);
    else sessionStorage.removeItem("uj_activeCollection");
  }, [activeCollection]);

  // Handle Deep Linking to Order Tracking from Email
  useEffect(() => {
    const trackOrderIdParam = searchParams.get("track_order_id");
    if (trackOrderIdParam) {
      console.log(`Deep linking to track order page for order ID: ${trackOrderIdParam}`);
      // Clear the search param so refreshes don't lock the view
      const updatedParams = new URLSearchParams(searchParams);
      updatedParams.delete("track_order_id");
      setSearchParams(updatedParams, { replace: true });
      
      // Navigate to tracking page
      handleSetTrackedOrderId(trackOrderIdParam);
      setCurrentPage("track-order");
      window.scrollTo(0, 0);
    }
  }, [searchParams, setSearchParams]);

  // Handle PhonePe Redirect Callback
  useEffect(() => {
    const checkPhonePeStatus = async () => {
      const phonepeOrderId = searchParams.get("phonepe_order_id");

      if (phonepeOrderId) {
        setIsVerifyingPayment(true);
        try {
          // Remove query params from browser URL using searchParams so page refreshes don't re-trigger verification
          const updatedParams = new URLSearchParams(searchParams);
          updatedParams.delete("phonepe_order_id");
          setSearchParams(updatedParams, { replace: true });

          console.log(`Verifying PhonePe payment for order ${phonepeOrderId}`);
          const response = await fetch(
            `http://localhost:5000/api/payment/phonepe/status/${phonepeOrderId}`,
          );
          const data = await response.json();

          if (response.ok && data.success) {
            console.log("✅ PhonePe Payment Verified successfully!");
            handleSetPhonepeSuccess(true);
            handleSetTrackedOrderId(phonepeOrderId);
            setCartItems([]);
            setAddedIds(new Set());
            setCurrentPage("checkout");

            // Re-fetch user orders to show the new order in their profile immediately
            const savedUser = localStorage.getItem("unicorn_jewels_user");
            if (savedUser) {
              const user = JSON.parse(savedUser);
              const ordersResponse = await fetch(
                `http://localhost:5000/api/auth/user-orders/${user.id}`,
              );
              if (ordersResponse.ok) {
                const backendOrders = await ordersResponse.json();
                const formattedOrders = backendOrders.map((o) => ({
                  id: o.order_id,
                  date: new Date(o.order_date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }),
                  status: o.status,
                  refundStatus: o.refund_status,
                  refundId: o.refund_id,
                  total: o.price,
                  item: o.product_name,
                  image: o.image_url,
                  productId: o.product_id,
                  quantity: o.quantity || 1,
                  selectedSize: o.selected_size || "",
                  cancellationReason: o.cancellation_reason || "",
                  timestamp: new Date(o.order_date).getTime(),
                }));
                setOrders(formattedOrders);
              }
            }
          } else {
            console.error(
              "❌ PhonePe Payment verification failed:",
              data.message || "Payment was not completed.",
            );
            alert(
              data.message || "Payment verification failed. Please try again.",
            );
          }
        } catch (error) {
          console.error("Error verifying PhonePe payment:", error);
          alert("Network error while verifying payment status.");
        } finally {
          setIsVerifyingPayment(false);
        }
      }
    };

    checkPhonePeStatus();
  }, [searchParams, setSearchParams]);

  // Disable browser scroll restoration so it doesn't fight us
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Scroll to top of hero section on every page change (covers refresh + navigation)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [currentPage]);

  // Restore session on mount WITHOUT resetting page (page is already restored from sessionStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem("unicorn_jewels_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Restore user identity only — do NOT call handleAuthSuccess (it resets page to home)
        setIsLoggedIn(true);
        setCurrentUser(user);
        setUserInitial(user.firstName[0].toUpperCase());
        // Fetch orders silently in background
        fetch(`http://localhost:5000/api/auth/user-orders/${user.id}`)
          .then((r) => (r.ok ? r.json() : []))
          .then((backendOrders) => {
            const formattedOrders = backendOrders.map((o) => ({
              id: o.order_id,
              date: new Date(o.order_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              status: o.status,
              total: o.price,
              item: o.product_name,
              image: o.image_url,
              productId: o.product_id,
              quantity: o.quantity || 1,
              selectedSize: o.selected_size || "",
              cancellationReason: o.cancellation_reason || "",
              timestamp: new Date(o.order_date).getTime(),
            }));
            setOrders(formattedOrders);
          })
          .catch((err) => console.error("Failed to fetch orders:", err));
        // Fetch addresses silently
        fetch(`http://localhost:5000/api/auth/user-addresses/${user.id}`)
          .then((r) => (r.ok ? r.json() : []))
          .then(setUserAddresses)
          .catch((err) => console.error("Failed to fetch addresses:", err));
      } catch (err) {
        console.error("Failed to restore session:", err);
        localStorage.removeItem("unicorn_jewels_user");
      }
    }
  }, []);

  useEffect(() => {
    const getPageKey = () => {
      if (currentPage === "home") return "home";
      if (currentPage === "category" && activeCategory)
        return activeCategory.toLowerCase();
      if (currentPage === "collection" && activeCollection)
        return activeCollection.toLowerCase();
      if (currentPage === "story") return "story";
      if (currentPage === "gift-guide") return "gift-guide";
      if (currentPage === "appointment") return "appointment";
      return "home";
    };

    const pageKey = getPageKey();

    // Set immediate defaults while fetching to avoid showing previous page's banner
    if (pageKey === "home") {
      setDynamicBanner({
        title: "Unicorn Jewels",
        subtitle: "Sustainable spark. Soulful shine.",
        description:
          "Discover our newest collection of handcrafted jewelry, where every piece tells a story of exceptional artistry and enduring beauty.",
        imageUrl: heroImage,
      });
    } else if (pageKey === "appointment") {
      setDynamicBanner({
        title: "Your Visit",
        subtitle: "",
        description: "",
        imageUrl:
          "https://images.unsplash.com/photo-1610187390406-9d24b55ea697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwbG9nbyUyMGpld2VscnklMjBicmFuZHxlbnwxfHx8fDE3NzY3NjUzMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      });
    } else {
      setDynamicBanner({
        title: "",
        subtitle: "",
        description: "",
        imageUrl: "",
      });
    }

    // Fetch dynamic banner content for the specific page
    fetch(`http://localhost:5000/api/content/banner/${pageKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.page_key) {
          setDynamicBanner({
            title: data.title || "",
            subtitle: data.subtitle || "",
            description: data.description || "",
            imageUrl: data.image_url
              ? data.image_url.startsWith("http")
                ? data.image_url
                : `http://localhost:5000${data.image_url}`
              : pageKey === "home"
                ? heroImage
                : pageKey === "appointment"
                  ? "https://images.unsplash.com/photo-1610187390406-9d24b55ea697?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwbG9nbyUyMGpld2VscnklMjBicmFuZHxlbnwxfHx8fDE3NzY3NjUzMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  : "",
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching banner:", err);
      });
  }, [currentPage, activeCategory, activeCollection]);

  useEffect(() => {
    const fetchHomeVisionSection = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/content/page-content/home-vision-section",
        );
        if (!response.ok) {
          throw new Error("Failed to fetch home vision section");
        }

        const data = await response.json();
        setHomeVisionSection(
          mergeWithDefaults(defaultPageContent["home-vision-section"], data),
        );
      } catch (error) {
        console.error("Error fetching home vision section:", error);
      }
    };

    fetchHomeVisionSection();
  }, []);

  useEffect(() => {
    // Fetch products, categories, and collections
    const fetchStoreData = async () => {
      try {
        const [prodRes, catRes, collRes, editRes, diamondRes, justUnveiledRes] =
          await Promise.all([
            fetch("http://localhost:5000/api/products"),
            fetch("http://localhost:5000/api/categories"),
            fetch("http://localhost:5000/api/collections"),
            fetch("http://localhost:5000/api/editorials"),
            fetch("http://localhost:5000/api/diamond-edit"),
            fetch("http://localhost:5000/api/just-unveiled"),
          ]);

        const [prods, cats, colls, edits, diamondItems, justUnveiledItems] =
          await Promise.all([
            prodRes.json(),
            catRes.json(),
            collRes.json(),
            editRes.json(),
            diamondRes.json(),
            justUnveiledRes.json(),
          ]);

        const servicesRes = await fetch("http://localhost:5000/api/services");
        const servicesItems = await servicesRes.json();

        const instaRes = await fetch("http://localhost:5000/api/instagram");
        const instaPosts = await instaRes.json();

        setDbProducts(prods);
        setDbCategories(cats);
        setDbCollections(colls);
        setDbEditorials(edits);
        setDbDiamondEdit(diamondItems);
        setDbJustUnveiled(justUnveiledItems);
        setDbServices(servicesItems);
        setDbInstagramPosts(instaPosts);
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStoreData();
  }, []);

  const productIndex = useMemo(() => {
    const allProducts = [
      ...dbProducts,
      ...Object.entries(catalogue)
        .filter(([name]) => name !== "Jewelry")
        .flatMap(([, section]) => section.products),
      ...Object.values(collectionsData).flatMap((section) => section.products),
      ...featuredCollectionCards,
      ...homeNewArrivals,
    ];
    return buildProductIndex(allProducts);
  }, [dbProducts]);
  const wishlistItems = useMemo(
    () =>
      Array.from(wishlist)
        .map((id) => productIndex.get(id))
        .filter(Boolean),
    [wishlist, productIndex],
  );

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    const allProductsList = Array.from(productIndex.values());
    const uniqueProducts = [];
    const seenIds = new Set();
    for (const p of allProductsList) {
      if (p && p.id && !seenIds.has(p.id)) {
        seenIds.add(p.id);
        uniqueProducts.push(p);
      }
    }
    return uniqueProducts.filter((p) => {
      const nameMatch = (p.name || "").toLowerCase().includes(query);
      const descMatch = (p.description || "").toLowerCase().includes(query);
      const metalMatch = (p.metal || "").toLowerCase().includes(query);
      const categoryMatch = (p.category || "").toLowerCase().includes(query);
      return nameMatch || descMatch || metalMatch || categoryMatch;
    });
  }, [searchQuery, productIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    if (searchOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const renderSearchOverlay = () => {
    return (
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col pt-24 px-6 md:px-12 pb-12 overflow-y-auto"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <div className="absolute top-6 right-6 md:top-10 md:right-12 z-10">
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white/50 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer bg-black/40 hover:bg-black/60"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
              <div className="relative border-b border-white/20 pb-4 mb-12">
                <input
                  type="text"
                  placeholder="SEARCH OUR COLLECTIONS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-white text-3xl md:text-5xl font-light tracking-widest outline-none border-none placeholder-white/30 uppercase"
                />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 w-6 h-6 md:w-8 md:h-8" />
              </div>

              <div className="flex-1">
                {searchQuery.trim() === "" ? (
                  <div className="text-center text-white/40 py-20 font-light tracking-widest text-lg uppercase">
                    START TYPING TO FIND PRODUCTS, METALS, OR STYLES...
                  </div>
                ) : (
                  <>
                    <div className="text-white/60 text-xs tracking-[0.2em] uppercase mb-8">
                      {filteredProducts.length}{" "}
                      {filteredProducts.length === 1 ? "RESULT" : "RESULTS"}{" "}
                      FOUND
                    </div>

                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {filteredProducts.map((product) => {
                          const productImg = product.image_url
                            ? product.image_url.startsWith("http")
                              ? product.image_url
                              : `http://localhost:5000${product.image_url}`
                            : product.image || eternallyDesired1;

                          return (
                            <div
                              key={product.id}
                              onClick={() => {
                                openProductPage(product);
                                setSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="group cursor-pointer flex flex-col h-full bg-neutral-900/40 border border-white/5 p-4 transition-all duration-300 hover:border-white/20 hover:bg-neutral-900/60"
                            >
                              <div className="aspect-square w-full overflow-hidden bg-neutral-950 mb-4 relative">
                                <ImageWithFallback
                                  src={productImg}
                                  alt={product.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <h4 className="text-white/95 text-base md:text-lg font-light tracking-wide mb-1 line-clamp-1 group-hover:text-white transition-colors">
                                {product.name}
                              </h4>
                              {product.metal && (
                                <p className="text-white/40 text-[10px] md:text-xs tracking-[0.15em] uppercase mb-2">
                                  {product.metal}
                                </p>
                              )}
                              <p className="text-[#C0C0C0] text-sm md:text-base font-light mt-auto">
                                {product.price ||
                                  (product.priceNum
                                    ? `$${product.priceNum.toLocaleString()}`
                                    : "")}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-white/40 py-20 font-light tracking-widest text-lg uppercase">
                        No products match "{searchQuery}"
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const openProfileTab = (tab = "overview") => {
    if (!isLoggedIn) {
      setCurrentPage("login");
      return;
    }
    setProfileInitialTab(tab);
    setAccountDropdownOpen(false);
    setCurrentPage("profile");
    window.scrollTo(0, 0);
  };
  const toggleWishlist = (id) => {
    if (!isLoggedIn) {
      setCurrentPage("login");
      return;
    }
    setWishlist((prev) => {
      const nextWishlist = new Set(prev);
      if (nextWishlist.has(id)) {
        nextWishlist.delete(id);
      } else {
        nextWishlist.add(id);
      }
      return nextWishlist;
    });
  };
  const addToCart = (item, selectedSize, sizeStock) => {
    if (!isLoggedIn) {
      setCurrentPage("login");
      return;
    }
    const cartSize = selectedSize || item.selectedSize || "";
    const cartStock =
      sizeStock !== undefined
        ? sizeStock
        : item.sizeStock !== undefined
          ? item.sizeStock
          : item.stock;

    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && (i.selectedSize || "") === cartSize,
      );
      if (existing) {
        if (
          cartStock !== undefined &&
          cartStock !== null &&
          existing.quantity >= cartStock
        ) {
          alert(`You can only purchase up to ${cartStock} items of this size.`);
          return prev;
        }
        return prev.map((i) =>
          i.id === item.id && (i.selectedSize || "") === cartSize
            ? {
                ...i,
                quantity: i.quantity + 1,
              }
            : i,
        );
      }
      return [
        ...prev,
        {
          ...item,
          selectedSize: cartSize,
          sizeStock: cartStock,
          quantity: 1,
        },
      ];
    });
    setAddedIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const s = new Set(prev);
        s.delete(item.id);
        return s;
      });
    }, 1600);
    setCartOpen(true);
  };
  const updateQty = (id, qty, selectedSize) => {
    const cartSize = selectedSize || "";
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.id === id && (i.selectedSize || "") === cartSize) {
          const maxStock =
            i.sizeStock !== undefined && i.sizeStock !== null
              ? i.sizeStock
              : i.stock;
          const targetQty =
            maxStock !== undefined && maxStock !== null
              ? Math.min(qty, maxStock)
              : qty;
          return {
            ...i,
            quantity: targetQty,
          };
        }
        return i;
      }),
    );
  };
  const removeFromCart = (id, selectedSize) => {
    const cartSize = selectedSize || "";
    setCartItems((prev) =>
      prev.filter((i) => !(i.id === id && (i.selectedSize || "") === cartSize)),
    );
  };
  const openProductPage = (
    product,
    backPage = currentPage,
    scrollPos = window.scrollY,
  ) => {
    if (currentPage === "product" && selectedProduct?.id === product.id) {
      setCartOpen(false);
      return;
    }
    if (currentPage === "product" && selectedProduct) {
      setProductHistory((prev) => [
        ...prev,
        {
          product: selectedProduct,
          backPage: productBackPage,
          scrollPos: savedScrollPos,
        },
      ]);
    } else {
      setProductHistory([]);
    }
    setSavedScrollPos(scrollPos);
    setSelectedProduct(product);
    setProductBackPage(backPage);
    setCartOpen(false);
    setCurrentPage("product");
    window.scrollTo(0, 0);
  };
  const openCartProductPage = (product) => {
    const backPage = currentPage === "product" ? productBackPage : currentPage;
    const scrollPos =
      currentPage === "product" ? savedScrollPos : window.scrollY;
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
  const openAppointment = (mode = "standard") => {
    setAppointmentMode(mode);
    setCurrentPage("appointment");
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserInitial("");
    setOrders([]);
    localStorage.removeItem("unicorn_jewels_user");
    sessionStorage.removeItem("uj_phonepeSuccess");
    sessionStorage.removeItem("uj_trackedOrderId");
    setTrackedOrderId("");
    setAccountDropdownOpen(false);
    setCurrentPage("home");
  };

  const handleCancelOrder = async (orderId, cancellationReason) => {
    if (!cancellationReason?.trim()) {
      alert("Please select a cancellation reason.");
      return { success: false };
    }
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Cancelled",
          cancellationReason: cancellationReason.trim(),
        }),
      });
      if (response.ok) {
        // Re-fetch user orders to ensure state (refund status, refund ID, tracking) is accurate
        const savedUser = localStorage.getItem("unicorn_jewels_user");
        if (savedUser) {
          const user = JSON.parse(savedUser);
          const ordersResponse = await fetch(
            `http://localhost:5000/api/auth/user-orders/${user.id}`,
          );
          if (ordersResponse.ok) {
            const backendOrders = await ordersResponse.json();
            const formattedOrders = backendOrders.map((o) => ({
              id: o.order_id,
              date: new Date(o.order_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              status: o.status,
              refundStatus: o.refund_status,
              refundId: o.refund_id,
              total: o.price,
              item: o.product_name,
              image: o.image_url,
              productId: o.product_id,
              quantity: o.quantity || 1,
              selectedSize: o.selected_size || "",
              cancellationReason: o.cancellation_reason || "",
              timestamp: new Date(o.order_date).getTime(),
            }));
            setOrders(formattedOrders);
          }
        } else {
          setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: "Cancelled", cancellationReason: cancellationReason.trim() } : o))
          );
        }
        alert("Order cancelled successfully.");
        return { success: true };
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to cancel order.");
        return { success: false };
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("An error occurred while cancelling the order.");
      return { success: false };
    }
  };

  // Render auth pages
  const handleAuthSuccess = async (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setUserInitial(user.firstName[0].toUpperCase());
    localStorage.setItem("unicorn_jewels_user", JSON.stringify(user));
    setCurrentPage("home");

    // Fetch orders from backend
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/user-orders/${user.id}`,
      );
      if (response.ok) {
        const backendOrders = await response.json();
        const formattedOrders = backendOrders.map((o) => ({
          id: o.order_id,
          date: new Date(o.order_date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
          status: o.status,
          refundStatus: o.refund_status,
          refundId: o.refund_id,
          total: o.price,
          item: o.product_name,
          image: o.image_url,
          productId: o.product_id,
          quantity: o.quantity || 1,
          selectedSize: o.selected_size || "",
          cancellationReason: o.cancellation_reason || "",
          timestamp: new Date(o.order_date).getTime(),
        }));
        setOrders(formattedOrders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }

    // Fetch addresses from backend
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/user-addresses/${user.id}`,
      );
      if (response.ok) {
        const backendAddresses = await response.json();
        setUserAddresses(backendAddresses);
      }
    } catch (err) {
      console.error("Failed to fetch addresses:", err);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/update-profile",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            ...updatedData,
          }),
        },
      );
      if (response.ok) {
        setCurrentUser((prev) => ({ ...prev, ...updatedData }));
        setUserInitial(updatedData.firstName[0].toUpperCase());
        return { success: true };
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
    return { success: false };
  };

  const handleAddAddress = async (addressData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/user-addresses",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            ...addressData,
          }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        // Re-fetch addresses to ensure state is correct (especially primary flag)
        const refreshResponse = await fetch(
          `http://localhost:5000/api/auth/user-addresses/${currentUser.id}`,
        );
        if (refreshResponse.ok) {
          const freshAddresses = await refreshResponse.json();
          setUserAddresses(freshAddresses);
        }
        return { success: true };
      }
    } catch (err) {
      console.error("Failed to add address:", err);
    }
    return { success: false };
  };

  const handleUpdateAddress = async (addressId, addressData) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/user-addresses/${addressId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            ...addressData,
          }),
        },
      );
      if (response.ok) {
        const refreshResponse = await fetch(
          `http://localhost:5000/api/auth/user-addresses/${currentUser.id}`,
        );
        if (refreshResponse.ok) {
          const freshAddresses = await refreshResponse.json();
          setUserAddresses(freshAddresses);
        }
        return { success: true };
      }
    } catch (err) {
      console.error("Failed to update address:", err);
    }
    return { success: false };
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/user-addresses/${addressId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        setUserAddresses((prev) => prev.filter((a) => a.id !== addressId));
        return { success: true };
      }
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
    return { success: false };
  };

  if (currentPage === "login") {
    return (
      <LoginPage
        onBack={() => setCurrentPage("home")}
        onGoToSignup={() => setCurrentPage("signup")}
        onSuccess={handleAuthSuccess}
      />
    );
  }
  if (currentPage === "signup") {
    return (
      <SignUpPage
        onBack={() => setCurrentPage("home")}
        onGoToLogin={() => setCurrentPage("login")}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  if (currentPage === "product" && selectedProduct) {
    return (
      <>
        {/* Sticky navbar on product page */}
        <div
          className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={goBackFromProduct}
              className="text-xs tracking-[0.25em] uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2"
            >
              <span>← Back</span>
            </button>
            <div
              className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo(0, 0);
              }}
            >
              <ImageWithFallback
                src={logoImage}
                alt="Unicorn Jewels Logo"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-5">
              <div className="relative">
                {accountDropdownOpen && isLoggedIn && (
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setAccountDropdownOpen(false)}
                  />
                )}
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setAccountDropdownOpen(!accountDropdownOpen);
                    } else {
                      setCurrentPage("login");
                    }
                  }}
                  className="hover:text-gray-500 transition-colors flex items-center gap-2 cursor-pointer"
                  aria-label="Account"
                >
                  {isLoggedIn ? (
                    <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-sans">
                      {userInitial}
                    </div>
                  ) : (
                    <User size={18} />
                  )}
                </button>

                {/* Account Dropdown */}
                {accountDropdownOpen && isLoggedIn && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="absolute right-0 top-[calc(100%+16px)] w-48 bg-white border border-gray-200 shadow-xl z-[100] py-2 font-sans"
                  >
                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        setCurrentPage("profile");
                      }}
                      className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-black hover:bg-gray-50 transition-colors"
                    >
                      My Account
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
                {/* Account Dropdown end */}
              </div>

              <button
                onClick={() => setSearchOpen(true)}
                className="hover:text-gray-500 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <button
                onClick={() => openProfileTab("wishlist")}
                className="hover:text-gray-500 transition-colors cursor-pointer"
                aria-label="Wishlist"
              >
                <Heart
                  size={18}
                  className={wishlist.size > 0 ? "fill-black" : "fill-none"}
                  stroke={wishlist.size > 0 ? "black" : "currentColor"}
                />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="hover:text-gray-500 transition-colors relative cursor-pointer"
                aria-label="Shopping bag"
              >
                <ShoppingBag size={18} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <ProductPage
          product={selectedProduct}
          onBack={goBackFromProduct}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          addedIds={addedIds}
          onProductClick={(p) => openProductPage(p, "product")}
          onBookAppointment={() => {
            setAppointmentMode("standard");
            setCurrentPage("appointment");
          }}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          addedIds={addedIds}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          onCheckout={() => setCurrentPage("checkout")}
          onProductClick={openCartProductPage}
        />
        {renderSearchOverlay()}
      </>
    );
  }
  if (currentPage === "story") {
    return (
      <OurStoryPage
        onBack={() => {
          window.scrollTo(0, 0);
          setCurrentPage("home");
        }}
        bannerContent={dynamicBanner}
      />
    );
  }
  if (currentPage === "gift-guide") {
    return (
      <GiftGuidePage
        onBack={() => {
          window.scrollTo(0, 0);
          setCurrentPage("home");
        }}
        bannerContent={dynamicBanner}
      />
    );
  }
  const handleDownloadReceipt = (order) => {
    const doc = new jsPDF();

    // Find matching product in state
    const matchedProduct =
      dbProducts.find((p) => String(p.id) === String(order.productId)) || {};

    // 1. BRAND HEADER
    // Set gold color for brand accents: RGB 201, 166, 107 (#C9A66B)
    doc.setTextColor(30, 30, 30); // Very dark gray for clean text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.text("UNICORN JEWELS", 105, 25, { align: "center" });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Sustainable spark. Soulful shine.", 105, 31, { align: "center" });

    // Accent gold separator line
    doc.setDrawColor(201, 166, 107);
    doc.setLineWidth(0.8);
    doc.line(20, 37, 190, 37);

    // 2. RECEIPT TITLE & META METADATA
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("RECEIPT / PROOF OF PURCHASE", 20, 48);

    // Left Metadata Block: Customer Details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("BILLED TO:", 20, 58);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    const clientName = currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`
      : "Valued Customer";
    const clientEmail = currentUser
      ? currentUser.email
      : "concierge@unicornjewels.com";
    doc.text(clientName, 20, 64);
    doc.text(clientEmail, 20, 70);

    // Right Metadata Block: Order Details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("ORDER DETAILS:", 120, 58);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(`Order ID: ${order.id}`, 120, 64);
    doc.text(`Date: ${order.date}`, 120, 70);
    const displayStatus =
      order.status === "Processing" ||
      order.status === "Shipped" ||
      order.status === "Delivered"
        ? "Paid"
        : order.status;
    doc.text(`Payment Status: ${displayStatus}`, 120, 76);

    // Deduce payment method from Order ID pattern
    const payMethod =
      order.id && order.id.startsWith("ORD-PP")
        ? "PhonePe Sandbox (UAT)"
        : "Simulated Credit Card";
    doc.text(`Payment Method: ${payMethod}`, 120, 82);

    // Separator line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90);

    // 3. PRODUCT SPECIFICATIONS SECTION
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(201, 166, 107); // Gold
    doc.text("PRODUCT SPECIFICATIONS", 20, 99);

    // Spec Table headers background
    doc.setFillColor(248, 248, 248);
    doc.rect(20, 104, 170, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text("SPECIFICATION", 25, 109.5);
    doc.text("DETAILS", 75, 109.5);

    // Spec rows
    const specs = [
      { label: "Product Name", value: order.item },
      { label: "Variant Size", value: order.selectedSize || "Standard" },
      {
        label: "Metal Type",
        value: matchedProduct.metal || "18k Yellow Gold (Default)",
      },
      {
        label: "Total Weight",
        value: matchedProduct.weight
          ? `${matchedProduct.weight} ct`
          : "0.30 ct (Default)",
      },
      { label: "Barcode (SKU)", value: matchedProduct.barcode || "N/A" },
      { label: "Quantity", value: String(order.quantity || 1) },
    ];

    let yPos = 117;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);

    specs.forEach((spec, idx) => {
      // Background shading for alternating rows
      if (idx % 2 === 1) {
        doc.setFillColor(252, 252, 252);
        doc.rect(20, yPos - 4.5, 170, 6.5, "F");
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(120, 120, 120);
      doc.text(spec.label, 25, yPos);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(spec.value, 75, yPos);

      yPos += 7;
    });

    // Thin line
    doc.setDrawColor(240, 240, 240);
    doc.line(20, yPos - 1.5, 190, yPos - 1.5);
    yPos += 5;

    // 4. PRODUCT DESCRIPTION
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("PRODUCT DESCRIPTION:", 25, yPos);
    yPos += 5.5;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 80);
    const descText =
      matchedProduct.description ||
      "A signature creation showcasing our dedication to sustainable elegance and master-crafted design. Each stone is ethically curated and set by hand.";
    const wrappedDescLines = doc.splitTextToSize(descText, 160);
    wrappedDescLines.forEach((line) => {
      doc.text(line, 25, yPos);
      yPos += 4.5;
    });

    yPos += 4;

    // Separator line
    doc.setDrawColor(201, 166, 107);
    doc.setLineWidth(0.8);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // 5. PRICING SUMMARY (Right-aligned)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("TOTAL AMOUNT PAID:", 125, yPos, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 30, 30);
    doc.text(order.total, 190, yPos, { align: "right" });

    // 6. BRAND FOOTER
    // Use a fixed bottom position for standard brand signature
    const footerY = 270;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(20, footerY - 10, 190, footerY - 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Thank you for choosing Unicorn Jewels.", 105, footerY - 3, {
      align: "center",
    });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "For bespoke modifications or concierge inquiries, contact concierge@unicornjewels.com",
      105,
      footerY + 2,
      { align: "center" },
    );

    // Save generated PDF
    doc.save(`Receipt_${order.id}.pdf`);
  };

  if (currentPage === "profile") {
    return (
      <>
        <ProfilePage
          onBack={() => setCurrentPage("home")}
          onLogout={handleLogout}
          userInitial={userInitial || "E"}
          user={currentUser}
          initialTab={profileInitialTab}
          wishlist={wishlist}
          wishlistItems={wishlistItems}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          onProductClick={(p) => openProductPage(p, "profile")}
          orders={orders}
          addresses={userAddresses}
          onUpdateProfile={async (data) => {
            const res = await handleUpdateProfile(data);
            if (res.success) {
              // Update localStorage with new user data
              const updatedUser = { ...currentUser, ...data };
              localStorage.setItem(
                "unicorn_jewels_user",
                JSON.stringify(updatedUser),
              );
            }
            return res;
          }}
          onAddAddress={handleAddAddress}
          onUpdateAddress={handleUpdateAddress}
          onDeleteAddress={handleDeleteAddress}
          onTrackShipment={(order) => {
            handleSetTrackedOrderId(order.id);
            setCurrentPage("track-order");
            window.scrollTo(0, 0);
          }}
          onDownloadReceipt={handleDownloadReceipt}
          onCancelOrder={handleCancelOrder}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          addedIds={addedIds}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          onCheckout={() => setCurrentPage("checkout")}
          onProductClick={openCartProductPage}
        />
      </>
    );
  }
  if (currentPage === "appointment") {
    return (
      <AppointmentPage
        mode={appointmentMode}
        bannerContent={dynamicBanner}
        onBack={() => {
          setAppointmentMode("standard");
          setCurrentPage("home");
        }}
      />
    );
  }
  if (currentPage === "track-order") {
    return (
      <TrackOrderPage
        initialOrderId={trackedOrderId || undefined}
        onBack={() => {
          window.scrollTo(0, 0);
          setCurrentPage("profile");
        }}
      />
    );
  }
  if (currentPage === "checkout") {
    return (
      <CheckoutPage
        items={cartItems}
        onBack={() => {
          handleSetPhonepeSuccess(false);
          setCurrentPage("home");
        }}
        initialIsComplete={phonepeSuccess}
        onPhonePeCheckout={async (total) => {
          try {
            console.log(`Initiating PhonePe payment for amount: ${total} USD`);
            const response = await fetch(
              "http://localhost:5000/api/payment/phonepe/initiate",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: currentUser?.id,
                  amount: total,
                  items: cartItems.map((item) => ({
                    id: item.id,
                    name: item.name,
                    priceNum: item.priceNum,
                    quantity: item.quantity,
                    image: item.image,
                    selectedSize: item.selectedSize || "",
                  })),
                }),
              },
            );

            if (!response.ok) {
              throw new Error("Failed to initiate payment");
            }

            const data = await response.json();
            if (data.redirectUrl) {
              console.log(
                `Redirecting to PhonePe checkout URL: ${data.redirectUrl}`,
              );
              window.location.href = data.redirectUrl;
            } else {
              alert("Error: PhonePe checkout URL not received.");
            }
          } catch (err) {
            console.error("PhonePe payment initiation failed:", err);
            alert("Unable to initiate PhonePe payment. Please try again.");
          }
        }}
        onCompletePurchase={async () => {
          const orderIdShared = `ORD-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}`;
          const newOrders = cartItems.map((item) => ({
            id: orderIdShared,
            date: new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            status: "Processing",
            total: new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(item.priceNum * item.quantity),
            item: item.name,
            image: item.image,
            productId: item.id,
            quantity: item.quantity,
            selectedSize: item.selectedSize || "",
            timestamp: Date.now(),
          }));

          // Reduce stock for all items
          try {
            const stockItems = cartItems.map((item) => ({
              id: item.id,
              quantity: item.quantity,
              selectedSize: item.selectedSize || "",
            }));
            await fetch("http://localhost:5000/api/products/reduce-stock", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: stockItems }),
            });
          } catch (err) {
            console.error("Failed to reduce stock:", err);
          }

          // If user is logged in, save to backend using the consolidated API
          if (isLoggedIn && currentUser) {
            try {
              const response = await fetch("http://localhost:5000/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: currentUser.id,
                  orderId: orderIdShared,
                  items: newOrders.map(o => ({
                    productName: o.item,
                    price: o.total,
                    imageUrl: o.image,
                    status: o.status,
                    productId: o.productId,
                    quantity: o.quantity,
                    selectedSize: o.selectedSize
                  }))
                })
              });
              if (!response.ok) {
                console.error("Failed to save order to backend:", await response.text());
              }
            } catch (err) {
              console.error("Failed to save order to backend:", err);
            }
          }

          setOrders((prev) => [...newOrders, ...prev]);
          if (newOrders.length > 0) {
            handleSetTrackedOrderId(orderIdShared);
          }
          setCartItems([]);
          setAddedIds(new Set());
        }}
        onViewTracking={() => {
          handleSetPhonepeSuccess(false);
          setCurrentPage("track-order");
          window.scrollTo(0, 0);
        }}
        onContinueShopping={() => {
          handleSetPhonepeSuccess(false);
          setCurrentPage("home");
        }}
      />
    );
  }
  if (currentPage === "collection" && activeCollection) {
    return (
      <>
        {/* Sticky navbar on collection page */}
        <div
          className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage("home")}
              className="text-xs tracking-[0.25em] uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2"
            >
              <span>← Back</span>
            </button>
            <div
              className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo(0, 0);
              }}
            >
              <ImageWithFallback
                src={logoImage}
                alt="Unicorn Jewels Logo"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-5">
              <div className="relative">
                {accountDropdownOpen && isLoggedIn && (
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setAccountDropdownOpen(false)}
                  />
                )}
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setAccountDropdownOpen(!accountDropdownOpen);
                    } else {
                      setCurrentPage("login");
                    }
                  }}
                  className="relative z-[95] hover:text-gray-500 transition-colors flex items-center justify-center w-[18px] h-[18px]"
                  aria-label="Account"
                >
                  {isLoggedIn && userInitial ? (
                    <span className="text-[14px] font-medium leading-none text-gray-800">
                      {userInitial}
                    </span>
                  ) : (
                    <User size={18} />
                  )}
                </button>
                {accountDropdownOpen && isLoggedIn && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="absolute right-0 top-[calc(100%+16px)] w-40 bg-white border border-gray-100 shadow-xl py-2 z-[100]"
                  >
                    <button
                      onClick={() => {
                        setCurrentPage("profile");
                        setAccountDropdownOpen(false);
                        window.scrollTo(0, 0);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors"
                    >
                      Profile
                    </button>
                    <div className="h-[1px] bg-gray-100 my-1 w-full" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors text-red-600"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
              <button
                onClick={() => openProfileTab("wishlist")}
                className="hover:text-gray-500 transition-colors"
                aria-label="Wishlist"
              >
                <Heart
                  size={18}
                  className={wishlist.size > 0 ? "fill-black" : "fill-none"}
                  stroke={wishlist.size > 0 ? "black" : "currentColor"}
                />
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="hover:text-gray-500 transition-colors relative"
                aria-label="Shopping bag"
              >
                <ShoppingBag size={18} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-2 bg-black text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <CollectionPage
          collectionName={activeCollection}
          onBack={() => setCurrentPage("home")}
          onCollectionChange={(name) => {
            setActiveCollection(name);
            window.scrollTo({
              top: 0,
              behavior: "instant",
            });
          }}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          addedIds={addedIds}
          onProductClick={(p) => openProductPage(p, "collection")}
          dynamicBanner={dynamicBanner}
          dbProducts={dbProducts}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          addedIds={addedIds}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          onCheckout={() => setCurrentPage("checkout")}
          onProductClick={openCartProductPage}
        />
      </>
    );
  }
  if (currentPage === "category" && activeCategory) {
    return (
      <>
        {/* Sticky navbar on category page */}
        <div
          className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage("home")}
              className="text-xs tracking-[0.25em] uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2"
            >
              <span>← Back</span>
            </button>
            <div
              className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo(0, 0);
              }}
            >
              <ImageWithFallback
                src={logoImage}
                alt="Unicorn Jewels Logo"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-5">
              <div className="relative">
                {accountDropdownOpen && isLoggedIn && (
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setAccountDropdownOpen(false)}
                  />
                )}
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setAccountDropdownOpen(!accountDropdownOpen);
                    } else {
                      setCurrentPage("login");
                    }
                  }}
                  className="relative z-[95] hover:text-gray-500 transition-colors flex items-center justify-center w-[18px] h-[18px]"
                  aria-label="Account"
                >
                  {isLoggedIn && userInitial ? (
                    <span className="text-[14px] font-medium leading-none text-gray-800">
                      {userInitial}
                    </span>
                  ) : (
                    <User
                      size={18}
                      className={isLoggedIn ? "text-gray-500" : ""}
                    />
                  )}
                </button>
                {accountDropdownOpen && isLoggedIn && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="absolute right-0 top-[calc(100%+16px)] w-40 bg-white border border-gray-100 shadow-xl py-2 z-[100]"
                  >
                    <button
                      onClick={() => {
                        setCurrentPage("profile");
                        setAccountDropdownOpen(false);
                        window.scrollTo(0, 0);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors"
                    >
                      Profile
                    </button>
                    <div className="h-[1px] bg-gray-100 my-1 w-full" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors text-red-600"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
              <button
                onClick={() => setCartOpen(true)}
                className="hover:text-gray-500 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <CategoryPage
          category={activeCategory}
          onCategoryChange={setActiveCategory}
          onBack={() => setCurrentPage("home")}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          addToCart={addToCart}
          addedIds={addedIds}
          onProductClick={(p) => openProductPage(p, "category")}
          dynamicBanner={dynamicBanner}
          dbProducts={dbProducts}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          addedIds={addedIds}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          onCheckout={() => setCurrentPage("checkout")}
          onProductClick={openCartProductPage}
        />
      </>
    );
  }
  if (currentPage === "gift-guide") {
    return (
      <>
        {/* Sticky navbar on gift guide page */}
        <div
          className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage("home")}
              className="text-xs tracking-[0.25em] uppercase text-gray-500 hover:text-black transition-colors flex items-center gap-2"
            >
              <span>← Back</span>
            </button>
            <div
              className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
              onClick={() => setCurrentPage("home")}
            >
              <ImageWithFallback
                src={logoImage}
                alt="Unicorn Jewels Logo"
                className="h-12 md:h-14 w-auto object-contain"
              />
            </div>
            <div className="flex items-center gap-5">
              <div className="relative">
                {accountDropdownOpen && isLoggedIn && (
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setAccountDropdownOpen(false)}
                  />
                )}
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setAccountDropdownOpen(!accountDropdownOpen);
                    } else {
                      setCurrentPage("login");
                    }
                  }}
                  className="relative z-[95] hover:text-gray-500 transition-colors flex items-center justify-center w-[18px] h-[18px]"
                  aria-label="Account"
                >
                  {isLoggedIn && userInitial ? (
                    <span className="text-[14px] font-medium leading-none text-gray-800">
                      {userInitial}
                    </span>
                  ) : (
                    <User
                      size={18}
                      className={isLoggedIn ? "text-gray-500" : ""}
                    />
                  )}
                </button>
                {accountDropdownOpen && isLoggedIn && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="absolute right-0 top-[calc(100%+16px)] w-40 bg-white border border-gray-100 shadow-xl py-2 z-[100]"
                  >
                    <button
                      onClick={() => {
                        setCurrentPage("profile");
                        setAccountDropdownOpen(false);
                        window.scrollTo(0, 0);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors"
                    >
                      Profile
                    </button>
                    <div className="h-[1px] bg-gray-100 my-1 w-full" />
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setAccountDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors text-red-600"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
              <button
                onClick={() => setCartOpen(true)}
                className="hover:text-gray-500 transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <GiftGuidePage
          onBack={() => setCurrentPage("home")}
          bannerContent={dynamicBanner}
          onNavigateCategory={(cat) => {
            setActiveCategory(cat);
            setCurrentPage("category");
            window.scrollTo(0, 0);
          }}
        />

        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          addedIds={addedIds}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          wishlist={wishlist}
          toggleWishlist={toggleWishlist}
          onCheckout={() => setCurrentPage("checkout")}
          onProductClick={openCartProductPage}
        />
      </>
    );
  }
  const categories =
    dbCategories.length > 0
      ? dbCategories.map((cat) => ({
          name: cat.name,
          image: cat.image_url
            ? cat.image_url.startsWith("http")
              ? cat.image_url
              : `http://localhost:5000${cat.image_url}`
            : cat.name === "Rings"
              ? catRings
              : cat.name === "Necklaces"
                ? catNecklaces
                : cat.name === "Bracelets"
                  ? catBracelets
                  : cat.name === "Earrings"
                    ? catEarrings
                    : cat.name === "Engagement"
                      ? catEngagement
                      : catSets,
        }))
      : [
          {
            name: "Rings",
            image: catRings,
          },
          {
            name: "Necklaces",
            image: catNecklaces,
          },
          {
            name: "Bracelets",
            image: catBracelets,
          },
          {
            name: "Earrings",
            image: catEarrings,
          },
          {
            name: "Engagement",
            image: catEngagement,
          },
          {
            name: "Sets",
            image: catSets,
          },
        ];

  const products =
    dbProducts.filter((p) => p.is_featured).length > 0
      ? dbProducts
          .filter((p) => p.is_featured)
          .map((p) => ({
            ...p,
            image: p.image_url
              ? p.image_url.startsWith("http")
                ? p.image_url
                : `http://localhost:5000${p.image_url}`
              : eternallyDesired1,
          }))
      : [
          {
            id: "home-featured-collections-1",
            name: "Promise Bloom",
            price: "$12,500",
            priceNum: 12500,
            metal: "Platinum · Round Brilliant",
            image: eternallyDesired1,
          },
          {
            id: "home-featured-collections-2",
            name: "The Vanguard",
            price: "$8,900",
            priceNum: 8900,
            metal: "18k Rose Gold",
            image: eternallyDesired2,
          },
          {
            id: "home-featured-collections-3",
            name: "Lumina Letter",
            price: "$2,750",
            priceNum: 2750,
            metal: "18k Yellow Gold",
            image: eternallyDesired3,
          },
          {
            id: "home-featured-collections-4",
            name: "Aura Everyday",
            price: "$4,200",
            priceNum: 4200,
            metal: "Platinum",
            image: eternallyDesired4,
          },
        ];

  const instagramImages =
    dbInstagramPosts.length > 0
      ? dbInstagramPosts.map((post) => ({
          image: post.image_url
            ? post.image_url.startsWith("http")
              ? post.image_url
              : `http://localhost:5000${post.image_url}`
            : catRings,
          link: post.post_url,
        }))
      : [
          catRings,
          catNecklaces,
          catBracelets,
          catEarrings,
          catEngagement,
          catSets,
        ].map((img) => ({ image: img, link: "https://instagram.com" }));

  const newArrivals =
    dbProducts.filter((p) => p.is_new_arrival).length > 0
      ? dbProducts
          .filter((p) => p.is_new_arrival)
          .map((p) => ({
            ...p,
            image: p.image_url
              ? p.image_url.startsWith("http")
                ? p.image_url
                : `http://localhost:5000${p.image_url}`
              : justUnveiledBlue,
          }))
      : [
          {
            id: "home-new-arrivals-10",
            name: "Sapphire Cushion Ring",
            price: "$4,800",
            priceNum: 4800,
            metal: "Platinum · Cushion Cut",
            tag: "NEW",
            image: justUnveiledBlue,
          },
          {
            id: "home-new-arrivals-11",
            name: "Sapphire Cushion Pendant",
            price: "$5,200",
            priceNum: 5200,
            metal: "18k White Gold",
            tag: "NEW",
            image: sapphirePendantImg,
          },
          {
            id: "home-new-arrivals-12",
            name: "Sapphire Cushion Earrings",
            price: "$5,950",
            priceNum: 5950,
            metal: "Platinum · Pair",
            tag: "EXCLUSIVE",
            image: sapphireEarringsImg,
          },
        ];
  return (
    <div
      className="min-h-screen bg-white overflow-x-hidden"
      style={{
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {isVerifyingPayment && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-[1000] flex flex-col items-center justify-center text-center p-6">
          <div className="space-y-6 max-w-md">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2
              className="text-2xl tracking-widest font-light text-black"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Verifying Payment Status
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Communicating with PhonePe secure server...
            </p>
          </div>
        </div>
      )}
      {/* Slide-out Menu Backdrop — always mounted for smooth animation; pointer-events off when closed */}
      <motion.div
        initial={false}
        animate={{
          opacity: menuOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
        }}
        className="fixed inset-0 z-[60] bg-black/40"
        style={{
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        onClick={() => setMenuOpen(false)}
      />

      {/* Slide-out Menu Panel — always mounted for smooth animation; pointer-events off when closed */}
      <motion.div
        initial={{
          x: "-100%",
        }}
        animate={{
          x: menuOpen ? 0 : "-100%",
        }}
        transition={{
          type: "tween",
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="fixed top-0 left-0 h-full w-full sm:w-[380px] sm:max-w-[85vw] bg-white shadow-2xl flex flex-col z-[65]"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 sm:py-6 border-b border-gray-200">
          <span
            className="text-base sm:text-lg tracking-widest"
            style={{
              fontWeight: 300,
              letterSpacing: "0.15em",
            }}
          >
            MENU
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="hover:text-gray-500 transition-colors"
            style={{
              pointerEvents: "auto",
            }}
          >
            <X size={24} />
          </button>
        </div>
        <nav
          className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 sm:py-8"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <div className="space-y-0">
            {/* Collections */}
            <button
              type="button"
              className="flex items-center justify-between py-3 text-lg tracking-wider hover:text-gray-500 transition-colors w-full text-left"
              style={{
                fontWeight: 300,
                pointerEvents: "auto",
                background: "none",
                cursor: "pointer",
                borderBottom: collectionsDropdownOpen
                  ? "1px solid #e5e7eb"
                  : "1px solid #f3f4f6",
              }}
              onClick={() => setCollectionsDropdownOpen((prev) => !prev)}
            >
              <span>COLLECTIONS</span>
              <motion.span
                animate={{
                  rotate: collectionsDropdownOpen ? 90 : 0,
                }}
                transition={{
                  duration: 0.2,
                }}
                style={{
                  display: "flex",
                }}
              >
                <ChevronRight size={16} className="text-gray-400" />
              </motion.span>
            </button>

            <motion.div
              initial={false}
              animate={{
                height: collectionsDropdownOpen ? "auto" : 0,
              }}
              transition={{
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1],
              }}
              style={{
                overflow: "hidden",
              }}
            >
              <div className="bg-gray-50 pl-6 pr-4 py-2">
                {(dbCollections.length > 0
                  ? dbCollections
                  : [
                      {
                        name: "The Vanguard",
                      },
                      {
                        name: "Lumina Letter",
                      },
                      {
                        name: "Promise Bloom",
                      },
                      {
                        name: "Aura Everyday",
                      },
                    ]
                ).map((sub) => (
                  <button
                    key={sub.id || sub.name}
                    type="button"
                    className="flex items-center justify-between w-full py-2.5 text-sm tracking-[0.2em] text-gray-500 hover:text-black transition-colors text-left"
                    style={{
                      fontWeight: 300,
                      pointerEvents: "auto",
                      background: "none",
                      cursor: "pointer",
                      borderBottom: "1px solid #ececec",
                    }}
                    onClick={() => {
                      setMenuOpen(false);
                      setCollectionsDropdownOpen(false);
                      setActiveCollection(sub.name);
                      setCurrentPage("collection");
                      window.scrollTo(0, 0);
                    }}
                  >
                    <span>{sub.name.toUpperCase()}</span>
                    <ChevronRight size={12} className="text-gray-300" />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Category with accordion dropdown */}
            <div>
              <button
                type="button"
                className="flex items-center justify-between py-3 text-lg tracking-wider hover:text-gray-500 transition-colors w-full text-left"
                style={{
                  fontWeight: 300,
                  pointerEvents: "auto",
                  background: "none",
                  cursor: "pointer",
                  borderBottom: categoryDropdownOpen
                    ? "1px solid #e5e7eb"
                    : "1px solid #f3f4f6",
                }}
                onClick={() => setCategoryDropdownOpen((prev) => !prev)}
              >
                <span>CATEGORY</span>
                <motion.span
                  animate={{
                    rotate: categoryDropdownOpen ? 90 : 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  style={{
                    display: "flex",
                  }}
                >
                  <ChevronRight size={16} className="text-gray-400" />
                </motion.span>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: categoryDropdownOpen ? "auto" : 0,
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.4, 0, 0.2, 1],
                }}
                style={{
                  overflow: "hidden",
                }}
              >
                <div className="bg-gray-50 pl-6 pr-4 py-2">
                  {(dbCategories.length > 0
                    ? dbCategories
                    : [
                        {
                          name: "Rings",
                        },
                        {
                          name: "Earrings",
                        },
                        {
                          name: "Necklaces",
                        },
                        {
                          name: "Sets",
                        },
                        {
                          name: "Bracelets",
                        },
                        {
                          name: "Engagement",
                        },
                      ]
                  ).map((sub) => (
                    <button
                      key={sub.id || sub.name}
                      type="button"
                      className="flex items-center justify-between w-full py-2.5 text-sm tracking-[0.2em] text-gray-500 hover:text-black transition-colors text-left"
                      style={{
                        fontWeight: 300,
                        pointerEvents: "auto",
                        background: "none",
                        cursor: "pointer",
                        borderBottom: "1px solid #ececec",
                      }}
                      onClick={() => {
                        setMenuOpen(false);
                        setCategoryDropdownOpen(false);
                        setActiveCategory(sub.name);
                        setCurrentPage("category");
                        window.scrollTo({
                          top: 0,
                          behavior: "instant",
                        });
                      }}
                    >
                      <span>{sub.name.toUpperCase()}</span>
                      <ChevronRight size={12} className="text-gray-300" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Jewelry */}
            <button
              type="button"
              className="flex items-center justify-between py-3 text-lg tracking-wider hover:text-gray-500 transition-colors w-full text-left"
              style={{
                fontWeight: 300,
                pointerEvents: "auto",
                background: "none",
                cursor: "pointer",
                borderBottom: "1px solid #f3f4f6",
              }}
              onClick={() => {
                setMenuOpen(false);
                setCategoryDropdownOpen(false);
                setCollectionsDropdownOpen(false);
                setActiveCategory("Jewelry");
                setCurrentPage("category");
                window.scrollTo({
                  top: 0,
                  behavior: "instant",
                });
              }}
            >
              <span>JEWELRY</span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            {/* Our Story */}
            <button
              type="button"
              className="flex items-center justify-between py-3 text-lg tracking-wider hover:text-gray-500 transition-colors w-full text-left"
              style={{
                fontWeight: 300,
                pointerEvents: "auto",
                background: "none",
                cursor: "pointer",
                borderBottom: "1px solid #f3f4f6",
              }}
              onClick={() => {
                setMenuOpen(false);
                setCategoryDropdownOpen(false);
                setCollectionsDropdownOpen(false);
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
                setCurrentPage("story");
                setTimeout(() => {
                  window.scrollTo(0, 0);
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                }, 50);
              }}
            >
              <span>OUR STORY</span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>

            {/* Book an Appointment */}
            <button
              type="button"
              className="flex items-center justify-between py-3 text-lg tracking-wider hover:text-gray-500 transition-colors w-full text-left"
              style={{
                fontWeight: 300,
                pointerEvents: "auto",
                background: "none",
                cursor: "pointer",
                borderBottom: "1px solid #f3f4f6",
              }}
              onClick={() => {
                setMenuOpen(false);
                openAppointment();
              }}
            >
              <span>BOOK AN APPOINTMENT</span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>
        </nav>
        <div className="px-6 sm:px-8 py-5 sm:py-6 border-t border-gray-200">
          <button
            type="button"
            className="text-xs sm:text-sm text-gray-800 hover:text-gray-500 tracking-widest uppercase transition-colors text-left font-light w-full"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              outline: "none",
            }}
            onClick={() => {
              setMenuOpen(false);
              if (isLoggedIn) {
                openProfileTab("overview");
              } else {
                setCurrentPage("login");
                window.scrollTo(0, 0);
              }
            }}
          >
            My Account
          </button>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-500 w-full ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white"}`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 w-full">
          <div className="flex items-center justify-between">
            {/* Left Icons */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-1">
              <button
                onClick={() => setMenuOpen(true)}
                className="hover:text-gray-500 transition-colors tap-target cursor-pointer"
                aria-label="Open menu"
              >
                <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="hover:text-gray-500 transition-colors tap-target cursor-pointer"
                aria-label="Search"
              >
                <Search size={18} className="sm:w-[20px] sm:h-[20px]" />
              </button>
            </div>

            {/* Centered Logo */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo(0, 0);
              }}
            >
              <ImageWithFallback
                src={logoImage}
                alt="Unicorn Jewels Logo"
                className="h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 w-auto object-contain hover:opacity-80 transition-opacity"
              />
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-1 justify-end">
              <button
                onClick={() => openAppointment()}
                className="hover:text-gray-500 transition-colors tap-target hidden md:block cursor-pointer"
                aria-label="Book appointment"
              >
                <Calendar size={18} className="md:w-[20px] md:h-[20px]" />
              </button>
              <div className="relative">
                {accountDropdownOpen && isLoggedIn && (
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setAccountDropdownOpen(false)}
                  />
                )}
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      setAccountDropdownOpen(!accountDropdownOpen);
                    } else {
                      setCurrentPage("login");
                    }
                  }}
                  className="relative z-[95] flex items-center justify-center tap-target focus:outline-none"
                  aria-label="Account"
                >
                  {isLoggedIn && userInitial ? (
                    <span className="w-8 h-8 rounded-full bg-black text-white hover:bg-neutral-800 transition-colors flex items-center justify-center text-xs font-semibold uppercase tracking-wider shadow-sm cursor-pointer">
                      {userInitial}
                    </span>
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm">
                      <User size={16} />
                    </div>
                  )}
                </button>
                {accountDropdownOpen && isLoggedIn && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="absolute right-0 top-[calc(100%+16px)] w-40 bg-white border border-gray-100 shadow-xl py-2 z-[100]"
                  >
                    <button
                      onClick={() => {
                        setCurrentPage("profile");
                        setAccountDropdownOpen(false);
                        window.scrollTo(0, 0);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors text-black"
                    >
                      Profile
                    </button>
                    <div className="h-[1px] bg-gray-100 my-1 w-full" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-xs tracking-widest uppercase hover:bg-gray-50 transition-colors text-red-600"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
              <button
                onClick={() => setCartOpen(true)}
                className="hover:text-gray-500 transition-colors relative tap-target cursor-pointer"
                aria-label="Cart"
              >
                <ShoppingBag size={18} className="sm:w-[20px] sm:h-[20px]" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-black text-white text-[10px] sm:text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItems.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-black overflow-hidden border-b border-gray-900 w-full">
        {/* Text Content (40%) */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16 md:py-20 lg:py-0 z-10 bg-black order-2 lg:order-1 max-w-full">
          <motion.div
            initial={{
              opacity: 0,
              x: -30,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.2,
            }}
          >
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] leading-[0.85] text-white mb-6 sm:mb-8 drop-shadow-2xl"
              style={{
                fontWeight: 300,
                letterSpacing: "-0.02em",
              }}
            >
              {dynamicBanner.title.includes(" ") ? (
                <>
                  {dynamicBanner.title.split(" ")[0]}
                  <br />
                  <span className="italic text-[#C0C0C0]">
                    {dynamicBanner.title.split(" ").slice(1).join(" ")}
                  </span>
                </>
              ) : (
                dynamicBanner.title
              )}
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl text-white mb-3 sm:mb-4 drop-shadow-lg"
              style={{
                fontWeight: 300,
                lineHeight: 1.6,
              }}
            >
              {dynamicBanner.subtitle}
            </p>
            <p
              className="text-sm sm:text-base text-white/90 mb-8 sm:mb-10 md:mb-12 max-w-sm tracking-wide leading-relaxed drop-shadow-lg"
              style={{
                fontWeight: 300,
              }}
            >
              {dynamicBanner.description}{" "}
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                  setCurrentPage("story");
                  setTimeout(() => {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                  }, 50);
                }}
                className="text-sm sm:text-base text-white/90 hover:text-white underline decoration-white/50 hover:decoration-white transition-all cursor-pointer drop-shadow-lg inline"
                style={{
                  fontWeight: 300,
                }}
              >
                More
              </button>
            </p>
           

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 items-start sm:items-center mt-2">
              <button
                onClick={() => {
                  document.getElementById("eternally-desired").scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="group flex items-center gap-3 sm:gap-4 text-xs sm:text-sm uppercase tracking-[0.2em] text-white hover:text-[#C0C0C0] transition-colors tap-target min-h-[44px]"
              >
                <span className="drop-shadow-lg">Explore Collection</span>
                <span className="w-6 sm:w-8 h-[1px] bg-white group-hover:bg-[#C0C0C0] group-hover:w-12 sm:group-hover:w-16 transition-all duration-500 drop-shadow-lg"></span>
              </button>
              <button
                onClick={() => {
                  openAppointment();
                }}
                className="group flex items-center gap-3 sm:gap-4 text-xs sm:text-sm uppercase tracking-[0.2em] text-white hover:text-[#C0C0C0] transition-colors tap-target min-h-[44px]"
              >
                <span className="drop-shadow-lg">Book Consultation</span>
                <span className="w-6 sm:w-8 h-[1px] bg-white group-hover:bg-[#C0C0C0] group-hover:w-12 sm:group-hover:w-16 transition-all duration-500 drop-shadow-lg"></span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Image Content (60%) */}
        <div className="w-full lg:w-[60%] h-[50vh] sm:h-[60vh] lg:h-auto lg:min-h-[calc(100vh-80px)] relative overflow-hidden group order-1 lg:order-2 max-w-full">
          <motion.div
            initial={{
              opacity: 0,
              scale: 1.05,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
            className="w-full h-full absolute inset-0 max-w-full"
          >
            <ImageWithFallback
              src={dynamicBanner.imageUrl}
              alt="Luxury Jewelry"
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
            />

            {/* Gradient overlay for better text contrast on mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:hidden" />
          </motion.div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <h2
            className="text-center text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-10 md:mb-12"
            style={{
              fontWeight: 300,
              letterSpacing: "0.1em",
            }}
          >
            Curated Collections
          </h2>

          {(() => {
            const isSlider = categories.length > 6;
            const itemsPerView = {
              mobile: 2,
              tablet: 3,
              desktop: 6,
            };

            // On desktop we show 6, so max index is length - 6
            const maxIndex = Math.max(0, categories.length - 6);

            return (
              <div className="relative group px-0 sm:px-4 md:px-8">
                <div className={isSlider ? "overflow-hidden" : ""}>
                  <motion.div
                    className={`grid ${isSlider ? "flex" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6"} gap-4 sm:gap-6 md:gap-8 transition-transform duration-500 ease-out`}
                    style={
                      isSlider
                        ? {
                            display: "flex",
                            transform: `translateX(-${categorySliderIndex * (100 / 6)}%)`,
                            gap: "0",
                            width: `${(categories.length / 6) * 100}%`,
                          }
                        : {}
                    }
                  >
                    {categories.map((category, index) => (
                      <div
                        key={category.name}
                        className={`text-center ${isSlider ? "flex-shrink-0" : ""}`}
                        style={
                          isSlider
                            ? {
                                width: `${100 / categories.length}%`,
                                padding: "0 12px",
                              }
                            : {}
                        }
                      >
                        <button
                          type="button"
                          className="group cursor-pointer w-full text-center bg-transparent border-none outline-none"
                          onClick={() => {
                            setActiveCategory(category.name);
                            setCurrentPage("category");
                            window.scrollTo({
                              top: 0,
                              behavior: "instant",
                            });
                          }}
                        >
                          <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden">
                            <ImageWithFallback
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                            />
                          </div>
                          <h3
                            className="text-sm sm:text-base md:text-lg tracking-wider"
                            style={{
                              fontWeight: 400,
                            }}
                          >
                            {category.name}
                          </h3>
                        </button>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {isSlider && (
                  <>
                    {/* Navigation Arrows */}
                    <button
                      onClick={() =>
                        setCategorySliderIndex(
                          Math.max(0, categorySliderIndex - 1),
                        )
                      }
                      disabled={categorySliderIndex === 0}
                      className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 bg-white/80 backdrop-blur border border-gray-200 p-2 rounded-full shadow-sm transition-all z-10 ${categorySliderIndex === 0 ? "opacity-0 pointer-events-none" : "hover:bg-white hover:scale-110"}`}
                    >
                      <ChevronLeft size={20} className="text-gray-800" />
                    </button>
                    <button
                      onClick={() =>
                        setCategorySliderIndex(
                          Math.min(maxIndex, categorySliderIndex + 1),
                        )
                      }
                      disabled={categorySliderIndex >= maxIndex}
                      className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 bg-white/80 backdrop-blur border border-gray-200 p-2 rounded-full shadow-sm transition-all z-10 ${categorySliderIndex >= maxIndex ? "opacity-0 pointer-events-none" : "hover:bg-white hover:scale-110"}`}
                    >
                      <ChevronRight size={20} className="text-gray-800" />
                    </button>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Just Unveiled */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-12 sm:mb-14 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Sparkles
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] text-gray-400"
                />
                <span
                  className="text-xs sm:text-sm tracking-[0.3em] text-gray-400"
                  style={{ fontWeight: 400 }}
                >
                  JUST ARRIVED
                </span>
                <Sparkles
                  size={16}
                  className="sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] text-gray-400"
                />
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4"
                style={{ fontWeight: 300, letterSpacing: "0.1em" }}
              >
                Just Unveiled
              </h2>
              <p
                className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto px-4"
                style={{ fontWeight: 300 }}
              >
                Be the first to discover our latest creations, fresh from the
                atelier
              </p>
            </motion.div>
          </div>

          {(() => {
            const sliderProducts = dbJustUnveiled;
            if (sliderProducts.length === 0) return null;

            const maxIndex = Math.max(0, sliderProducts.length - 3);

            return (
              <div className="relative group px-4 sm:px-12">
                <div className="overflow-hidden">
                  <motion.div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${sliderIndex * (100 / 3)}%)`,
                    }}
                  >
                    {sliderProducts.map((item, index) => (
                      <div
                        key={item.id}
                        className="w-full sm:w-1/2 md:w-1/3 flex-shrink-0 px-3 sm:px-4 md:px-5"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: index * 0.15 }}
                          viewport={{ once: true }}
                          className="group cursor-pointer h-full"
                          onClick={() => {
                            const matchingProduct = dbProducts.find(
                              (p) =>
                                p.name.toLowerCase() ===
                                item.title.toLowerCase(),
                            );
                            if (matchingProduct) {
                              openProductPage(matchingProduct, "home");
                            } else {
                              openProductPage(
                                {
                                  id: "just-unveiled-" + item.id,
                                  name: item.title,
                                  price: item.subtitle || "$0",
                                  image_url: item.image_url,
                                  description:
                                    "Exquisite piece from the Just Unveiled collection.",
                                  stock: 10,
                                },
                                "home",
                              );
                            }
                          }}
                        >
                          <div className="relative mb-4 sm:mb-5 overflow-hidden">
                            <ImageWithFallback
                              src={
                                item.image_url
                                  ? item.image_url.startsWith("http")
                                    ? item.image_url
                                    : `http://localhost:5000${item.image_url}`
                                  : ""
                              }
                              alt={item.title}
                              className="w-full h-64 sm:h-80 md:h-96 object-cover bg-gray-50 group-hover:scale-105 transition-transform duration-700"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist("just-unveiled-" + item.id);
                              }}
                              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors z-10 tap-target"
                            >
                              <Heart
                                size={16}
                                className={`sm:w-[18px] sm:h-[18px] ${wishlist.has("just-unveiled-" + item.id) ? "fill-black" : "fill-none"}`}
                                stroke="black"
                              />
                            </button>
                          </div>
                          <h3
                            className="text-lg sm:text-xl mb-2"
                            style={{ fontWeight: 400 }}
                          >
                            {item.title}
                          </h3>
                        </motion.div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {sliderProducts.length > 3 && (
                  <>
                    <button
                      onClick={() =>
                        setSliderIndex(Math.max(0, sliderIndex - 1))
                      }
                      disabled={sliderIndex === 0}
                      className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur border border-slate-200 p-2 sm:p-3 rounded-full shadow-sm transition-all z-10 ${sliderIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:scale-110"}`}
                    >
                      <ChevronLeft size={20} className="text-slate-800" />
                    </button>
                    <button
                      onClick={() =>
                        setSliderIndex(Math.min(maxIndex, sliderIndex + 1))
                      }
                      disabled={sliderIndex >= maxIndex}
                      className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur border border-slate-200 p-2 sm:p-3 rounded-full shadow-sm transition-all z-10 ${sliderIndex >= maxIndex ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:scale-110"}`}
                    >
                      <ChevronRight size={20} className="text-slate-800" />
                    </button>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Dynamic Editorial Sections */}
      {dbEditorials.map((editorial, index) => (
        <section
          key={editorial.id}
          className={`py-12 sm:py-16 md:py-20 w-full overflow-hidden ${index % 2 !== 0 ? "bg-gray-50" : ""}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: editorial.is_reversed ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`relative w-full h-[400px] sm:h-[500px] md:h-[600px] cursor-pointer overflow-hidden ${editorial.is_reversed ? "order-1 md:order-2" : ""}`}
              >
                <ImageWithFallback
                  src={
                    editorial.image_url
                      ? editorial.image_url.startsWith("http")
                        ? editorial.image_url
                        : `http://localhost:5000${editorial.image_url}`
                      : ""
                  }
                  alt={editorial.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out hover:scale-105"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: editorial.is_reversed ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`space-y-4 sm:space-y-6 ${editorial.is_reversed ? "order-2 md:order-1" : ""}`}
              >
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl"
                  style={{ fontWeight: 300, letterSpacing: "0.05em" }}
                >
                  {editorial.title}
                </h2>
                <p
                  className="text-base sm:text-lg text-gray-600"
                  style={{ fontWeight: 300, lineHeight: 1.8 }}
                >
                  {editorial.description}
                </p>
                <button
                  onClick={() => {
                    const targetSection =
                      editorial.button_link || "eternally-desired";
                    document.getElementById(targetSection).scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                  className="flex items-center gap-2 text-black border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors text-sm sm:text-base tap-target"
                >
                  <span className="tracking-wider">
                    {editorial.button_text}
                  </span>
                  <ChevronRight size={18} className="sm:w-[20px] sm:h-[20px]" />
                </button>
              </motion.div>
            </div>
          </div>
        </section>
      ))}

      {/* Our Vision - Asymmetric Editorial */}
      <section className="py-32 px-6 bg-[#0a0a0a] text-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-32">
            <motion.div
              initial={{
                opacity: 0,
                clipPath: "inset(10% 10% 10% 10%)",
              }}
              whileInView={{
                opacity: 1,
                clipPath: "inset(0% 0% 0% 0%)",
              }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{
                once: true,
              }}
              className="w-full md:w-5/12 h-[80vh] min-h-[600px] max-h-[900px] relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#111] z-0"></div>
              <ImageWithFallback
                src={
                  resolveManagedImage(homeVisionSection.primary_image_url) ||
                  ourStoryModel
                }
                alt="Unicorn Jewels Model"
                className="w-full h-full object-cover object-center absolute inset-0 z-10"
              />
              <div className="absolute inset-0 border border-white/10 z-20 m-6 lg:m-10 pointer-events-none mix-blend-overlay"></div>
            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              viewport={{
                once: true,
              }}
              className="w-full md:w-6/12 flex flex-col justify-center"
            >
              <span className="text-xs tracking-[0.4em] uppercase text-gray-300 mb-8 block font-medium">
                {homeVisionSection.eyebrow}
              </span>
              <h2
                className="text-5xl lg:text-7xl mb-10 text-white leading-tight"
                style={{
                  fontWeight: 300,
                }}
              >
                {homeVisionSection.title_line_one} <br />
                <span className="italic text-gray-400">
                  {homeVisionSection.accent}
                </span>
              </h2>
              <div className="w-12 h-[1px] bg-white/40 mb-10"></div>
              <p
                className="text-lg lg:text-xl mb-8 text-gray-300 max-w-lg"
                style={{
                  fontWeight: 300,
                  lineHeight: 1.8,
                }}
              >
                {homeVisionSection.paragraph_one}
              </p>
              <p
                className="text-sm text-gray-400 mb-12 max-w-md tracking-wide"
                style={{
                  fontWeight: 300,
                  lineHeight: 1.8,
                }}
              >
                {homeVisionSection.paragraph_two}
              </p>
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  document.documentElement.scrollTop = 0;
                  document.body.scrollTop = 0;
                  setCurrentPage("story");
                  setTimeout(() => {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                  }, 50);
                }}
                className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-white hover:text-gray-300 transition-colors w-max"
              >
                <span>{homeVisionSection.button_text}</span>
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
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              viewport={{
                once: true,
              }}
            >
              <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-6 block">
                Featured Collections
              </span>
              <h2
                className="text-5xl lg:text-7xl mb-10 text-black leading-tight"
                style={{
                  fontWeight: 300,
                }}
              >
                Eternally <br />
                <span className="italic text-gray-500">Desired</span>
              </h2>
            </motion.div>
            <button className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] hover:text-gray-500 transition-colors">
              <span>View Collection</span>
              <span className="w-8 h-[1px] bg-black group-hover:w-12 transition-all duration-300"></span>
            </button>
          </div>
          {(() => {
            const featuredProducts = dbProducts.filter((p) => p.is_featured);
            if (featuredProducts.length === 0) return null;

            const maxIndex = Math.max(0, featuredProducts.length - 4); // Assumes 4 items per view on desktop

            return (
              <div className="relative group px-2 sm:px-8">
                <div className="overflow-hidden">
                  <motion.div
                    className="flex transition-transform duration-500 ease-out"
                    style={{
                      transform: `translateX(-${featuredSliderIndex * (100 / 4)}%)`,
                    }}
                  >
                    {featuredProducts.map((product, index) => (
                      <div
                        key={product.id}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 px-3"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="group cursor-pointer flex flex-col h-full"
                          onClick={() => {
                            setActiveCollection(product.name);
                            setCurrentPage("collection");
                            window.scrollTo(0, 0);
                          }}
                        >
                          <div className="relative mb-6 overflow-hidden bg-[#f0f0f0] aspect-[4/5]">
                            <ImageWithFallback
                              src={
                                product.image_url
                                  ? product.image_url.startsWith("http")
                                    ? product.image_url
                                    : `http://localhost:5000${product.image_url}`
                                  : ""
                              }
                              alt={product.name}
                              className="w-full h-full object-cover p-4 group-hover:scale-110 transition-transform duration-1000 ease-out"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product.id);
                              }}
                              className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2"
                            >
                              <Heart
                                size={20}
                                className={
                                  wishlist.has(product.id)
                                    ? "fill-black"
                                    : "fill-none"
                                }
                                stroke="black"
                                strokeWidth={1}
                              />
                            </button>
                          </div>
                          <h3
                            className="text-sm uppercase tracking-widest mb-2 text-black"
                            style={{ fontWeight: 400 }}
                          >
                            {product.name}
                          </h3>
                        </motion.div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Navigation Arrows (Only show if there are more than 4 items) */}
                {featuredProducts.length > 4 && (
                  <>
                    <button
                      onClick={() =>
                        setFeaturedSliderIndex(
                          Math.max(0, featuredSliderIndex - 1),
                        )
                      }
                      disabled={featuredSliderIndex === 0}
                      className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur border border-slate-200 p-2 sm:p-3 rounded-full shadow-sm transition-all z-10 ${featuredSliderIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:scale-110"}`}
                    >
                      <ChevronLeft size={20} className="text-slate-800" />
                    </button>
                    <button
                      onClick={() =>
                        setFeaturedSliderIndex(
                          Math.min(maxIndex, featuredSliderIndex + 1),
                        )
                      }
                      disabled={featuredSliderIndex >= maxIndex}
                      className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur border border-slate-200 p-2 sm:p-3 rounded-full shadow-sm transition-all z-10 ${featuredSliderIndex >= maxIndex ? "opacity-50 cursor-not-allowed" : "hover:bg-white hover:scale-110"}`}
                    >
                      <ChevronRight size={20} className="text-slate-800" />
                    </button>
                  </>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* The Stone Edit - Staggered Masonry Look */}
      <section className="py-40 px-6 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            viewport={{
              once: true,
            }}
            className="text-center mb-32"
          >
            <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-6 block">
              The Diamond Collection
            </span>
            <h2
              className="text-5xl lg:text-6xl text-black mb-8"
              style={{
                fontWeight: 300,
              }}
            >
              The Diamond <span className="italic text-gray-500">Edit</span>
            </h2>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {dbDiamondEdit.map((stone, index) => {
              const offsets = ["mt-0", "md:mt-32", "md:mt-16"];
              const offset = offsets[index % 3];

              return (
                <motion.div
                  key={stone.id || stone.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`flex-1 group cursor-pointer ${offset}`}
                >
                  <div className="aspect-[3/4] overflow-hidden mb-8 relative bg-[#f8f8f8]">
                    <ImageWithFallback
                      src={
                        stone.image_url
                          ? stone.image_url.startsWith("http")
                            ? stone.image_url
                            : `http://localhost:5000${stone.image_url}`
                          : ""
                      }
                      alt={stone.title}
                      className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <h3
                        className="text-3xl text-black mb-2"
                        style={{ fontWeight: 300 }}
                      >
                        {stone.title}
                      </h3>
                      <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
                        {stone.subtitle}
                      </span>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-gray-400 group-hover:text-black transition-colors -translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 duration-500"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Personal Styling & Art of Giving - Combined Editorial Spread */}
      <section id="personal-styling" className="py-32 px-6 bg-[#fafafa]">
        <div className="max-w-[1400px] mx-auto">
          {dbServices
            .filter(
              (service) =>
                (service.button_link || "").toLowerCase() !== "gift-guide",
            )
            .map((service, index, filteredServices) => (
              <div
                key={service.id}
                className={`flex flex-col md:flex-row items-center gap-12 lg:gap-24 ${index < filteredServices.length - 1 ? "mb-40" : ""}`}
              >
                {/* Text Content */}
                <motion.div
                  initial={{ opacity: 0, x: service.is_reversed ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                  className={`w-full md:w-5/12 ${service.is_reversed ? "order-2" : "order-2 md:order-1"}`}
                >
                  <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 mb-8 block font-medium">
                    {service.tag}
                  </span>
                  <h2
                    className="text-5xl lg:text-6xl mb-10 text-black leading-tight"
                    style={{ fontWeight: 300 }}
                  >
                    {service.title.split(" ").length > 1 ? (
                      <>
                        {service.title.split(" ").slice(0, -1).join(" ")} <br />
                        <span className="italic text-gray-500">
                          {service.title.split(" ").slice(-1)}
                        </span>
                      </>
                    ) : (
                      service.title
                    )}
                  </h2>
                  <p
                    className="text-lg text-gray-600 mb-12 max-w-md"
                    style={{ fontWeight: 300, lineHeight: 1.8 }}
                  >
                    {service.description}
                  </p>
                  <button
                    onClick={() => {
                      if (service.button_link === "appointment")
                        openAppointment();
                      else {
                        setCurrentPage(service.button_link);
                        window.scrollTo(0, 0);
                      }
                    }}
                    className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] hover:text-gray-500 transition-colors w-max"
                  >
                    <span>{service.button_text}</span>
                    <span className="w-8 h-[1px] bg-black group-hover:w-12 transition-all duration-300"></span>
                  </button>
                </motion.div>

                {/* Image Content */}
                <motion.div
                  initial={{
                    opacity: 0,
                    clipPath: service.is_reversed
                      ? "inset(0 0 0 100%)"
                      : "inset(100% 0 0 0)",
                  }}
                  whileInView={{
                    opacity: 1,
                    clipPath: "inset(0% 0 0 0%)",
                  }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className={`w-full md:w-7/12 overflow-hidden ${service.is_reversed ? "order-1 md:aspect-[3/4]" : "order-1 md:order-2 aspect-[4/3] md:aspect-[16/9]"}`}
                >
                  <ImageWithFallback
                    src={
                      service.image_url
                        ? service.image_url.startsWith("http")
                          ? service.image_url
                          : `http://localhost:5000${service.image_url}`
                        : ""
                    }
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            ))}
        </div>
      </section>

      {/* Haute Joaillerie - Dark Avant-Garde Editorial */}
      <section id="vault" className="py-32 px-6 bg-[#0a0a0a] text-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{
                once: true,
              }}
              className="w-full lg:w-5/12 flex flex-col justify-center order-2 lg:order-1"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-[1px] bg-white/40"></div>
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/60">
                  The Vault
                </span>
              </div>
              <h2
                className="text-5xl lg:text-7xl mb-8 leading-[1.1]"
                style={{
                  fontWeight: 300,
                }}
              >
                Haute <br />
                <span className="italic text-white/50">Joaillerie</span>
              </h2>
              <p
                className="text-lg lg:text-xl mb-8 text-white/70 max-w-md"
                style={{
                  fontWeight: 300,
                  lineHeight: 1.8,
                }}
              >
                Where imagination knows no bounds. Discover our most
                spectacular, one-of-a-kind masterworks reserved for the
                discerning collector.
              </p>
              <p
                className="text-sm text-white/40 mb-12 max-w-md tracking-wide"
                style={{
                  fontWeight: 300,
                  lineHeight: 1.8,
                }}
              >
                Crafted with impossibly rare gems and hundreds of hours of
                painstaking artisanal labor, the High Jewelry collection
                represents the absolute zenith of the Unicorn Jewels legacy.
              </p>
              <button
                onClick={() => openAppointment("vault")}
                className="group flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-white hover:text-white/70 transition-colors w-max"
              >
                <span>Request Private Viewing</span>
                <span className="w-8 h-[1px] bg-white group-hover:w-12 transition-all duration-300"></span>
              </button>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                clipPath: "inset(10% 10% 10% 10%)",
              }}
              whileInView={{
                opacity: 1,
                clipPath: "inset(0% 0% 0% 0%)",
              }}
              transition={{
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{
                once: true,
              }}
              className="w-full lg:w-7/12 aspect-[3/4] lg:aspect-[4/5] relative group order-1 lg:order-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#111] z-0"></div>
              <ImageWithFallback
                src={hauteJoaillerieImg}
                alt="Haute Joaillerie High Fashion Editorial"
                className="w-full h-full object-cover object-center absolute inset-0 z-10 transition-transform duration-[2000ms] group-hover:scale-105"
              />
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
              <h2
                className="text-3xl"
                style={{
                  fontWeight: 300,
                  letterSpacing: "0.1em",
                }}
              >
                @UnicornJewels
              </h2>
            </div>
            <p
              className="text-gray-600"
              style={{
                fontWeight: 300,
              }}
            >
              Follow us for daily inspiration and exclusive behind-the-scenes
              moments
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {instagramImages.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="aspect-square overflow-hidden cursor-pointer group relative"
                onClick={() => window.open(item.link, "_blank")}
              >
                <ImageWithFallback
                  src={item.image}
                  alt={`Instagram ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram size={20} className="text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-16 pb-6 sm:pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Newsletter */}
          <div className="border-b border-gray-300 pb-12 mb-12">
            <div className="max-w-2xl mx-auto text-center">
              <h3
                className="text-2xl mb-4"
                style={{
                  fontWeight: 300,
                  letterSpacing: "0.1em",
                }}
              >
                Join Our Community
              </h3>
              <p
                className="text-gray-600 mb-6"
                style={{
                  fontWeight: 300,
                }}
              >
                Be the first to discover new collections and exclusive offerings
              </p>
              <div className="flex gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 px-4 py-3 border border-gray-300 focus:outline-none focus:border-black"
                />
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
              <h4
                className="mb-4 tracking-wider"
                style={{
                  fontWeight: 500,
                }}
              >
                SHOP
              </h4>
              <ul
                className="space-y-2 text-gray-600"
                style={{
                  fontWeight: 300,
                }}
              >
                {categories.map((category) => (
                  <li key={category.name}>
                    <button
                      onClick={() => {
                        setActiveCategory(category.name);
                        setCurrentPage("category");
                        setTimeout(() => {
                          window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: "instant",
                          });
                          document.documentElement.scrollTop = 0;
                          document.body.scrollTop = 0;
                        }, 0);
                      }}
                      className="hover:text-black text-left"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4
                className="mb-4 tracking-wider"
                style={{
                  fontWeight: 500,
                }}
              >
                CLIENT CARE
              </h4>
              <ul
                className="space-y-2 text-gray-600"
                style={{
                  fontWeight: 300,
                }}
              >
                <li>
                  <button
                    onClick={() => {
                      setCurrentPage("track-order");
                      window.scrollTo(0, 0);
                    }}
                    className="hover:text-black text-left w-full"
                  >
                    Track Order
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentPage("terms-of-service");
                      setTimeout(() => {
                        const element =
                          document.getElementById("shipping-returns");
                        if (element)
                          element.scrollIntoView({ behavior: "smooth" });
                      }, 0);
                    }}
                    className="hover:text-black text-left w-full"
                  >
                    Shipping & Returns
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentPage("terms-of-service");
                      setTimeout(() => {
                        const element = document.getElementById("size-guide");
                        if (element)
                          element.scrollIntoView({ behavior: "smooth" });
                      }, 0);
                    }}
                    className="hover:text-black text-left w-full"
                  >
                    Size Guide
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4
                className="mb-4 tracking-wider"
                style={{
                  fontWeight: 500,
                }}
              >
                OUR WORLD
              </h4>
              <ul
                className="space-y-2 text-gray-600"
                style={{
                  fontWeight: 300,
                }}
              >
                <li>
                  <button
                    onClick={() => {
                      setCurrentPage("story");
                      window.scrollTo(0, 0);
                    }}
                    className="hover:text-black text-left w-full"
                  >
                    Our Story
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (currentPage !== "home") setCurrentPage("home");
                      setTimeout(() => {
                        const element =
                          document.getElementById("personal-styling");
                        if (element)
                          element.scrollIntoView({ behavior: "smooth" });
                      }, 0);
                    }}
                    className="hover:text-black text-left w-full"
                  >
                    Personal Styling
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (currentPage !== "home") setCurrentPage("home");
                      setTimeout(() => {
                        const element = document.getElementById("vault");
                        if (element)
                          element.scrollIntoView({ behavior: "smooth" });
                      }, 0);
                    }}
                    className="hover:text-black text-left w-full"
                  >
                    Vault
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4
                className="mb-4 tracking-wider"
                style={{
                  fontWeight: 500,
                }}
              >
                CONNECT
              </h4>
              <ul
                className="space-y-2 text-gray-600"
                style={{
                  fontWeight: 300,
                }}
              >
                <li>
                  <a href="#" className="hover:text-black">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Pinterest
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-300 pt-6 sm:pt-8 pb-2 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p
              style={{
                fontWeight: 300,
              }}
            >
              Designed & Developed by{" "}
              <a
                href="https://www.syntiaro.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-all font-medium"
              >
                SYNTIARO
              </a>
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <button
                onClick={() => setCurrentPage("privacy-policy")}
                className="hover:text-black"
                style={{
                  fontWeight: 300,
                }}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setCurrentPage("terms-of-service")}
                className="hover:text-black"
                style={{
                  fontWeight: 300,
                }}
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Silver Collection Image Modal */}
      <div
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isSilverModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/90 cursor-zoom-out"
          onClick={() => setIsSilverModalOpen(false)}
        />
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setIsSilverModalOpen(false)}
            className="text-white hover:text-gray-300 transition-colors bg-black/50 p-2 rounded-full backdrop-blur-sm"
          >
            <X size={24} />
          </button>
        </div>
        <div className="absolute inset-4 md:inset-12 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{
              scale: 0.95,
              opacity: 0,
            }}
            animate={{
              scale: isSilverModalOpen ? 1 : 0.95,
              opacity: isSilverModalOpen ? 1 : 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className={`w-full h-full flex items-center justify-center ${isSilverModalOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          >
            <ImageWithFallback
              src={silverCollectionImg}
              alt="The Silver Collection High Resolution"
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        addedIds={addedIds}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        onCheckout={() => setCurrentPage("checkout")}
        onProductClick={openCartProductPage}
      />
      {renderSearchOverlay()}
    </div>
  );
}
