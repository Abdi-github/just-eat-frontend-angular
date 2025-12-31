import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ApiResponse, ApiListResponse, Restaurant, Cuisine, MenuCategory } from '@core/models';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private readonly api = inject(ApiService);

  getRestaurants(params?: Record<string, string | number | boolean>): Observable<ApiListResponse<Restaurant>> {
    return this.api.getList<Restaurant>('/public/restaurants', {
      limit: 12,
      sort: 'rating',
      order: 'desc',
      is_active: true,
      status: 'published',
      ...params,
    });
  }

  getRestaurantBySlug(slug: string): Observable<ApiResponse<Restaurant>> {
    return this.api.get<Restaurant>(`/public/restaurants/slug/${slug}`);
  }

  getRestaurantMenu(restaurantId: string): Observable<ApiResponse<{ categories: MenuCategory[] }>> {
    return this.api.get<{ categories: MenuCategory[] }>(`/public/restaurants/${restaurantId}/menu`);
  }

  getRestaurantReviews(restaurantId: string, params?: Record<string, string | number | boolean>): Observable<ApiListResponse<unknown>> {
    return this.api.getList<unknown>(`/public/reviews/restaurant/${restaurantId}`, params);
  }

  getCuisines(params?: Record<string, string | number | boolean>): Observable<ApiListResponse<Cuisine>> {
    return this.api.getList<Cuisine>('/public/cuisines', { limit: 50, ...params });
  }
}
