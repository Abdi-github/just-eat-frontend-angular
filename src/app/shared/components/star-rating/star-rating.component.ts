import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="inline-flex items-center gap-0.5" [attr.aria-label]="'Rating: ' + rating() + ' out of 5'">
      @for (star of stars; track star) {
        <mat-icon
          class="text-lg"
          [class.cursor-pointer]="interactive()"
          [class.text-warning]="star <= filledStars()"
          [class.text-border]="star > filledStars()"
          (click)="interactive() && ratingChange.emit(star)">
          {{ star <= filledStars() ? 'star' : (star - 0.5 <= rating() ? 'star_half' : 'star_border') }}
        </mat-icon>
      }
      @if (showCount() && count() > 0) {
        <span class="ml-1 text-sm text-muted-foreground">({{ count() }})</span>
      }
    </div>
  `,
})
export class StarRatingComponent {
  rating = input<number>(0);
  count = input<number>(0);
  showCount = input<boolean>(false);
  interactive = input<boolean>(false);
  ratingChange = output<number>();

  readonly stars = [1, 2, 3, 4, 5];

  filledStars(): number {
    return Math.floor(this.rating());
  }
}
