import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';
import { ApiService } from '@core/services/api.service';
import { Review } from '@core/models';
import { StarRatingComponent } from '@shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-reviews-page',
  imports: [TranslateModule, MatIconModule, MatProgressSpinnerModule, DatePipe, StarRatingComponent],
  template: `
    <div>
      <h1 class="mb-6 text-2xl font-bold text-gray-900">{{ 'reviews.myReviews' | translate }}</h1>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (reviews().length === 0) {
        <div class="py-12 text-center">
          <mat-icon class="!text-5xl text-gray-300">rate_review</mat-icon>
          <h2 class="mt-3 text-lg font-semibold text-gray-500">{{ 'reviews.noReviews' | translate }}</h2>
        </div>
      } @else {
        <div class="space-y-4">
          @for (review of reviews(); track review.id) {
            <div class="rounded-xl border border-gray-200 p-4">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-gray-900">{{ review.user.first_name }} {{ review.user.last_name }}</h3>
                    <app-star-rating [rating]="review.rating" />
              </div>
              @if (review.comment) {
                <p class="mt-2 text-sm text-gray-600">{{ review.comment }}</p>
              }
              <p class="mt-2 text-xs text-gray-400">{{ review.created_at | date:'mediumDate' }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ReviewsPageComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly reviews = signal<Review[]>([]);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.api.getList<Review>('/public/reviews/my').subscribe({
      next: (res) => {
        this.reviews.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
