import type { Lang } from './types';

export type { Lang } from './types';

let current: Lang = 'uk';

/** Поточна мова (встановлюється сховищем під час рендеру). */
export function getLang(): Lang {
  return current;
}

export function setLang(l: Lang) {
  current = l;
}

/** Мова за налаштуваннями телефона/браузера: угорська, якщо система угорська. */
export function detectLang(): Lang {
  try {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
    return langs.some((l) => l?.toLowerCase().startsWith('hu')) ? 'hu' : 'uk';
  } catch {
    return 'uk';
  }
}

export function locale(): string {
  return current === 'hu' ? 'hu-HU' : 'uk-UA';
}
