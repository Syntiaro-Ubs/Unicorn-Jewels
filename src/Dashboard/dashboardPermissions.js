export const DASHBOARD_PERMISSION_OPTIONS = [
  { id: "home", label: "Home Page" },
  { id: "banner", label: "Banners" },
  { id: "products", label: "Products" },
  { id: "taxonomy", label: "Taxonomy" },
  { id: "shop-by-look", label: "Shop by Look" },
  { id: "users", label: "Customers" },
  { id: "orders", label: "Orders" },
  { id: "team", label: "Team" },
];

export const DASHBOARD_PERMISSION_IDS = DASHBOARD_PERMISSION_OPTIONS.map(
  ({ id }) => id,
);
