import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  imports: [
    TranslateModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 class="mb-6 text-3xl font-bold text-gray-900">{{ 'static.contact.title' | translate }}</h1>

      <div class="grid gap-10 lg:grid-cols-2">
        <div>
          <p class="mb-6 text-gray-600">{{ 'static.contact.intro' | translate }}</p>

          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <mat-icon class="text-primary">email</mat-icon>
              <div>
                <p class="font-medium text-gray-900">{{ 'static.contact.emailLabel' | translate }}</p>
                <p class="text-sm text-gray-500">support&#64;just-eat.ch</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <mat-icon class="text-primary">phone</mat-icon>
              <div>
                <p class="font-medium text-gray-900">{{ 'static.contact.phoneLabel' | translate }}</p>
                <p class="text-sm text-gray-500">+41 800 123 456</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <mat-icon class="text-primary">location_on</mat-icon>
              <div>
                <p class="font-medium text-gray-900">{{ 'static.contact.addressLabel' | translate }}</p>
                <p class="text-sm text-gray-500">Bahnhofstrasse 1, 8001 Zürich</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          @if (submitted()) {
            <div class="rounded-xl bg-green-50 p-6 text-center">
              <mat-icon class="!text-4xl text-green-500">check_circle</mat-icon>
              <h3 class="mt-2 text-lg font-semibold text-green-700">{{ 'static.contact.successTitle' | translate }}</h3>
              <p class="mt-1 text-sm text-green-600">{{ 'static.contact.successMessage' | translate }}</p>
            </div>
          } @else {
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>{{ 'static.contact.name' | translate }}</mat-label>
                <input matInput formControlName="name" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>{{ 'static.contact.email' | translate }}</mat-label>
                <input matInput type="email" formControlName="email" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>{{ 'static.contact.subject' | translate }}</mat-label>
                <input matInput formControlName="subject" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>{{ 'static.contact.message' | translate }}</mat-label>
                <textarea matInput formControlName="message" rows="5"></textarea>
              </mat-form-field>
              <button mat-flat-button color="primary" type="submit" class="w-full" [disabled]="isSubmitting()">
                @if (isSubmitting()) {
                  <mat-spinner diameter="20" class="mr-2 inline-block"></mat-spinner>
                }
                {{ 'static.contact.send' | translate }}
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class ContactPageComponent {
  private readonly fb = inject(FormBuilder);

  readonly isSubmitting = signal(false);
  readonly submitted = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', Validators.required],
    message: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting.set(true);
    // Simulate submission
    setTimeout(() => {
      this.submitted.set(true);
      this.isSubmitting.set(false);
    }, 500);
  }
}
