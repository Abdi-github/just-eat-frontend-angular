import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { Address } from '@core/models';

@Component({
  selector: 'app-addresses-page',
  imports: [TranslateModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatDialogModule],
  template: `
    <div>
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">{{ 'addresses.title' | translate }}</h1>
        <button mat-flat-button color="primary">
          <mat-icon>add</mat-icon>
          {{ 'addresses.add' | translate }}
        </button>
      </div>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (addresses().length === 0) {
        <div class="py-12 text-center">
          <mat-icon class="!text-5xl text-gray-300">location_on</mat-icon>
          <h2 class="mt-3 text-lg font-semibold text-gray-500">{{ 'addresses.noAddresses' | translate }}</h2>
        </div>
      } @else {
        <div class="grid gap-4 sm:grid-cols-2">
          @for (address of addresses(); track address.id) {
            <div class="rounded-xl border border-gray-200 p-4">
              @if (address.label) {
                <span class="mb-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {{ address.label }}
                </span>
              }
              <p class="font-medium text-gray-900">{{ address.street }}</p>
              <p class="text-sm text-gray-500">{{ address.postal_code }} {{ $any(address.city)?.name || address.city }}</p>
              <div class="mt-3 flex gap-2">
                <button mat-icon-button><mat-icon>edit</mat-icon></button>
                <button mat-icon-button color="warn" (click)="deleteAddress(address.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class AddressesPageComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly addresses = signal<Address[]>([]);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.loadAddresses();
  }

  deleteAddress(id: string) {
    this.api.delete(`/public/addresses/${id}`).subscribe({
      next: () => {
        this.addresses.update((prev) => prev.filter((a) => a.id !== id));
      },
      error: (err) => {
      },
    });
  }

  private loadAddresses() {
    this.api.getList<Address>('/public/addresses').subscribe({
      next: (res) => {
        this.addresses.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }
}
