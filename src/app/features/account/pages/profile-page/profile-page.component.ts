import { Component, inject, signal, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { AuthStore } from '@state/auth.store';
import { User } from '@core/models';

@Component({
  selector: 'app-profile-page',
  imports: [
    TranslateModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div>
      <h1 class="mb-6 text-2xl font-bold text-gray-900">
        {{ 'profile.title' | translate }}
      </h1>

      @if (successMessage()) {
        <div class="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">{{ successMessage() }}</div>
      }
      @if (errorMessage()) {
        <div class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{{ errorMessage() }}</div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="max-w-lg space-y-1">
        <div class="flex gap-3">
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>{{ 'profile.firstName' | translate }}</mat-label>
            <input matInput formControlName="first_name" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="flex-1">
            <mat-label>{{ 'profile.lastName' | translate }}</mat-label>
            <input matInput formControlName="last_name" />
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'profile.email' | translate }}</mat-label>
          <input matInput type="email" formControlName="email" readonly />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'profile.phone' | translate }}</mat-label>
          <input matInput type="tel" formControlName="phone" />
        </mat-form-field>

        <button mat-flat-button color="primary" type="submit" [disabled]="isSubmitting()">
          @if (isSubmitting()) {
            <mat-spinner diameter="20" class="mr-2 inline-block"></mat-spinner>
          }
          {{ 'profile.save' | translate }}
        </button>
      </form>
    </div>
  `,
})
export class ProfilePageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiService);
  private readonly authStore = inject(AuthStore);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: [''],
    phone: [''],
  });

  ngOnInit() {
    const user = this.authStore.user();
    if (user) {
      this.form.patchValue({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { email, ...data } = this.form.getRawValue();
    this.api.put<User>('/public/users/profile', data).subscribe({
      next: (res) => {
        if (res.data) this.authStore.updateUser(res.data);
        this.successMessage.set('Profile updated successfully');
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Update failed');
        this.isSubmitting.set(false);
      },
    });
  }
}
