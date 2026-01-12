import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="flex items-center justify-center min-h-[400px]">
      <mat-spinner diameter="48" color="primary" />
    </div>
  `,
})
export class PageLoaderComponent {}
