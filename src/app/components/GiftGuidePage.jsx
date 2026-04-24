import { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Gift, Package, Sparkles, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const giftCategories = [
  {
    title: 'For Her',
    subtitle: 'Elegant and timeless pieces for every celebration.',
    pieces: '42 pieces',
    range: '$500 - $5,000',
    image:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: 'For Him',
    subtitle: 'Bold silhouettes with a refined, modern finish.',
    pieces: '28 pieces',
    range: '$800 - $8,000',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: 'Anniversary',
    subtitle: 'Celebrate love with statement heirlooms.',
    pieces: '31 pieces',
    range: '$1,000 - $15,000',
    image:
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: 'Birthday',
    subtitle: 'Meaningful gifts with everyday brilliance.',
    pieces: '36 pieces',
    range: '$300 - $3,000',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: 'Graduation',
    subtitle: 'Milestone-worthy keepsakes for a new chapter.',
    pieces: '24 pieces',
    range: '$400 - $2,500',
    image:
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
  {
    title: 'Just Because',
    subtitle: 'Spontaneous joy, wrapped with intention.',
    pieces: '19 pieces',
    range: '$250 - $4,000',
    image:
      'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

const packagingOptions = [
  {
    icon: Package,
    title: 'Signature Gift Box',
    detail: 'Elegant black box with gold foil logo.',
    note: 'Complimentary',
  },
  {
    icon: Star,
    title: 'Premium Gift Bag',
    detail: 'Luxe velvet bag finished with a satin ribbon.',
    note: 'Orders over $1,000',
  },
  {
    icon: Sparkles,
    title: 'Personalized Card',
    detail: 'A handwritten message on premium cardstock.',
    note: 'Add at checkout',
  },
];

export function GiftGuidePage({ onBack }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
              <span>Gift Guide</span>
            </div>
            <h1 className="max-w-3xl text-5xl leading-[0.95] md:text-7xl">
              The Perfect Gift
              <span className="italic text-gray-400"> Awaits</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
              Discover curated jewelry gifts for every milestone, each presented
              with refined packaging and thoughtful finishing touches.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-black/10 bg-[#faf8f5] p-5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
                  Included
                </p>
                <p className="mt-3 text-2xl">Complimentary Gift Packaging</p>
              </div>
              <div className="rounded-3xl border border-black/10 bg-[#f5f5f5] p-5">
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500">
                  Optional
                </p>
                <p className="mt-3 text-2xl">Personalized Message Cards</p>
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
                src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="Luxury jewelry gift presentation"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/70">
                  Curated by Occasion
                </p>
                <p className="mt-3 max-w-sm text-3xl leading-tight">
                  Gifts chosen to feel personal before the box is even opened.
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
                Shop by Occasion
              </p>
              <h2 className="mt-4 text-4xl md:text-5xl">
                Curated gift directions for every kind of moment.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-gray-600">
              Explore our edit for anniversaries, birthdays, graduations, and
              more. Each selection is designed to make choosing feel effortless.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {giftCategories.map((category, index) => (
              <motion.article
                key={category.title}
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
              Luxury Packaging
            </p>
            <h2 className="mt-4 text-4xl md:text-5xl">
              Every detail is part of the gift.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {packagingOptions.map((option, index) => {
              const Icon = option.icon;

              return (
                <motion.div
                  key={option.title}
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
            Concierge Support
          </p>
          <h2 className="mt-4 text-4xl md:text-6xl">
            Need help choosing something unforgettable?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Our team can help you select a piece based on recipient, occasion,
            and budget, then finish it with the right presentation.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="mailto:concierge@unicornjewels.com?subject=Gift%20Consultation"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-8 py-3 text-xs uppercase tracking-[0.3em] text-black transition-transform hover:scale-[1.02]"
            >
              Book Consultation
            </a>
            <a
              href="mailto:hello@unicornjewels.com"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 px-8 py-3 text-xs uppercase tracking-[0.3em] text-white transition-colors hover:border-white hover:bg-white hover:text-black"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default GiftGuidePage;
