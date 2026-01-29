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
import { matchFieldValidator } from '@shared/validators/validators';

@Component({
  selector: 'app-reset-password-page',
  imports: [
    RouterLink, TranslateModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="w-full max-w-md">
      <h1 class="mb-2 text-2xl font-bold text-gray-900">
        {{ 'auth.resetPassword.title' | translate }}
      </h1>
      <p class="mb-6 text-gray-500">
        {{ 'auth.resetPassword.subtitle' | translate }}
      </p>

      @if (errorMessage()) {
        <div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.resetPassword.password' | translate }}</mat-label>
          <input matInput [type]="showPassword() ? 'text' : 'password'" formControlName="password" />
          <mat-icon matPrefix>lock</mat-icon>
          <button type="button" mat-icon-button matSuffix (click)="showPassword.set(!showPassword())">
            <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.resetPassword.confirmPassword' | translate }}</mat-label>
          <input matInput [type]="showPassword() ? 'text' : 'password'" formControlName="password_confirmation" />
          <mat-icon matPrefix>lock</mat-icon>
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
          {{ 'auth.resetPassword.submit' | translate }}
        </button>
      </form>
    </div>
  `,
})
export class ResetPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly showPassword = signal(false);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: ['', [Validators.required, matchFieldValidator('password')]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const token = this.route.snapshot.queryParamMap.get('token') || '';
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.resetPassword({ token, ...this.form.getRawValue() }).subscribe({
      next: () => {
        this.router.navigateByUrl('/auth/login');
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Failed to reset password');
        this.isSubmitting.set(false);
      },
    });
  }
}
