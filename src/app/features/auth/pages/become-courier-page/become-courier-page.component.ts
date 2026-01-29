import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { AuthStore } from '@state/auth.store';

@Component({
  selector: 'app-become-courier-page',
  imports: [
    RouterLink, TranslateModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSelectModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="w-full max-w-md">
      <h1 class="mb-2 text-2xl font-bold text-gray-900">
        {{ 'auth.becomeCourier.title' | translate }}
      </h1>
      <p class="mb-6 text-gray-500">
        {{ 'auth.becomeCourier.subtitle' | translate }}
      </p>

      @if (errorMessage()) {
        <div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="flex gap-3">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>{{ 'auth.becomeCourier.firstName' | translate }}</mat-label>
            <input matInput formControlName="first_name" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>{{ 'auth.becomeCourier.lastName' | translate }}</mat-label>
            <input matInput formControlName="last_name" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.becomeCourier.email' | translate }}</mat-label>
          <input matInput type="email" formControlName="email" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.becomeCourier.phone' | translate }}</mat-label>
          <input matInput type="tel" formControlName="phone" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.becomeCourier.vehicleType' | translate }}</mat-label>
          <mat-select formControlName="vehicle_type">
            <mat-option value="bicycle">{{ 'auth.becomeCourier.bicycle' | translate }}</mat-option>
            <mat-option value="motorcycle">{{ 'auth.becomeCourier.motorcycle' | translate }}</mat-option>
            <mat-option value="car">{{ 'auth.becomeCourier.car' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'auth.becomeCourier.password' | translate }}</mat-label>
          <input matInput type="password" formControlName="password" />
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
          {{ 'auth.becomeCourier.submit' | translate }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-500">
        <a routerLink="/auth/login" class="font-medium text-primary hover:underline">
          {{ 'auth.becomeCourier.haveAccount' | translate }}
        </a>
      </p>
    </div>
  `,
})
export class BecomeCourierPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    vehicle_type: ['bicycle', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.authService.registerCourier(this.form.getRawValue()).subscribe({
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
