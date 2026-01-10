import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import { ApiService } from '@core/services/api.service';
import { Order } from '@core/models';
import { CurrencyChfPipe } from '@shared/pipes';

@Component({
  selector: 'app-order-detail-page',
  imports: [RouterLink, TranslateModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatDividerModule, DatePipe, CurrencyChfPipe],
  template: `
    <div>
      <a routerLink="/account/orders" class="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
        <mat-icon class="!text-base">arrow_back</mat-icon>
        {{ 'orders.backToOrders' | translate }}
      </a>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (!order()) {
        <div class="py-12 text-center">
          <h2 class="text-lg font-semibold text-gray-500">Order not found</h2>
        </div>
      } @else {
        <div class="rounded-xl border border-gray-200 p-6">
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold text-gray-900">Order #{{ order()!.order_number }}</h1>
            <span [class]="getStatusClass(order()!.status)">{{ order()!.status }}</span>
          </div>
          <p class="mt-1 text-sm text-gray-500">{{ order()!.created_at | date:'full' }}</p>

          <mat-divider class="my-4"></mat-divider>

          <h3 class="mb-2 font-semibold text-gray-900">{{ 'orders.items' | translate }}</h3>
          <div class="space-y-2">
            @for (item of order()!.items ?? []; track item.menu_item_id) {
              <div class="flex items-center justify-between">
                <span class="text-gray-700">{{ item.quantity }}x {{ item.name }}</span>
                <span class="font-medium">{{ item.total_price || (item.unit_price * item.quantity) | currencyChf }}</span>
              </div>
            }
          </div>

          <mat-divider class="my-4"></mat-divider>

          <div class="flex items-center justify-between text-lg font-bold">
            <span>{{ 'orders.total' | translate }}</span>
            <span>{{ order()!.total | currencyChf }}</span>
          </div>
        </div>
      }
    </div>
  `,
})
export class OrderDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  readonly order = signal<Order | null>(null);
  readonly isLoading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.api.get<Order>(`/public/orders/${id}`).subscribe({
      next: (res) => {
        this.order.set(res.data ?? null);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  getStatusClass(status: string): string {
    const base = 'rounded-full px-3 py-1 text-sm font-medium ';
    switch (status) {
      case 'delivered': return base + 'bg-green-100 text-green-700';
      case 'cancelled': return base + 'bg-red-100 text-red-700';
      case 'pending': return base + 'bg-yellow-100 text-yellow-700';
      default: return base + 'bg-blue-100 text-blue-700';
    }
  }
}
