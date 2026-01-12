import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-error-fallback',
  standalone: true,
  imports: [MatButtonModule, TranslateModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[400px] px-4 text-center">
      <div class="text-5xl mb-4">⚠️</div>
      <h2 class="text-xl font-semibold mb-2">{{ 'common.errors.boundaryTitle' | translate }}</h2>
      <p class="text-muted-foreground mb-6 max-w-md">
        {{ message() || ('common.errors.boundaryMessage' | translate) }}
      </p>
      <button mat-flat-button color="primary" (click)="onRetry()">
        {{ 'common.actions.retry' | translate }}
      </button>
    </div>
  `,
})
export class ErrorFallbackComponent {
  message = input<string>('');

  onRetry(): void {
    window.location.reload();
  }
}
