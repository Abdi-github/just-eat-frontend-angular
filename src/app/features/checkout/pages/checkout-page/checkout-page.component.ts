import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { CartStore } from '@state/cart.store';
import { CurrencyChfPipe, LocalizedFieldPipe } from '@shared/pipes';

@Component({
  selector: 'app-checkout-page',
  imports: [
    RouterLink, TranslateModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatRadioModule, MatProgressSpinnerModule,
    MatDividerModule, CurrencyChfPipe, LocalizedFieldPipe,
  ],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="mb-6 text-2xl font-bold text-gray-900">{{ 'checkout.title' | translate }}</h1>

      <div class="grid gap-8 lg:grid-cols-[1fr_360px]">
        <!-- Form -->
        <div>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <!-- Delivery Address -->
            <h2 class="mb-4 text-lg font-semibold text-gray-900">{{ 'checkout.deliveryAddress' | translate }}</h2>
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'checkout.street' | translate }}</mat-label>
              <input matInput formControlName="street" />
            </mat-form-field>
            <div class="flex gap-3">
              <mat-form-field appearance="outline" class="w-32">
                <mat-label>{{ 'checkout.postalCode' | translate }}</mat-label>
                <input matInput formControlName="postal_code" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="flex-1">
                <mat-label>{{ 'checkout.city' | translate }}</mat-label>
                <input matInput formControlName="city" />
              </mat-form-field>
            </div>

            <mat-divider class="my-6"></mat-divider>

            <!-- Payment Method -->
            <h2 class="mb-4 text-lg font-semibold text-gray-900">{{ 'checkout.paymentMethod' | translate }}</h2>
            <mat-radio-group formControlName="payment_method" class="flex flex-col gap-2">
              <mat-radio-button value="cash">{{ 'checkout.cash' | translate }}</mat-radio-button>
              <mat-radio-button value="card">{{ 'checkout.card' | translate }}</mat-radio-button>
              <mat-radio-button value="twint">{{ 'checkout.twint' | translate }}</mat-radio-button>
            </mat-radio-group>

            <mat-divider class="my-6"></mat-divider>

            <!-- Note -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>{{ 'checkout.notes' | translate }}</mat-label>
              <textarea matInput formControlName="notes" rows="3"></textarea>
            </mat-form-field>

            <button
              mat-flat-button
              color="primary"
              type="submit"
              class="w-full lg:hidden"
              [disabled]="isSubmitting()"
            >
              @if (isSubmitting()) {
                <mat-spinner diameter="20" class="mr-2 inline-block"></mat-spinner>
              }
              {{ 'checkout.placeOrder' | translate }} · {{ cartStore.total() | currencyChf }}
            </button>
          </form>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="rounded-xl border border-gray-200 p-4">
          <h2 class="mb-4 text-lg font-semibold text-gray-900">{{ 'checkout.orderSummary' | translate }}</h2>

          @if (cartStore.restaurant()) {
            <p class="mb-3 font-medium text-gray-700">{{ cartStore.restaurant()!.name }}</p>
          }

          <div class="space-y-2">
            @for (item of cartStore.items(); track item.menu_item.id) {
              <div class="flex justify-between text-sm">
                <span>{{ item.quantity }}x {{ item.menu_item.name | localizedField }}</span>
                <span>{{ item.menu_item.price * item.quantity | currencyChf }}</span>
              </div>
            }
          </div>

          <mat-divider class="my-3"></mat-divider>

          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">{{ 'checkout.subtotal' | translate }}</span>
              <span>{{ cartStore.subtotal() | currencyChf }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">{{ 'checkout.deliveryFee' | translate }}</span>
              <span>{{ cartStore.deliveryFee() | currencyChf }}</span>
            </div>
          </div>

          <mat-divider class="my-3"></mat-divider>

          <div class="flex justify-between text-lg font-bold">
            <span>{{ 'checkout.total' | translate }}</span>
            <span>{{ cartStore.total() | currencyChf }}</span>
          </div>

          <button
            mat-flat-button
            color="primary"
            (click)="onSubmit()"
            class="mt-4 hidden w-full lg:block"
            [disabled]="isSubmitting()"
          >
            @if (isSubmitting()) {
              <mat-spinner diameter="20" class="mr-2 inline-block"></mat-spinner>
            }
            {{ 'checkout.placeOrder' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  readonly cartStore = inject(CartStore);

  readonly isSubmitting = signal(false);

  readonly form = this.fb.nonNullable.group({
    street: ['', Validators.required],
    postal_code: ['', Validators.required],
    city: ['', Validators.required],
    payment_method: ['cash', Validators.required],
    notes: [''],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const orderData = {
      restaurant_id: this.cartStore.restaurant()?.id,
      items: this.cartStore.items().map((item) => ({
        menu_item_id: item.menu_item.id,
        quantity: item.quantity,
      })),
      order_type: this.cartStore.orderType(),
      delivery_address: {
        street: this.form.value.street,
        postal_code: this.form.value.postal_code,
        city: this.form.value.city,
      },
      payment_method: this.form.value.payment_method,
      notes: this.form.value.notes,
    };

    this.api.post('/user/orders', orderData).subscribe({
      next: (res: any) => {
        this.cartStore.clearCart();
        this.router.navigateByUrl(`/account/orders/${res.data?.id || ''}`);
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false),
    });
  }
}
