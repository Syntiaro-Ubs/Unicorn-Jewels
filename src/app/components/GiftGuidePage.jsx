import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Gift, Package, Sparkles, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import defaultPageContent from '../../../shared/pageContentDefaults.json';

const GIFT_GUIDE_DEFAULTS = defaultPageContent['gift-guide'];

const GIFT_GUIDE_BANNER_DEFAULTS = {
  title: 'The Perfect Gift',
  subtitle: 'Awaits',
  description: 'Discover curated jewelry gifts for every milestone, each presented with refined packaging and thoughtful finishing touches.',
  imageUrl: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
};

const PACKAGING_ICONS = [Package, Star, Sparkles];

const cloneContent = (value) => JSON.parse(JSON.stringify(value));

const mergeWithDefaults = (defaults, incoming) => {
  if (Array.isArray(defaults)) {
    const source = Array.isArray(incoming) ? incoming : [];
    return defaults.map((item, index) => mergeWithDefaults(item, source[index]));
  }

  if (defaults && typeof defaults === 'object') {
    const source = incoming && typeof incoming === 'object' ? incoming : {};
    return Object.keys(defaults).reduce((acc, key) => {
      acc[key] = mergeWithDefaults(defaults[key], source[key]);
      return acc;
    }, {});
  }

  return incoming ?? defaults;
};

const resolveBanner = (bannerContent) => ({
  title: bannerContent?.title || GIFT_GUIDE_BANNER_DEFAULTS.title,
  subtitle: bannerContent?.subtitle || GIFT_GUIDE_BANNER_DEFAULTS.subtitle,
  description: bannerContent?.description || GIFT_GUIDE_BANNER_DEFAULTS.description,
  imageUrl: bannerContent?.imageUrl || GIFT_GUIDE_BANNER_DEFAULTS.imageUrl
});

export function GiftGuidePage({ onBack, bannerContent }) {
  const [content, setContent] = useState(() => cloneContent(GIFT_GUIDE_DEFAULTS));

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 50);

    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPageContent = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/content/page-content/gift-guide');
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (isMounted) {
          setContent(mergeWithDefaults(GIFT_GUIDE_DEFAULTS, data));
        }
      } catch (error) {
        console.error('Error fetching gift guide page content:', error);
      }
    };

    fetchPageContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const hero = resolveBanner(bannerContent);

  return (
    <div
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "'Cormorant Garamond', serif" }}
    >
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            onClick={onBack}
            className="flex min-h-11 items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-500 transition-colors hover:text-black"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <span className="text-xs uppercase tracking-[0.45em] text-gray-500">
            Unicorn Jewels
          </span>
        </div>
      </header>

      <section className="overflow-hidden px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-gray-500">
              <Gift size={16} />
              <span>{content.hero.eyebrow}</span>
            </div>
            <h1 className="max-w-3xl text-5xl leading-[0.95] md:text-7xl">
              {hero.title}
              <span className="italic text-gray-400"> {hero.subtitle}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              {hero.description}
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-black/10 bg-[#faf8f5] p-5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
                  {content.hero.included_label}
                </p>
                <p className="mt-3 text-2xl">{content.hero.included_text}</p>
              </div>
              <div className="rounded-3xl border border-black/10 bg-[#f5f5f5] p-5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
                  {content.hero.optional_label}
                </p>
                <p className="mt-3 text-2xl">{content.hero.optional_text}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-8 top-10 hidden h-24 w-24 rounded-full bg-[#f3eadf] blur-2xl md:block" />
            <div className="absolute -bottom-6 right-6 hidden h-28 w-28 rounded-full bg-[#ececec] blur-2xl md:block" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#f4f1ec]">
              <ImageWithFallback
                src={hero.imageUrl}
                alt="Luxury jewelry gift presentation"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/70">
                  {content.hero.image_eyebrow}
                </p>
                <p className="mt-3 max-w-sm text-3xl leading-tight">
                  {content.hero.image_headline}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-6 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
                {content.occasions.eyebrow}
              </p>
              <h2 className="mt-4 text-4xl md:text-5xl">
                {content.occasions.title}
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-gray-600">
              {content.occasions.description}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {content.categories.map((category, index) => (
              <motion.article
                key={`${category.title}-${index}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="group overflow-hidden rounded-[2rem] border border-black/10 bg-white"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                      {category.pieces}
                    </p>
                    <h3 className="mt-3 text-3xl">{category.title}</h3>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">
                      {category.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between px-6 py-5">
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Price Range
                  </span>
                  <span className="text-lg">{category.range}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5f2] px-6 py-20 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
              {content.packaging.eyebrow}
            </p>
            <h2 className="mt-4 text-4xl md:text-5xl">
              {content.packaging.title}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.packaging.items.map((option, index) => {
              const Icon = PACKAGING_ICONS[index] || Sparkles;

              return (
                <motion.div
                  key={`${option.title}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="rounded-[2rem] border border-black/10 bg-white p-8 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-6 text-3xl">{option.title}</h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    {option.detail}
                  </p>
                  <p className="mt-6 text-[10px] uppercase tracking-[0.35em] text-gray-500">
                    {option.note}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-black px-6 py-20 text-white md:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/60">
            {content.concierge.eyebrow}
          </p>
          <h2 className="mt-4 text-4xl md:text-6xl">
            {content.concierge.title}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            {content.concierge.description}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={content.concierge.primary_cta_url}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-8 py-3 text-xs uppercase tracking-[0.3em] text-black transition-transform hover:scale-[1.02]"
            >
              {content.concierge.primary_cta_text}
            </a>
            <a
              href={content.concierge.secondary_cta_url}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-8 py-3 text-xs uppercase tracking-[0.3em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              {content.concierge.secondary_cta_text}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GiftGuidePage;
