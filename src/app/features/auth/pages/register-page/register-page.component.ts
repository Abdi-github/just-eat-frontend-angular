import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { AuthStore } from '@state/auth.store';
import { matchFieldValidator } from '@shared/validators/validators';

@Component({
  selector: 'app-register-page',
  imports: [
    RouterLink, TranslateModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="w-full max-w-md">
      <h1 class="mb-2 text-2xl font-bold text-gray-900">
        {{ 'auth.register.title' | translate }}
      </h1>
      <p class="mb-6 text-gray-500">
        {{ 'auth.register.subtitle' | translate }}
      </p>

      @if (errorMessage()) {
        <div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="flex gap-3">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>{{ 'auth.register.firstName' | translate }}</mat-label>
            <input matInput formControlName="first_name" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>{{ 'auth.register.lastName' | translate }}</mat-label>
            <input matInput formControlName="last_name" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.register.email' | translate }}</mat-label>
          <input matInput type="email" formControlName="email" />
          <mat-icon matPrefix>email</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.register.phone' | translate }}</mat-label>
          <input matInput type="tel" formControlName="phone" />
          <mat-icon matPrefix>phone</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.register.password' | translate }}</mat-label>
          <input matInput [type]="showPassword() ? 'text' : 'password'" formControlName="password" />
          <mat-icon matPrefix>lock</mat-icon>
          <button type="button" mat-icon-button matSuffix (click)="showPassword.set(!showPassword())">
            <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.register.confirmPassword' | translate }}</mat-label>
          <input matInput [type]="showPassword() ? 'text' : 'password'" formControlName="password_confirmation" />
          <mat-icon matPrefix>lock</mat-icon>
          @if (form.controls.password_confirmation.hasError('passwordsMismatch')) {
            <mat-error>{{ 'auth.register.passwordMismatch' | translate }}</mat-error>
          }
        </mat-form-field>

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
          {{ 'auth.register.submit' | translate }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        {{ 'auth.register.haveAccount' | translate }}
        <a routerLink="/auth/login" class="font-medium text-primary hover:underline">
          {{ 'auth.register.login' | translate }}
        </a>
      </p>
    </div>
  `,
})
export class RegisterPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required, matchFieldValidator('password')]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.register(this.form.getRawValue()).subscribe({
      next: (res) => {
        if (res.data) {
          this.authStore.setCredentials({
            token: res.data.tokens.access_token,
            refreshToken: res.data.tokens.refresh_token,
            user: res.data.user,
          });
          this.router.navigateByUrl('/');
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Registration failed');
        this.isSubmitting.set(false);
      },
    });
  }
}
