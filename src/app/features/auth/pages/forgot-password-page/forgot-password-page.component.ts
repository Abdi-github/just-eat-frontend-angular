import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-forgot-password-page',
  imports: [
    RouterLink, TranslateModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="w-full max-w-md">
      <h1 class="mb-2 text-2xl font-bold text-gray-900">
        {{ 'auth.forgotPassword.title' | translate }}
      </h1>
      <p class="mb-6 text-gray-500">
        {{ 'auth.forgotPassword.subtitle' | translate }}
      </p>

      @if (successMessage()) {
        <div class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
          {{ successMessage() }}
        </div>
      }

      @if (errorMessage()) {
        <div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.forgotPassword.email' | translate }}</mat-label>
          <input matInput type="email" formControlName="email" />
          <mat-icon matPrefix>email</mat-icon>
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
          {{ 'auth.forgotPassword.submit' | translate }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        <a routerLink="/auth/login" class="font-medium text-primary hover:underline">
          {{ 'auth.forgotPassword.backToLogin' | translate }}
        </a>
      </p>
    </div>
  `,
})
export class ForgotPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService.forgotPassword(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.successMessage.set(res.data?.message || 'Password reset email sent');
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Failed to send reset email');
        this.isSubmitting.set(false);
      },
    });
  }
}
