import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { ApiService } from '@core/services/api.service';
import { Notification } from '@core/models';

@Component({
  selector: 'app-notifications-page',
  imports: [TranslateModule, MatIconModule, MatProgressSpinnerModule, DatePipe],
  template: `
    <div>
      <h1 class="mb-6 text-2xl font-bold text-gray-900">{{ 'notifications.title' | translate }}</h1>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (notifications().length === 0) {
        <div class="py-12 text-center">
          <mat-icon class="!text-5xl text-gray-300">notifications_none</mat-icon>
          <h2 class="mt-3 text-lg font-semibold text-gray-500">{{ 'notifications.noNotifications' | translate }}</h2>
        </div>
      } @else {
        <div class="space-y-3">
          @for (notification of notifications(); track notification.id) {
            <div [class]="notification.is_read
              ? 'rounded-xl border border-gray-200 p-4'
              : 'rounded-xl border border-primary/30 bg-primary/5 p-4'"
            >
              <div class="flex items-start gap-3">
                <mat-icon [class]="notification.is_read ? 'text-gray-400' : 'text-primary'">
                  {{ getNotificationIcon(notification.type) }}
                </mat-icon>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ notification.title }}</p>
                  <p class="text-sm text-gray-500">{{ notification.message }}</p>
                  <p class="mt-1 text-xs text-gray-400">{{ notification.created_at | date:'medium' }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class NotificationsPageComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly notifications = signal<Notification[]>([]);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.api.getList<Notification>('/public/notifications').subscribe({
      next: (res) => {
        this.notifications.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'order': return 'receipt_long';
      case 'promotion': return 'local_offer';
      case 'system': return 'info';
      default: return 'notifications';
    }
  }
}
