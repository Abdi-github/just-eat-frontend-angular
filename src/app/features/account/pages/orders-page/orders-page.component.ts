import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';
import { Order } from '@core/models';
import { CurrencyChfPipe } from '@shared/pipes';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders-page',
  imports: [RouterLink, TranslateModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, CurrencyChfPipe, DatePipe],
  template: `
    <div>
      <h1 class="mb-6 text-2xl font-bold text-gray-900">{{ 'orders.title' | translate }}</h1>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (orders().length === 0) {
        <div class="py-12 text-center">
          <mat-icon class="!text-5xl text-gray-300">receipt_long</mat-icon>
          <h2 class="mt-3 text-lg font-semibold text-gray-500">{{ 'orders.noOrders' | translate }}</h2>
          <a mat-flat-button color="primary" routerLink="/restaurants" class="mt-4">
            {{ 'orders.browseRestaurants' | translate }}
          </a>
        </div>
      } @else {
        <div class="space-y-4">
          @for (order of orders(); track order.id) {
            <a
              [routerLink]="['/account/orders', order.id]"
              class="block rounded-xl border border-gray-200 p-4 transition-colors hover:bg-gray-50"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ order.restaurant?.name || 'Restaurant' }}</h3>
                  <p class="text-sm text-gray-500">{{ order.created_at | date:'medium' }}</p>
                </div>
                <div class="text-right">
                  <p class="font-semibold text-gray-900">{{ order.total | currencyChf }}</p>
                  <span [class]="getStatusClass(order.status)">{{ order.status }}</span>
                </div>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class OrdersPageComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.api.getList<Order>('/public/orders/my', { limit: 50, sort: '-created_at' }).subscribe({
      next: (res) => {
        this.orders.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  getStatusClass(status: string): string {
    const base = 'inline-block rounded-full px-2 py-0.5 text-xs font-medium ';
    switch (status) {
      case 'delivered': return base + 'bg-green-100 text-green-700';
      case 'cancelled': return base + 'bg-red-100 text-red-700';
      case 'pending': return base + 'bg-yellow-100 text-yellow-700';
      default: return base + 'bg-blue-100 text-blue-700';
    }
  }
}
