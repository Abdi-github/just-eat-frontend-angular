import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 class="text-8xl font-bold text-primary mb-4">404</h1>
      <h2 class="text-2xl font-semibold mb-2">{{ 'common.errors.notFoundTitle' | translate }}</h2>
      <p class="text-muted-foreground mb-8 max-w-md">
        {{ 'common.errors.notFoundMessage' | translate }}
      </p>
      <div class="flex gap-4">
        <a mat-flat-button color="primary" routerLink="/">
          <mat-icon>home</mat-icon>
          {{ 'common.nav.home' | translate }}
        </a>
        <a mat-stroked-button routerLink="/restaurants">
          {{ 'common.nav.restaurants' | translate }}
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
