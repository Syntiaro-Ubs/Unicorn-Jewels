import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const looks = {
  sculptural: {
    image: 'https://images.unsplash.com/photo-1770062422744-dcecde9c84ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwamV3ZWxyeSUyMG1vZGVsJTIwZWRpdG9yaWFsJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3Njc2Mzg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    eyebrow: 'Shop by Look',
    title: 'The Sculptural Edit',
    description: 'Bold forms, polished metal, and high-jewelry silhouettes curated for statement dressing.',
    contentAlign: 'left'
  },
  vault: {
    image: 'https://images.unsplash.com/photo-1614999612412-3b1dbcd68e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwamV3ZWxyeSUyMGRpYW1vbmQlMjBuZWNrbGFjZSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzc2NzY1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    eyebrow: 'Shop by Look',
    title: 'The Evening Vault',
    description: 'Rare stones and luminous settings assembled for private viewings and after-dark occasions.',
    contentAlign: 'center'
  }
};
const contentAlignClasses = {
  left: 'items-start text-left',
  center: 'items-center text-center',
  right: 'items-end text-right'
};
const contentWidthClasses = {
  left: '',
  center: 'mx-auto',
  right: 'ml-auto'
};

export function ShopByLookBlock({
  variant = 'sculptural',
  contentAlign
}) {
  const look = looks[variant] ?? looks.sculptural;
  const resolvedContentAlign = contentAlign ?? look.contentAlign ?? 'left';
  const resolvedAlignClass = contentAlignClasses[resolvedContentAlign] ?? contentAlignClasses.left;
  const resolvedWidthClass = contentWidthClasses[resolvedContentAlign] ?? contentWidthClasses.left;

  return <motion.div initial={{
    opacity: 0,
    y: 40
  }} whileInView={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.7
  }} viewport={{
    once: true,
    margin: '-60px'
  }} className="group relative overflow-hidden border border-gray-100 bg-black aspect-[4/5] min-h-[360px]">
      <ImageWithFallback src={look.image} alt={look.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

      <div className={`relative z-10 flex h-full flex-col justify-end gap-4 p-6 text-white sm:p-8 ${resolvedAlignClass}`}>
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/75">{look.eyebrow}</span>
        <div className={`space-y-3 ${resolvedWidthClass}`}>
          <h3 className="text-3xl leading-tight" style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300
        }}>
            {look.title}
          </h3>
          <p className="max-w-[18rem] text-sm leading-relaxed text-white/80" style={{
          fontWeight: 300
        }}>
            {look.description}
          </p>
        </div>
      </div>
    </motion.div>;
}
