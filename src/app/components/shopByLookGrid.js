const LOOK_ALIGNMENTS = ['left', 'center', 'right'];
const LOOK_VARIANTS = ['sculptural', 'vault'];
const PRODUCT_ROWS_BEFORE_LOOK = 2;
const GRID_COLUMNS = 3;
const PRODUCT_CELLS_BEFORE_LOOK = PRODUCT_ROWS_BEFORE_LOOK * GRID_COLUMNS;

const mapProductItem = (product, productIndex) => ({
  type: 'product',
  data: product,
  productIndex
});

const mapShopByLookItem = lookIndex => ({
  type: 'shopByLook',
  id: `shop-by-look-${lookIndex}`,
  variant: LOOK_VARIANTS[lookIndex % LOOK_VARIANTS.length],
  contentAlign: LOOK_ALIGNMENTS[lookIndex % LOOK_ALIGNMENTS.length]
});

export function buildShopByLookGridItems(products, {
  enabled = true
} = {}) {
  if (!enabled) {
    return products.map(mapProductItem);
  }

  const items = [];
  let productIndex = 0;
  let lookIndex = 0;

  while (productIndex < products.length) {
    for (let cell = 0; cell < PRODUCT_CELLS_BEFORE_LOOK && productIndex < products.length; cell += 1) {
      items.push(mapProductItem(products[productIndex], productIndex));
      productIndex += 1;
    }

    if (productIndex >= products.length) {
      break;
    }

    const lookCell = lookIndex % LOOK_ALIGNMENTS.length;

    for (let cell = 0; cell < GRID_COLUMNS; cell += 1) {
      if (cell === lookCell) {
        items.push(mapShopByLookItem(lookIndex));
      } else if (productIndex < products.length) {
        items.push(mapProductItem(products[productIndex], productIndex));
        productIndex += 1;
      }
    }

    lookIndex += 1;
  }

  return items;
}
