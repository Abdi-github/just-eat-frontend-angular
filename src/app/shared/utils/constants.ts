export const SUPPORTED_LANGUAGES = ['de', 'en', 'fr', 'it'] as const;

export const ORDER_STATUSES = [
  'PLACED', 'ACCEPTED', 'REJECTED', 'PREPARING',
  'READY', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED',
] as const;

export const ITEMS_PER_PAGE = 12;

export const ALLERGEN_LIST = [
  'gluten', 'dairy', 'eggs', 'fish', 'shellfish', 'nuts',
  'peanuts', 'soy', 'celery', 'mustard', 'sesame', 'sulphites',
  'lupin', 'molluscs',
] as const;

export const DIETARY_FLAGS = [
  'vegetarian', 'vegan', 'halal', 'kosher',
  'gluten_free', 'lactose_free', 'organic', 'spicy',
] as const;
