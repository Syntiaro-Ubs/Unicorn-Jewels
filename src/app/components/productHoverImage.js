const MODEL_IMAGE_POOLS = {
  rings: [
    'https://images.unsplash.com/photo-1729641246245-64405c363263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHdlYXJpbmclMjBsdXh1cnklMjBkaWFtb25kJTIwamV3ZWxyeSUyMGF2YW50LWdhcmRlfGVufDF8fHx8MTc3Njc2NTMxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1770062422744-dcecde9c84ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwamV3ZWxyeSUyMG1vZGVsJTIwZWRpdG9yaWFsJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3Njc2Mzg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  ],
  necklaces: [
    'https://images.unsplash.com/photo-1722410180670-b6d5a2e704fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwY2hhaW4lMjBsYXllcmVkJTIwbmVja2xhY2UlMjBsdXh1cnklMjB3b21hbnxlbnwxfHx8fDE3NzQyNDY2NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1772571092191-eb7010126fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBuZWNrbGFjZSUyMHBlbmRhbnQlMjBsdXh1cnl8ZW58MXx8fHwxNzc0MzQ5NjIzfDA&ixlib=rb-4.1.0&q=80&w=1080'
  ],
  earrings: [
    'https://images.unsplash.com/photo-1682822749969-61a63203c501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMGRyb3AlMjBlYXJyaW5ncyUyMGx1eHVyeSUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NzQyNDY2NTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWludHklMjBlYXJyaW5nc3xlbnwxfHx8fDE3NzQzNTIxNjV8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ],
  bracelets: [
    'https://images.unsplash.com/photo-1758995116383-f51775896add?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYmFuZ2xlJTIwYnJhY2VsZXQlMjBzdGFjayUyMHdyaXN0JTIwbHV4dXJ5fGVufDF8fHx8MTc3NDI0NjY1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1721206624552-d945fc1a3b8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYnJhY2VsZXQlMjBtb2Rlcm4lMjBkZXNpZ258ZW58MXx8fHwxNzc0MzQ5NjI2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  ],
  sets: [
    'https://images.unsplash.com/photo-1729641246245-64405c363263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHdlYXJpbmclMjBsdXh1cnklMjBkaWFtb25kJTIwamV3ZWxyeSUyMGF2YW50LWdhcmRlfGVufDF8fHx8MTc3Njc2NTMxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1770062422744-dcecde9c84ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwamV3ZWxyeSUyMG1vZGVsJTIwZWRpdG9yaWFsJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3Njc2Mzg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  ],
  general: [
    'https://images.unsplash.com/photo-1729641246245-64405c363263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHdlYXJpbmclMjBsdXh1cnklMjBkaWFtb25kJTIwamV3ZWxyeSUyMGF2YW50LWdhcmRlfGVufDF8fHx8MTc3Njc2NTMxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1770062422744-dcecde9c84ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwamV3ZWxyeSUyMG1vZGVsJTIwZWRpdG9yaWFsJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3Njc2Mzg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  ]
};

function hashValue(value) {
  return Array.from(String(value)).reduce((total, char) => total + char.charCodeAt(0), 0);
}

function inferProductFamily(product) {
  const label = `${product.name} ${product.sourceLabel ?? ''}`.toLowerCase();

  if (label.includes('ring') || label.includes('solitaire') || label.includes('band') || label.includes('signet')) {
    return 'rings';
  }

  if (label.includes('necklace') || label.includes('pendant') || label.includes('chain') || label.includes('collar')) {
    return 'necklaces';
  }

  if (label.includes('earring') || label.includes('stud')) {
    return 'earrings';
  }

  if (label.includes('bracelet') || label.includes('cuff') || label.includes('bangle')) {
    return 'bracelets';
  }

  if (label.includes('set') || label.includes('suite') || label.includes('parure') || label.includes('collection')) {
    return 'sets';
  }

  return 'general';
}

export function getProductHoverImage(product) {
  if (product.hoverImage) {
    return product.hoverImage;
  }

  if (product.modelImage) {
    return product.modelImage;
  }

  const family = inferProductFamily(product);
  const pool = MODEL_IMAGE_POOLS[family] ?? MODEL_IMAGE_POOLS.general;
  return pool[hashValue(product.id) % pool.length];
}
