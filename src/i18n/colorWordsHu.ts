/**
 * Угорські слова, що описують готовність через КОЛІР. Заборонені в
 * основних ознаках (text/done/warn/tip); дозволені лише в полі look.
 * «vöröshagyma» (цибуля) — назва продукту, тому виключена.
 */
export const COLOR_CUE_PATTERNS_HU: RegExp[] = [
  /aranyb|aranys|aranyszín/i, // aranybarna, aranysárga, aranyszínű
  /barn(a|á|ul|ít)/i, // barna, barnára, barnul
  /rózsaszín/i, // rózsaszín
  /piros/i, // piros, pirosas
  /vörös(?!hagym)/i, // vörös, vöröses (крім vöröshagyma)
  /pirul/i, // megpirul, pirulásig
  /színű|színe\b|színét|színváltoz|színt\b/i, // колір
  /sötétebb|sötétedik|sötétül|megsötét/i, // потемніння
  /(átlátszó|tiszta)\s+(a\s+)?(lé|szaft)|leve\s+tiszta/i, // «сік прозорий»
];

export function findColorCuesHu(text: string): string[] {
  return COLOR_CUE_PATTERNS_HU.filter((re) => re.test(text)).map((re) => re.source);
}
