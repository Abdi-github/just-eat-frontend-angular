import { Component } from '@angular/core';
import { HeroSearchComponent } from '../../components/hero-search/hero-search.component';
import { PopularCuisinesComponent } from '../../components/popular-cuisines/popular-cuisines.component';
import { TopRestaurantsComponent } from '../../components/top-restaurants/top-restaurants.component';
import { HowItWorksComponent } from '../../components/how-it-works/how-it-works.component';
import { AppPromotionComponent } from '../../components/app-promotion/app-promotion.component';

@Component({
  selector: 'app-home-page',
  imports: [
    HeroSearchComponent,
    PopularCuisinesComponent,
    TopRestaurantsComponent,
    HowItWorksComponent,
    AppPromotionComponent,
  ],
  template: `
    <app-hero-search />
    <app-popular-cuisines />
    <app-top-restaurants />
    <app-how-it-works />
    <app-app-promotion />
  `,
})
export class HomePageComponent {}
