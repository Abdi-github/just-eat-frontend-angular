import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartStore } from '@state/cart.store';
import { CurrencyChfPipe, LocalizedFieldPipe } from '@shared/pipes';

@Component({
  selector: 'app-cart-page',
  imports: [RouterLink, TranslateModule, MatIconModule, MatButtonModule, CurrencyChfPipe, LocalizedFieldPipe],
  template: `
    <div class="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="mb-6 text-2xl font-bold text-gray-900">{{ 'cart.title' | translate }}</h1>

      @if (cartStore.isEmpty()) {
        <div class="py-16 text-center">
          <mat-icon class="!text-6xl text-gray-300">shopping_cart</mat-icon>
          <h2 class="mt-4 text-xl font-semibold text-gray-500">{{ 'cart.empty' | translate }}</h2>
          <p class="mt-1 text-sm text-gray-400">{{ 'cart.emptyDescription' | translate }}</p>
          <a mat-flat-button color="primary" routerLink="/restaurants" class="mt-4">
            {{ 'cart.browseRestaurants' | translate }}
          </a>
        </div>
      } @else {
        <!-- Restaurant info -->
        @if (cartStore.restaurant()) {
          <div class="mb-4 rounded-xl bg-gray-50 p-4">
            <h2 class="font-semibold text-gray-900">{{ cartStore.restaurant()!.name }}</h2>
          </div>
        }

        <!-- Cart items -->
        <div class="space-y-3">
          @for (item of cartStore.items(); track item.menu_item.id) {
            <div class="flex items-center justify-between rounded-xl border border-gray-200 p-4">
              <div class="flex items-center gap-3">
                @if (item.menu_item.image_url) {
                  <img [src]="item.menu_item.image_url" [alt]="item.menu_item.name | localizedField" class="h-14 w-14 rounded-lg object-cover" />
                }
                <div>
                  <h3 class="font-medium text-gray-900">{{ item.menu_item.name | localizedField }}</h3>
                  <p class="text-sm text-gray-500">{{ item.menu_item.price | currencyChf }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <button
                  mat-icon-button
                  (click)="cartStore.updateQuantity(item.menu_item.id, item.quantity - 1)"
                  class="!h-8 !w-8"
                >
                  <mat-icon>remove</mat-icon>
                </button>
                <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
                <button
                  mat-icon-button
                  (click)="cartStore.updateQuantity(item.menu_item.id, item.quantity + 1)"
                  class="!h-8 !w-8"
                >
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="cartStore.removeItem(item.menu_item.id)" class="!h-8 !w-8">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Order summary -->
        <div class="mt-6 rounded-xl border border-gray-200 p-4">
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">{{ 'cart.subtotal' | translate }}</span>
              <span>{{ cartStore.subtotal() | currencyChf }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ 'cart.deliveryFee' | translate }}</span>
              <span>{{ cartStore.deliveryFee() | currencyChf }}</span>
            </div>
            <div class="flex justify-between border-t border-gray-200 pt-2 text-base font-bold">
              <span>{{ 'cart.total' | translate }}</span>
              <span>{{ cartStore.total() | currencyChf }}</span>
            </div>
          </div>

          <a
            mat-flat-button
            color="primary"
            routerLink="/checkout"
            class="mt-4 w-full"
          >
            {{ 'cart.checkout' | translate }}
          </a>
        </div>
      }
    </div>
  `,
})
export class CartPageComponent {
  readonly cartStore = inject(CartStore);
}
