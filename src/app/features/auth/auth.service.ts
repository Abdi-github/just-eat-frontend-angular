import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ApiResponse, User } from '@core/models';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  password_confirmation: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>('/public/auth/login', data);
  }

  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>('/public/auth/register', data);
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<ApiResponse<{ message: string }>> {
    return this.api.post<{ message: string }>('/public/auth/forgot-password', data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<ApiResponse<{ message: string }>> {
    return this.api.post<{ message: string }>('/public/auth/reset-password', data);
  }

  logout(): Observable<ApiResponse<{ message: string }>> {
    return this.api.post<{ message: string }>('/public/auth/logout', {});
  }

  getMe(): Observable<ApiResponse<User>> {
    return this.api.get<User>('/public/auth/me');
  }

  registerRestaurant(data: unknown): Observable<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>('/public/auth/register-restaurant', data);
  }

  registerCourier(data: unknown): Observable<ApiResponse<AuthResponse>> {
    return this.api.post<AuthResponse>('/public/auth/register-courier', data);
  }
}
