export const ALL_MATERIALS = 'All Materials';

export function getDisplayMetal(metal) {
  return String(metal || '')
    .split(/\s*(?:\u00c2?\u00b7|\u2022)\s*/)
    [0]
    .trim();
}

export function buildMetalFilterOptions(products = []) {
  const metals = new Set(
    products
      .map((product) => getDisplayMetal(product.metal))
      .filter(Boolean)
  );

  return [
    ALL_MATERIALS,
    ...Array.from(metals).sort((a, b) => a.localeCompare(b))
  ];
}

export function productMatchesMetalFilter(product, metalFilter) {
  if (metalFilter === ALL_MATERIALS) return true;
  return getDisplayMetal(product?.metal).toLowerCase() === metalFilter.toLowerCase();
}
