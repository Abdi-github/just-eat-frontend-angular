import { computed } from '@angular/core';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { CartItem, MenuItem, Restaurant, OrderType } from '@core/models';
import { environment } from '@env/environment';

interface CartState {
  items: CartItem[];
  restaurant: Restaurant | null;
  orderType: OrderType;
}

const STORAGE_KEY = environment.storageKeys.cart;

function loadInitialState(): CartState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch { /* ignore */ }
  return { items: [], restaurant: null, orderType: 'delivery' };
}

function persistState(state: CartState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState<CartState>(loadInitialState()),
  withComputed((store) => ({
    itemCount: computed(() => store.items().reduce((sum, item) => sum + item.quantity, 0)),
    subtotal: computed(() =>
      store.items().reduce((sum, item) => sum + item.menu_item.price * item.quantity, 0),
    ),
    deliveryFee: computed(() => {
      if (store.orderType() === 'pickup') return 0;
      return store.restaurant()?.delivery_fee ?? 0;
    }),
    total: computed(() => {
      const subtotal = store.items().reduce((sum, item) => sum + item.menu_item.price * item.quantity, 0);
      const fee = store.orderType() === 'pickup' ? 0 : (store.restaurant()?.delivery_fee ?? 0);
      return subtotal + fee;
    }),
    isEmpty: computed(() => store.items().length === 0),
    meetsMinimumOrder: computed(() => {
      const subtotal = store.items().reduce((sum, item) => sum + item.menu_item.price * item.quantity, 0);
      const minimum = store.restaurant()?.minimum_order ?? 0;
      return subtotal >= minimum;
    }),
  })),
  withMethods((store) => ({
    addItem(menuItem: MenuItem, restaurant: Restaurant, quantity = 1, specialInstructions?: string): void {
      const currentRestaurant = store.restaurant();
      let currentItems = store.items();

      // Clear cart if switching restaurants
      if (currentRestaurant && currentRestaurant.id !== restaurant.id) {
        currentItems = [];
      }

      const existingIndex = currentItems.findIndex(
        (item) => item.menu_item.id === menuItem.id,
      );

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = currentItems.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity, special_instructions: specialInstructions || item.special_instructions }
            : item,
        );
      } else {
        newItems = [...currentItems, { menu_item: menuItem, quantity, special_instructions: specialInstructions }];
      }

      const newState: CartState = { items: newItems, restaurant, orderType: store.orderType() };
      patchState(store, newState);
      persistState(newState);
    },

    updateQuantity(menuItemId: string, quantity: number): void {
      const newItems = quantity <= 0
        ? store.items().filter((item) => item.menu_item.id !== menuItemId)
        : store.items().map((item) =>
            item.menu_item.id === menuItemId ? { ...item, quantity } : item,
          );

      const newState: CartState = { items: newItems, restaurant: store.restaurant(), orderType: store.orderType() };
      patchState(store, newState);
      persistState(newState);
    },

    removeItem(menuItemId: string): void {
      const newItems = store.items().filter((item) => item.menu_item.id !== menuItemId);
      const newState: CartState = {
        items: newItems,
        restaurant: newItems.length === 0 ? null : store.restaurant(),
        orderType: store.orderType(),
      };
      patchState(store, newState);
      persistState(newState);
    },

    setOrderType(orderType: OrderType): void {
      const newState: CartState = { items: store.items(), restaurant: store.restaurant(), orderType };
      patchState(store, newState);
      persistState(newState);
    },

    clearCart(): void {
      const newState: CartState = { items: [], restaurant: null, orderType: 'delivery' };
      patchState(store, newState);
      localStorage.removeItem(STORAGE_KEY);
    },
  })),
);
