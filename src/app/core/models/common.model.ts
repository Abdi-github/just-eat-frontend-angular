export type SupportedLanguage = 'de' | 'en' | 'fr' | 'it';

export type OrderStatus =
  | 'PLACED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'PREPARING'
  | 'READY'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'stripe_card' | 'twint' | 'postfinance' | 'cash';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'PAID'
  | 'REFUNDED'
  | 'FAILED';

export type OrderType = 'delivery' | 'pickup';

export type ApplicationStatus = 'none' | 'pending_approval' | 'approved' | 'rejected';

export type VehicleType = 'bicycle' | 'motorcycle' | 'car' | 'scooter';

export type UserRole = 'customer' | 'restaurant_owner' | 'courier' | 'admin';

export interface TranslatedField {
  en: string;
  fr: string;
  de: string;
  it: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  preferred_language: SupportedLanguage;
  avatar?: string;
  is_active: boolean;
  roles: UserRole[];
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: TranslatedField;
  slug: string;
  cover_image_url?: string;
  logo_url?: string;
  address: string;
  postal_code: string;
  city: string;
  canton: string;
  phone: string;
  email: string;
  cuisines: Cuisine[];
  brand?: Brand;
  delivery_fee: number;
  minimum_order: number;
  estimated_delivery_time_min: number;
  estimated_delivery_time_max: number;
  supports_delivery: boolean;
  supports_pickup: boolean;
  is_featured: boolean;
  is_active: boolean;
  average_rating: number;
  rating: number;
  review_count: number;
  opening_hours: OpeningHours[];
  created_at: string;
}

export interface OpeningHours {
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export interface Cuisine {
  id: string;
  name: TranslatedField;
  slug: string;
  image_url?: string;
  restaurant_count?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

export interface MenuCategory {
  id: string;
  name: TranslatedField;
  description?: TranslatedField;
  sort_order: number;
  is_active: boolean;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: TranslatedField;
  description?: TranslatedField;
  price: number;
  image_url?: string;
  category_id: string;
  is_available: boolean;
  is_popular: boolean;
  allergens: string[];
  dietary_flags: string[];
  sort_order: number;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  special_instructions?: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  canton: string;
  postal_code: string;
  is_default: boolean;
  latitude?: number;
  longitude?: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  restaurant: Restaurant;
  items: OrderItem[];
  status: OrderStatus;
  order_type: OrderType;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  delivery_address?: Address;
  special_instructions?: string;
  estimated_delivery_time?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  menu_item_id: string;
  name: string;
  price: number;
  unit_price?: number;
  total_price?: number;
  quantity: number;
  special_instructions?: string;
}

export interface Review {
  id: string;
  user: { id: string; first_name: string; last_name: string; avatar?: string };
  restaurant_id: string;
  order_id: string;
  rating: number;
  comment: string;
  reply?: string;
  is_verified: boolean;
  created_at: string;
}

export interface Canton {
  id: string;
  name: string;
  code: string;
}

export interface City {
  id: string;
  name: string;
  canton_id: string;
  postal_code: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}
