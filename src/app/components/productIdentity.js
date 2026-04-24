function slugifyScope(value) {
  return String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function withScopedProductIds(products, scope) {
  const normalizedScope = slugifyScope(scope);
  return products.map(product => {
    const rawId = String(product.id);
    const scopedId = rawId.startsWith(`${normalizedScope}-`) ? rawId : `${normalizedScope}-${rawId}`;
    return {
      ...product,
      id: scopedId
    };
  });
}

export function buildProductIndex(products) {
  return products.reduce((index, product) => {
    index.set(product.id, product);
    return index;
  }, new Map());
}
