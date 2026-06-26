import { useEffect, useState } from 'react';
import { API_BASE } from '@/config';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import defaultPageContent from '../../../shared/pageContentDefaults.json';

const STORY_DEFAULTS = defaultPageContent.story;

const STORY_BANNER_DEFAULTS = {
  title: 'The',
  subtitle: 'Vision',
  description: 'We engineer future heirlooms. Our pursuit of perfection transcends traditional boundaries, fusing raw elemental power with avant-garde architectural precision.',
  imageUrl: 'https://images.unsplash.com/photo-1770062421988-7929b4748e29?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwbHV4dXJ5JTIwamV3ZWxyeSUyMGVkaXRvcmlhbCUyMGJsYWNrJTIwYW5kJTIwd2hpdGV8ZW58MXx8fHwxNzc2NzU1NDA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
};

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
  title: bannerContent?.title || STORY_BANNER_DEFAULTS.title,
  subtitle: bannerContent?.subtitle || STORY_BANNER_DEFAULTS.subtitle,
  description: bannerContent?.description || STORY_BANNER_DEFAULTS.description,
  imageUrl: bannerContent?.imageUrl || STORY_BANNER_DEFAULTS.imageUrl
});

export const OurStoryPage = ({ onBack, bannerContent }) => {
  const [content, setContent] = useState(() => cloneContent(STORY_DEFAULTS));

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
        const response = await fetch(`${API_BASE}/api/content/page-content/story`);
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        if (isMounted) {
          setContent(mergeWithDefaults(STORY_DEFAULTS, data));
        }
      } catch (error) {
        console.error('Error fetching story page content:', error);
      }
    };

    fetchPageContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const hero = resolveBanner(bannerContent);

  return (
    <div className="min-h-screen bg-white text-black font-serif overflow-hidden">
      <header className="fixed top-0 w-full z-50 mix-blend-difference text-white">
        <div className="max-w-[1600px] mx-auto px-6 py-8 flex justify-between items-center">
          <button onClick={onBack} className="flex items-center gap-3 text-xs tracking-[0.3em] uppercase hover:opacity-50 transition-opacity font-sans">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div className="text-xs tracking-[0.4em] uppercase font-sans">
            Unicorn Jewels
          </div>
        </div>
      </header>

      <section className="relative w-full h-screen flex flex-col md:flex-row items-center justify-center">
        <div className="w-full md:w-[60%] h-full flex flex-col justify-center px-12 md:pl-[10%] md:pr-24 z-10 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="block text-xs font-sans tracking-[0.5em] uppercase text-gray-400 mb-8">{content.hero.eyebrow}</span>
            <h1 className="text-7xl md:text-9xl tracking-tight leading-[0.85] mb-12">
              {hero.title} <br />
              <span className="italic text-[#C0C0C0]">{hero.subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-600 max-w-xl leading-relaxed">
              {hero.description}
            </p>
          </motion.div>
        </div>

        <div className="w-full md:w-[40%] h-[50vh] md:h-full relative overflow-hidden">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <ImageWithFallback src={hero.imageUrl} alt="Vision page hero" className="w-full h-full object-cover grayscale" />
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
          </motion.div>
        </div>
      </section>

      <section className="py-32 px-6 bg-black text-white relative">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl md:text-6xl font-light leading-snug italic mb-12">
              "{content.quote.text}"
            </h2>
            <div className="w-[1px] h-24 bg-[#C0C0C0] mx-auto opacity-50"></div>
          </motion.div>
        </div>
      </section>

      <section className="py-32 md:py-48 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="md:col-span-5 order-2 md:order-1 relative"
          >
            <div className="aspect-[3/4] w-full overflow-hidden">
              <ImageWithFallback src={content.craft.image_url} alt="Vision craft section" className="w-full h-full object-cover grayscale contrast-125" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-gray-100 -z-10 mix-blend-multiply hidden md:block"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="md:col-span-6 md:col-start-7 order-1 md:order-2 flex flex-col justify-center"
          >
            <span className="block text-xs font-sans tracking-[0.5em] uppercase text-gray-400 mb-8">{content.craft.eyebrow}</span>
            <h2 className="text-5xl md:text-7xl tracking-tight mb-12">
              {content.craft.title} <br />
              <span className="italic text-[#C0C0C0]">{content.craft.accent}</span>
            </h2>

            <div className="space-y-8 text-lg font-light text-gray-600 leading-relaxed max-w-lg">
              <p>{content.craft.paragraph_one}</p>
              <p>{content.craft.paragraph_two}</p>
            </div>

            <div className="mt-16 pt-16 border-t border-gray-200">
              <p className="text-sm font-sans tracking-widest uppercase text-black">
                {content.craft.footer}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="min-h-screen relative flex items-center justify-center py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback src={content.finale.image_url} alt="Vision closing section" className="w-full h-full object-cover grayscale opacity-20" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <div className="w-[1px] h-24 bg-black mx-auto mb-12"></div>
          <h2 className="text-6xl md:text-8xl tracking-tighter mb-10">
            {content.finale.title_line_one} <span className="italic text-[#C0C0C0]">{content.finale.accent_one}</span><br />
            {content.finale.title_line_two} <span className="italic text-[#C0C0C0]">{content.finale.accent_two}</span>
          </h2>
          <button onClick={onBack} className="group mt-16 flex items-center justify-center gap-4 text-xs font-sans uppercase tracking-[0.2em] text-black hover:text-gray-500 transition-colors mx-auto">
            <span>{content.finale.button_text}</span>
            <span className="w-8 h-[1px] bg-black group-hover:w-12 group-hover:bg-gray-500 transition-all duration-300"></span>
          </button>
        </motion.div>
      </section>
    </div>
  );
};
