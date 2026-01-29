import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="flex min-h-screen items-center justify-center bg-muted p-4">
      <div class="w-full max-w-md">
        <div class="mb-8 text-center">
          <a routerLink="/" class="inline-block">
            <span class="text-3xl font-bold text-primary">just-eat</span>
            <span class="text-lg text-muted-foreground">.ch</span>
          </a>
        </div>
        <div class="rounded-xl border border-border bg-white p-6 shadow-card">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent {}
