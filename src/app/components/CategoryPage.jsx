import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Heart, SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShopByLookBlock } from './ShopByLookBlock';
import { getProductHoverImage } from './productHoverImage';
import { withScopedProductIds } from './productIdentity';
import { buildShopByLookGridItems } from './shopByLookGrid';
import { collectionsData } from './CollectionPage';

/* ─── Types ──────────────────────────────────────────── */

/* ─── Product catalogue ───────────────────────────────── */
const catalogue = {
  Rings: {
    hero: 'https://images.unsplash.com/photo-1662434921251-a6eba45ac40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZ3MlMjB3aGl0ZSUyMGJhY2tncm91bmQlMjBqZXdlbHJ5fGVufDF8fHx8MTc3NDI0NjY0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    subtitle: 'From solitaires to eternity bands, each ring is a promise in platinum and gold.',
    editorial: 'Icons of Desire',
    products: [{
      id: 101,
      name: 'Round Brilliant Solitaire',
      price: '$8,500',
      priceNum: 8500,
      metal: 'Platinum · Round Brilliant',
      image: 'https://images.unsplash.com/photo-1662434921251-a6eba45ac40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZ3MlMjB3aGl0ZSUyMGJhY2tncm91bmQlMjBqZXdlbHJ5fGVufDF8fHx8MTc3NDI0NjY0OXww&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'ICONIC'
    }, {
      id: 102,
      name: 'Sapphire Halo Ring',
      price: '$12,800',
      priceNum: 12800,
      metal: '18k White Gold · Oval Sapphire',
      image: 'https://images.unsplash.com/photo-1735480165158-e645caaf1695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGdvbGQlMjByaW5nJTIwbHV4dXJ5JTIwamV3ZWxyeSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzQyNDY2NTN8MA&ixlib=rb-4.1.0&q=80&w=400',
      isNew: true
    }, {
      id: 103,
      name: 'Ruby Cocktail Ring',
      price: '$15,200',
      priceNum: 15200,
      metal: '18k Rose Gold · Burmese Ruby',
      image: 'https://images.unsplash.com/photo-1636730510270-292129a416f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydWJ5JTIwZ2Vtc3RvbmUlMjBjb2NrdGFpbCUyMHJpbmclMjBnb2xkJTIwbHV4dXJ5fGVufDF8fHx8MTc3NDI0NjY2MXww&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 104,
      name: 'Diamond Eternity Band',
      price: '$9,600',
      priceNum: 9600,
      metal: 'Platinum · Pavé Set',
      image: 'https://images.unsplash.com/photo-1648564585735-19491888545c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGVybml0eSUyMGJhbmQlMjB3ZWRkaW5nJTIwcmluZyUyMGRpYW1vbmRzJTIwbHV4dXJ5fGVufDF8fHx8MTc3NDI0NjY2Mnww&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 105,
      name: 'Three-Stone Diamond',
      price: '$22,000',
      priceNum: 22000,
      metal: 'Platinum · 3.2ct Total',
      image: 'https://images.unsplash.com/photo-1736154577794-65871df026ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJlZSUyMHN0b25lJTIwZW5nYWdlbWVudCUyMHJpbmclMjBkaWFtb25kJTIwcGxhdGludW18ZW58MXx8fHwxNzc0MjQ2NjYyfDA&ixlib=rb-4.1.0&q=80&w=400',
      isNew: true
    }, {
      id: 106,
      name: 'Platinum Band Ring',
      price: '$4,200',
      priceNum: 4200,
      metal: 'Platinum · Minimal',
      image: 'https://images.unsplash.com/photo-1599481805056-1c61a8975797?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF0aW51bSUyMGJhbmQlMjByaW5nJTIwbWluaW1hbCUyMGZpbmUlMjBqZXdlbHJ5fGVufDF8fHx8MTc3NDI0NjY1NHww&ixlib=rb-4.1.0&q=80&w=400'
    }]
  },
  Necklaces: {
    hero: 'https://images.unsplash.com/photo-1736436789706-005f2218a96d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwbmVja2xhY2UlMjBsdXh1cnklMjBwZW5kYW50JTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3NDI0NjY0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    subtitle: 'Pendants, chains and statement collars to be worn and treasured forever.',
    editorial: 'Worn Close to the Heart',
    products: [{
      id: 201,
      name: 'Diamond Solitaire Pendant',
      price: '$3,800',
      priceNum: 3800,
      metal: 'Platinum · 0.5ct',
      image: 'https://images.unsplash.com/photo-1773913753908-860293e9deef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwc29saXRhaXJlJTIwbmVja2xhY2UlMjBmaW5lJTIwamV3ZWxyeSUyMG1pbmltYWx8ZW58MXx8fHwxNzc0MjQ2NjYxfDA&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'BESTSELLER'
    }, {
      id: 202,
      name: 'Gold Chain Layered Set',
      price: '$5,200',
      priceNum: 5200,
      metal: '18k Yellow Gold · 3 Layers',
      image: 'https://images.unsplash.com/photo-1722410180670-b6d5a2e704fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwY2hhaW4lMjBsYXllcmVkJTIwbmVja2xhY2UlMjBsdXh1cnklMjB3b21hbnxlbnwxfHx8fDE3NzQyNDY2NTV8MA&ixlib=rb-4.1.0&q=80&w=400',
      isNew: true
    }, {
      id: 203,
      name: 'Emerald Drop Pendant',
      price: '$8,900',
      priceNum: 8900,
      metal: '18k White Gold · Colombian Emerald',
      image: 'https://images.unsplash.com/photo-1583937443351-f2f669fbe2cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyYWxkJTIwY3V0JTIwZGlhbW9uZCUyMHBlbmRhbnQlMjBuZWNrbGFjZSUyMHdoaXRlJTIwZ29sZHxlbnwxfHx8fDE3NzQyNDY2NTR8MA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 204,
      name: 'Luxury Pendant Necklace',
      price: '$7,100',
      priceNum: 7100,
      metal: '18k Gold · Signature',
      image: 'https://images.unsplash.com/photo-1736436789706-005f2218a96d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwbmVja2xhY2UlMjBsdXh1cnklMjBwZW5kYW50JTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3NDI0NjY0OXww&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'EXCLUSIVE'
    }, {
      id: 205,
      name: 'Diamond Cluster Pendant',
      price: '$12,500',
      priceNum: 12500,
      metal: 'Platinum · 1.8ct Cluster',
      image: 'https://images.unsplash.com/photo-1773913490635-44e688001528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwc2V0JTIwbmVja2xhY2UlMjBlYXJyaW5ncyUyMGJyYWNlbGV0fGVufDF8fHx8MTc3NDI0NjY1MXww&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 206,
      name: 'Pearl Rope Necklace',
      price: '$6,200',
      priceNum: 6200,
      metal: '18k Gold · Akoya Pearl',
      image: 'https://images.unsplash.com/photo-1682822749969-61a63203c501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGRyb3AlMjBlYXJyaW5ncyUyMGx1eHVyeSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzQyNDY2NTB8MA&ixlib=rb-4.1.0&q=80&w=400',
      isNew: true
    }]
  },
  Bracelets: {
    hero: 'https://images.unsplash.com/photo-1763029513623-37d488cb97b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwdGVubmlzJTIwYnJhY2VsZXQlMjBsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc3NDI0NjY1MHww&ixlib=rb-4.1.0&q=80&w=1080',
    subtitle: 'Bangles, cuffs and tennis bracelets that transform every gesture.',
    editorial: 'Adorned at Every Turn',
    products: [{
      id: 301,
      name: 'Diamond Tennis Bracelet',
      price: '$18,500',
      priceNum: 18500,
      metal: 'Platinum · 5ct Total',
      image: 'https://images.unsplash.com/photo-1763029513623-37d488cb97b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwdGVubmlzJTIwYnJhY2VsZXQlMjBsdXh1cnklMjBqZXdlbHJ5fGVufDF8fHx8MTc3NDI0NjY1MHww&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'ICONIC'
    }, {
      id: 302,
      name: 'Gold Bangle Stack',
      price: '$4,800',
      priceNum: 4800,
      metal: '18k Yellow Gold · Set of 3',
      image: 'https://images.unsplash.com/photo-1758995116383-f51775896add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFuZ2xlJTIwYnJhY2VsZXQlMjBzdGFjayUyMHdyaXN0JTIwbHV4dXJ5fGVufDF8fHx8MTc3NDI0NjY1Nnww&ixlib=rb-4.1.0&q=80&w=400',
      isNew: true
    }, {
      id: 303,
      name: 'Pearl Charm Bracelet',
      price: '$3,200',
      priceNum: 3200,
      metal: '18k Gold · Freshwater Pearl',
      image: 'https://images.unsplash.com/photo-1682822749969-61a63203c501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGRyb3AlMjBlYXJyaW5ncyUyMGx1eHVyeSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzQyNDY2NTB8MA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 304,
      name: 'Sapphire Cuff',
      price: '$9,600',
      priceNum: 9600,
      metal: '18k White Gold · Ceylon Sapphire',
      image: 'https://images.unsplash.com/photo-1735480165158-e645caaf1695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGdvbGQlMjByaW5nJTIwbHV4dXJ5JTIwamV3ZWxyeSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzQyNDY2NTN8MA&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'EXCLUSIVE'
    }, {
      id: 305,
      name: 'Diamond Pavé Cuff',
      price: '$14,200',
      priceNum: 14200,
      metal: 'Platinum · Full Pavé',
      image: 'https://images.unsplash.com/photo-1648564585735-19491888545c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGVybml0eSUyMGJhbmQlMjB3ZWRkaW5nJTIwcmluZyUyMGRpYW1vbmRzJTIwbHV4dXJ5fGVufDF8fHx8MTc3NDI0NjY2Mnww&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 306,
      name: 'Jewelry Signature Set',
      price: '$8,800',
      priceNum: 8800,
      metal: '18k Gold · Exclusive',
      image: 'https://images.unsplash.com/photo-1773913490635-44e688001528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwc2V0JTIwbmVja2xhY2UlMjBlYXJyaW5ncyUyMGJyYWNlbGV0fGVufDF8fHx8MTc3NDI0NjY1MXww&ixlib=rb-4.1.0&q=80&w=400',
      isNew: true
    }]
  },
  Earrings: {
    hero: 'https://images.unsplash.com/photo-1682822749969-61a63203c501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGRyb3AlMjBlYXJyaW5ncyUyMGx1eHVyeSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzQyNDY2NTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    subtitle: 'Studs, drops and chandeliers that illuminate every face with brilliance.',
    editorial: 'Framing Perfection',
    products: [{
      id: 401,
      name: 'Pearl Drop Earrings',
      price: '$4,600',
      priceNum: 4600,
      metal: '18k Gold · South Sea Pearl',
      image: 'https://images.unsplash.com/photo-1682822749969-61a63203c501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGRyb3AlMjBlYXJyaW5ncyUyMGx1eHVyeSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzQyNDY2NTB8MA&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'BESTSELLER'
    }, {
      id: 402,
      name: 'Diamond Hoop Earrings',
      price: '$7,200',
      priceNum: 7200,
      metal: '18k Yellow Gold · Pavé',
      image: 'https://images.unsplash.com/photo-1625516152414-8f33eef3d660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwaG9vcCUyMGVhcnJpbmdzJTIwZ29sZCUyMGx1eHVyeSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzc0MjQ2NjU2fDA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 403,
      name: 'Cluster Stud Earrings',
      price: '$5,400',
      priceNum: 5400,
      metal: '18k White Gold · 1.2ct Cluster',
      image: 'https://images.unsplash.com/photo-1723361656146-f201d215c49c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbHVzdGVyJTIwZGlhbW9uZCUyMHN0dWQlMjBlYXJyaW5ncyUyMHdoaXRlJTIwZ29sZHxlbnwxfHx8fDE3NzQyNDY2NjJ8MA&ixlib=rb-4.1.0&q=80&w=400',
      isNew: true
    }, {
      id: 404,
      name: 'Sapphire Drop Earrings',
      price: '$9,800',
      priceNum: 9800,
      metal: 'Platinum · Oval Sapphire',
      image: 'https://images.unsplash.com/photo-1735480165158-e645caaf1695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGdvbGQlMjByaW5nJTIwbHV4dXJ5JTIwamV3ZWxyeSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzQyNDY2NTN8MA&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'EXCLUSIVE'
    }, {
      id: 405,
      name: 'Ruby Chandelier Earrings',
      price: '$11,500',
      priceNum: 11500,
      metal: '18k Gold · Pigeon Blood Ruby',
      image: 'https://images.unsplash.com/photo-1636730510270-292129a416f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydWJ5JTIwZ2Vtc3RvbmUlMjBjb2NrdGFpbCUyMHJpbmclMjBnb2xkJTIwbHV4dXJ5fGVufDF8fHx8MTc3NDI0NjY2MXww&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 406,
      name: 'Diamond Stud Solitaire',
      price: '$6,400',
      priceNum: 6400,
      metal: 'Platinum · 0.8ct Each',
      image: 'https://images.unsplash.com/photo-1773913753908-860293e9deef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwc29saXRhaXJlJTIwbmVja2xhY2UlMjBmaW5lJTIwamV3ZWxyeSUyMG1pbmltYWx8ZW58MXx8fHwxNzc0MjQ2NjYxfDA&ixlib=rb-4.1.0&q=80&w=400',
      isNew: true
    }]
  },
  Engagement: {
    hero: 'https://images.unsplash.com/photo-1613945409199-1b5527d31fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdhZ2VtZW50JTIwcmluZyUyMHNvbGl0YWlyZSUyMGRpYW1vbmQlMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc3NDI0NjY1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    subtitle: 'Rings that mark the beginning of forever, chosen with uncompromising care.',
    editorial: 'Begin With a Promise',
    products: [{
      id: 501,
      name: 'Classic Solitaire Ring',
      price: '$14,500',
      priceNum: 14500,
      metal: 'Platinum · Round Brilliant 1.5ct',
      image: 'https://images.unsplash.com/photo-1613945409199-1b5527d31fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdhZ2VtZW50JTIwcmluZyUyMHNvbGl0YWlyZSUyMGRpYW1vbmQlMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc3NDI0NjY1MXww&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'ICONIC'
    }, {
      id: 502,
      name: 'Halo Diamond Ring',
      price: '$18,800',
      priceNum: 18800,
      metal: 'Platinum · 2.0ct Centre',
      image: 'https://images.unsplash.com/photo-1662434921251-a6eba45ac40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZ3MlMjB3aGl0ZSUyMGJhY2tncm91bmQlMjBqZXdlbHJ5fGVufDF8fHx8MTc3NDI0NjY0OXww&ixlib=rb-4.1.0&q=80&w=400',
      isNew: true
    }, {
      id: 503,
      name: 'Three-Stone Eternity',
      price: '$26,000',
      priceNum: 26000,
      metal: 'Platinum · Past Present Future',
      image: 'https://images.unsplash.com/photo-1736154577794-65871df026ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJlZSUyMHN0b25lJTIwZW5nYWdlbWVudCUyMHJpbmclMjBkaWFtb25kJTIwcGxhdGludW18ZW58MXx8fHwxNzc0MjQ2NjYyfDA&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'EXCLUSIVE'
    }, {
      id: 504,
      name: 'Sapphire Engagement Ring',
      price: '$22,400',
      priceNum: 22400,
      metal: '18k White Gold · Royal Blue',
      image: 'https://images.unsplash.com/photo-1735480165158-e645caaf1695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGdvbGQlMjByaW5nJTIwbHV4dXJ5JTIwamV3ZWxyeSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzQyNDY2NTN8MA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 505,
      name: 'Bridal Diamond Band',
      price: '$9,800',
      priceNum: 9800,
      metal: 'Platinum · Eternity Style',
      image: 'https://images.unsplash.com/photo-1648564585735-19491888545c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGVybml0eSUyMGJhbmQlMjB3ZWRkaW5nJTIwcmluZyUyMGRpYW1vbmRzJTIwbHV4dXJ5fGVufDF8fHx8MTc3NDI0NjY2Mnww&ixlib=rb-4.1.0&q=80&w=400',
      isNew: true
    }, {
      id: 506,
      name: 'Emerald Cut Solitaire',
      price: '$31,500',
      priceNum: 31500,
      metal: 'Platinum · 3.5ct Emerald Cut',
      image: 'https://images.unsplash.com/photo-1709980378295-790d8a3c37e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwYnJpZGFsJTIwc2V0JTIwcmluZ3MlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc0MjQ2NjYzfDA&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'RARE'
    }]
  },
  Sets: {
    hero: 'https://images.unsplash.com/photo-1773913490635-44e688001528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwc2V0JTIwbmVja2xhY2UlMjBlYXJyaW5ncyUyMGJyYWNlbGV0fGVufDF8fHx8MTc3NDI0NjY1MXww&ixlib=rb-4.1.0&q=80&w=1080',
    subtitle: 'Perfectly curated sets — every piece made to complement, to elevate, to last.',
    editorial: 'The Complete Story',
    products: [{
      id: 601,
      name: 'Diamond Suite Set',
      price: '$42,000',
      priceNum: 42000,
      metal: 'Platinum · Necklace, Earrings, Ring',
      image: 'https://images.unsplash.com/photo-1773913490635-44e688001528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwc2V0JTIwbmVja2xhY2UlMjBlYXJyaW5ncyUyMGJyYWNlbGV0fGVufDF8fHx8MTc3NDI0NjY1MXww&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'EXCLUSIVE'
    }, {
      id: 602,
      name: 'Pearl Signature Set',
      price: '$18,500',
      priceNum: 18500,
      metal: '18k Gold · Pearl Collection',
      image: 'https://images.unsplash.com/photo-1682822749969-61a63203c501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGRyb3AlMjBlYXJyaW5ncyUyMGx1eHVyeSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzQyNDY2NTB8MA&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 603,
      name: 'Sapphire Parure Set',
      price: '$55,000',
      priceNum: 55000,
      metal: 'Platinum · Royal Blue Sapphire',
      image: 'https://images.unsplash.com/photo-1735480165158-e645caaf1695?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGdvbGQlMjByaW5nJTIwbHV4dXJ5JTIwamV3ZWxyeSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzQyNDY2NTN8MA&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'RARE'
    }, {
      id: 604,
      name: 'Bridal Complete Set',
      price: '$38,000',
      priceNum: 38000,
      metal: 'Platinum · Engagement & Wedding',
      image: 'https://images.unsplash.com/photo-1709980378295-790d8a3c37e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBqZXdlbHJ5JTIwYnJpZGFsJTIwc2V0JTIwcmluZ3MlMjBlZGl0b3JpYWx8ZW58MXx8fHwxNzc0MjQ2NjYzfDA&ixlib=rb-4.1.0&q=80&w=400',
      isNew: true
    }, {
      id: 605,
      name: 'Classic Gold Set',
      price: '$22,800',
      priceNum: 22800,
      metal: '18k Yellow Gold · 4-Piece',
      image: 'https://images.unsplash.com/photo-1758995116383-f51775896add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFuZ2xlJTIwYnJhY2VsZXQlMjBzdGFjayUyMHdyaXN0JTIwbHV4dXJ5fGVufDF8fHx8MTc3NDI0NjY1Nnww&ixlib=rb-4.1.0&q=80&w=400'
    }, {
      id: 606,
      name: 'Ruby Parure Collection',
      price: '$64,000',
      priceNum: 64000,
      metal: '18k Gold · Burmese Ruby Suite',
      image: 'https://images.unsplash.com/photo-1636730510270-292129a416f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydWJ5JTIwZ2Vtc3RvbmUlMjBjb2NrdGFpbCUyMHJpbmclMjBnb2xkJTIwbHV4dXJ5fGVufDF8fHx8MTc3NDI0NjY2MXww&ixlib=rb-4.1.0&q=80&w=400',
      tag: 'RARE'
    }]
  }
};
Object.keys(catalogue).forEach(name => {
  catalogue[name] = {
    ...catalogue[name],
    products: withScopedProductIds(catalogue[name].products, `category-${name}`)
  };
});
const mapMergedProduct = (product, sourceType, sourceName) => ({
  ...product,
  sourceType,
  sourceLabel: sourceName
});
catalogue.Jewelry = {
  hero: 'https://images.unsplash.com/photo-1729641246245-64405c363263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHdlYXJpbmclMjBsdXh1cnklMjBkaWFtb25kJTIwamV3ZWxyeSUyMGF2YW50LWdhcmRlfGVufDF8fHx8MTc3Njc2NTMxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  subtitle: 'Explore every signature category and curated collection in one complete jewelry edit.',
  editorial: 'Complete House Selection',
  products: [...Object.entries(catalogue).filter(([name]) => name !== 'Jewelry').flatMap(([name, section]) => section.products.map(product => mapMergedProduct(product, 'category', name))), ...Object.entries(collectionsData).flatMap(([name, section]) => section.products.map(product => mapMergedProduct(product, 'collection', name)))]
};
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'New Arrivals'];
const FILTER_METALS = ['All', 'Platinum', '18k Yellow Gold', '18k White Gold', '18k Rose Gold'];
export function CategoryPage({
  category,
  onCategoryChange,
  onBack,
  wishlist,
  toggleWishlist,
  addToCart,
  addedIds,
  onProductClick
}) {
  const data = catalogue[category];
  const [sort, setSort] = useState('Featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [metalFilter, setMetalFilter] = useState('All Materials');
  const [priceFilter, setPriceFilter] = useState('All Prices');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('Category');
  useEffect(() => {
    setSort('Featured');
    setMetalFilter('All Materials');
    setPriceFilter('All Prices');
    setSortOpen(false);
    setFilterDrawerOpen(false);
  }, [category]);
  const availableMetals = useMemo(() => {
    if (!data) return ['All Materials'];
    const metals = new Set(data.products.map(p => {
      const parts = p.metal.split('·');
      return parts[0].trim();
    }));
    return ['All Materials', ...Array.from(metals).sort()];
  }, [data]);
  const filtered = useMemo(() => {
    let list = [...data.products];
    if (metalFilter !== 'All Materials') {
      list = list.filter(p => p.metal.includes(metalFilter));
    }
    if (priceFilter !== 'All Prices') {
      if (priceFilter === 'Under $2,000') list = list.filter(p => p.priceNum < 2000);else if (priceFilter === '$2,000 - $5,000') list = list.filter(p => p.priceNum >= 2000 && p.priceNum <= 5000);else if (priceFilter === 'Over $5,000') list = list.filter(p => p.priceNum > 5000);
    }
    if (sort === 'Price: Low to High') list.sort((a, b) => a.priceNum - b.priceNum);
    if (sort === 'Price: High to Low') list.sort((a, b) => b.priceNum - a.priceNum);
    if (sort === 'New Arrivals') list = [...list.filter(p => p.isNew), ...list.filter(p => !p.isNew)];
    return list;
  }, [data.products, sort, metalFilter, priceFilter]);
  const finalItems = useMemo(() => buildShopByLookGridItems(filtered, {
    enabled: category !== 'Jewelry'
  }), [filtered, category]);
  return <div className="min-h-screen bg-white" style={{
    fontFamily: "'Cormorant Garamond', serif"
  }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[520px] overflow-hidden">
        <ImageWithFallback src={data.hero} alt={category} className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[3000ms]" />
        {/* No darkening overlay — full colour as per brief */}

        {/* Breadcrumb */}
        <div className="absolute top-8 left-8 flex items-center gap-2 z-10">
          <button onClick={onBack} className="text-white/70 hover:text-white transition-colors text-xs tracking-[0.2em] uppercase">
            Home
          </button>
          <ChevronRight size={12} className="text-white/40" />
          <span className="text-white text-xs tracking-[0.2em] uppercase">{category}</span>
        </div>

        {/* Centred editorial text */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 text-center px-6 z-10">
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-white/60 text-[10px] tracking-[0.5em] uppercase mb-4">
            {data.editorial}
          </motion.p>
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.9,
          delay: 0.1
        }} className="text-white text-6xl md:text-8xl lg:text-[110px] leading-none mb-6" style={{
          fontWeight: 300,
          letterSpacing: '-0.01em'
        }}>
            {category}
          </motion.h1>
          <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 1,
          delay: 0.4
        }} className="text-white/70 text-lg max-w-xl" style={{
          fontWeight: 300,
          lineHeight: 1.7
        }}>
            {data.subtitle}
          </motion.p>
        </div>
      </section>

      {/* ── FILTER / SORT BAR ─────────────────────────────── */}
      <div className="relative z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 px-6">
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
          }}>{filtered.length} Results</span>
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
                {SORT_OPTIONS.map(option => <button key={option} onClick={() => {
              setSort(option);
              setSortOpen(false);
            }} className={`block w-full text-left px-6 py-2 text-sm tracking-wide hover:bg-gray-50 ${sort === option ? 'font-medium' : 'font-light text-gray-600'}`}>
                    {option}
                  </button>)}
              </div>}
          </div>
        </div>
      </div>

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
            
            {/* Category Accordion */}
            <div className="border-b border-gray-100 pb-4">
              <button className="w-full flex items-center justify-between py-2 text-sm tracking-widest uppercase font-light hover:text-gray-500" onClick={() => setOpenAccordion(openAccordion === 'Category' ? null : 'Category')}>
                <span>Category</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${openAccordion === 'Category' ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openAccordion === 'Category' ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="space-y-3 pb-2">
                  {Object.keys(catalogue).map(option => <button key={option} onClick={() => {
                  if (onCategoryChange && option !== category) {
                    onCategoryChange(option);
                  }
                }} className="flex items-center w-full group">
                      <div className={`w-4 h-4 border flex items-center justify-center mr-4 transition-colors ${category === option ? 'border-black bg-black text-white' : 'border-gray-300 bg-transparent group-hover:border-black'}`}>
                        {category === option && <Check size={12} />}
                      </div>
                      <span className={`text-sm tracking-wide ${category === option ? 'font-medium' : 'font-light text-gray-600 group-hover:text-black'}`}>{option}</span>
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
            {(metalFilter !== 'All Materials' || priceFilter !== 'All Prices') && <div className="pt-4">
                <h3 className="text-xs uppercase tracking-widest text-gray-400 mb-3">Applied Filters</h3>
                <div className="flex flex-wrap gap-2">
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
            }} className="text-xs uppercase tracking-widest text-gray-500 hover:text-black mt-4 block underline underline-offset-4">
                  Clear All
                </button>
              </div>}

          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-gray-200 shrink-0">
            <button onClick={() => setFilterDrawerOpen(false)} className="w-full bg-black text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors">
              View {filtered.length} Results
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── PRODUCT GRID ──────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">
        {filtered.length === 0 ? <div className="text-center py-40">
            <p className="text-4xl text-gray-200 mb-6" style={{
          fontWeight: 300
        }}>No pieces found</p>
            <button onClick={() => {
          setMetalFilter('All Materials');
          setPriceFilter('All Prices');
        }} className="text-[10px] tracking-[0.25em] uppercase border-b border-gray-300 pb-0.5 hover:border-black transition-colors">
              Clear filters
            </button>
          </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
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
              duration: 0.7,
              delay: item.productIndex % 3 * 0.12
            }} viewport={{
              once: true,
              margin: '-60px'
            }} className="group cursor-pointer" onClick={() => onProductClick(product)}>
                  {/* Image container */}
                  <div className="relative overflow-hidden bg-[#f7f7f7] aspect-[3/4] mb-6">

                    {/* Product image — cinematic zoom */}
                    <ImageWithFallback src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1200ms] ease-out group-hover:scale-110 group-hover:opacity-0" />
                    <ImageWithFallback src={getProductHoverImage(product)} alt={`${product.name} styled on model`} className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-all duration-[1200ms] ease-out group-hover:scale-105 group-hover:opacity-100" />

                    {/* Wishlist heart — appears on hover */}
                    <button onClick={e => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }} className="absolute top-5 right-5 z-10 p-2 bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white" aria-label="Add to wishlist">
                      <Heart size={16} strokeWidth={1.5} className={wishlist.has(product.id) ? 'fill-black text-black' : 'fill-none text-black'} />
                    </button>

                    {/* Tiffany-style "Add to Bag" — slides up from bottom */}
                    <button onClick={e => {
                  e.stopPropagation();
                  addToCart(product);
                }} className="absolute bottom-0 left-0 right-0 z-10 py-4 transition-all duration-300 ease-out translate-y-full group-hover:translate-y-0" style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: '10px',
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  background: addedIds.has(product.id) ? '#1a1a1a' : '#000',
                  color: '#fff'
                }}>
                      {addedIds.has(product.id) ? '✓  Added to Bag' : 'Add to Bag'}
                    </button>
                  </div>

                  {/* Product info */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className="text-sm uppercase tracking-[0.12em] text-black mb-1.5 leading-snug" style={{
                    fontWeight: 400
                  }}>
                        {product.name}
                      </h3>
                      <p className="text-base text-black" style={{
                    fontWeight: 300,
                    letterSpacing: '0.05em'
                  }}>
                        {product.price}
                      </p>
                    </div>
                    {/* Quick wishlist always-visible */}
                    <button onClick={e => {
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }} className="mt-1 text-gray-300 hover:text-black transition-colors" aria-label="Wishlist">
                      <Heart size={16} strokeWidth={1.2} className={wishlist.has(product.id) ? 'fill-black text-black' : 'fill-none'} />
                    </button>
                  </div>
                </motion.div>;
        })}
          </div>}

        {/* ── Editorial bottom strip ── */}
        <div className="mt-32 border-t border-gray-100 pt-16 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-md">
            <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 block mb-4">Our Promise</span>
            <p className="text-gray-500" style={{
            fontWeight: 300,
            lineHeight: 1.9
          }}>
              Every Unicorn Jewels piece arrives in our signature gift box with a certificate of authenticity, complimentary engraving, and lifetime care.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[{
            label: 'Complimentary Shipping',
            sub: 'On all orders'
          }, {
            label: 'Signature Packaging',
            sub: 'Included with every purchase'
          }, {
            label: 'Lifetime Care',
            sub: 'Free cleaning & resizing'
          }].map(s => <div key={s.label} className="flex items-center gap-4">
                <div className="w-[1px] h-8 bg-gray-200" />
                <div>
                  <p className="text-xs tracking-wider text-black" style={{
                fontWeight: 400
              }}>{s.label}</p>
                  <p className="text-[10px] text-gray-400">{s.sub}</p>
                </div>
              </div>)}
          </div>
        </div>
      </section>
    </div>;
}
export { catalogue };
