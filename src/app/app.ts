import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageStore } from '@state/language.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly translate = inject(TranslateService);
  private readonly languageStore = inject(LanguageStore);

  ngOnInit() {
    const lang = this.languageStore.current();
    this.translate.use(lang);
    document.documentElement.lang = lang;
  }
}
