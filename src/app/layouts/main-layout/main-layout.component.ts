import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, HeaderComponent, FooterComponent],
  template: `
    <div class="flex min-h-screen flex-col">
      <a href="#main-content"
         class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:shadow-lg">
        {{ 'common.nav.home' | translate }}
      </a>
      <app-header />
      <main id="main-content" class="flex-1" role="main">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class MainLayoutComponent {}
