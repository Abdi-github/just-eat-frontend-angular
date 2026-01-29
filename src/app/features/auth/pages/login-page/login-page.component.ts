import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { AuthStore } from '@state/auth.store';

@Component({
  selector: 'app-login-page',
  imports: [
    RouterLink, TranslateModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="w-full max-w-md">
      <h1 class="mb-2 text-2xl font-bold text-gray-900">
        {{ 'auth.login.title' | translate }}
      </h1>
      <p class="mb-6 text-gray-500">
        {{ 'auth.login.subtitle' | translate }}
      </p>

      @if (errorMessage()) {
        <div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.login.email' | translate }}</mat-label>
          <input matInput type="email" formControlName="email" />
          <mat-icon matPrefix>email</mat-icon>
          @if (form.controls.email.hasError('required') && form.controls.email.touched) {
            <mat-error>{{ 'auth.login.emailRequired' | translate }}</mat-error>
          }
          @if (form.controls.email.hasError('email') && form.controls.email.touched) {
            <mat-error>{{ 'auth.login.emailInvalid' | translate }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.login.password' | translate }}</mat-label>
          <input matInput [type]="showPassword() ? 'text' : 'password'" formControlName="password" />
          <mat-icon matPrefix>lock</mat-icon>
          <button type="button" mat-icon-button matSuffix (click)="showPassword.set(!showPassword())">
            <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (form.controls.password.hasError('required') && form.controls.password.touched) {
            <mat-error>{{ 'auth.login.passwordRequired' | translate }}</mat-error>
          }
        </mat-form-field>

        <div class="mb-4 text-right">
          <a routerLink="/auth/forgot-password" class="text-sm text-primary hover:underline">
            {{ 'auth.login.forgotPassword' | translate }}
          </a>
        </div>

        <button
          mat-flat-button
          color="primary"
          type="submit"
          class="w-full"
          [disabled]="isSubmitting()"
        >
          @if (isSubmitting()) {
            <mat-spinner diameter="20" class="mr-2 inline-block"></mat-spinner>
          }
          {{ 'auth.login.submit' | translate }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{ 'auth.login.noAccount' | translate }}
        <a routerLink="/auth/register" class="font-medium text-primary hover:underline">
          {{ 'auth.login.register' | translate }}
        </a>
      </p>
    </div>
  `,
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (res) => {
        if (res.data) {
          this.authStore.setCredentials({
            token: res.data.tokens.access_token,
            refreshToken: res.data.tokens.refresh_token,
            user: res.data.user,
          });
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
          this.router.navigateByUrl(returnUrl);
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Login failed');
        this.isSubmitting.set(false);
      },
    });
  }
}
