/**
 * Фото-приклади страв з Wikimedia Commons (вільні ліцензії).
 * Файли лежать у public/photos/ (кадровано до 3:2, 800×533, WebP);
 * у назві файлу — хеш вмісту, щоб офлайн-кеш оновлювався лише за зміни фото.
 * Список згенеровано скриптом scripts/photos.py; джерела — docs/PHOTOS.md.
 */

export interface DishPhoto {
  /** Файл у public/photos/ */
  file: string;
  /** Автор (як на сторінці файлу) */
  author: string;
  /** Ліцензія, напр. «CC BY-SA 4.0» */
  license: string;
  /** Посилання на текст ліцензії (порожнє для суспільного надбання) */
  licenseUrl: string;
  /** Сторінка файлу на Wikimedia Commons */
  page: string;
}

export const PHOTOS: Record<string, DishPhoto> = {};

export function photoUrl(p: DishPhoto): string {
  return `photos/${p.file}`;
}
