import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslatedField, SupportedLanguage } from '@core/models';

@Pipe({ name: 'localizedField', standalone: true, pure: false })
export class LocalizedFieldPipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(field: TranslatedField | string | null | undefined): string {
    if (!field) return '';
    if (typeof field === 'string') return field;
    const lang = (this.translate.currentLang || 'de') as SupportedLanguage;
    return field[lang] || field['de'] || field['en'] || '';
  }
}
