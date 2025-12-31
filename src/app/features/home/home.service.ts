import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { ApiResponse, ApiListResponse, Restaurant, Cuisine, City } from '@core/models';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly api = inject(ApiService);

  getPopularCuisines(): Observable<ApiListResponse<Cuisine>> {
    return this.api.getList<Cuisine>('/public/cuisines', { limit: 100, is_active: true });
  }

  getTopRestaurants(params?: Record<string, string | number | boolean>): Observable<ApiListResponse<Restaurant>> {
    return this.api.getList<Restaurant>('/public/restaurants', {
      limit: 8,
      sort: 'rating',
      order: 'desc',
      is_active: true,
      status: 'PUBLISHED',
      ...params,
    });
  }

  getCities(params?: Record<string, string | number | boolean>): Observable<ApiListResponse<City>> {
    return this.api.getList<City>('/public/locations/cities', { limit: 100, is_active: true, ...params });
  }

  searchLocations(query: string): Observable<ApiResponse<{ cities: City[]; cantons: unknown[] }>> {
    return this.api.get<{ cities: City[]; cantons: unknown[] }>('/public/locations/cities/search', { q: query });
  }
}
